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
        >
          {/* ── Main Detail Card ── */}
          <div className="glass-card overflow-hidden">
            <div className="grid lg:grid-cols-[1fr_1fr] gap-0">
              {/* Left — Backdrop / Poster with play overlay */}
              <div
                className="relative aspect-video lg:aspect-auto lg:min-h-[420px] cursor-pointer group overflow-hidden"
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
                  className="w-full h-full object-cover"
                  wrapperClassName="w-full h-full block"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-bgColorSecondary/80 to-transparent lg:block hidden" />
                <div className="absolute inset-0 bg-gradient-to-t from-bgColorSecondary/60 to-transparent" />

                {/* Play Button */}
                {props.detailType === "movie" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border-2 border-primaryBtn bg-primaryBtn/20 backdrop-blur-sm flex items-center justify-center text-primaryBtn shadow-gold opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                      <BsPlayFill className="text-3xl ml-1" />
                    </div>
                  </div>
                )}
              </div>

              {/* Right — Info Panel */}
              <div className="p-6 lg:p-8 flex flex-col justify-between">
                {/* Genres */}
                {movie.genres?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {movie.genres.map((g, i) => (
                      <span key={i} className="genre-pill">{g}</span>
                    ))}
                  </div>
                )}

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-extrabold text-primaryTextColor leading-tight mb-2">
                  {movie.title}
                </h1>

                {/* Status (for TV) */}
                {movie.media_type === "tv" && movie.status && (
                  <span className="inline-block bg-primaryBtn/10 text-primaryBtn border border-primaryBtn/30 text-xs font-semibold px-3 py-1 rounded-full mb-3 w-fit">
                    {movie.status}
                  </span>
                )}

                {/* Description */}
                <p className="text-secondaryTextColor text-sm leading-relaxed line-clamp-3 mb-4">
                  {movie.description}
                </p>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-5">
                  {/* Runtime / Seasons */}
                  <div className="flex items-center gap-2 text-sm">
                    {movie.media_type === "movie"
                      ? <BiTime className="text-primaryBtn text-base shrink-0" />
                      : <BsListStars className="text-primaryBtn text-base shrink-0" />}
                    <span className="text-secondaryTextColor">
                      {movie.media_type === "movie"
                        ? `${movie.runtime || "?"} min`
                        : `${movie.total_seasons || "?"} Seasons · ${movie.total_episodes || "?"} Eps`}
                    </span>
                  </div>

                  {/* Year */}
                  {movie.release_year && (
                    <div className="flex items-center gap-2 text-sm">
                      <FiCalendar className="text-primaryBtn text-base shrink-0" />
                      <span className="text-secondaryTextColor">{movie.release_year}</span>
                    </div>
                  )}

                  {/* Language */}
                  {movie.languages?.length > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <LuLanguages className="text-primaryBtn text-base shrink-0" />
                      <span className="text-secondaryTextColor">{formatLangs(movie.languages)}</span>
                    </div>
                  )}

                  {/* Quality */}
                  {movie.rip && (
                    <div className="flex items-center gap-2 text-sm">
                      <MdOutlineHighQuality className="text-primaryBtn text-base shrink-0" />
                      <span className="text-secondaryTextColor">{movie.rip}</span>
                    </div>
                  )}

                  {/* Rating */}
                  {movie.rating && (
                    <div className="flex items-center gap-2 text-sm">
                      <PiStarFill className="text-goldLight text-base shrink-0" />
                      <span className="text-goldLight font-bold">{movie.rating.toFixed(1)}</span>
                      <span className="text-mutedText text-xs">/ 10</span>
                    </div>
                  )}

                  {/* Media Type */}
                  <div className="flex items-center gap-2 text-sm">
                    {movie.media_type === "movie"
                      ? <HiOutlineFilm className="text-primaryBtn text-base shrink-0" />
                      : <HiOutlineTv className="text-primaryBtn text-base shrink-0" />}
                    <span className="text-secondaryTextColor capitalize">{movie.media_type}</span>
                  </div>
                </div>

                {/* Telegram Button */}
                <div className="flex flex-wrap gap-2">
                  <TelegramButton movieData={movie} />
                </div>
              </div>
            </div>
          </div>

          {/* ── Player & Download Section ── */}
          <PlayerButtons movieData={movie} />

          {/* ── Episodes Section (TV only) ── */}
          {props.detailType === "series" && (
            <div className="glass-card p-5 mt-4">
              <div className="flex items-center gap-2 mb-4">
                <HiOutlineTv className="text-primaryBtn" />
                <h2 className="text-primaryTextColor font-bold">Episodes</h2>
              </div>

              {/* Season Selector */}
              <div className="relative inline-block mb-4">
                <button
                  onClick={() => setIsSeasonsOpen((p) => !p)}
                  className="flex items-center gap-2 bg-bgColorSecondary border border-border text-primaryTextColor text-sm font-semibold px-4 py-2 rounded-lg hover:border-primaryBtn transition-colors"
                >
                  <BiPlay className="text-primaryBtn" />
                  Season {props.seasonNumber}
                  <IoIosArrowDown className={`text-secondaryTextColor transition-transform ${isSeasonsOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {isSeasonsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute top-full mt-1 left-0 z-30 bg-bgColorTertiary border border-border rounded-xl overflow-hidden shadow-card min-w-[160px] max-h-[240px] overflow-y-auto"
                    >
                      {movie.seasons
                        ?.filter((s) => s.season_number > 0)
                        .sort((a, b) => a.season_number - b.season_number)
                        .map((s) => (
                          <button
                            key={s.season_number}
                            onClick={() => { props.setSeasonNumber(s.season_number); setIsSeasonsOpen(false); }}
                            className={`w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-primaryBtn/10 hover:text-primaryBtn transition-colors ${
                              props.seasonNumber === s.season_number ? "text-primaryBtn bg-primaryBtn/10" : "text-secondaryTextColor"
                            }`}
                          >
                            <BiPlay className="shrink-0" />
                            Season {s.season_number}
                          </button>
                        ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Episode Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                {!props.isEpisodesLoading ? (
                  props.episodes
                    ?.sort((a, b) => a.episode_number - b.episode_number)
                    .map((ep, i) => (
                      <button
                        key={i}
                        onClick={() => { props.setEpisodeNumber(ep.episode_number); setIsWatchEpisodePopupOpen(true); }}
                        className="flex items-center gap-2 text-sm px-3 py-2.5 bg-bgColorSecondary border border-border rounded-xl hover:border-primaryBtn hover:bg-primaryBtn/5 transition-all duration-200 text-left group"
                      >
                        <div className="w-7 h-7 rounded-full bg-primaryBtn/10 border border-primaryBtn/30 flex items-center justify-center shrink-0 group-hover:bg-primaryBtn/20 transition-colors">
                          <BiPlay className="text-primaryBtn text-sm" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-secondaryTextColor font-semibold text-xs">Ep {ep.episode_number}</span>
                          <p className="text-primaryTextColor text-xs line-clamp-1">{ep.title}</p>
                        </div>
                      </button>
                    ))
                ) : (
                  <div className="col-span-full flex justify-center py-10">
                    <div className="loader-episode" />
                  </div>
                )}
              </div>
            </div>
          )}
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
