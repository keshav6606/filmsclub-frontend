import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BiSearch, BiX, BiChevronDown } from "react-icons/bi";
import { HiOutlineHome, HiOutlineFilm, HiOutlineTv, HiOutlineShieldCheck, HiOutlineInformationCircle, HiOutlineEnvelope, HiOutlineScale, HiOutlineDocumentText, HiOutlineShieldExclamation } from "react-icons/hi2";
import { RiSearchLine } from "react-icons/ri";
import posterPlaceholder from "../assets/images/poster-placeholder.png";
import BrandLogo from "./svg/BrandLogo";

const BASE = import.meta.env.VITE_BASE_URL;
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
  const [policiesOpen, setPoliciesOpen] = useState(false);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active path tracking
  useEffect(() => {
    const path = location.pathname;
    if (path === "/") setNavStatus("Home");
    else if (path.startsWith("/mov") || path.startsWith("/Movies")) setNavStatus("Movies");
    else if (path.startsWith("/ser") || path.startsWith("/Series")) setNavStatus("Series");
    else if (["/privacy-policy", "/terms", "/about", "/contact", "/dmca", "/disclaimer"].includes(path)) {
      setNavStatus("Help & Legal");
    } else {
      setNavStatus("");
    }
  }, [location.pathname]);

  // Fetch search data
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

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedVal(query), 400);
    return () => clearTimeout(timer);
  }, [query]);

  // Outside click close
  const closeRef = useRef();
  const dropdownRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (closeRef.current && !closeRef.current.contains(e.target)) {
        setDebouncedVal("");
        setQuery("");
        setMobileSearchOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setPoliciesOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const primaryNavLinks = [
    { name: "Home", icon: <HiOutlineHome />, path: "/" },
    { name: "Movies", icon: <HiOutlineFilm />, path: "/movies" },
    { name: "Series", icon: <HiOutlineTv />, path: "/series" },
  ];

  const policyLinks = [
    { name: "About Us", path: "/about", icon: <HiOutlineInformationCircle className="text-primaryBtn" /> },
    { name: "Contact Us", path: "/contact", icon: <HiOutlineEnvelope className="text-accent" /> },
    { name: "Privacy Policy", path: "/privacy-policy", icon: <HiOutlineShieldCheck className="text-goldLight" /> },
    { name: "Terms of Service", path: "/terms", icon: <HiOutlineScale className="text-primaryBtn" /> },
    { name: "DMCA Policy", path: "/dmca", icon: <HiOutlineDocumentText className="text-red-400" /> },
    { name: "Disclaimer", path: "/disclaimer", icon: <HiOutlineShieldExclamation className="text-accent" /> },
  ];

  return (
    <>
      {/* ── Desktop / Tablet Header ────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-bgColorTertiary/95 backdrop-blur-xl border-b border-border shadow-nav"
            : "bg-gradient-to-b from-bgColor/90 via-bgColor/50 to-transparent"
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 shrink-0 group"
            aria-label={`${SITENAME} Home`}
          >
            <BrandLogo size={34} className="w-8 h-8 sm:w-9 sm:h-9 transition-transform duration-300 group-hover:scale-105" />
            <span className="gold-text font-extrabold text-xl sm:text-2xl tracking-tight block">
              {SITENAME}
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {primaryNavLinks.map((link) => (
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

            {/* Help & Legal Policies Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setPoliciesOpen((prev) => !prev)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  navStatus === "Help & Legal"
                    ? "text-accent bg-accent/10"
                    : "text-secondaryTextColor hover:text-primaryTextColor hover:bg-white/5"
                }`}
              >
                <HiOutlineShieldCheck className="text-base" />
                Help & Policies
                <BiChevronDown className={`text-base transition-transform duration-200 ${policiesOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {policiesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-2 w-56 glass-card p-2 rounded-xl border border-border shadow-card z-50 bg-bgColorTertiary/95 backdrop-blur-xl"
                  >
                    {policyLinks.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setPoliciesOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-secondaryTextColor hover:text-primaryTextColor hover:bg-white/5 transition-colors"
                      >
                        <span className="text-sm">{item.icon}</span>
                        {item.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Search Bar */}
          <div className="flex-1 max-w-sm hidden sm:block" ref={closeRef}>
            <div className="relative">
              <div className="flex items-center gap-2 bg-bgColorSecondary/80 border border-border rounded-full px-4 py-2 transition-all duration-200 focus-within:border-primaryBtn focus-within:shadow-gold">
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
                        className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors duration-150 border-b border-border/40 last:border-0"
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
                    placeholder="Search movies, series…"
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
        {primaryNavLinks.map((link) => (
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
        
        {/* Help / Legal Link on Mobile */}
        <Link
          to="/about"
          className={`flex flex-col items-center gap-0.5 px-4 py-2 transition-all duration-200 ${
            navStatus === "Help & Legal" ? "text-accent" : "text-secondaryTextColor"
          }`}
          aria-label="About"
        >
          <HiOutlineShieldCheck className="text-2xl" />
          <span className="text-[0.6rem] font-semibold">About</span>
        </Link>

        {/* Search */}
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
