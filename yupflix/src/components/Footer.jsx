import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const TELEGRAM_URL = 'https://t.me/+YVnrgnm-dcwzNWU9';

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <p>Official website is <b>Yupflix.com</b>. Bookmark it for safe, direct access.</p>
        <p>
          <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
            Updates, requests and support on Telegram
          </a>
        </p>
        <p className="cr">© Yupflix</p>
      </div>
    </footer>
  );
}

// Icons for Mobile Tab Bar
const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 11 12 4l8 7v8a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z" />
  </svg>
);

const MoviesIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
    <path d="M8 4.5v15M16 4.5v15M3.5 9.5H8M3.5 14.5H8M16 9.5h4.5M16 14.5h4.5" />
  </svg>
);

const SeriesIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="6" width="18" height="12" rx="2" />
    <path d="M8 21h8M9 3l3 3 3-3" />
  </svg>
);

const AnimeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9l-5.2 2.8 1-5.9L3.5 9.7l5.9-.8z" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

const TAB_ITEMS = [
  ['/', 'Home', <HomeIcon key="h" />],
  ['/browse/movie', 'Movies', <MoviesIcon key="m" />],
  ['/browse/series', 'Series', <SeriesIcon key="s" />],
  ['/browse/anime', 'Anime', <AnimeIcon key="a" />]
];

export function TabBar({ searchInputRef, isSearching }) {
  const location = useLocation();
  const isActive = (path) => path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <nav className="tabbar">
      {TAB_ITEMS.map(([path, label, icon]) => (
        <NavLink
          key={path}
          to={path}
          end={path === '/'}
          className={isActive(path) ? 'on' : ''}
        >
          {icon}
          <span>{label}</span>
        </NavLink>
      ))}
      <button
        type="button"
        className={isSearching || location.pathname.startsWith('/search') ? 'on' : ''}
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          searchInputRef.current?.focus();
        }}
      >
        <SearchIcon />
        <span>Search</span>
      </button>
    </nav>
  );
}
