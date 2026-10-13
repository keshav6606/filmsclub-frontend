/**
 * Yupflix API Service for filmsclub-frontend
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
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return import.meta.env.VITE_YUPFLIX_SERVER || 'http://localhost:3000';
    }
  }
  return import.meta.env.VITE_YUPFLIX_SERVER || '';
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
    const url = server ? `${server}${endpoint}` : `/yupflix-api${endpoint.replace(/^\/api/, '')}`;
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
      .catch(err => {
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
    try {
      const res = await fetch(`${YUPFLIX_SERVER}/api/t/${code}`, { signal });
      if (res.ok) return await res.json();
    } catch {}

    // Check if we have bundled title data
    try {
      const mod = await import(`../data/titles/${code}.json`);
      return mod.default || mod;
    } catch {}

    // Search in home/trending items
    const allItems = [...(homeFallback.trending || []), ...(browseMovieFallback.items || []), ...(browseSeriesFallback.items || [])];
    const match = allItems.find(it => it.code === code || it.slug === code);
    if (match) {
      return { title: match, similar: allItems.filter(it => it.code !== code).slice(0, 10) };
    }
    throw new Error('Title not found');
  },
  resolveStreamUrl: async (token) => {
    try {
      const res = await fetch(`${YUPFLIX_SERVER}/api/dl?t=${encodeURIComponent(token)}`, {
        redirect: 'follow'
      });
      return res.url;
    } catch {
      return null;
    }
  }
};
