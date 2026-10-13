/**
 * Yupflix API Service with Caching and Request Deduplication
 */

const CACHE_TTL_MS = 5 * 60 * 1000;
const cache = new Map();
const inFlight = new Map();

async function rawFetch(endpoint, signal) {
  const res = await fetch(endpoint, { signal });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} from ${endpoint}`);
  }
  return await res.json();
}

export function cachedFetch(endpoint, signal) {
  const cached = cache.get(endpoint);
  if (cached && (Date.now() - cached.at < CACHE_TTL_MS)) {
    return Promise.resolve(cached.data);
  }

  let promise = inFlight.get(endpoint);
  if (!promise) {
    promise = rawFetch(endpoint)
      .then(data => {
        cache.set(endpoint, { at: Date.now(), data });
        inFlight.delete(endpoint);
        return data;
      })
      .catch(err => {
        inFlight.delete(endpoint);
        throw err;
      });
    inFlight.set(endpoint, promise);
  }

  if (!signal) return promise;

  return new Promise((resolve, reject) => {
    const onAbort = () => reject(new DOMException('Aborted', 'AbortError'));
    if (signal.aborted) return onAbort();
    signal.addEventListener('abort', onAbort, { once: true });
    promise.then(
      data => {
        signal.removeEventListener('abort', onAbort);
        resolve(data);
      },
      err => {
        signal.removeEventListener('abort', onAbort);
        reject(err);
      }
    );
  });
}

export function prefetch(endpoint) {
  if (!cache.has(endpoint) && !inFlight.has(endpoint)) {
    cachedFetch(endpoint).catch(() => {});
  }
}

export const api = {
  home: (signal) => cachedFetch('/api/home', signal),
  trending: (type = '', industry = '', signal) => cachedFetch(`/api/trending?type=${type}&industry=${industry}`, signal),
  genres: (type = '', signal) => cachedFetch(`/api/genres?type=${type}`, signal),
  browse: (queryString = '', signal) => cachedFetch(`/api/browse?${queryString}`, signal),
  title: (code, signal) => cachedFetch(`/api/t/${code}`, signal),
  search: (q, signal) => cachedFetch(`/api/search?q=${encodeURIComponent(q)}&limit=30`, signal),
  prefetchTitle: (code) => prefetch(`/api/t/${code}`),
  prefetchBrowse: (queryString) => prefetch(`/api/browse?${queryString}`)
};
