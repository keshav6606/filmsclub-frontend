const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');
const zlib = require('zlib');
const crypto = require('crypto');

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';
const UPSTREAM_ORIGIN = 'https://yupflix.org';
const DATA_DIR = path.join(__dirname, 'data');
const TITLES_DIR = path.join(DATA_DIR, 'titles');
const PUBLIC_DIR = path.join(__dirname, 'public');

if (!fs.existsSync(TITLES_DIR)) {
  fs.mkdirSync(TITLES_DIR, { recursive: true });
}

// In-memory upstream session management
let upstreamCookie = null;
let upstreamCookieExpires = 0;

async function getUpstreamCookie(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && upstreamCookie && upstreamCookieExpires > now + 60000) {
    return upstreamCookie;
  }

  try {
    const res = await fetch(`${UPSTREAM_ORIGIN}/enter`, {
      method: 'POST',
      redirect: 'manual',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    const setCookie = res.headers.get('set-cookie');
    if (setCookie) {
      const match = setCookie.match(/yf_pass=[^;]+/);
      if (match) {
        upstreamCookie = match[0];
        // 20 hours expiration default
        upstreamCookieExpires = now + (20 * 60 * 60 * 1000);
        console.log('[Upstream] Acquired fresh session pass:', upstreamCookie.slice(0, 30) + '...');
        return upstreamCookie;
      }
    }
  } catch (err) {
    console.warn('[Upstream] Could not refresh cookie:', err.message);
  }

  return upstreamCookie;
}

// Fetch helper with upstream session & automatic retry
async function fetchUpstream(pathAndQuery, options = {}) {
  let cookie = await getUpstreamCookie();
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    ...(cookie ? { 'Cookie': cookie } : {}),
    ...(options.headers || {})
  };

  const targetUrl = pathAndQuery.startsWith('http') ? pathAndQuery : `${UPSTREAM_ORIGIN}${pathAndQuery}`;
  let res = await fetch(targetUrl, {
    method: options.method || 'GET',
    headers,
    redirect: options.redirect || 'manual',
    body: options.body
  });

  // If unauthorized or redirected to enter, refresh cookie and retry once
  if (res.status === 401 || res.status === 403 || (res.status === 302 && (res.headers.get('location') || '').includes('enter'))) {
    console.log('[Upstream] Session expired (status', res.status, '). Refreshing pass...');
    cookie = await getUpstreamCookie(true);
    headers['Cookie'] = cookie;
    res = await fetch(targetUrl, {
      method: options.method || 'GET',
      headers,
      redirect: options.redirect || 'manual',
      body: options.body
    });
  }

  return res;
}

// MIME types dictionary
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

// Safe file reader helper
function readJsonSafe(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (err) {
    console.error('Error reading json', filePath, err.message);
  }
  return null;
}

// Compress and send response
function sendData(req, res, statusCode, contentType, body, maxAge = 0) {
  const acceptEncoding = req.headers['accept-encoding'] || '';
  const headers = {
    'Content-Type': contentType,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };

  if (maxAge > 0) {
    headers['Cache-Control'] = `public, max-age=${maxAge}`;
  } else {
    headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
  }

  let buffer = Buffer.isBuffer(body) ? body : Buffer.from(typeof body === 'string' ? body : JSON.stringify(body));

  if (buffer.length > 1024 && acceptEncoding.includes('gzip')) {
    zlib.gzip(buffer, (err, compressed) => {
      if (!err) {
        headers['Content-Encoding'] = 'gzip';
        headers['Content-Length'] = compressed.length;
        res.writeHead(statusCode, headers);
        res.end(compressed);
      } else {
        headers['Content-Length'] = buffer.length;
        res.writeHead(statusCode, headers);
        res.end(buffer);
      }
    });
  } else {
    headers['Content-Length'] = buffer.length;
    res.writeHead(statusCode, headers);
    res.end(buffer);
  }
}

function sendJson(req, res, statusCode, data, maxAge = 0) {
  sendData(req, res, statusCode, 'application/json; charset=utf-8', JSON.stringify(data), maxAge);
}

// Serve static file
function serveStaticFile(req, res, filePath) {
  if (!fs.existsSync(filePath)) {
    return false;
  }
  const stat = fs.statSync(filePath);
  if (!stat.isFile()) return false;

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  const content = fs.readFileSync(filePath);
  const maxAge = ext === '.html' ? 0 : 86400;

  sendData(req, res, 200, contentType, content, maxAge);
  return true;
}

// Server Request Handler
const server = http.createServer(async (req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = reqUrl.pathname;
  const searchParams = reqUrl.searchParams;

  // Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  // 1. Session verification check
  if (pathname === '/api/session') {
    return sendJson(req, res, 200, { ok: true, session: 'active' });
  }

  // 2. Ad configuration
  if (pathname === '/api/ads') {
    const localAds = path.join(DATA_DIR, 'ads.json');
    const data = readJsonSafe(localAds) || { enabled: false, windowMin: 30, ads: [] };
    return sendJson(req, res, 200, data);
  }

  // 3. Search index
  if (pathname === '/api/search-index.json' || pathname === '/api/search-index') {
    const indexPath = path.join(DATA_DIR, 'search-index.json');
    if (fs.existsSync(indexPath)) {
      const content = fs.readFileSync(indexPath);
      return sendData(req, res, 200, 'application/json; charset=utf-8', content, 3600);
    }
    // Fallback upstream
    try {
      const uRes = await fetchUpstream('/api/search-index.json');
      if (uRes.ok) {
        const text = await uRes.text();
        fs.writeFileSync(indexPath, text);
        return sendData(req, res, 200, 'application/json; charset=utf-8', text, 3600);
      }
    } catch (e) {
      console.error('search-index error:', e.message);
    }
    return sendJson(req, res, 404, { error: 'Search index not available' });
  }

  // 4. Home catalog
  if (pathname === '/api/home') {
    try {
      const uRes = await fetchUpstream('/api/home');
      if (uRes.ok) {
        const json = await uRes.json();
        fs.writeFileSync(path.join(DATA_DIR, 'home.json'), JSON.stringify(json, null, 2));
        return sendJson(req, res, 200, json, 300);
      }
    } catch (e) {
      // offline fallback
    }
    const local = readJsonSafe(path.join(DATA_DIR, 'home.json'));
    if (local) return sendJson(req, res, 200, local, 300);
    return sendJson(req, res, 500, { error: 'Could not load home data' });
  }

  // 5. Trending catalog
  if (pathname === '/api/trending') {
    const queryString = reqUrl.search || '';
    try {
      const uRes = await fetchUpstream(`/api/trending${queryString}`);
      if (uRes.ok) {
        const json = await uRes.json();
        return sendJson(req, res, 200, json, 300);
      }
    } catch (e) {
      // offline fallback
    }
    const local = readJsonSafe(path.join(DATA_DIR, 'trending.json'));
    if (local) return sendJson(req, res, 200, local, 300);
    return sendJson(req, res, 500, { error: 'Could not load trending data' });
  }

  // 6. Genres catalog
  if (pathname === '/api/genres') {
    try {
      const uRes = await fetchUpstream('/api/genres');
      if (uRes.ok) {
        const json = await uRes.json();
        return sendJson(req, res, 200, json, 86400);
      }
    } catch (e) {}
    const local = readJsonSafe(path.join(DATA_DIR, 'genres.json'));
    if (local) return sendJson(req, res, 200, local, 86400);
    return sendJson(req, res, 500, { error: 'Could not load genres' });
  }

  // 7. Browse catalog
  if (pathname === '/api/browse') {
    const queryString = reqUrl.search || '';
    try {
      const uRes = await fetchUpstream(`/api/browse${queryString}`);
      if (uRes.ok) {
        const json = await uRes.json();
        return sendJson(req, res, 200, json, 120);
      }
    } catch (e) {}

    // Offline fallback from local browse files
    const type = searchParams.get('type');
    let fallbackFile = 'browse_all.json';
    if (type === 'movie') fallbackFile = 'browse_movie.json';
    else if (type === 'series') fallbackFile = 'browse_series.json';
    else if (type === 'anime') fallbackFile = 'browse_anime.json';

    const local = readJsonSafe(path.join(DATA_DIR, fallbackFile)) || readJsonSafe(path.join(DATA_DIR, 'browse_movie.json'));
    if (local) return sendJson(req, res, 200, local, 120);
    return sendJson(req, res, 500, { error: 'Could not browse catalog' });
  }

  // 8. Title Details (/api/t/:code)
  if (pathname.startsWith('/api/t/')) {
    const code = pathname.slice('/api/t/'.length);
    const cachedFile = path.join(TITLES_DIR, `${code}.json`);

    // If cached, return cache immediately
    if (fs.existsSync(cachedFile)) {
      const cached = readJsonSafe(cachedFile);
      if (cached) {
        // Asynchronously update if older than 24 hours
        return sendJson(req, res, 200, cached, 3600);
      }
    }

    // Fetch from upstream
    try {
      console.log(`[Title] Fetching details for ${code} from upstream...`);
      const uRes = await fetchUpstream(`/api/t/${code}`);
      if (uRes.ok) {
        const json = await uRes.json();
        fs.writeFileSync(cachedFile, JSON.stringify(json, null, 2));
        return sendJson(req, res, 200, json, 3600);
      }
    } catch (e) {
      console.error(`Error fetching title ${code}:`, e.message);
    }

    return sendJson(req, res, 404, { error: 'Title details not found' });
  }

  // 9. Search (/api/search)
  if (pathname === '/api/search') {
    const q = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '30', 10);
    try {
      const uRes = await fetchUpstream(`/api/search?q=${encodeURIComponent(q)}&limit=${limit}`);
      if (uRes.ok) {
        const json = await uRes.json();
        return sendJson(req, res, 200, json, 60);
      }
    } catch (e) {}

    // Fallback: search over search-index.json
    const searchIndex = readJsonSafe(path.join(DATA_DIR, 'search-index.json')) || [];
    const queryNorm = q.trim().toLowerCase();
    const results = searchIndex
      .filter(([slug, title]) => title.toLowerCase().includes(queryNorm))
      .slice(0, limit)
      .map(([code, title, year, typeIdx, poster, latestLabel]) => ({
        code,
        title,
        year,
        type: ['movie', 'series', 'anime'][typeIdx] || 'movie',
        poster: poster ? `https://storage.hicine.sbs/images/${poster}` : null,
        latestLabel: latestLabel || null
      }));

    return sendJson(req, res, 200, { items: results });
  }

  // 10. Direct Download Resolver (/api/dl?t=...)
  if (pathname === '/api/dl') {
    const t = searchParams.get('t');
    if (!t) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      return res.end('Missing token t');
    }

    try {
      console.log('[Download] Resolving stream/download redirect for token:', t.slice(0, 15) + '...');
      const dlRes = await fetchUpstream(`/api/dl?t=${encodeURIComponent(t)}`, {
        redirect: 'manual'
      });

      const location = dlRes.headers.get('location');
      if (location) {
        console.log('[Download] Redirecting user to stream server:', location);
        res.writeHead(302, {
          'Location': location,
          'Access-Control-Allow-Origin': '*'
        });
        return res.end();
      }

      // If body returned HTML (player or mirror page)
      const body = await dlRes.text();
      res.writeHead(dlRes.status, { 'Content-Type': dlRes.headers.get('content-type') || 'text/html' });
      return res.end(body);
    } catch (e) {
      console.error('Download error:', e.message);
      res.writeHead(502, { 'Content-Type': 'text/plain' });
      return res.end('Download resolution failed: ' + e.message);
    }
  }

  // 11. Enter Gate Pass Form Handler (POST /enter)
  if (pathname === '/enter') {
    const passToken = `${Math.floor(Date.now() / 1000)}.${crypto.randomBytes(16).toString('hex')}`;
    const maxAge = 86400; // 24 hours
    res.writeHead(302, {
      'Set-Cookie': [
        `yf_pass=${passToken}; Path=/; Max-Age=${maxAge}; SameSite=Lax`,
        `yf_seen=1; Path=/; Max-Age=${maxAge}; SameSite=Lax`
      ],
      'Location': '/'
    });
    return res.end();
  }

  // 12. Verification Gate Page (/gate)
  if (pathname === '/gate') {
    const gatePath = path.join(PUBLIC_DIR, 'gate.html');
    if (serveStaticFile(req, res, gatePath)) return;
  }

  // 13. Static files inside public/
  let filePath = path.join(PUBLIC_DIR, pathname);
  if (serveStaticFile(req, res, filePath)) {
    return;
  }

  // 14. SPA Fallback: for routes like /, /browse/movie, /t/code, /search
  const indexPath = path.join(PUBLIC_DIR, 'index.html');
  if (serveStaticFile(req, res, indexPath)) {
    return;
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('404 Not Found');
});

server.listen(PORT, HOST, () => {
  console.log('====================================================');
  console.log(`🎬 Yupflix Full-Stack Clone Server Running!`);
  console.log(`📡 Local URL:       http://localhost:${PORT}/`);
  console.log(`🚪 Gate Landing:   http://localhost:${PORT}/gate`);
  console.log(`🔍 Direct Search:   http://localhost:${PORT}/search`);
  console.log(`📚 Catalog Database: ${fs.readdirSync(TITLES_DIR).length} titles cached locally`);
  console.log('====================================================');
});
