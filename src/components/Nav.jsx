import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BiSearch, BiX } from "react-icons/bi";
import { HiOutlineHome, HiOutlineFilm, HiOutlineTv } from "react-icons/hi2";
import { RiSearchLine } from "react-icons/ri";
import { MdLocalMovies } from "react-icons/md";
import posterPlaceholder from "../assets/images/poster-placeholder.png";

const BASE = import.meta.env.VITE_BASE_URL;
const SITENAME = import.meta.env.VITE_SITENAME;

export default function Nav() {
  const location = useLocation();
  const navigate = useNavigate();

  const [navStatus, setNavStatus] = useState("Home");
  const [query, setQuery] = useState("");
  const [debouncedVal, setDebouncedVal] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll detection for nav shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Update navStatus based on the current path
  useEffect(() => {
    const path = location.pathname;
    if (path === "/") setNavStatus("Home");
    else if (path.startsWith("/mov") || path.startsWith("/Movies")) setNavStatus("Movies");
    else if (path.startsWith("/ser") || path.startsWith("/Series")) setNavStatus("Series");
    else if (path.startsWith("/search")) setNavStatus("Search");
  }, [location.pathname]);

  // Query Data Fetcher
  useEffect(() => {
    if (!debouncedVal) {
      setSearchResult([]);
      return;
    }
    setIsLoading(true);
    fetch(`${BASE}/api/search/?query=${debouncedVal}&page=1`)
      .then((res) => res.json())
      .then((data) => {
        setSearchResult(data.results || []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [debouncedVal]);

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedVal(query), 500);
    return () => clearTimeout(timer);
  }, [query]);

  // Close on outside click
  const closeRef = useRef();
  useEffect(() => {
    const handler = (e) => {
      if (closeRef.current && !closeRef.current.contains(e.target)) {
        setDebouncedVal("");
        setQuery("");
        setMobileSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navLinks = [
    { name: "Home", icon: <HiOutlineHome />, path: "/" },
    { name: "Movies", icon: <HiOutlineFilm />, path: "/movies" },
    { name: "Series", icon: <HiOutlineTv />, path: "/series" },
  ];

  return (
    <>
      {/* ── Desktop / Tablet Header ────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-bgColorTertiary/95 backdrop-blur-xl border-b border-border shadow-nav"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 shrink-0 group"
            aria-label={`${SITENAME} Home`}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-primaryBtn flex items-center justify-center shadow-gold">
              <MdLocalMovies className="text-bgColor text-lg" />
            </div>
            <span className="gold-text font-extrabold text-xl tracking-tight hidden xs:block">
              {SITENAME || "Filmy4uhd"}
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  navStatus === link.name
                    ? "text-accent bg-accent/10"
                    : "text-secondaryTextColor hover:text-primaryTextColor hover:bg-white/5"
                }`}
              >
                <span className="text-base">{link.icon}</span>
                {link.name}
                {navStatus === link.name && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-primaryBtn to-accent rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="flex-1 max-w-sm hidden sm:block" ref={closeRef}>
            <div className="relative">
              <div className="flex items-center gap-2 bg-bgColorSecondary border border-border rounded-full px-4 py-2 transition-all duration-200 focus-within:border-primaryBtn focus-within:shadow-gold">
                {isLoading ? (
                  <div className="loader-search shrink-0" />
                ) : (
                  <RiSearchLine className="text-secondaryTextColor shrink-0 text-base" />
                )}
                <input
                  type="text"
                  id="desktop-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search movies, series…"
                  className="bg-transparent text-primaryTextColor placeholder-mutedText text-sm w-full outline-none"
                  aria-label="Search"
                  autoComplete="off"
                />
                {query && (
                  <button onClick={() => { setQuery(""); setDebouncedVal(""); }}>
                    <BiX className="text-secondaryTextColor hover:text-primaryTextColor text-lg" />
                  </button>
                )}
              </div>

              {/* Search Dropdown */}
              <AnimatePresence>
                {searchResult.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full mt-2 left-0 right-0 glass-card overflow-hidden z-50 max-h-[60dvh] overflow-y-auto shadow-card"
                  >
                    {searchResult.slice(0, 8).map((movie) => (
                      <Link
                        key={movie.tmdb_id}
                        to={movie.media_type === "movie" ? `/mov/${movie.tmdb_id}` : `/ser/${movie.tmdb_id}`}
                        onClick={() => { setQuery(""); setDebouncedVal(""); }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors duration-150"
                      >
                        <img
                          src={movie.poster || posterPlaceholder}
                          alt={movie.title}
                          className="w-10 h-14 object-cover rounded-md shrink-0 bg-bgColorSecondary"
                          onError={(e) => { e.target.src = posterPlaceholder; }}
                        />
                        <div className="min-w-0">
                          <p className="text-primaryTextColor text-sm font-semibold line-clamp-1">{movie.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-secondaryTextColor">{movie.release_year}</span>
                            <span className="quality-badge">{movie.rip || "HD"}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                    {searchResult.length > 0 && (
                      <button
                        onClick={() => { navigate(`/search/${query}`); setQuery(""); setDebouncedVal(""); }}
                        className="w-full text-center py-3 text-xs font-semibold text-primaryBtn hover:bg-primaryBtn/10 transition-colors border-t border-border"
                      >
                        See all results for "{query}"
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Search Toggle */}
          <button
            className="sm:hidden text-secondaryTextColor hover:text-primaryTextColor p-2 rounded-lg hover:bg-white/5 transition-colors"
            onClick={() => setMobileSearchOpen((p) => !p)}
            aria-label="Toggle search"
          >
            {mobileSearchOpen ? <BiX className="text-2xl" /> : <BiSearch className="text-xl" />}
          </button>
        </div>

        {/* Mobile Search Overlay */}
        <AnimatePresence>
          {mobileSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="sm:hidden bg-bgColorTertiary/95 backdrop-blur-xl border-t border-border overflow-hidden"
              ref={closeRef}
            >
              <div className="p-3">
                <div className="flex items-center gap-2 bg-bgColorSecondary border border-border rounded-full px-4 py-2 focus-within:border-primaryBtn">
                  {isLoading ? <div className="loader-search shrink-0" /> : <RiSearchLine className="text-secondaryTextColor shrink-0" />}
                  <input
                    autoFocus
                    type="text"
                    id="mobile-search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search…"
                    className="bg-transparent text-primaryTextColor placeholder-mutedText text-sm w-full outline-none"
                    aria-label="Mobile search"
                  />
                  {query && (
                    <button onClick={() => { setQuery(""); setDebouncedVal(""); }}>
                      <BiX className="text-secondaryTextColor text-lg" />
                    </button>
                  )}
                </div>
                {/* Mobile Search Results */}
                <AnimatePresence>
                  {searchResult.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="mt-2 rounded-xl overflow-hidden max-h-[50dvh] overflow-y-auto"
                    >
                      {searchResult.slice(0, 6).map((movie) => (
                        <Link
                          key={movie.tmdb_id}
                          to={movie.media_type === "movie" ? `/mov/${movie.tmdb_id}` : `/ser/${movie.tmdb_id}`}
                          onClick={() => { setQuery(""); setDebouncedVal(""); setMobileSearchOpen(false); }}
                          className="flex items-center gap-3 px-3 py-2.5 bg-bgColorSecondary border-b border-border last:border-0 hover:bg-white/5 transition-colors"
                        >
                          <img
                            src={movie.poster || posterPlaceholder}
                            alt={movie.title}
                            className="w-9 h-12 object-cover rounded-md shrink-0 bg-bgColorSecondary"
                            onError={(e) => { e.target.src = posterPlaceholder; }}
                          />
                          <div>
                            <p className="text-primaryTextColor text-sm font-semibold line-clamp-1">{movie.title}</p>
                            <p className="text-secondaryTextColor text-xs">{movie.release_year} • {movie.rip || "HD"}</p>
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Mobile Bottom Navigation ──────────────────────────────────────── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-bgColorTertiary/95 backdrop-blur-xl border-t border-border flex items-center justify-around h-16 safe-area-pb"
        aria-label="Mobile bottom navigation"
      >
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={`flex flex-col items-center gap-0.5 px-4 py-2 transition-all duration-200 ${
              navStatus === link.name ? "text-accent" : "text-secondaryTextColor"
            }`}
            aria-label={link.name}
          >
            <span className={`text-2xl transition-transform duration-200 ${navStatus === link.name ? "scale-110" : ""}`}>
              {link.icon}
            </span>
            <span className="text-[0.6rem] font-semibold">{link.name}</span>
          </Link>
        ))}
        <button
          onClick={() => setMobileSearchOpen((p) => !p)}
          className={`flex flex-col items-center gap-0.5 px-4 py-2 transition-all duration-200 ${
            mobileSearchOpen ? "text-accent" : "text-secondaryTextColor"
          }`}
          aria-label="Search"
        >
          <BiSearch className="text-2xl" />
          <span className="text-[0.6rem] font-semibold">Search</span>
        </button>
      </nav>
    </>
  );
}
