/**
 * Yupflix Helpers for filmsclub-frontend integration
 */

export const PROVIDERS = [
  { key: 'netflix', name: 'Netflix', img: 'netflix' },
  { key: 'prime', name: 'Prime Video', img: 'prime' },
  { key: 'hotstar', name: 'JioHotstar', img: 'hotstar' },
  { key: 'zee5', name: 'ZEE5', img: 'zee5' },
  { key: 'sonyliv', name: 'SonyLIV', img: 'sonyliv' },
  { key: 'appletv', name: 'Apple TV+', img: 'appletv' },
  { key: 'mxplayer', name: 'MX Player', img: 'mxplayer' },
  { key: 'hoichoi', name: 'Hoichoi', img: 'hoichoi' },
  { key: 'ullu', name: 'ULLU', bg: '#C8102E', fg: '#fff', label: 'ULLU', small: true },
  { key: 'voot', name: 'Voot', bg: 'linear-gradient(135deg,#7d3cff,#ff007a)', fg: '#fff', label: 'voot', small: true },
  { key: 'altbalaji', name: 'ALTBalaji', bg: '#ED1C24', fg: '#fff', label: 'ALT' },
  { key: 'kooku', name: 'Kooku', bg: '#111827', fg: '#ff2d55', label: 'kooku', small: true },
  { key: 'lionsgate', name: 'Lionsgate Play', img: 'lionsgate' }
];

const baseProvidersMap = Object.fromEntries(PROVIDERS.map(p => [p.key, p]));
export const PROVIDERS_MAP = {
  ...baseProvidersMap,
  apple: baseProvidersMap['appletv'] || { key: 'apple', name: 'Apple TV+', img: 'appletv' },
  nf: baseProvidersMap['netflix'],
  amz: baseProvidersMap['prime'],
  dnp: baseProvidersMap['hotstar'],
  sliv: baseProvidersMap['sonyliv'],
  zee: baseProvidersMap['zee5']
};

export const TYPE_LABELS = {
  movie: 'Movie',
  series: 'Series',
  anime: 'Anime'
};

export function cleanTitle(title = '') {
  return title.replace(/\s*\((19|20)\d{2}\)\s*$/, '').trim() || title;
}

const QUALITY_RANKS = { '2160p': 4, '1080p': 3, '720p': 2, '480p': 1 };
export function getQualityRank(q = '') {
  return QUALITY_RANKS[q] ?? 0;
}

export function formatQuality(q = '') {
  return q === '2160p' ? '4K' : (q || 'File');
}

const QUALITY_NAMES = {
  '2160p': 'Ultra HD',
  '1080p': 'Full HD',
  '720p': 'HD',
  '480p': 'SD'
};
export function getQualityName(q = '') {
  return QUALITY_NAMES[q] || '';
}

export function parseSizeToMb(size = '') {
  const match = (size || '').match(/([\d.]+)\s*(TB|GB|MB)/i);
  if (!match) return 0;
  const num = parseFloat(match[1]);
  const unit = match[2].toUpperCase();
  if (unit === 'TB') return num * 1024 * 1024;
  if (unit === 'GB') return num * 1024;
  return num;
}

export function formatSize(size = '') {
  return (size || '').replace(/([\d.]+)\s*(TB|GB|MB)/i, (match, num, unit) => `${num} ${unit.toUpperCase()}`);
}

const SOURCE_NAMES = {
  bluray: 'BluRay',
  'blu-ray': 'BluRay',
  brrip: 'BRRip',
  'web-dl': 'WEB-DL',
  webrip: 'WEBRip',
  web: 'WEB',
  hdrip: 'HDRip',
  hdtv: 'HDTV',
  dvdrip: 'DVDRip',
  hdts: 'HDTS',
  hdcam: 'HDCAM',
  cam: 'CAM'
};

export function parseMediaInfo(label = '') {
  const result = {};
  const audioMatch = (label || '').match(/\{([^}]+)\}/);
  if (audioMatch) {
    const list = audioMatch[1].split(/[-–,&/+]/).map(s => s.trim()).filter(Boolean);
    if (list.length) result.audio = list.join(' + ');
  }

  const srcMatch = (label || '').match(/\b(BluRay|Blu-Ray|BRRip|WEB-DL|WEBRip|HDRip|HDTV|DVDRip|HDTS|HDCAM|CAM|WEB)\b/i);
  if (srcMatch) {
    result.source = SOURCE_NAMES[srcMatch[1].toLowerCase()] || srcMatch[1];
  }

  const codecMatch = (label || '').match(/\b(x265|x264|HEVC|H\.?265|H\.?264|AV1)\b/i);
  const bitMatch = /\b10[\s-]?bit\b/i.test(label || '') ? '10-bit' : '';
  const hdrMatch = /\b(HDR10\+?|HDR|DV|Dolby Vision)\b/i.exec(label || '')?.[1] || '';
  const codec = [codecMatch?.[1], bitMatch, hdrMatch].filter(Boolean).join(' ');
  if (codec) result.codec = codec;

  return result;
}

const GENRE_BLACKLIST = /^(hollywood|bollywood)(\s+(movies|series))?$|^(19|20)\d{2}$|blu-?ray|web-?dl|dual audio|anime series|^featured$|^trending$/i;
const PLATFORM_NAMES = new Set(PROVIDERS.map(p => p.name.toLowerCase()).concat(['amazon prime video', 'hbo max', 'disney+', 'disney+ hotstar', 'apple tv']));

export function filterGenres(genres = []) {
  return (genres || []).filter(g => g && !GENRE_BLACKLIST.test(g.trim()) && !PLATFORM_NAMES.has(g.trim().toLowerCase()));
}

export function cleanEpisodeLabel(label = '') {
  return (label || '').replace(/\s*Episode\s*/i, ' E').trim();
}

export function extractEpisodeNumber(label = '') {
  const match = (label || '').match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

export function parseSeasonEpisode(text = '') {
  if (!text) return null;
  const s = text.match(/s(?:eason)?\s*(\d+)/i);
  const e = text.match(/e(?:p|pisode)?\s*(\d+)/i);
  if (!s && !e) return null;
  return {
    season: s ? parseInt(s[1], 10) : undefined,
    ep: e ? parseInt(e[1], 10) : undefined
  };
}

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
export function isRecentUpdate(dateStr) {
  const time = dateStr ? Date.parse(dateStr) : NaN;
  return !isNaN(time) && (Date.now() - time < SEVEN_DAYS_MS);
}

export function sortSources(a, b) {
  return (getQualityRank(b.quality) - getQualityRank(a.quality)) || (parseSizeToMb(b.size) - parseSizeToMb(a.size));
}
