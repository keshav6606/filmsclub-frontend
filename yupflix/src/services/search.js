/**
 * Yupflix Fast Client-Side Search Engine over 19,000+ Titles
 */

const IMAGE_STORAGE_CDN = 'https://storage.hicine.sbs/images/';
const TYPE_KEYS = ['movie', 'series', 'anime'];

let searchIndex = null;
let indexPromise = null;

export function normalizeSearchText(text = '') {
  return text
    .normalize('NFKD')
    .replace(/[.’'`]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

export function loadSearchIndex() {
  if (searchIndex) return Promise.resolve(searchIndex);
  if (indexPromise) return indexPromise;

  indexPromise = fetch('/api/search-index.json')
    .then(res => {
      if (!res.ok) throw new Error(`Failed to load index: ${res.status}`);
      return res.json();
    })
    .then(data => {
      searchIndex = data.map(([slug, title, year, typeIdx, poster, latestLabel]) => ({
        slug,
        code: slug,
        title,
        type: TYPE_KEYS[typeIdx] || 'movie',
        year: year || undefined,
        poster: poster ? `${IMAGE_STORAGE_CDN}${poster}` : undefined,
        latestLabel: latestLabel || null,
        tc: normalizeSearchText(title)
      }));
      indexPromise = null;
      return searchIndex;
    })
    .catch(err => {
      indexPromise = null;
      throw err;
    });

  return indexPromise;
}

export function preloadSearchIndex() {
  loadSearchIndex().catch(() => {});
}

export function searchTitles(query = '', limit = 40) {
  if (!searchIndex) return [];
  const normalized = normalizeSearchText(query);
  if (!normalized) return [];

  const queryTokens = normalized.split(' ');
  const scored = [];

  for (const item of searchIndex) {
    const itemText = item.tc;
    let score = 0;

    if (itemText === normalized) {
      score = 1000;
    } else if (itemText.startsWith(normalized)) {
      score = 820;
    } else if (itemText.includes(normalized)) {
      score = 560;
    } else {
      const itemTokens = itemText.split(' ');
      let matchAll = true;
      for (const qTok of queryTokens) {
        if (!itemTokens.some(itTok => itTok.startsWith(qTok))) {
          matchAll = false;
          break;
        }
      }
      if (!matchAll) continue;
      score = 300;
    }

    // Boost newer releases
    score += Math.min(item.year || 0, 2030) / 1000;
    scored.push({ item, score });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map(s => s.item);
}
