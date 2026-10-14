import { getUpstreamCookie } from '../yupflix/streamResolver.js';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    const cookie = await getUpstreamCookie();
    const upstreamRes = await fetch('https://yupflix.org/api/home', {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json',
        ...(cookie ? { 'Cookie': cookie } : {})
      },
      signal: AbortSignal.timeout(6000)
    });

    if (upstreamRes.ok) {
      const data = await upstreamRes.json();
      res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
      return res.status(200).json(data);
    }
  } catch (err) {}

  try {
    const dataDir = path.join(process.cwd(), 'src', 'yupflix', 'data');
    const local = JSON.parse(fs.readFileSync(path.join(dataDir, 'home.json'), 'utf8'));
    return res.status(200).json(local);
  } catch (err) {
    return res.status(500).json({ error: 'Could not load home catalog' });
  }
}
