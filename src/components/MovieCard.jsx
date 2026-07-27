import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/opacity.css";
import { PiStarFill } from "react-icons/pi";
import { BsPlayFill } from "react-icons/bs";
import { HiOutlineFilm, HiOutlineTv } from "react-icons/hi2";
import posterPlaceholder from "../assets/images/poster-placeholder.png";

const langShort = { hi: "HINDI", en: "ENG", ta: "TAMIL", te: "TELUGU", kn: "KAN", ml: "MAL", mr: "MAR", bn: "BEN" };

const MovieCard = ({ movie }) => {
  const [hovered, setHovered] = useState(false);

  const to = movie.media_type === "movie" ? `/mov/${movie.tmdb_id}` : `/ser/${movie.tmdb_id}`;
  const langLabel = movie.languages?.map((l) => (langShort[l] || l.toUpperCase())).slice(0, 2).join(" · ") || "";

  return (
    <Link to={to} aria-label={`View ${movie.title}`} className="block group">
      <div
        className="movie-card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Poster Container */}
        <div className="relative aspect-[2/3] w-full bg-[#0F131C] overflow-hidden">
          <LazyLoadImage
            src={movie.poster || posterPlaceholder}
            alt={movie.title}
            effect="opacity"
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-108"
            wrapperClassName="w-full h-full block"
            onError={(e) => { e.target.src = posterPlaceholder; }}
          />

          {/* Shimmer overlay effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Card Overlay Gradient */}
          <div className="card-overlay" aria-hidden="true" />

          {/* ── Top Floating Badges ── */}
          {/* Rating Badge (Top Left) */}
          <div className="absolute top-2.5 left-2.5 z-10">
            <div className="rating-badge flex items-center gap-1 shadow-lg">
              <PiStarFill className="text-amber-400 text-xs" />
              <span>{movie.rating ? movie.rating.toFixed(1) : "N/A"}</span>
            </div>
          </div>

          {/* Quality Badge (Top Right) */}
          {movie.rip && (
            <div className="absolute top-2.5 right-2.5 z-10">
              <span className="quality-badge">{movie.rip}</span>
            </div>
          )}

          {/* Play Button Overlay (Center) */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                className="card-play z-20"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              >
                <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-[0_0_30px_rgba(245,158,11,0.8)] border-2 border-white/40">
                  <BsPlayFill className="text-3xl ml-0.5" />
                  <span className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-30 pointer-events-none" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Language & Type Badges (Bottom Left & Right inside image) */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-1 text-[0.62rem] font-extrabold bg-slate-950/80 backdrop-blur-md text-slate-300 border border-white/10 px-2 py-0.5 rounded-md shadow-md">
              {movie.media_type === "movie" ? <HiOutlineFilm className="text-amber-400" /> : <HiOutlineTv className="text-cyan-400" />}
              <span>{movie.media_type === "movie" ? "MOVIE" : "SERIES"}</span>
            </div>

            {langLabel && (
              <div className="text-[0.6rem] font-bold bg-amber-500/20 backdrop-blur-md text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-md shadow-md">
                {langLabel}
              </div>
            )}
          </div>
        </div>

        {/* ── Card Title Info ── */}
        <div className="p-3 bg-[#0D111A] border-t border-white/5 group-hover:border-amber-500/30 transition-colors">
          <h3 className="text-slate-100 font-bold text-sm line-clamp-1 group-hover:text-amber-400 transition-colors leading-snug">
            {movie.title}
          </h3>
          <div className="flex items-center justify-between mt-1 text-[0.72rem] text-slate-400 font-medium">
            <span>{movie.release_year || "Latest"}</span>
            {movie.genres?.length > 0 && (
              <span className="text-slate-500 truncate max-w-[100px]">{movie.genres[0]}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
