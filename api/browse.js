import { getUpstreamCookie } from '../yupflix/streamResolver.js';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const queryIndex = req.url.indexOf('?');
  const queryString = queryIndex !== -1 ? req.url.slice(queryIndex) : '';

  // 1. Live fetch from upstream Yupflix with authentication session
  try {
    const cookie = await getUpstreamCookie();
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
      ...(cookie ? { 'Cookie': cookie } : {})
    };

    const upstreamRes = await fetch(`https://yupflix.org/api/browse${queryString}`, {
      headers,
      signal: AbortSignal.timeout(6000)
    });

    if (upstreamRes.ok) {
      const data = await upstreamRes.json();
      res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=300');
      return res.status(200).json(data);
    }
  } catch (err) {
    console.warn('[api/browse] Live upstream fetch failed, using cached provider catalog:', err.message);
  }

  // 2. Fallback to bundled curated datasets
  try {
    const dataDir = path.join(process.cwd(), 'src', 'yupflix', 'data');
    let prov = req.query?.prov;
    let type = req.query?.type;
    if (!prov || !type) {
      try {
        const u = new URL(req.url, 'http://localhost');
        if (!prov) prov = u.searchParams.get('prov');
        if (!type) type = u.searchParams.get('type');
      } catch (e) {}
    }

    if (prov) {
      const provPath = path.join(dataDir, 'providers_cache.json');
      if (fs.existsSync(provPath)) {
        const provData = JSON.parse(fs.readFileSync(provPath, 'utf8'));
        if (provData[prov]) {
          return res.status(200).json(provData[prov]);
        }
      }
    }

    let file = 'browse_all.json';
    if (type === 'movie') file = 'browse_movie.json';
    else if (type === 'series') file = 'browse_series.json';
    else if (type === 'anime') file = 'browse_anime.json';

    const fallbackPath = path.join(dataDir, file);
    if (fs.existsSync(fallbackPath)) {
      const fallbackData = JSON.parse(fs.readFileSync(fallbackPath, 'utf8'));
      return res.status(200).json(fallbackData);
    }
  } catch (err) {
    console.error('[api/browse] Local fallback error:', err.message);
  }

  return res.status(200).json({ items: [], total: 0, hasMore: false });
}
