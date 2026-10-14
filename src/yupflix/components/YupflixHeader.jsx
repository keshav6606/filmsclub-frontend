import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { yupflixApi } from '../services/yupflixApi';
import { loadSearchIndex, searchTitles } from '../services/yupflixSearch';
import { cleanTitle, cleanEpisodeLabel, TYPE_LABELS } from '../utils/yupflixHelpers';
import FilmsClubLogo from '../../components/FilmsClubLogo';
import { BiSearch, BiX } from 'react-icons/bi';
import { FaArrowLeft, FaFire, FaTv, FaFilm } from 'react-icons/fa';

const NAV_ITEMS = [
  ['/', 'Home'],
  ['/movies', 'Movies'],
  ['/series', 'Web Series'],
  ['/filmsclub/browse/anime', 'Anime'],
  ['/watchlist', 'Watchlist']
];

export function YupflixHeader({ searchInputRef, isSearching, onSearchingChange }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [active, setActive] = useState(false);
  const [trending, setTrending] = useState([]);
  const [placeholderWord, setPlaceholderWord] = useState('');
  const wrapRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    onSearchingChange?.(active);
  }, [active, onSearchingChange]);

  useEffect(() => {
    yupflixApi.trending('', '')
      .then(d => setTrending((d.trending || []).slice(0, 8)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (query || active) return;
    const words = trending.length ? trending.map(t => cleanTitle(t.title)) : ['Spider-Man', 'Mirzapur', 'Stranger Things', 'Anime'];
    let wIdx = 0, charIdx = 0, deleting = false, timer = 0;

    const tick = () => {
      const current = words[wIdx] || 'Movies';
      charIdx += deleting ? -1 : 1;
      setPlaceholderWord(current.slice(0, charIdx));
      let delay = deleting ? 30 : 70;

      if (!deleting && charIdx === current.length) {
        deleting = true;
        delay = 1800;
      } else if (deleting && charIdx === 0) {
        deleting = false;
        wIdx = (wIdx + 1) % words.length;
        delay = 350;
      }
      timer = window.setTimeout(tick, delay);
    };

    tick();
    return () => clearTimeout(timer);
  }, [trending, query, active]);

  useEffect(() => {
    const handleOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setActive(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const searchTimerRef = useRef(null);

  const handleChange = (val) => {
    setQuery(val);
    setActive(true);
    if (!val.trim()) {
      setResults([]);
      return;
    }

    // 1. Instant client-side scraped search
    let localMatches = [];
    try {
      localMatches = searchTitles(val, 6).map(m => ({ ...m, isScraped: true }));
      setResults(localMatches);
    } catch {}

    // 2. Debounced Koyeb Database API search
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      fetch(`https://screeching-cherye-filmy4uhd-b60bef55.koyeb.app/api/search/?query=${encodeURIComponent(val.trim())}&page=1&page_size=6`)
        .then(r => r.json())
        .then(d => {
          if (d?.results?.length) {
            const dbMatches = d.results.map(m => ({
              ...m,
              code: null,
              tmdb_id: m.tmdb_id,
              title: m.title,
              poster: m.poster,
              year: m.release_year,
              type: m.media_type === 'tv' ? 'series' : 'movie',
              media_type: m.media_type || 'movie',
              latestLabel: m.rip || (m.media_type === 'tv' ? 'Series' : '4K UHD'),
              isDatabase: true,
            }));

            // Merge & Deduplicate
            const merged = [];
            const seen = new Set();
            const maxLen = Math.max(dbMatches.length, localMatches.length);
            for (let i = 0; i < maxLen; i++) {
              if (dbMatches[i]) {
                const norm = dbMatches[i].title.toLowerCase().replace(/[^a-z0-9]/g, '');
                if (!seen.has(norm)) {
                  seen.add(norm);
                  merged.push(dbMatches[i]);
                }
              }
              if (localMatches[i]) {
                const norm = localMatches[i].title.toLowerCase().replace(/[^a-z0-9]/g, '');
                if (!seen.has(norm)) {
                  seen.add(norm);
                  merged.push(localMatches[i]);
                }
              }
            }
            setResults(merged);
          }
        })
        .catch(() => {});
    }, 200);
  };

  const closeDropdown = () => {
    setActive(false);
    searchInputRef?.current?.blur();
  };

  const selectItem = (item) => {
    closeDropdown();
    setQuery('');
    if (item.code) {
      navigate(`/filmsclub/t/${item.code}`, { state: { card: item } });
    } else if (item.media_type === 'tv' || item.type === 'series') {
      navigate(`/ser/${item.tmdb_id}`, { state: { card: item } });
    } else {
      navigate(`/mov/${item.tmdb_id}`, { state: { card: item } });
    }
  };

  const hasQuery = !!query.trim();
  const displayedItems = hasQuery ? results : trending.slice(0, 6);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (hasQuery) {
      closeDropdown();
      navigate(`/search/${encodeURIComponent(query.trim())}`);
    }
  };

  const isNavActive = (path) => {
    if (path === '/') return location.pathname === '/' || location.pathname === '/filmsclub';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 transition-all duration-300 bg-[#0a0c12]/95 backdrop-blur-2xl border-b border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.85)]">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2.5 sm:gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <FilmsClubLogo to="/" />
        </div>

        {/* Center: Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-[#12141c]/80 p-1.5 rounded-2xl border border-white/10">
          {NAV_ITEMS.map(([path, label]) => {
            const activeLink = isNavActive(path);
            return (
              <NavLink
                key={path}
                to={path}
                className={`px-4 py-1.5 rounded-xl text-xs lg:text-sm font-outfit font-bold transition-all duration-200 ${
                  activeLink
                    ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(229,9,20,0.6)]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {label}
              </NavLink>
            );
          })}
        </nav>

        {/* Right: Live Search Box */}
        <div className="relative flex-1 md:flex-initial max-w-[210px] sm:max-w-xs lg:max-w-sm" ref={wrapRef}>
          <form
            onSubmit={handleSubmit}
            className={`relative flex items-center h-10 sm:h-11 px-3.5 rounded-2xl border transition-all duration-300 ${
              active
                ? 'bg-[#181a24] border-red-500/80 shadow-[0_0_20px_rgba(229,9,20,0.3)]'
                : 'bg-white/5 hover:bg-white/10 border-white/10'
            }`}
          >
            <BiSearch className="text-zinc-400 text-lg shrink-0 mr-2" />
            <input
              ref={searchInputRef}
              type="search"
              value={query}
              onChange={(e) => handleChange(e.target.value)}
              onFocus={() => setActive(true)}
              placeholder={`Search ${placeholderWord}...`}
              className="w-full bg-transparent text-white placeholder-zinc-500 text-xs sm:text-sm font-medium outline-none"
              autoComplete="off"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-zinc-400 hover:text-white p-1"
              >
                <BiX className="text-base" />
              </button>
            )}
          </form>

          {/* Search Dropdown Modal */}
          {active && (
            <div className="absolute top-full mt-2 left-0 right-0 max-h-[75vh] bg-[#12141c]/98 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden z-50 p-2 animate-fadeIn no-sb overflow-y-auto">
              <div className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-zinc-400 flex items-center justify-between border-b border-white/5">
                <span>{hasQuery ? `Results for "${query}"` : "Trending Searches"}</span>
                <span className="text-red-400 flex items-center gap-1">
                  <FaFire className="text-[10px]" /> Instant
                </span>
              </div>

              {displayedItems.length === 0 ? (
                <div className="p-4 text-center text-zinc-400 text-xs">
                  No titles found matching "{query}"
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {displayedItems.map((item, idx) => (
                    <button
                      key={item.code || item.tmdb_id || idx}
                      type="button"
                      onClick={() => selectItem(item)}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/10 text-left transition-colors group"
                    >
                      <div className="w-10 h-14 rounded-lg overflow-hidden bg-black/60 shrink-0 border border-white/10">
                        {item.poster && (
                          <img src={item.poster} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h5 className="font-outfit font-bold text-white text-xs sm:text-sm truncate group-hover:text-red-400 transition-colors">
                            {cleanTitle(item.title)}
                          </h5>
                          {item.isDatabase ? (
                            <span className="shrink-0 px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[9px] font-bold border border-cyan-400/30">
                              4K DB
                            </span>
                          ) : (
                            <span className="shrink-0 px-1.5 py-0.2 rounded bg-red-600/20 text-red-400 font-mono text-[9px] font-bold border border-red-500/30">
                              OTT
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-0.5 truncate">
                          {TYPE_LABELS[item.type] || (item.media_type === 'tv' ? 'Series' : 'Movie')} · {item.latestLabel ? cleanEpisodeLabel(item.latestLabel) : (item.year || 'HD')}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {hasQuery && (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full mt-1 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 font-bold text-xs text-center border border-red-500/30 transition-colors"
                >
                  View all results for "{query}"
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default YupflixHeader;
