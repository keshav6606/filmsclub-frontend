import { getUpstreamCookie } from '../../yupflix/streamResolver.js';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const { code } = req.query;
  if (!code) {
    return res.status(400).json({ error: 'Missing title code' });
  }

  const titlesDir = path.join(process.cwd(), 'src', 'yupflix', 'data', 'titles');
  const cachedFile = path.join(titlesDir, `${code}.json`);

  if (fs.existsSync(cachedFile)) {
    try {
      const cached = JSON.parse(fs.readFileSync(cachedFile, 'utf8'));
      return res.status(200).json(cached);
    } catch {}
  }

  try {
    const cookie = await getUpstreamCookie();
    const headers = {
      'User-Agent': 'Mozilla/5.0',
      'Accept': 'application/json',
      ...(cookie ? { 'Cookie': cookie } : {})
    };

    const upstreamRes = await fetch(`https://yupflix.org/api/t/${code}`, {
      headers,
      signal: AbortSignal.timeout(6000)
    });

    if (upstreamRes.ok) {
      const json = await upstreamRes.json();
      return res.status(200).json(json);
    }
  } catch (err) {}

  return res.status(404).json({ error: 'Title details unavailable' });
}
