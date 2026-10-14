/**
 * Yupflix / FilmsClub API Service
 * Uses live backend/proxy when available, and automatically falls back to bundled JSON datasets.
 */

import homeFallback from '../data/home.json';
import trendingFallback from '../data/trending.json';
import genresFallback from '../data/genres.json';
import browseAllFallback from '../data/browse_all.json';
import browseMovieFallback from '../data/browse_movie.json';
import browseSeriesFallback from '../data/browse_series.json';
import browseAnimeFallback from '../data/browse_anime.json';

const CACHE_TTL_MS = 5 * 60 * 1000;
const cache = new Map();
const inFlight = new Map();

export const getYupflixServer = () => {
  if (typeof window !== 'undefined') {
    // If VITE_YUPFLIX_SERVER is explicitly set, use it
    if (import.meta.env.VITE_YUPFLIX_SERVER) {
      return import.meta.env.VITE_YUPFLIX_SERVER;
    }
  }
  return '';
};

export const YUPFLIX_SERVER = getYupflixServer();

export function getYupflixDownloadUrl(url) {
  if (!url) return '#';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const server = getYupflixServer();
  return server ? `${server}${url}` : url;
}

async function safeFetch(endpoint, fallbackData) {
  try {
    const server = getYupflixServer();
    const url = server ? `${server}${endpoint}` : endpoint;
    const res = await fetch(url);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // server unreachable, use fallback
  }
  return fallbackData;
}

export function cachedFetch(endpoint, fallbackData, signal) {
  const cached = cache.get(endpoint);
  if (cached && (Date.now() - cached.at < CACHE_TTL_MS)) {
    return Promise.resolve(cached.data);
  }

  let promise = inFlight.get(endpoint);
  if (!promise) {
    promise = safeFetch(endpoint, fallbackData)
      .then(data => {
        cache.set(endpoint, { at: Date.now(), data });
        inFlight.delete(endpoint);
        return data;
      })
      .catch(() => {
        inFlight.delete(endpoint);
        return fallbackData;
      });
    inFlight.set(endpoint, promise);
  }

  if (!signal) return promise;

  return new Promise((resolve) => {
    const onAbort = () => resolve(fallbackData);
    if (signal.aborted) return onAbort();
    signal.addEventListener('abort', onAbort, { once: true });
    promise.then(data => {
      signal.removeEventListener('abort', onAbort);
      resolve(data);
    });
  });
}

export const yupflixApi = {
  home: (signal) => cachedFetch('/api/home', homeFallback, signal),
  trending: (type = '', industry = '', signal) => cachedFetch(`/api/trending?type=${type}&industry=${industry}`, trendingFallback, signal),
  genres: (type = '', signal) => cachedFetch(`/api/genres?type=${type}`, genresFallback, signal),
  browse: (queryString = '', signal) => {
    let fb = browseAllFallback;
    if (queryString.includes('type=movie')) fb = browseMovieFallback;
    else if (queryString.includes('type=series')) fb = browseSeriesFallback;
    else if (queryString.includes('type=anime')) fb = browseAnimeFallback;
    return cachedFetch(`/api/browse?${queryString}`, fb, signal);
  },
  title: async (code, signal) => {
    const server = getYupflixServer();
    try {
      const res = await fetch(`${server}/api/t/${code}`, { signal });
      if (res.ok) return await res.json();
    } catch {}

    // Check if we have bundled title data
    try {
      const mod = await import(`../data/titles/${code}.json`);
      return mod.default || mod;
    } catch {}

    // Search in home/trending items
    const allItems = [
      ...(homeFallback.trending || []),
      ...(browseMovieFallback.items || []),
      ...(browseSeriesFallback.items || [])
    ];
    const match = allItems.find(it => it.code === code || it.slug === code);
    if (match) {
      return { title: match, similar: allItems.filter(it => it.code !== code).slice(0, 10) };
    }
    throw new Error('Title not found');
  },
  resolveStream: async (tokenOrUrl) => {
    let token = tokenOrUrl;
    if (tokenOrUrl && tokenOrUrl.includes('t=')) {
      try {
        const u = new URL(tokenOrUrl, 'http://localhost');
        token = u.searchParams.get('t') || tokenOrUrl;
      } catch {}
    }

    if (!token) {
      throw new Error('No token found to resolve');
    }

    const server = getYupflixServer();
    const apiUrl = `${server}/api/resolve-stream?t=${encodeURIComponent(token)}`;

    try {
      const res = await fetch(apiUrl);
      if (res.ok) {
        const data = await res.json();
        if (data.ok) return data;
      }
    } catch (e) {
      console.warn('[yupflixApi] resolveStream API call failed:', e.message);
    }

    // Secondary attempt via /api/dl?format=json
    try {
      const dlRes = await fetch(`${server}/api/dl?t=${encodeURIComponent(token)}&format=json`);
      if (dlRes.ok) {
        const data = await dlRes.json();
        if (data.ok) return data;
      }
    } catch {}

    // Fallback: direct download route
    const dlUrl = getYupflixDownloadUrl(`/api/dl?t=${encodeURIComponent(token)}`);
    return {
      ok: true,
      directStreamUrl: dlUrl,
      downloadUrl: dlUrl,
      servers: []
    };
  },
  findTmdbId: async (titleText, year = '', type = 'movie') => {
    if (!titleText) return null;
    const clean = titleText.replace(/\s*\(\d{4}\)/, '').trim();
    const cacheKey = `fc_tmdb_${clean}_${year}`;
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) return JSON.parse(cached);
    } catch {}

    const TMDB_API_KEY = 'f19e3265d68fadce804778d6f4c09f38';

    // 1. Try api.tmdb.org multi-search
    try {
      const u = `https://api.tmdb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(clean)}`;
      const res = await fetch(u, { signal: AbortSignal.timeout(4500) });
      if (res.ok) {
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          let match = data.results[0];
          if (year) {
            const yrMatch = data.results.find(it => {
              const rYr = (it.release_date || it.first_air_date || '').slice(0, 4);
              return rYr === String(year);
            });
            if (yrMatch) match = yrMatch;
          }
          const info = {
            id: match.id,
            title: match.title || match.name,
            mediaType: match.media_type || (type === 'series' ? 'tv' : 'movie')
          };
          try { localStorage.setItem(cacheKey, JSON.stringify(info)); } catch {}
          return info;
        }
      }
    } catch (e) {
      console.warn('[yupflixApi] TMDB direct search error:', e.message);
    }

    // 2. Try Koyeb backend search
    try {
      const kUrl = `https://screeching-cherye-filmy4uhd-b60bef55.koyeb.app/api/search/?query=${encodeURIComponent(clean)}`;
      const kRes = await fetch(kUrl, { signal: AbortSignal.timeout(4500) });
      if (kRes.ok) {
        const kData = await kRes.json();
        const first = kData.results?.[0];
        if (first?.tmdb_id) {
          const info = {
            id: first.tmdb_id,
            title: first.title,
            mediaType: first.media_type || (type === 'series' ? 'tv' : 'movie')
          };
          try { localStorage.setItem(cacheKey, JSON.stringify(info)); } catch {}
          return info;
        }
      }
    } catch {}

    return null;
  }
};
