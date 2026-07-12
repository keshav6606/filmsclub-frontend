import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/opacity.css";
import { PiStarFill } from "react-icons/pi";
import { BsPlayFill } from "react-icons/bs";
import { HiOutlineFilm, HiOutlineTv } from "react-icons/hi2";
import posterPlaceholder from "../assets/images/poster-placeholder.png";

const langShort = { hi: "HI", en: "EN", ta: "TA", te: "TE", kn: "KN", ml: "ML", mr: "MR", bn: "BN" };

const MovieCard = ({ movie }) => {
  const [hovered, setHovered] = useState(false);

  const to = movie.media_type === "movie" ? `/mov/${movie.tmdb_id}` : `/ser/${movie.tmdb_id}`;
  const langLabel = movie.languages?.map((l) => (langShort[l] || l.toUpperCase())).join("·") || "";

  return (
    <Link to={to} aria-label={`View ${movie.title}`}>
      <div
        className="movie-card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Poster Image */}
        <div className="aspect-[2/3] w-full bg-bgColorSecondary overflow-hidden">
          <LazyLoadImage
            src={movie.poster || posterPlaceholder}
            alt={movie.title}
            effect="opacity"
            className="w-full h-full object-cover"
            wrapperClassName="w-full h-full block"
            onError={(e) => { e.target.src = posterPlaceholder; }}
          />
        </div>

        {/* Hover Overlay */}
        <div className="card-overlay" aria-hidden="true" />

        {/* Play Button on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              className="card-play z-20"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            >
              <div className="w-12 h-12 rounded-full border-2 border-primaryBtn bg-primaryBtn/20 backdrop-blur-sm flex items-center justify-center text-primaryBtn shadow-gold">
                <BsPlayFill className="text-xl ml-0.5" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Top Badges ── */}
        {/* Rating — top left */}
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-bgColor/80 backdrop-blur-sm text-goldLight border border-goldLight/20 rounded-md px-2 py-0.5 text-[0.6rem] font-bold z-10">
          <PiStarFill className="text-[0.55rem]" />
          {movie.rating ? movie.rating.toFixed(1) : "N/A"}
        </div>

        {/* Quality — top right */}
        {movie.rip && (
          <div className="absolute top-2 right-2 z-10">
            <span className="quality-badge">{movie.rip}</span>
          </div>
        )}

        {/* Language — bottom right above info */}
        {langLabel && (
          <div className="absolute bottom-14 right-2 z-10 text-[0.55rem] font-bold bg-bgColor/80 backdrop-blur-sm text-secondaryTextColor border border-border px-2 py-0.5 rounded-md">
            {langLabel}
          </div>
        )}

        {/* Media type — bottom left above info */}
        <div className="absolute bottom-14 left-2 z-10">
          <div className="flex items-center gap-1 text-[0.6rem] font-semibold bg-bgColor/80 backdrop-blur-sm text-secondaryTextColor border border-border px-2 py-0.5 rounded-md">
            {movie.media_type === "movie" ? <HiOutlineFilm /> : <HiOutlineTv />}
            {movie.media_type === "movie" ? "Movie" : "Series"}
          </div>
        </div>

        {/* ── Card Info ── */}
        <div className="p-2.5 pt-2 bg-bgColorSecondary">
          <p className="text-primaryTextColor font-semibold text-sm line-clamp-1 leading-snug">
            {movie.title}
          </p>
          <p className="text-mutedText text-xs mt-0.5">{movie.release_year || ""}</p>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
