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
      return movie.languages.map((l, i) => `${langMap[l] || l.toUpperCase()} ${i === 0 ? "(Original)" : ""}`);
    }
    return ["Hindi (Original)", "English", "Dual Audio"];
  }, [movie]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: movie?.title || "Filmy4UHD",
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
    <div className="relative mt-20 mb-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
      {!loading && movie ? (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="space-y-6"
        >
          {/* ── Screen 3 / Screen 5: Detail Hero Backdrop Card ── */}
          <div className="relative rounded-3xl overflow-hidden bg-[#0A0D15] border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.9)]">
            {/* Backdrop Image with Centered Glowing Play Button */}
            <div className="relative aspect-video sm:aspect-[21/9] lg:aspect-[2.4/1] w-full overflow-hidden bg-slate-950">
              <LazyLoadImage
                src={movie.backdrop || movie.poster}
                alt={movie.title}
                effect="opacity"
                className="w-full h-full object-cover object-center"
                wrapperClassName="w-full h-full block"
              />

              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D15] via-[#0A0D15]/40 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0A0D15]/80 via-transparent to-transparent pointer-events-none" />

              {/* Centered Large Gold Circular Play Button (Matching Screen 3) */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => {
                    if (props.detailType === "movie") setIsWatchMoviePopupOpen(true);
                    else if (props.detailType === "series") setIsWatchEpisodePopupOpen(true);
                  }}
                  className="group relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-[0_0_40px_rgba(245,158,11,0.9)] hover:scale-115 transition-all duration-300 border-2 border-white/40 cursor-pointer"
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
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase drop-shadow-md">
                  {movie.title}
                </h1>

                {/* Metadata Badges Row (Matching Screen 3 & 5) */}
                <div className="flex flex-wrap items-center gap-2 mt-3 text-xs sm:text-sm font-bold text-slate-300">
                  {movie.genres?.map((g) => (
                    <span key={g} className="bg-slate-900/90 border border-white/10 text-slate-200 px-3 py-1 rounded-full">
                      {g}
                    </span>
                  ))}
                  <span className="bg-slate-900/90 border border-white/10 text-slate-200 px-3 py-1 rounded-full">
                    {movie.release_year || "2026"}
                  </span>
                  <span className="bg-slate-900/90 border border-white/10 text-slate-200 px-3 py-1 rounded-full">
                    UA
                  </span>
                  {movie.runtime && (
                    <span className="bg-slate-900/90 border border-white/10 text-slate-200 px-3 py-1 rounded-full flex items-center gap-1">
                      <BiTime className="text-amber-400" /> {movie.runtime} min
                    </span>
                  )}
                  {movie.media_type === "tv" && (
                    <span className="bg-slate-900/90 border border-white/10 text-slate-200 px-3 py-1 rounded-full">
                      {movie.total_seasons || 1} Seasons
                    </span>
                  )}
                  <span className="bg-amber-500/20 border border-amber-500/40 text-amber-300 px-3 py-1 rounded-full">
                    {movie.rip || "4K UHD"}
                  </span>
                  {movie.rating && (
                    <span className="bg-amber-400 text-slate-950 font-black px-3 py-1 rounded-full flex items-center gap-1">
                      <PiStarFill className="text-xs" /> {movie.rating.toFixed(1)}/10 IMDb
                    </span>
                  )}
                  <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-3 py-1 rounded-full font-black">
                    93% Match
                  </span>
                </div>
              </div>

              {/* Description with Expandable ...more Toggle */}
              {movie.description && (
                <div className="max-w-3xl">
                  <p className={`text-slate-300 text-sm sm:text-base leading-relaxed ${!isDescriptionExpanded ? "line-clamp-2" : ""}`}>
                    {movie.description}
                  </p>
                  <button
                    onClick={() => setIsDescriptionExpanded((p) => !p)}
                    className="text-amber-400 hover:text-amber-300 text-xs font-bold mt-1 inline-block"
                  >
                    {isDescriptionExpanded ? "Show less" : "... more"}
                  </button>
                </div>
              )}

              {/* ── Screen 3: Action Bar (Watchlist, Like, Share, Download) ── */}
              <div className="flex items-center flex-wrap gap-4 sm:gap-6 pt-2 pb-3 border-y border-white/10">
                <button
                  onClick={handleWatchlist}
                  className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-300 hover:text-amber-400 transition-colors"
                >
                  {isBookmarked ? <BsBookmarkCheckFill className="text-xl text-amber-400" /> : <BiBookmark className="text-xl" />}
                  <span>{isBookmarked ? "In Watchlist" : "+ Watchlist"}</span>
                </button>

                <button
                  onClick={handleLike}
                  className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-300 hover:text-rose-400 transition-colors"
                >
                  {isLiked ? <BsFillHeartFill className="text-lg text-rose-500" /> : <BiHeart className="text-xl" />}
                  <span>Like</span>
                </button>

                <button
                  onClick={() => setIsTrailerOpen(true)}
                  className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-300 hover:text-red-400 transition-colors"
                >
                  <FaYoutube className="text-xl text-red-500" />
                  <span>Trailer</span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-300 hover:text-cyan-400 transition-colors"
                >
                  <BiShareAlt className="text-xl" />
                  <span>Share</span>
                </button>

                <TelegramButton movieData={movie} />
              </div>

              {/* ── Screen 3: Audio & Subtitles Selector ── */}
              <div className="space-y-2.5 pt-1">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Audio &amp; Subtitles
                </h3>
                <div className="flex items-center gap-2.5 flex-wrap">
                  {audioTracks.map((track, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedAudio(idx)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 border ${
                        selectedAudio === idx
                          ? "bg-slate-900 border-amber-400 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                          : "bg-slate-900/50 border-white/10 text-slate-300 hover:border-white/25"
                      }`}
                    >
                      <span>{track}</span>
                      {selectedAudio === idx && <FiCheck className="text-amber-400 text-sm font-bold" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Ad Banner Above Player */}
          <AdBanner slot="5754054742" />

          {/* ── Screen 3 & 6: Stream or Download / Player Cockpit & Episode List ── */}
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
        <div className="glass-card overflow-hidden rounded-3xl">
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
