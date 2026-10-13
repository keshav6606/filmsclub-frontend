import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { loadSearchIndex, preloadSearchIndex, searchTitles } from '../services/search';
import { cleanTitle, cleanEpisodeLabel, TYPE_LABELS } from '../utils/helpers';

// SVG Icons
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

const NAV_ITEMS = [
  ['/', 'Home'],
  ['/browse/movie', 'Movies'],
  ['/browse/series', 'Series'],
  ['/browse/anime', 'Anime']
];

export function Logo() {
  const ref = useRef(null);
  const handleMouseEnter = () => {
    const el = ref.current;
    if (el) {
      el.classList.remove('play');
      void el.offsetWidth;
      el.classList.add('play');
    }
  };

  return (
    <Link to="/" className="logo play" ref={ref} onMouseEnter={handleMouseEnter} aria-label="Yupflix home">
      <svg className="mk" viewBox="0 0 32 32" aria-hidden="true">
        <circle className="ring" cx="16" cy="16" r="13" />
        <path className="yy" d="M10 9.5l6 7.5 6-7.5M16 17v6.5" />
        <circle className="pip" cx="16" cy="17" r="2.3" />
      </svg>
      <span className="wm" aria-hidden="true">
        {[...'yupflix'].map((ch, i) => (
          <span key={i} style={{ '--i': i }}>{ch}</span>
        ))}
      </span>
    </Link>
  );
}

function formatMeta(item) {
  const typeStr = TYPE_LABELS[item.type] || 'Series';
  const sub = item.latestLabel ? cleanEpisodeLabel(item.latestLabel) : item.year;
  return [typeStr, sub].filter(Boolean).join(' · ');
}

export function SearchBar({ inputRef, onActive }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [active, setActive] = useState(false);
  const [indexLoaded, setIndexLoaded] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const [trending, setTrending] = useState([]);
  const [placeholderWord, setPlaceholderWord] = useState('');
  const wrapRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    onActive(active);
  }, [active, onActive]);

  useEffect(() => {
    api.trending('', '')
      .then(d => setTrending(d.trending.slice(0, 8)))
      .catch(() => {});
  }, []);

  // Typing placeholder rotation
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

  // Click outside listener
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
    setHighlightIdx(-1);
    if (!indexLoaded) {
      loadSearchIndex().then(() => {
        setIndexLoaded(true);
        setResults(searchTitles(val, 8));
      }).catch(() => {});
    }
    setResults(searchTitles(val, 8));
    setActive(true);
  };

  const closeDropdown = () => {
    setActive(false);
    inputRef.current?.blur();
  };

  const selectItem = (item) => {
    closeDropdown();
    setQuery('');
    api.prefetchTitle(item.code);
    navigate(`/t/${item.code}`, { state: { card: item } });
  };

  const hasQuery = !!query.trim();
  const displayedItems = hasQuery ? results : trending.slice(0, 5);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (highlightIdx >= 0 && displayedItems[highlightIdx]) {
      return selectItem(displayedItems[highlightIdx]);
    }
    if (hasQuery) {
      closeDropdown();
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') return closeDropdown();
    if (active && displayedItems.length) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightIdx(idx => Math.min(idx + 1, displayedItems.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightIdx(idx => Math.max(idx - 1, -1));
      }
    }
  };

  const showDropdown = active && (hasQuery || displayedItems.length > 0);

  return (
    <div className="searchwrap" ref={wrapRef}>
      <form className="find" onSubmit={handleSubmit} role="search" onClick={() => inputRef.current?.focus()}>
        <SearchIcon />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={e => handleChange(e.target.value)}
          onFocus={() => { preloadSearchIndex(); setActive(true); }}
          onKeyDown={handleKeyDown}
          placeholder="Search movies, series, anime"
          aria-label="Search titles"
          autoComplete="off"
        />
        {!query && !active && (
          <span className="phx" aria-hidden="true">
            Search<span className="tw">&nbsp;{placeholderWord}</span><span className="caret" />
          </span>
        )}
      </form>

      {showDropdown && (
        <div className="sdrop no-sb">
          {!hasQuery ? (
            <div className="sh">Trending searches</div>
          ) : displayedItems.length === 0 ? (
            <div className="sh">{indexLoaded ? `No titles match "${query.trim()}"` : 'Loading…'}</div>
          ) : null}

          {displayedItems.map((item, idx) => (
            <button
              key={item.code}
              type="button"
              className={'sr' + (idx === highlightIdx ? ' hi' : '')}
              style={{ '--i': idx }}
              onMouseEnter={() => { setHighlightIdx(idx); api.prefetchTitle(item.code); }}
              onClick={() => selectItem(item)}
            >
              <span className="sp">
                {item.poster && <img src={item.poster} alt="" loading="lazy" />}
              </span>
              <span className="st">
                <b>{cleanTitle(item.title)}</b>
                <small>{formatMeta(item)}</small>
              </span>
            </button>
          ))}

          {hasQuery && displayedItems.length > 0 && (
            <button
              type="button"
              className="sall"
              onClick={() => {
                closeDropdown();
                navigate(`/search?q=${encodeURIComponent(query.trim())}`);
              }}
            >
              See all results for "{query.trim()}"
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function Header({ searchInputRef, isSearching, onSearchingChange }) {
  const [stuck, setStuck] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setStuck(window.scrollY > 8);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <header className={'top' + (stuck ? ' stuck' : '') + (isSearching ? ' searching' : '')}>
      <div className="in">
        <Logo />
        <nav className="nav">
          {NAV_ITEMS.map(([path, label]) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={isActive(path) ? 'on' : ''}
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <SearchBar inputRef={searchInputRef} onActive={onSearchingChange} />
      </div>
    </header>
  );
}
