// src/utils/storage.js
// Client-side storage utilities for Watchlist, Continue Watching, and Liked Titles

const WATCHLIST_KEY = "filmy4uhd_watchlist";
const CONTINUE_KEY = "filmy4uhd_continue_watching";
const LIKED_KEY = "filmy4uhd_liked";

/* ── Watchlist Helpers ── */
export const getWatchlist = () => {
  try {
    const data = localStorage.getItem(WATCHLIST_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const isInWatchlist = (tmdbId) => {
  if (!tmdbId) return false;
  const list = getWatchlist();
  return list.some((item) => String(item.tmdb_id) === String(tmdbId));
};

export const toggleWatchlist = (movie) => {
  if (!movie || !movie.tmdb_id) return false;
  const list = getWatchlist();
  const index = list.findIndex((item) => String(item.tmdb_id) === String(movie.tmdb_id));
  let updated;
  let added = false;

  if (index >= 0) {
    updated = list.filter((item) => String(item.tmdb_id) !== String(movie.tmdb_id));
    added = false;
  } else {
    const itemToAdd = {
      tmdb_id: movie.tmdb_id,
      title: movie.title || movie.name || "Untitled",
      poster: movie.poster || "",
      backdrop: movie.backdrop || "",
      rating: movie.rating || 7.5,
      release_year: movie.release_year || "2026",
      rip: movie.rip || "HD",
      genres: movie.genres || [],
      languages: movie.languages || [],
      media_type: movie.media_type || (movie.total_seasons ? "tv" : "movie"),
      addedAt: Date.now(),
    };
    updated = [itemToAdd, ...list];
    added = true;
  }

  try {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("watchlistUpdated"));
  } catch (e) {
    console.warn("Watchlist storage error:", e);
  }

  return added;
};

export const clearWatchlist = () => {
  try {
    localStorage.removeItem(WATCHLIST_KEY);
    window.dispatchEvent(new Event("watchlistUpdated"));
  } catch {}
};

/* ── Continue Watching Helpers ── */
export const getContinueWatching = () => {
  try {
    const data = localStorage.getItem(CONTINUE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveContinueWatching = ({
  tmdb_id,
  title,
  media_type = "movie",
  quality = "HD",
  poster = "",
  currentTime = 0,
  duration = 0,
  fileId = "",
  fileName = "",
  videoUrl = "",
}) => {
  if (!tmdb_id || !duration || duration < 15) return;
  const progressPercent = Math.round((currentTime / duration) * 100);

  const list = getContinueWatching().filter((i) => String(i.tmdb_id) !== String(tmdb_id));

  // Only keep if watched between 2% and 95%
  if (progressPercent >= 2 && progressPercent <= 95) {
    const entry = {
      tmdb_id,
      title,
      media_type,
      quality,
      poster,
      currentTime,
      duration,
      progressPercent,
      fileId,
      fileName,
      videoUrl,
      updatedAt: Date.now(),
    };
    list.unshift(entry);
  }

  try {
    localStorage.setItem(CONTINUE_KEY, JSON.stringify(list.slice(0, 12)));
    window.dispatchEvent(new Event("continueWatchingUpdated"));
  } catch {}
};

export const removeContinueWatching = (tmdbId) => {
  try {
    const list = getContinueWatching().filter((i) => String(i.tmdb_id) !== String(tmdbId));
    localStorage.setItem(CONTINUE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event("continueWatchingUpdated"));
  } catch {}
};
