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
    const dataDir = path.join(process.cwd(), 'src', 'yupflix', 'data');
    const local = JSON.parse(fs.readFileSync(path.join(dataDir, 'genres.json'), 'utf8'));
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=86400');
    return res.status(200).json(local);
  } catch (err) {
    return res.status(500).json({ error: 'Could not load genres' });
  }
}
