import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const q = (req.query?.q || '').toLowerCase().trim();
  const limit = parseInt(req.query?.limit || '40', 10);

  if (!q) {
    return res.status(200).json({ results: [] });
  }

  try {
    const dataDir = path.join(process.cwd(), 'src', 'yupflix', 'data');
    const searchIndex = JSON.parse(fs.readFileSync(path.join(dataDir, 'search-index.json'), 'utf8'));
    const results = searchIndex
      .filter(([slug, title]) => title.toLowerCase().includes(q))
      .slice(0, limit)
      .map(([code, title, year, typeIdx, poster, latestLabel]) => ({
        code,
        title,
        year,
        type: typeIdx === 1 ? 'series' : typeIdx === 2 ? 'anime' : 'movie',
        poster: poster ? (poster.startsWith('http') ? poster : `https://storage.hicine.biz/images/${poster}`) : null,
        latestLabel: latestLabel || null
      }));

    return res.status(200).json({ results });
  } catch (err) {
    return res.status(500).json({ error: 'Search failed' });
  }
}
