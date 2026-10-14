import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/opacity.css";
import {
  BiPlay,
  BiTime,
  BiBookmark,
  BiHeart,
  BiShareAlt,
  BiDownload,
} from "react-icons/bi";
import { BsPlayFill, BsFillHeartFill, BsBookmarkCheckFill } from "react-icons/bs";
import { PiStarFill } from "react-icons/pi";
import { FiCheck } from "react-icons/fi";
import { FaYoutube } from "react-icons/fa";
import { toast } from "react-toastify";

import PlayerButtons from "./PlayerButtons";
import TelegramButton from "./TelegramButtons";
import Watch from "./Watch";
import AdBanner from "./AdBanner";
import TrailerModal from "./TrailerModal";
import { isInWatchlist, toggleWatchlist } from "../utils/storage";

const langMap = {
  hi: "Hindi", en: "English", ta: "Tamil", te: "Telugu",
  kn: "Kannada", ml: "Malayalam", mr: "Marathi", bn: "Bengali",
  gu: "Gujarati", pa: "Punjabi",
};

export default function MoviesAndSeriesDetailsSections(props) {
  const [isWatchMoviePopupOpen, setIsWatchMoviePopupOpen] = useState(false);
  const [isWatchEpisodePopupOpen, setIsWatchEpisodePopupOpen] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState(0);

  const movie = props.movieData;
  const loading = props.isMovieDataLoading;

  React.useEffect(() => {
    if (movie?.tmdb_id) {
      setIsBookmarked(isInWatchlist(movie.tmdb_id));
    }
  }, [movie?.tmdb_id]);

  // Build audio tracks list
  const audioTracks = React.useMemo(() => {
    if (!movie) return ["Hindi (Original)"];
    if (Array.isArray(movie.languages) && movie.languages.length > 0) {
      return movie.languages.map((l, i) => `${langMap[l] || l.toUpperCase()} ${i === 0 ? "(Master)" : ""}`);
    }
    return ["Hindi (Master)", "English (Dolby)", "Dual Audio"];
  }, [movie]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: movie?.title || "FilmsClub VIP",
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleWatchlist = () => {
    if (!movie) return;
    const added = toggleWatchlist(movie);
    setIsBookmarked(added);
    if (added) {
      toast.success(`"${movie.title}" added to your Watchlist!`);
    } else {
      toast.info(`"${movie.title}" removed from Watchlist.`);
    }
  };

  const handleLike = () => {
    setIsLiked((p) => !p);
    toast.success(!isLiked ? "Added to Liked Movies!" : "Removed from Liked.");
  };

  return (
    <div className="relative mt-20 mb-12 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
      {!loading && movie ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="space-y-6"
        >
          {/* ── Detail Hero Backdrop Card ── */}
          <div className="relative rounded-3xl overflow-hidden bg-[#0B0F19] border border-white/[0.1] border-t-white/[0.2] shadow-[0_25px_60px_rgba(0,0,0,0.95)]">
            {/* Backdrop Image with Centered Glowing Play Button */}
            <div className="relative aspect-video sm:aspect-[21/9] lg:aspect-[2.4/1] w-full overflow-hidden bg-[#070A12]">
              <LazyLoadImage
                src={movie.backdrop || movie.poster}
                alt={movie.title}
                effect="opacity"
                className="w-full h-full object-cover object-center"
                wrapperClassName="w-full h-full block"
              />

              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/45 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19]/80 via-transparent to-transparent pointer-events-none" />

              {/* Centered Large Cyan-Violet Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => {
                    if (props.detailType === "movie") setIsWatchMoviePopupOpen(true);
                    else if (props.detailType === "series") setIsWatchEpisodePopupOpen(true);
                  }}
                  className="group relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 shadow-[0_0_40px_rgba(0,242,254,0.9)] hover:scale-110 transition-all duration-300 border-2 border-white/40 cursor-pointer"
                  aria-label="Play content"
                >
                  <BsPlayFill className="text-4xl sm:text-5xl ml-1 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>

            {/* Content Details Container */}
            <div className="p-6 sm:p-8 lg:p-10 -mt-12 sm:-mt-20 relative z-10 space-y-5">
              {/* Title Header */}
              <div>
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-outfit font-black tracking-tight text-white uppercase drop-shadow-md">
                  {movie.title}
                </h1>

                {/* Metadata Badges Row */}
                <div className="flex flex-wrap items-center gap-2 mt-3.5 text-xs sm:text-sm font-bold text-slate-300">
                  {movie.genres?.map((g) => (
                    <span key={g} className="bg-[#141A29] border border-white/10 text-slate-200 px-3 py-1 rounded-xl font-outfit">
                      {g}
                    </span>
                  ))}
                  <span className="bg-[#141A29] border border-white/10 text-slate-200 px-3 py-1 rounded-xl font-mono">
                    {movie.release_year || "2026"}
                  </span>
                  <span className="bg-[#141A29] border border-white/10 text-slate-200 px-3 py-1 rounded-xl font-mono">
                    UA 16+
                  </span>
                  {movie.runtime && (
                    <span className="bg-[#141A29] border border-white/10 text-slate-200 px-3 py-1 rounded-xl flex items-center gap-1 font-mono">
                      <BiTime className="text-cyan-400" /> {movie.runtime} min
                    </span>
                  )}
                  {movie.media_type === "tv" && (
                    <span className="bg-[#141A29] border border-white/10 text-slate-200 px-3 py-1 rounded-xl font-outfit">
                      {movie.total_seasons || 1} Seasons
                    </span>
                  )}
                  <span className="spec-badge spec-badge-4k">
                    {movie.rip || "4K UHD REMUX"}
                  </span>
                  <span className="spec-badge spec-badge-hdr">
                    DOLBY VISION
                  </span>
                  {movie.rating && (
                    <span className="inline-flex items-center gap-1 bg-amber-400 text-slate-950 font-black px-3 py-1 rounded-xl text-xs shadow font-mono">
                      <PiStarFill className="text-xs" /> {movie.rating.toFixed(1)}/10 IMDb
                    </span>
                  )}
                  <span className="spec-badge spec-badge-atmos">
                    DOLBY ATMOS
                  </span>
                </div>
              </div>

              {/* Description with Expandable ...more Toggle */}
              {movie.description && (
                <div className="max-w-3xl">
                  <p className={`text-slate-300 text-sm sm:text-base leading-relaxed font-normal ${!isDescriptionExpanded ? "line-clamp-2" : ""}`}>
                    {movie.description}
                  </p>
                  <button
                    onClick={() => setIsDescriptionExpanded((p) => !p)}
                    className="text-cyan-400 hover:text-cyan-300 text-xs font-bold mt-1 inline-block font-outfit"
                  >
                    {isDescriptionExpanded ? "Show less" : "... more info"}
                  </button>
                </div>
              )}

              {/* Action Bar (Watchlist, Like, Share, Trailer, Telegram) */}
              <div className="flex items-center flex-wrap gap-4 sm:gap-6 pt-3 pb-3 border-y border-white/[0.08]">
                <button
                  onClick={handleWatchlist}
                  className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-300 hover:text-cyan-400 transition-colors font-outfit"
                >
                  {isBookmarked ? <BsBookmarkCheckFill className="text-xl text-cyan-400" /> : <BiBookmark className="text-xl" />}
                  <span>{isBookmarked ? "In Watchlist" : "+ Watchlist"}</span>
                </button>

                <button
                  onClick={handleLike}
                  className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-300 hover:text-rose-400 transition-colors font-outfit"
                >
                  {isLiked ? <BsFillHeartFill className="text-lg text-rose-500" /> : <BiHeart className="text-xl" />}
                  <span>{isLiked ? "Liked" : "Like"}</span>
                </button>

                <button
                  onClick={() => setIsTrailerOpen(true)}
                  className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-300 hover:text-red-400 transition-colors font-outfit"
                >
                  <FaYoutube className="text-xl text-red-500" />
                  <span>Trailer</span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-300 hover:text-cyan-400 transition-colors font-outfit"
                >
                  <BiShareAlt className="text-xl" />
                  <span>Share</span>
                </button>

                <TelegramButton movieData={movie} />
              </div>

              {/* Audio & Subtitles Selector */}
              <div className="space-y-2.5 pt-1">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 font-outfit">
                  Audio &amp; Language Master Tracks
                </h3>
                <div className="flex items-center gap-2.5 flex-wrap">
                  {audioTracks.map((track, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedAudio(idx)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 border font-mono ${
                        selectedAudio === idx
                          ? "bg-[#141A29] border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,242,254,0.3)]"
                          : "bg-[#0E131F]/80 border-white/10 text-slate-300 hover:border-white/25"
                      }`}
                    >
                      <span>{track}</span>
                      {selectedAudio === idx && <FiCheck className="text-cyan-400 text-sm font-bold" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Ad Banner Above Player */}
          <AdBanner slot="5754054742" />

          {/* Player Buttons Cockpit */}
          <PlayerButtons
            movieData={movie}
            episodes={props.episodes}
            seasonNumber={props.seasonNumber}
            setSeasonNumber={props.setSeasonNumber}
            episodeNumber={props.episodeNumber}
            setEpisodeNumber={props.setEpisodeNumber}
            isEpisodesLoading={props.isEpisodesLoading}
            onOpenWebPlayer={() => {
              if (props.detailType === "movie") setIsWatchMoviePopupOpen(true);
              else if (props.detailType === "series") setIsWatchEpisodePopupOpen(true);
            }}
          />

          {/* Ad Banner Below Player */}
          <AdBanner slot="7317709042" />
        </motion.div>
      ) : (
        /* Loading Skeleton */
        <div className="glass-panel overflow-hidden rounded-3xl">
          <div className="aspect-[21/9] shimmer-effect" />
          <div className="p-8 space-y-4">
            <div className="h-6 w-1/3 shimmer-effect rounded" />
            <div className="h-10 w-3/4 shimmer-effect rounded" />
            <div className="h-4 w-full shimmer-effect rounded" />
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

      {/* Official Trailer Modal */}
      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        tmdbId={movie?.tmdb_id}
        mediaType={props.detailType === "series" ? "tv" : "movie"}
        title={movie?.title || ""}
      />
    </div>
  );
}
