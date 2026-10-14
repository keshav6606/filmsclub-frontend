import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BiSearch, BiX } from "react-icons/bi";
import {
  HiOutlineHome,
  HiHome,
  HiOutlineFilm,
  HiFilm,
  HiOutlineTv,
  HiTv,
  HiOutlineBookmark,
  HiBookmark,
  HiSparkles,
} from "react-icons/hi2";
import { RiSearchLine } from "react-icons/ri";
import { MdLocalMovies, MdOutlineLiveTv } from "react-icons/md";
import { BsLightningChargeFill } from "react-icons/bs";
import { toast } from "react-toastify";
import posterPlaceholder from "../assets/images/poster-placeholder.png";
import { BASE_URL as BASE } from "../config/api";
import FilmsClubLogo from "./FilmsClubLogo";
import { loadSearchIndex, searchTitles } from "../yupflix/services/yupflixSearch";

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
  const [cinemaMode, setCinemaMode] = useState(false);
  const [watchlistCount, setWatchlistCount] = useState(0);

  // Pre-load scraped search index in background
  useEffect(() => {
    loadSearchIndex().catch(() => {});
  }, []);

  // Scroll detection for navbar blur & elevation
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cinema Mode Toggle (Dimming background for distraction-free movie night)
  const toggleCinemaMode = () => {
    setCinemaMode((prev) => {
      const next = !prev;
      if (next) {
        document.body.classList.add("cinema-mode-active");
        toast.info("🎬 Cinema Mode Enabled: OLED Lights Dimmed", { autoClose: 2000 });
      } else {
        document.body.classList.remove("cinema-mode-active");
        toast.info("💡 Standard Mode Restored", { autoClose: 2000 });
      }
      return next;
    });
  };

  // Update navStatus based on current path
  useEffect(() => {
    const path = location.pathname.toLowerCase();
    if (path === "/") setNavStatus("Home");
    else if (path.startsWith("/filmsclub") || path.startsWith("/yupflix")) setNavStatus("FilmsClub");
    else if (path.startsWith("/mov")) setNavStatus("Movies");
    else if (path.startsWith("/ser")) setNavStatus("Series");
    else if (path.startsWith("/watchlist")) setNavStatus("Watchlist");
    else if (path.startsWith("/about")) setNavStatus("About");
    else if (path.startsWith("/contact")) setNavStatus("Contact");
    else if (path.startsWith("/search")) setNavStatus("Search");
  }, [location.pathname]);

  // Watchlist Count Tracker
  useEffect(() => {
    const updateCount = () => {
      try {
        const list = JSON.parse(localStorage.getItem("filmy4uhd_watchlist") || "[]");
        setWatchlistCount(list.length);
      } catch {
        setWatchlistCount(0);
      }
    };
    updateCount();
    window.addEventListener("watchlistUpdated", updateCount);
    return () => window.removeEventListener("watchlistUpdated", updateCount);
  }, []);

  // Unified Query Data Fetcher (Database + Scraped Catalog)
  useEffect(() => {
    if (!debouncedVal.trim()) {
      setSearchResult([]);
      return;
    }
    setIsLoading(true);

    const fetchDb = fetch(`${BASE}/api/search/?query=${encodeURIComponent(debouncedVal)}&page=1`)
      .then((res) => res.json())
      .then((data) => (data.results || []).map((item) => ({ ...item, source: "db" })))
      .catch(() => []);

    const scrapedMatches = searchTitles(debouncedVal, 8).map((item) => ({
      tmdb_id: item.code,
      code: item.code,
      title: item.title,
      poster: item.poster,
      release_year: item.year,
      rip: item.latestLabel || "4K UHD",
      media_type: item.type || "movie",
      source: "scraped",
    }));

    fetchDb.then((dbResults) => {
      setSearchResult([...dbResults, ...scrapedMatches]);
      setIsLoading(false);
    });
  }, [debouncedVal]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedVal(query), 350);
    return () => clearTimeout(timer);
  }, [query]);

  // Keyboard shortcut Ctrl+K / / to search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey && e.key === "k") || (e.key === "/" && document.activeElement.tagName !== "INPUT")) {
        e.preventDefault();
        const searchInput = document.getElementById("desktop-search") || document.getElementById("mobile-search");
        if (searchInput) searchInput.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close search dropdown on click outside
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

  const desktopNavLinks = [
    { name: "Home", path: "/" },
    { name: "Movies", path: "/movies" },
    { name: "Series", path: "/series" },
    { name: "OTT Channels", path: "/filmsclub" },
    { name: "Watchlist", path: "/watchlist" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const bottomNavItems = [
    {
      name: "Home",
      path: "/",
      icon: <HiOutlineHome className="text-xl" />,
      activeIcon: <HiHome className="text-xl text-cyan-400" />,
    },
    {
      name: "Movies",
      path: "/movies",
      icon: <HiOutlineFilm className="text-xl" />,
      activeIcon: <HiFilm className="text-xl text-cyan-400" />,
    },
    {
      name: "Channels",
      path: "/filmsclub",
      icon: <MdOutlineLiveTv className="text-xl" />,
      activeIcon: <MdOutlineLiveTv className="text-xl text-cyan-400" />,
    },
    {
      name: "Series",
      path: "/series",
      icon: <HiOutlineTv className="text-xl" />,
      activeIcon: <HiTv className="text-xl text-cyan-400" />,
    },
    {
      name: "Watchlist",
      path: "/watchlist",
      icon: (
        <div className="relative">
          <HiOutlineBookmark className="text-xl" />
          {watchlistCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-950 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(0,242,254,0.6)]">
              {watchlistCount > 9 ? "9+" : watchlistCount}
            </span>
          )}
        </div>
      ),
      activeIcon: (
        <div className="relative">
          <HiBookmark className="text-xl text-cyan-400" />
          {watchlistCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-950 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(0,242,254,0.6)]">
              {watchlistCount > 9 ? "9+" : watchlistCount}
            </span>
          )}
        </div>
      ),
    },
  ];

  const isStreamingHub =
    location.pathname.toLowerCase().startsWith("/filmsclub") ||
    location.pathname.toLowerCase().startsWith("/yupflix");

  return (
    <>
      {/* ── Top Header Navigation Bar ────────────────────────────────────────── */}
      {!isStreamingHub && (
        <header
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled
              ? "bg-[#05070B]/92 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.85)]"
              : "bg-gradient-to-b from-[#05070B]/95 via-[#05070B]/75 to-transparent backdrop-blur-md"
          }`}
        >
          {/* Subtle Top Specular Laser Line */}
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-4">
            {/* Left: Brand Identity */}
            <FilmsClubLogo className="hover:opacity-95" />

            {/* Center: Desktop Navigation Hub */}
            <nav className="hidden lg:flex items-center gap-1 bg-[#0E131F]/80 p-1.5 rounded-full border border-white/[0.08] backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              {desktopNavLinks.map((link) => {
                const isActive =
                  (link.name === "Home" && navStatus === "Home") ||
                  (link.name !== "Home" && (navStatus === link.name || (link.path === "/filmsclub" && navStatus === "FilmsClub")));

                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`relative px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-1.5 ${
                      isActive
                        ? "text-slate-950 bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-500 shadow-[0_0_20px_rgba(0,242,254,0.6)] font-black scale-105"
                        : "text-slate-300 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Search + Telemetry + Cinema Toggle + Watchlist */}
            <div className="flex items-center gap-2.5" ref={closeRef}>
              {/* Server Fleet Telemetry Badge (Desktop) */}
              <div
                title="5 Video Edge Nodes Synchronized • 4K Passthrough"
                className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0E131F]/90 border border-emerald-400/30 text-[11px] font-mono text-emerald-300 shadow-[0_0_12px_rgba(0,245,160,0.15)]"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_#00f5a0]"></span>
                </span>
                <span className="font-semibold text-[10px] tracking-wide">5 SERVERS LIVE</span>
              </div>

              {/* Desktop Search Bar */}
              <div className="relative hidden sm:block w-60 lg:w-72">
                <div className="flex items-center gap-2.5 bg-[#0E131F]/90 border border-white/[0.12] rounded-full px-4 py-2 transition-all duration-300 focus-within:border-cyan-400 focus-within:shadow-[0_0_25px_rgba(0,242,254,0.4)] backdrop-blur-xl group">
                  {isLoading ? (
                    <div className="loader-search shrink-0" />
                  ) : (
                    <RiSearchLine className="text-cyan-400 shrink-0 text-base group-focus-within:scale-110 transition-transform" />
                  )}
                  <input
                    type="text"
                    id="desktop-search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search 4K movies, series…"
                    className="bg-transparent text-slate-100 placeholder-slate-400 text-xs w-full outline-none font-medium"
                    aria-label="Search"
                    autoComplete="off"
                  />
                  {query ? (
                    <button onClick={() => { setQuery(""); setDebouncedVal(""); }} aria-label="Clear query">
                      <BiX className="text-slate-400 hover:text-white text-lg" />
                    </button>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-500 border border-slate-700/60 rounded px-1.5 py-0.5 hidden lg:inline">
                      /
                    </span>
                  )}
                </div>

                {/* Instant Autocomplete Dropdown */}
                <AnimatePresence>
                  {searchResult.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full mt-2 left-0 right-0 glass-panel-elevated rounded-2xl border border-cyan-400/30 overflow-hidden z-50 max-h-[65dvh] overflow-y-auto shadow-[0_20px_50px_rgba(0,0,0,0.95)]"
                    >
                      <div className="p-2 border-b border-white/5 bg-cyan-950/20 flex items-center justify-between text-[11px] font-mono text-cyan-300 px-3">
                        <span>SEARCH RESULTS ({searchResult.length})</span>
                        <span className="text-slate-400">ESC to close</span>
                      </div>

                      {searchResult.slice(0, 8).map((movie) => {
                        const isScraped = movie.source === "scraped";
                        const itemLink = isScraped
                          ? `/filmsclub/t/${movie.code}`
                          : movie.media_type === "movie"
                          ? `/mov/${movie.tmdb_id}`
                          : `/ser/${movie.tmdb_id}`;

                        return (
                          <Link
                            key={isScraped ? `scraped-${movie.code}` : `db-${movie.tmdb_id}`}
                            to={itemLink}
                            onClick={() => { setQuery(""); setDebouncedVal(""); }}
                            className="flex items-center gap-3 px-3 py-2.5 hover:bg-cyan-500/10 transition-colors duration-150 border-b border-white/5 last:border-0 group"
                          >
                            <img
                              src={movie.poster || posterPlaceholder}
                              alt={movie.title}
                              className="w-10 h-14 object-cover rounded-lg shrink-0 bg-[#070A12] border border-white/10 shadow group-hover:scale-105 transition-transform"
                              onError={(e) => { e.target.src = posterPlaceholder; }}
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-slate-100 text-xs sm:text-sm font-bold line-clamp-1 group-hover:text-cyan-300 transition-colors">
                                {movie.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                {movie.release_year && (
                                  <span className="text-[11px] text-slate-400 font-medium">
                                    {movie.release_year}
                                  </span>
                                )}
                                <span className="spec-badge spec-badge-4k">
                                  {movie.rip || "4K UHD"}
                                </span>
                                {isScraped ? (
                                  <span className="spec-badge spec-badge-4k">
                                    OTT STREAM
                                  </span>
                                ) : (
                                  <span className="spec-badge spec-badge-hdr">
                                    CINEMA
                                  </span>
                                )}
                              </div>
                            </div>
                          </Link>
                        );
                      })}

                      {searchResult.length > 0 && (
                        <button
                          onClick={() => { navigate(`/search/${encodeURIComponent(query)}`); setQuery(""); setDebouncedVal(""); }}
                          className="w-full text-center py-2.5 text-xs font-bold text-cyan-400 hover:bg-cyan-500/20 transition-colors border-t border-white/10 font-outfit"
                        >
                          View all matches for "{query}" &rarr;
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Search Button */}
              <button
                className="sm:hidden text-cyan-400 p-2.5 rounded-full bg-[#0E131F]/90 border border-white/[0.12] hover:border-cyan-400 transition-colors"
                onClick={() => setMobileSearchOpen((p) => !p)}
                aria-label="Search toggle"
              >
                <BiSearch className="text-xl" />
              </button>

              {/* Advanced Cinema Theater Mode Toggle (Lights Off) */}
              <button
                onClick={toggleCinemaMode}
                title={cinemaMode ? "Lights Off Mode Active (Click to turn lights on)" : "Toggle Cinema Screening Mode (Dim Lights)"}
                className={`p-2.5 rounded-full border transition-all duration-300 ${
                  cinemaMode
                    ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_16px_rgba(0,242,254,0.5)] scale-105"
                    : "bg-[#0E131F]/90 border-white/[0.12] text-slate-400 hover:text-white hover:border-white/30"
                }`}
                aria-label="Cinema Theater Mode"
              >
                <MdLocalMovies className="text-lg" />
              </button>

              {/* Watchlist Bookmark Pill Button */}
              <Link
                to="/watchlist"
                className="relative w-10 h-10 rounded-full bg-[#0E131F]/90 border border-white/[0.12] hover:border-cyan-400 flex items-center justify-center text-slate-300 hover:text-cyan-400 transition-all shadow-md group"
                aria-label="My Watchlist"
                title="My Watchlist"
              >
                <HiBookmark className="text-lg text-cyan-400 group-hover:scale-110 transition-transform" />
                {watchlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-rose-500 to-red-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(255,42,85,0.7)] animate-pulse">
                    {watchlistCount > 9 ? "9+" : watchlistCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile Search Input Drawer */}
          <AnimatePresence>
            {mobileSearchOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="sm:hidden bg-[#05070B]/98 backdrop-blur-3xl border-t border-white/10 overflow-hidden"
                ref={closeRef}
              >
                <div className="p-4">
                  <div className="flex items-center gap-2 bg-[#0E131F] border border-cyan-400/40 rounded-full px-4 py-2.5 focus-within:shadow-[0_0_20px_rgba(0,242,254,0.3)]">
                    {isLoading ? <div className="loader-search shrink-0" /> : <RiSearchLine className="text-cyan-400 shrink-0 text-base" />}
                    <input
                      autoFocus
                      type="text"
                      id="mobile-search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search movies, web series, 4K…"
                      className="bg-transparent text-slate-100 placeholder-slate-400 text-sm w-full outline-none font-medium"
                      aria-label="Mobile search"
                    />
                    {query && (
                      <button onClick={() => { setQuery(""); setDebouncedVal(""); }} aria-label="Clear input">
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
                        className="mt-3 rounded-2xl overflow-hidden max-h-[50dvh] overflow-y-auto glass-panel border border-cyan-400/30"
                      >
                        {searchResult.slice(0, 6).map((movie) => {
                          const isScraped = movie.source === "scraped";
                          const itemLink = isScraped
                            ? `/filmsclub/t/${movie.code}`
                            : movie.media_type === "movie"
                            ? `/mov/${movie.tmdb_id}`
                            : `/ser/${movie.tmdb_id}`;

                          return (
                            <Link
                              key={isScraped ? `m-scraped-${movie.code}` : `m-db-${movie.tmdb_id}`}
                              to={itemLink}
                              onClick={() => { setQuery(""); setDebouncedVal(""); setMobileSearchOpen(false); }}
                              className="flex items-center gap-3 px-3 py-2.5 border-b border-white/5 last:border-0 hover:bg-cyan-500/10 transition-colors"
                            >
                              <img
                                src={movie.poster || posterPlaceholder}
                                alt={movie.title}
                                className="w-10 h-14 object-cover rounded-lg shrink-0 bg-[#070A12] border border-white/10"
                                onError={(e) => { e.target.src = posterPlaceholder; }}
                              />
                              <div>
                                <p className="text-slate-100 text-sm font-bold line-clamp-1">{movie.title}</p>
                                <div className="flex items-center gap-2 text-slate-400 text-xs mt-0.5">
                                  <span>{movie.release_year}</span>
                                  <span className="spec-badge spec-badge-4k">{movie.rip || "4K UHD"}</span>
                                  {isScraped && (
                                    <span className="spec-badge spec-badge-4k">OTT</span>
                                  )}
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>
      )}

      {/* ── Mobile Suspended Bottom Glass Pill HUD (Hidden on Streaming Hub) ────── */}
      {!isStreamingHub && (
        <nav
          className="md:hidden fixed bottom-3 inset-x-4 z-50 bg-[#0A0E18]/90 backdrop-blur-2xl border border-white/[0.12] rounded-3xl flex items-center justify-around h-16 shadow-[0_16px_40px_rgba(0,0,0,0.95),0_0_20px_rgba(0,242,254,0.15)]"
          aria-label="Mobile bottom navigation"
        >
          {bottomNavItems.map((item) => {
            const isActive =
              (item.name === "Home" && navStatus === "Home") ||
              (item.name !== "Home" && navStatus.includes(item.name));

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`relative flex flex-col items-center justify-center gap-1 px-3 py-1 transition-all duration-300 ${
                  isActive ? "text-cyan-400 font-extrabold" : "text-slate-400 font-semibold"
                }`}
                aria-label={item.name}
              >
                <span className={`transition-transform duration-300 ${isActive ? "scale-115 -translate-y-0.5" : ""}`}>
                  {isActive ? item.activeIcon : item.icon}
                </span>
                <span className="text-[0.62rem] tracking-tight">{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeBottomTab"
                    className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f2fe]"
                  />
                )}
              </Link>
            );
          })}
        </nav>
      )}
    </>
  );
}
