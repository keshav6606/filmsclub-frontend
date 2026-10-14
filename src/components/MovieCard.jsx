import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/opacity.css";
import { PiStarFill } from "react-icons/pi";
import { BsPlayFill, BsBookmarkFill, BsBookmark } from "react-icons/bs";
import { toast } from "react-toastify";
import posterPlaceholder from "../assets/images/poster-placeholder.png";
import { isInWatchlist, toggleWatchlist } from "../utils/storage";

const langShort = {
  hi: "HINDI",
  en: "ENG",
  ta: "TAMIL",
  te: "TELUGU",
  kn: "KAN",
  ml: "MAL",
  mr: "MARATHI",
  bn: "BENGALI",
  gu: "GUJARATI",
  pa: "PUNJABI",
};

const MovieCard = ({ movie, badgeText }) => {
  const [hovered, setHovered] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (movie?.tmdb_id) {
      setBookmarked(isInWatchlist(movie.tmdb_id));
    }
  }, [movie?.tmdb_id]);

  if (!movie) return null;

  const to = movie.code
    ? `/filmsclub/t/${movie.code}`
    : movie.media_type === "movie"
    ? `/mov/${movie.tmdb_id}`
    : `/ser/${movie.tmdb_id}`;
  
  // Extract primary language
  let langLabel = "HINDI";
  if (Array.isArray(movie.languages) && movie.languages.length > 0) {
    const first = String(movie.languages[0]).toLowerCase();
    langLabel = langShort[first] || movie.languages[0].toUpperCase();
  } else if (movie.language) {
    const first = String(movie.language).toLowerCase();
    langLabel = langShort[first] || String(movie.language).toUpperCase();
  }

  // Genre / Year string
  const genreStr = movie.genres?.length > 0 ? movie.genres[0] : (movie.media_type === "movie" ? "Action" : `${movie.total_seasons || 1} Seasons`);
  const subtitle = `${movie.release_year || "2026"} • ${genreStr}`;

  const handleBookmarkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWatchlist(movie);
    setBookmarked(added);
    if (added) {
      toast.success(`Added "${movie.title}" to Watchlist!`, { autoClose: 2000 });
    } else {
      toast.info(`Removed "${movie.title}" from Watchlist.`, { autoClose: 2000 });
    }
  };

  return (
    <Link to={to} aria-label={`View ${movie.title}`} className="block group select-none relative">
      <div
        className="movie-card relative rounded-2xl overflow-hidden bg-[#0E131F] border border-white/[0.08] border-t-white/[0.18] group-hover:border-cyan-400/50 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Poster Image Container */}
        <div className="relative aspect-[2/3] w-full bg-[#070A12] overflow-hidden">
          <LazyLoadImage
            src={movie.poster || posterPlaceholder}
            alt={movie.title}
            effect="opacity"
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-108"
            wrapperClassName="w-full h-full block"
            onError={(e) => { e.target.src = posterPlaceholder; }}
          />

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E131F] via-transparent to-black/35 pointer-events-none" />

          {/* ── Top Left: Rating Badge ── */}
          <div className="absolute top-2.5 left-2.5 z-10">
            <div className="flex items-center gap-1 bg-[#05070B]/85 backdrop-blur-md text-amber-300 border border-white/10 px-2 py-0.5 rounded-lg text-[0.68rem] font-black font-mono shadow-lg">
              <PiStarFill className="text-amber-400 text-xs" />
              <span>{movie.rating ? Number(movie.rating).toFixed(1) : "7.8"}</span>
            </div>
          </div>

          {/* ── Top Right: Quality Badge & Bookmark Action ── */}
          <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5">
            {/* Quick Watchlist Bookmark Button */}
            <button
              onClick={handleBookmarkClick}
              title={bookmarked ? "Remove from Watchlist" : "Add to Watchlist"}
              className={`p-1.5 rounded-lg backdrop-blur-md transition-all duration-200 border ${
                bookmarked
                  ? "bg-cyan-400 text-slate-950 border-cyan-400 shadow-[0_0_12px_rgba(0,242,254,0.7)]"
                  : "bg-[#05070B]/75 text-slate-300 border-white/10 hover:text-cyan-400 hover:border-cyan-400/40 opacity-80 group-hover:opacity-100"
              }`}
            >
              {bookmarked ? <BsBookmarkFill className="text-[0.7rem]" /> : <BsBookmark className="text-[0.7rem]" />}
            </button>

            {(badgeText || movie.rip) && (
              <span className={`text-[0.6rem] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow font-mono ${
                badgeText === "New Ep"
                  ? "bg-gradient-to-r from-rose-500 to-red-600 text-white"
                  : badgeText === "Tele Ep"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950"
                  : "bg-cyan-400/90 text-slate-950 shadow-[0_0_10px_rgba(0,242,254,0.4)]"
              }`}>
                {badgeText || movie.rip || "4K UHD"}
              </span>
            )}
          </div>

          {/* ── Center: Hover Play Button with Photonic Halo ── */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              >
                <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 shadow-[0_0_30px_rgba(0,242,254,0.8)] border border-white/40">
                  <BsPlayFill className="text-3xl ml-0.5" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Title & Meta Details Bar ── */}
        <div className="p-3 bg-[#0B0F19] border-t border-white/5 space-y-1">
          <h3 className="text-white font-outfit font-extrabold text-xs sm:text-sm line-clamp-1 group-hover:text-cyan-300 transition-colors">
            {movie.title}
          </h3>

          <div className="flex items-center justify-between gap-1 pt-0.5">
            <span className="text-[0.68rem] text-slate-400 font-semibold truncate">
              {subtitle}
            </span>

            {/* Audio Language Pill */}
            <span className="shrink-0 text-[0.58rem] font-black uppercase tracking-wider font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-400/35 px-1.5 py-0.5 rounded">
              {langLabel}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
