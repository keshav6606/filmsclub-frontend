import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { resolveStreamToken, getUpstreamCookie } from './yupflix/streamResolver.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'yupflix', 'data');
const TITLES_DIR = path.join(DATA_DIR, 'titles');

function readJsonSafe(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch {}
  return null;
}

function filmsclubApiPlugin() {
  return {
    name: 'filmsclub-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost:5173'}`);
        const pathname = reqUrl.pathname;
        const searchParams = reqUrl.searchParams;

        // Only handle /api/ and /yupflix-api/
        if (!pathname.startsWith('/api/') && !pathname.startsWith('/yupflix-api/')) {
          return next();
        }

        // Set standard CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          return res.end();
        }

        const normalizedPath = pathname.replace(/^\/yupflix-api/, '/api');

        // 1. Resolve Stream API (JSON)
        if (normalizedPath === '/api/resolve-stream') {
          const t = searchParams.get('t');
          if (!t) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ ok: false, error: 'Missing token t' }));
          }

          try {
            console.log(`[Vite API] Resolving stream for token: ${t.slice(0, 15)}...`);
            const result = await resolveStreamToken(t);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify(result));
          } catch (err) {
            console.error('[Vite API] Resolution error:', err.message);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ ok: false, error: err.message }));
          }
        }

        // 1.5. TMDB Proxy Search
        if (normalizedPath === '/api/tmdb-search') {
          const q = searchParams.get('q');
          if (!q) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ error: 'Missing query q' }));
          }

          const TMDB_KEY = 'f19e3265d68fadce804778d6f4c09f38';
          try {
            const tmdbRes = await fetch(`https://api.tmdb.org/3/search/multi?api_key=${TMDB_KEY}&query=${encodeURIComponent(q)}`);
            const json = await tmdbRes.json();
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify(json));
          } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ error: err.message }));
          }
        }

        // 2. Direct Download / Stream Redirect
        if (normalizedPath === '/api/dl') {
          const t = searchParams.get('t');
          if (!t) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'text/plain');
            return res.end('Missing token t');
          }

          const wantsJson = searchParams.get('format') === 'json' || searchParams.get('resolve') === '1';

          try {
            const result = await resolveStreamToken(t);
            if (wantsJson) {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify(result));
            }

            const targetUrl = result.directStreamUrl || result.workerLocation;
            if (targetUrl) {
              console.log('[Vite API] Redirecting /api/dl to:', targetUrl);
              res.statusCode = 302;
              res.setHeader('Location', targetUrl);
              return res.end();
            }
          } catch (err) {
            console.error('[Vite API] Download error:', err.message);
          }

          // Fallback redirect to upstream
          res.statusCode = 302;
          res.setHeader('Location', `https://yupflix.org/api/dl?t=${encodeURIComponent(t)}`);
          return res.end();
        }

        // 3. Home catalog
        if (normalizedPath === '/api/home') {
          const local = readJsonSafe(path.join(DATA_DIR, 'home.json'));
          if (local) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify(local));
          }
        }

        // 4. Trending catalog
        if (normalizedPath === '/api/trending') {
          const local = readJsonSafe(path.join(DATA_DIR, 'trending.json'));
          if (local) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify(local));
          }
        }

        // 5. Genres
        if (normalizedPath === '/api/genres') {
          const local = readJsonSafe(path.join(DATA_DIR, 'genres.json'));
          if (local) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify(local));
          }
        }

        // 6. Browse
        if (normalizedPath === '/api/browse') {
          const type = searchParams.get('type');
          let file = 'browse_all.json';
          if (type === 'movie') file = 'browse_movie.json';
          else if (type === 'series') file = 'browse_series.json';
          else if (type === 'anime') file = 'browse_anime.json';

          const local = readJsonSafe(path.join(DATA_DIR, file)) || readJsonSafe(path.join(DATA_DIR, 'browse_movie.json'));
          if (local) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify(local));
          }
        }

        // 7. Title Details (/api/t/:code)
        if (normalizedPath.startsWith('/api/t/')) {
          const code = normalizedPath.slice('/api/t/'.length);
          const cachedFile = path.join(TITLES_DIR, `${code}.json`);
          if (fs.existsSync(cachedFile)) {
            const cached = readJsonSafe(cachedFile);
            if (cached) {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify(cached));
            }
          }

          // Fetch upstream
          try {
            const cookie = await getUpstreamCookie();
            const uRes = await fetch(`https://yupflix.org/api/t/${code}`, {
              headers: {
                'User-Agent': 'Mozilla/5.0',
                ...(cookie ? { 'Cookie': cookie } : {})
              }
            });
            if (uRes.ok) {
              const json = await uRes.json();
              try { fs.writeFileSync(cachedFile, JSON.stringify(json, null, 2)); } catch {}
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify(json));
            }
          } catch {}

          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ error: 'Title not found' }));
        }

        // 8. Search
        if (normalizedPath === '/api/search') {
          const q = (searchParams.get('q') || '').toLowerCase().trim();
          const limit = parseInt(searchParams.get('limit') || '30', 10);
          const searchIndex = readJsonSafe(path.join(DATA_DIR, 'search-index.json')) || [];
          const results = searchIndex
            .filter(([slug, title]) => title.toLowerCase().includes(q))
            .slice(0, limit)
            .map(([code, title, year, typeIdx, poster, latestLabel]) => ({
              code,
              title,
              year,
              type: ['movie', 'series', 'anime'][typeIdx] || 'movie',
              poster: poster ? `https://storage.hicine.sbs/images/${poster}` : null,
              latestLabel: latestLabel || null
            }));

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ items: results }));
        }

        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [
    react(),
    filmsclubApiPlugin()
  ],
  server: {
    port: 5173
  }
});
