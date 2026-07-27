import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BiSearch, BiX } from "react-icons/bi";
import { HiOutlineHome, HiOutlineFilm, HiOutlineTv, HiOutlineInformationCircle } from "react-icons/hi2";
import { RiSearchLine } from "react-icons/ri";
import { MdOutlineEmail } from "react-icons/md";
import posterPlaceholder from "../assets/images/poster-placeholder.png";
import { BASE_URL as BASE } from "../config/api";
import BrandLogo from "./BrandLogo";

const SITENAME = import.meta.env.VITE_SITENAME || "Filmy4uhd";

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

  // Update navStatus based on current path
  useEffect(() => {
    const path = location.pathname.toLowerCase();
    if (path === "/") setNavStatus("Home");
    else if (path.startsWith("/mov")) setNavStatus("Movies");
    else if (path.startsWith("/ser")) setNavStatus("Series");
    else if (path.startsWith("/about")) setNavStatus("About");
    else if (path.startsWith("/contact")) setNavStatus("Contact");
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
    { name: "About", icon: <HiOutlineInformationCircle />, path: "/about" },
    { name: "Contact", icon: <MdOutlineEmail />, path: "/contact" },
  ];

  return (
    <>
      {/* ── Desktop / Tablet Header ────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#06080D]/95 backdrop-blur-2xl border-b border-amber-500/20 shadow-[0_10px_35px_rgba(0,0,0,0.9)]"
            : "bg-gradient-to-b from-[#06080D]/95 to-transparent backdrop-blur-md"
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo & Name */}
          <Link
            to="/"
            className="flex items-center gap-3 shrink-0 group"
            aria-label={`${SITENAME} Home`}
          >
            <BrandLogo className="w-10 h-10" />
            <span className="text-2xl font-black tracking-tight flex items-center">
              <span className="gold-text">Filmy</span>
              <span className="text-amber-400">4uhd</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-full border border-white/10 backdrop-blur-md shadow-inner" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-200 ${
                  navStatus === link.name
                    ? "text-amber-400 bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-500/40 shadow-md"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <span className="text-base text-amber-400">{link.icon}</span>
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="flex-1 max-w-sm hidden sm:block" ref={closeRef}>
            <div className="relative">
              <div className="flex items-center gap-2.5 bg-slate-900/90 border border-white/15 rounded-full px-4 py-2 transition-all duration-200 focus-within:border-amber-400 focus-within:shadow-[0_0_25px_rgba(245,158,11,0.4)] backdrop-blur-md">
                {isLoading ? (
                  <div className="loader-search shrink-0" />
                ) : (
                  <RiSearchLine className="text-amber-400 shrink-0 text-lg" />
                )}
                <input
                  type="text"
                  id="desktop-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search 4K movies, series…"
                  className="bg-transparent text-slate-100 placeholder-slate-400 text-xs sm:text-sm w-full outline-none font-semibold"
                  aria-label="Search"
                  autoComplete="off"
                />
                {query && (
                  <button onClick={() => { setQuery(""); setDebouncedVal(""); }}>
                    <BiX className="text-slate-400 hover:text-white text-lg" />
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
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-2 left-0 right-0 glass-card border border-white/15 overflow-hidden z-50 max-h-[60dvh] overflow-y-auto shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
                  >
                    {searchResult.slice(0, 8).map((movie) => (
                      <Link
                        key={movie.tmdb_id}
                        to={movie.media_type === "movie" ? `/mov/${movie.tmdb_id}` : `/ser/${movie.tmdb_id}`}
                        onClick={() => { setQuery(""); setDebouncedVal(""); }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-amber-500/10 transition-colors duration-150 border-b border-white/5 last:border-0"
                      >
                        <img
                          src={movie.poster || posterPlaceholder}
                          alt={movie.title}
                          className="w-10 h-14 object-cover rounded-lg shrink-0 bg-slate-900 border border-white/10 shadow-md"
                          onError={(e) => { e.target.src = posterPlaceholder; }}
                        />
                        <div className="min-w-0">
                          <p className="text-slate-100 text-sm font-bold line-clamp-1 hover:text-amber-400">{movie.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-slate-400 font-semibold">{movie.release_year}</span>
                            <span className="quality-badge">{movie.rip || "HD"}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                    {searchResult.length > 0 && (
                      <button
                        onClick={() => { navigate(`/search/${query}`); setQuery(""); setDebouncedVal(""); }}
                        className="w-full text-center py-3 text-xs font-bold text-amber-400 hover:bg-amber-500/20 transition-colors border-t border-white/10"
                      >
                        See all results for "{query}" &rarr;
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Search Toggle */}
          <button
            className="sm:hidden text-amber-400 p-2.5 rounded-xl bg-slate-900/80 border border-white/10 hover:bg-white/5 transition-colors"
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
              className="sm:hidden bg-[#06080D]/95 backdrop-blur-2xl border-t border-white/10 overflow-hidden"
              ref={closeRef}
            >
              <div className="p-4">
                <div className="flex items-center gap-2 bg-slate-900 border border-amber-400/40 rounded-full px-4 py-2.5 focus-within:shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                  {isLoading ? <div className="loader-search shrink-0" /> : <RiSearchLine className="text-amber-400 shrink-0 text-base" />}
                  <input
                    autoFocus
                    type="text"
                    id="mobile-search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search movies, series…"
                    className="bg-transparent text-slate-100 placeholder-slate-400 text-sm w-full outline-none"
                    aria-label="Mobile search"
                  />
                  {query && (
                    <button onClick={() => { setQuery(""); setDebouncedVal(""); }}>
                      <BiX className="text-slate-400 text-lg" />
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
                      className="mt-3 rounded-xl overflow-hidden max-h-[50dvh] overflow-y-auto glass-card border border-white/10"
                    >
                      {searchResult.slice(0, 6).map((movie) => (
                        <Link
                          key={movie.tmdb_id}
                          to={movie.media_type === "movie" ? `/mov/${movie.tmdb_id}` : `/ser/${movie.tmdb_id}`}
                          onClick={() => { setQuery(""); setDebouncedVal(""); setMobileSearchOpen(false); }}
                          className="flex items-center gap-3 px-3 py-2.5 border-b border-white/5 last:border-0 hover:bg-amber-500/10 transition-colors"
                        >
                          <img
                            src={movie.poster || posterPlaceholder}
                            alt={movie.title}
                            className="w-10 h-14 object-cover rounded-lg shrink-0 bg-slate-900"
                            onError={(e) => { e.target.src = posterPlaceholder; }}
                          />
                          <div>
                            <p className="text-slate-100 text-sm font-bold line-clamp-1">{movie.title}</p>
                            <p className="text-slate-400 text-xs mt-0.5">{movie.release_year} • {movie.rip || "HD"}</p>
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
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#06080D]/95 backdrop-blur-2xl border-t border-white/10 flex items-center justify-around h-16 safe-area-pb shadow-[0_-10px_30px_rgba(0,0,0,0.8)]"
        aria-label="Mobile bottom navigation"
      >
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-all duration-200 ${
              navStatus === link.name ? "text-amber-400" : "text-slate-400"
            }`}
            aria-label={link.name}
          >
            <span className={`text-xl transition-transform duration-200 ${navStatus === link.name ? "scale-110 text-amber-400" : ""}`}>
              {link.icon}
            </span>
            <span className="text-[0.62rem] font-bold tracking-tight">{link.name}</span>
          </Link>
        ))}
        <button
          onClick={() => setMobileSearchOpen((p) => !p)}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-all duration-200 ${
            mobileSearchOpen ? "text-amber-400" : "text-slate-400"
          }`}
          aria-label="Search"
        >
          <BiSearch className="text-xl" />
          <span className="text-[0.62rem] font-bold tracking-tight">Search</span>
        </button>
      </nav>
    </>
  );
}
