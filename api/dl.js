import { resolveStreamToken } from '../yupflix/streamResolver.js';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const { t, format, resolve } = req.query;
  if (!t) {
    return res.status(400).send('Missing token t');
  }

  const wantsJson = format === 'json' || resolve === '1';

  try {
    const result = await resolveStreamToken(t);
    if (wantsJson) {
      return res.status(200).json(result);
    }

    const targetUrl = result.directStreamUrl || result.workerLocation;
    if (targetUrl) {
      return res.redirect(302, targetUrl);
    }
  } catch (err) {
    console.error('Download error:', err.message);
  }

  return res.redirect(302, `https://yupflix.org/api/dl?t=${encodeURIComponent(t)}`);
}
