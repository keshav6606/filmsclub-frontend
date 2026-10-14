export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: 'Missing query q' });
  }

  const TMDB_KEY = 'f19e3265d68fadce804778d6f4c09f38';
  try {
    const tmdbRes = await fetch(`https://api.tmdb.org/3/search/multi?api_key=${TMDB_KEY}&query=${encodeURIComponent(q)}`);
    const data = await tmdbRes.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
