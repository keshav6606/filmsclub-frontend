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
