/**
 * Stream Resolver for FilmsClub (Yupflix)
 * Resolves upstream bypass, Cloudflare worker server links, and direct Cloudflare R2 video URLs.
 */

const UPSTREAM_ORIGIN = 'https://yupflix.org';

let cachedCookie = null;
let cookieExpiresAt = 0;

export async function getUpstreamCookie(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && cachedCookie && cookieExpiresAt > now + 60000) {
    return cachedCookie;
  }

  try {
    const res = await fetch(`${UPSTREAM_ORIGIN}/enter`, {
      method: 'POST',
      redirect: 'manual',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
      }
    });

    const setCookie = res.headers.get('set-cookie');
    if (setCookie) {
      const match = setCookie.match(/yf_pass=[^;]+/);
      if (match) {
        cachedCookie = match[0];
        cookieExpiresAt = now + 16 * 60 * 60 * 1000;
        return cachedCookie;
      }
    }
  } catch (err) {
    console.warn('[StreamResolver] Failed to refresh pass:', err.message);
  }

  return cachedCookie;
}

export async function resolveStreamToken(token) {
  if (!token) {
    throw new Error('Token is required');
  }

  let cookie = await getUpstreamCookie();
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    ...(cookie ? { 'Cookie': cookie } : {})
  };

  let dlRes = await fetch(`${UPSTREAM_ORIGIN}/api/dl?t=${encodeURIComponent(token)}`, {
    headers,
    redirect: 'manual'
  });

  if (dlRes.status === 401 || dlRes.status === 403 || (dlRes.status === 302 && (dlRes.headers.get('location') || '').includes('enter'))) {
    cookie = await getUpstreamCookie(true);
    headers['Cookie'] = cookie || '';
    dlRes = await fetch(`${UPSTREAM_ORIGIN}/api/dl?t=${encodeURIComponent(token)}`, {
      headers,
      redirect: 'manual'
    });
  }

  const workerLocation = dlRes.headers.get('location');
  if (!workerLocation) {
    const body = await dlRes.text();
    return {
      ok: false,
      error: 'Upstream did not return a redirect location',
      status: dlRes.status,
      body: body.slice(0, 200)
    };
  }

  try {
    const workerUrl = new URL(workerLocation);
    const vcloud = workerUrl.searchParams.get('vcloud');
    if (!vcloud) {
      return {
        ok: true,
        directStreamUrl: workerLocation,
        downloadUrl: workerLocation,
        workerLocation,
        servers: []
      };
    }

    const linksUrl = `${workerUrl.origin}/api/links?vcloud=${encodeURIComponent(vcloud)}`;
    const linksRes = await fetch(linksUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
      }
    });

    const linksData = await linksRes.json();
    const tokens = linksData.tokens || {};
    const servers = [];

    const SERVER_LABELS = {
      fsl: 'FSL Direct Ultra-Fast (Cloudflare R2)',
      fsl2: 'FSLv2 High-Speed Node',
      pixel: 'Pixel High-Bandwidth Server',
      ten: '10Gbps Dedicated CDN Server',
      server1: 'Standard VIP Server 1',
      gofile: 'Gofile Direct Mirror'
    };

    for (const [type, tokenObj] of Object.entries(tokens)) {
      const goUrl = `${workerUrl.origin}/go?type=${type}&vcloud=${encodeURIComponent(vcloud)}&ts=${tokenObj.ts}&sig=${tokenObj.sig}`;
      const watchUrl = `${workerUrl.origin}/watch?type=${type}&vcloud=${encodeURIComponent(vcloud)}&ts=${tokenObj.ts}&sig=${tokenObj.sig}`;
      servers.push({
        type,
        name: SERVER_LABELS[type] || `Server ${type.toUpperCase()}`,
        goUrl,
        watchUrl
      });
    }

    // Resolve direct stream from first available server
    let directStreamUrl = null;
    if (servers.length > 0) {
      try {
        const goRes = await fetch(servers[0].goUrl, {
          method: 'GET',
          redirect: 'manual',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
          }
        });
        directStreamUrl = goRes.headers.get('location') || servers[0].goUrl;
      } catch {
        directStreamUrl = servers[0].goUrl;
      }
    }

    return {
      ok: true,
      title: linksData.title || '',
      size: linksData.size || '',
      watchable: linksData.watchable !== false,
      directStreamUrl: directStreamUrl || workerLocation,
      downloadUrl: directStreamUrl || (servers[0]?.goUrl) || workerLocation,
      workerLocation,
      vcloud,
      servers
    };
  } catch (err) {
    return {
      ok: true,
      directStreamUrl: workerLocation,
      downloadUrl: workerLocation,
      workerLocation,
      servers: []
    };
  }
}
