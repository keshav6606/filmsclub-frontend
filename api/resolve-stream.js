import { resolveStreamToken } from '../yupflix/streamResolver.js';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const { t } = req.query;
  if (!t) {
    return res.status(400).json({ ok: false, error: 'Missing token t' });
  }

  try {
    const result = await resolveStreamToken(t);
    return res.status(200).json(result);
  } catch (err) {
    console.error('Resolve stream error:', err.message);
    return res.status(500).json({ ok: false, error: err.message });
  }
}
