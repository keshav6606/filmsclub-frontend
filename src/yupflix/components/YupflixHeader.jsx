import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { yupflixApi } from '../services/yupflixApi';
import { loadSearchIndex, searchTitles } from '../services/yupflixSearch';
import { cleanTitle, cleanEpisodeLabel, TYPE_LABELS } from '../utils/yupflixHelpers';
import FilmsClubLogo from '../../components/FilmsClubLogo';

const NAV_ITEMS = [
  ['/filmsclub', 'Home'],
  ['/filmsclub/browse/movie', 'Movies'],
  ['/filmsclub/browse/series', 'Series'],
  ['/filmsclub/browse/anime', 'Anime']
];

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

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
      .then(d => setTrending(d.trending.slice(0, 8)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (query || active) return;
    const words = trending.length ? trending.map(t => cleanTitle(t.title)) : ['movies', 'series', 'anime'];
    let wIdx = 0, charIdx = 0, deleting = false, timer = 0;

    const tick = () => {
      const current = words[wIdx];
      charIdx += deleting ? -1 : 1;
      setPlaceholderWord(current.slice(0, charIdx));
      let delay = deleting ? 26 : 64;

      if (!deleting && charIdx === current.length) {
        deleting = true;
        delay = 1600;
      } else if (deleting && charIdx === 0) {
        deleting = false;
        wIdx = (wIdx + 1) % words.length;
        delay = 380;
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

  const handleChange = (val) => {
    setQuery(val);
    loadSearchIndex().then(() => {
      setResults(searchTitles(val, 8));
    }).catch(() => {});
    setResults(searchTitles(val, 8));
    setActive(true);
  };

  const closeDropdown = () => {
    setActive(false);
    searchInputRef?.current?.blur();
  };

  const selectItem = (item) => {
    closeDropdown();
    setQuery('');
    navigate(`/filmsclub/t/${item.code}`, { state: { card: item } });
  };

  const hasQuery = !!query.trim();
  const displayedItems = hasQuery ? results : trending.slice(0, 5);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (hasQuery) {
      closeDropdown();
      navigate(`/filmsclub/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const isActive = (path) =>
    path === '/filmsclub'
      ? location.pathname === '/filmsclub' || location.pathname === '/filmsclub/'
      : location.pathname.startsWith(path);

  return (
    <header className={'top stuck' + (isSearching ? ' searching' : '')}>
      <div className="in">
        <Link
          to="/"
          className="back-filmy"
          title="Back to Filmy4UHD (Main Site)"
          aria-label="Back to Filmy4UHD"
        >
          <svg className="w-3.5 h-3.5 inline mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m15 18-6-6 6-6" />
          </svg>
          <span className="text-amber-400 font-extrabold text-xs hidden sm:inline">Filmy4UHD</span>
          <span className="sm:hidden text-amber-400 font-bold text-xs">Home</span>
        </Link>
        <FilmsClubLogo to="/filmsclub" />
        <nav className="nav">
          {NAV_ITEMS.map(([path, label]) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/filmsclub'}
              className={isActive(path) ? 'on' : ''}
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="searchwrap" ref={wrapRef}>
          <form className="find" onSubmit={handleSubmit} role="search" onClick={() => searchInputRef?.current?.focus()}>
            <SearchIcon />
            <input
              ref={searchInputRef}
              type="search"
              value={query}
              onChange={e => handleChange(e.target.value)}
              onFocus={() => setActive(true)}
              placeholder="Search movies, series, anime in FilmsClub..."
              aria-label="Search titles"
              autoComplete="off"
            />
            {!query && !active && (
              <span className="phx" aria-hidden="true">
                Search<span className="tw">&nbsp;{placeholderWord}</span><span className="caret" />
              </span>
            )}
          </form>

          {active && (hasQuery || displayedItems.length > 0) && (
            <div className="sdrop no-sb">
              {!hasQuery ? (
                <div className="sh">Trending searches</div>
              ) : displayedItems.length === 0 ? (
                <div className="sh">No titles match "{query.trim()}"</div>
              ) : null}

              {displayedItems.map((item, idx) => (
                <button
                  key={item.code}
                  type="button"
                  className="sr"
                  style={{ '--i': idx }}
                  onClick={() => selectItem(item)}
                >
                  <span className="sp">
                    {item.poster && <img src={item.poster} alt="" loading="lazy" />}
                  </span>
                  <span className="st">
                    <b>{cleanTitle(item.title)}</b>
                    <small>{TYPE_LABELS[item.type] || 'Series'} · {item.latestLabel ? cleanEpisodeLabel(item.latestLabel) : item.year}</small>
                  </span>
                </button>
              ))}

              {hasQuery && displayedItems.length > 0 && (
                <button
                  type="button"
                  className="sall"
                  onClick={() => {
                    closeDropdown();
                    navigate(`/filmsclub/search?q=${encodeURIComponent(query.trim())}`);
                  }}
                >
                  See all results for "{query.trim()}"
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
