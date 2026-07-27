import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/opacity.css";
import "swiper/css";

import { BiPlay, BiTime } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";
import { FiCalendar } from "react-icons/fi";
import { BsListStars, BsPlayFill } from "react-icons/bs";
import { PiStarFill } from "react-icons/pi";
import { LuLanguages } from "react-icons/lu";
import { MdOutlineHighQuality } from "react-icons/md";
import { HiOutlineFilm, HiOutlineTv } from "react-icons/hi2";
import { TbBrandTelegram } from "react-icons/tb";

import PlayerButtons from "./PlayerButtons";
import TelegramButton from "./TelegramButtons";
import Watch from "./Watch";
import AdBanner from "./AdBanner";

const langMap = {
  hi: "Hindi", en: "English", ta: "Tamil", te: "Telugu",
  kn: "Kannada", ml: "Malayalam", mr: "Marathi", bn: "Bengali",
};

export default function MoviesAndSeriesDetailsSections(props) {
  const [isWatchMoviePopupOpen, setIsWatchMoviePopupOpen] = useState(false);
  const [isWatchEpisodePopupOpen, setIsWatchEpisodePopupOpen] = useState(false);
  const [isSeasonsOpen, setIsSeasonsOpen] = useState(false);

  const movie = props.movieData;
  const loading = props.isMovieDataLoading;

  const formatLangs = (arr) =>
    arr?.map((l) => langMap[l] || l.charAt(0).toUpperCase() + l.slice(1)).join(" · ") || "";

  return (
    <div className="relative mt-20 mb-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
      {!loading ? (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="space-y-8"
        >
          {/* ── Main Detail Card ── */}
          <div className="glass-card border border-white/10 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
            <div className="grid lg:grid-cols-[1fr_1.1fr] gap-0">
              {/* Left — Backdrop / Poster with play overlay */}
              <div
                className="relative aspect-video lg:aspect-auto lg:min-h-[460px] cursor-pointer group overflow-hidden bg-slate-950"
                onClick={() => props.detailType === "movie" && setIsWatchMoviePopupOpen(true)}
                role="button"
                aria-label={`Play ${movie.title}`}
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && props.detailType === "movie" && setIsWatchMoviePopupOpen(true)}
              >
                <LazyLoadImage
                  src={movie.backdrop || movie.poster}
                  alt={movie.title}
                  effect="opacity"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  wrapperClassName="w-full h-full block"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#06080D] via-[#06080D]/40 to-transparent lg:block hidden" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06080D] via-transparent to-transparent" />

                {/* Play Button */}
                {props.detailType === "movie" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-[0_0_35px_rgba(245,158,11,0.8)] group-hover:scale-115 transition-transform border-2 border-white/30">
                      <BsPlayFill className="text-4xl ml-1" />
                    </div>
                  </div>
                )}
              </div>

              {/* Right — Info Panel */}
              <div className="p-6 lg:p-10 flex flex-col justify-between space-y-4">
                <div>
                  {/* Genres */}
                  {movie.genres?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {movie.genres.map((g, i) => (
                        <span key={i} className="genre-pill">{g}</span>
                      ))}
                    </div>
                  )}

                  {/* Title */}
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight mb-3">
                    <span className="gold-text">{movie.title}</span>
                  </h1>

                  {/* Status (for TV) */}
                  {movie.media_type === "tv" && movie.status && (
                    <span className="inline-block bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 text-xs font-bold px-3.5 py-1 rounded-full mb-3 w-fit shadow-md">
                      STATUS: {movie.status.toUpperCase()}
                    </span>
                  )}

                  {/* Description */}
                  <p className="text-slate-300 text-sm leading-relaxed line-clamp-4 mb-5 font-normal">
                    {movie.description}
                  </p>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3 p-4 rounded-xl bg-slate-900/60 border border-white/5 backdrop-blur-md mb-6">
                    {/* Runtime / Seasons */}
                    <div className="flex items-center gap-2.5 text-xs sm:text-sm">
                      {movie.media_type === "movie"
                        ? <BiTime className="text-amber-400 text-lg shrink-0" />
                        : <BsListStars className="text-amber-400 text-lg shrink-0" />}
                      <span className="text-slate-300 font-semibold">
                        {movie.media_type === "movie"
                          ? `${movie.runtime || "?"} min`
                          : `${movie.total_seasons || "?"} Seasons · ${movie.total_episodes || "?"} Episodes`}
                      </span>
                    </div>

                    {/* Year */}
                    {movie.release_year && (
                      <div className="flex items-center gap-2.5 text-xs sm:text-sm">
                        <FiCalendar className="text-amber-400 text-lg shrink-0" />
                        <span className="text-slate-300 font-semibold">{movie.release_year}</span>
                      </div>
                    )}

                    {/* Language */}
                    {movie.languages?.length > 0 && (
                      <div className="flex items-center gap-2.5 text-xs sm:text-sm">
                        <LuLanguages className="text-cyan-400 text-lg shrink-0" />
                        <span className="text-slate-300 font-semibold">{formatLangs(movie.languages)}</span>
                      </div>
                    )}

                    {/* Quality */}
                    {movie.rip && (
                      <div className="flex items-center gap-2.5 text-xs sm:text-sm">
                        <MdOutlineHighQuality className="text-amber-400 text-lg shrink-0" />
                        <span className="text-slate-300 font-semibold">{movie.rip}</span>
                      </div>
                    )}

                    {/* Rating */}
                    {movie.rating && (
                      <div className="flex items-center gap-2.5 text-xs sm:text-sm">
                        <PiStarFill className="text-amber-400 text-lg shrink-0" />
                        <span className="text-amber-400 font-black">{movie.rating.toFixed(1)}</span>
                        <span className="text-slate-500 text-xs font-semibold">/ 10 IMDb</span>
                      </div>
                    )}

                    {/* Media Type */}
                    <div className="flex items-center gap-2.5 text-xs sm:text-sm">
                      {movie.media_type === "movie"
                        ? <HiOutlineFilm className="text-amber-400 text-lg shrink-0" />
                        : <HiOutlineTv className="text-cyan-400 text-lg shrink-0" />}
                      <span className="text-slate-300 font-semibold capitalize">{movie.media_type}</span>
                    </div>
                  </div>
                </div>

                {/* Telegram Button */}
                <div className="flex flex-wrap gap-3">
                  <TelegramButton movieData={movie} />
                </div>
              </div>
            </div>
          </div>

          {/* Ad Banner Above Player */}
          <AdBanner slot="5754054742" />

          {/* ── Player & Download Section ── */}
          <PlayerButtons
            movieData={movie}
            episodes={props.episodes}
            seasonNumber={props.seasonNumber}
            setSeasonNumber={props.setSeasonNumber}
            episodeNumber={props.episodeNumber}
            setEpisodeNumber={props.setEpisodeNumber}
            isEpisodesLoading={props.isEpisodesLoading}
          />

          {/* Ad Banner Below Player */}
          <AdBanner slot="7317709042" style={{ display: "inline-block", width: "728px", height: "90px" }} />
        </motion.div>
      ) : (
        /* Loading Skeleton */
        <div className="glass-card overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="aspect-video shimmer-effect" />
            <div className="p-8 space-y-4">
              <div className="h-4 w-1/3 shimmer-effect rounded" />
              <div className="h-8 w-4/5 shimmer-effect rounded" />
              <div className="h-3 w-full shimmer-effect rounded" />
              <div className="h-3 w-4/5 shimmer-effect rounded" />
              <div className="h-3 w-2/3 shimmer-effect rounded" />
              <div className="grid grid-cols-2 gap-3 mt-6">
                {[1,2,3,4].map((i) => <div key={i} className="h-3 shimmer-effect rounded" />)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Watch Movie Popup */}
      {props.detailType === "movie" && (
        <Watch
          isWatchMoviePopupOpen={isWatchMoviePopupOpen}
          id={movie}
          setIsWatchMoviePopupOpen={setIsWatchMoviePopupOpen}
          popUpType="movie"
        />
      )}

      {/* Watch Episode Popup */}
      {props.detailType === "series" && (
        <Watch
          isWatchEpisodePopupOpen={isWatchEpisodePopupOpen}
          id={movie}
          setIsWatchEpisodePopupOpen={setIsWatchEpisodePopupOpen}
          popUpType="episode"
          seasonNumber={props.seasonNumber}
          episodeNumber={props.episodeNumber}
        />
      )}
    </div>
  );
}
