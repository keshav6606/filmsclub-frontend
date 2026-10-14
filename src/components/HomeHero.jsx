import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Autoplay, Navigation, A11y, Pagination, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "react-lazy-load-image-component/src/effects/opacity.css";

import { BsPlayFill, BsBookmarkFill, BsBookmark } from "react-icons/bs";
import { FaDownload, FaYoutube } from "react-icons/fa";
import { PiStarFill } from "react-icons/pi";
import { HiChevronLeft, HiChevronRight, HiSparkles } from "react-icons/hi2";
import { toast } from "react-toastify";
import TrailerModal from "./TrailerModal";
import { isInWatchlist, toggleWatchlist } from "../utils/storage";

export default function HeroSlider({ movieData, isMovieDataLoading }) {
  const [trailerMovie, setTrailerMovie] = useState(null);

  const langMap = {
    hi: "Hindi", en: "English", ta: "Tamil", te: "Telugu",
    kn: "Kannada", ml: "Malayalam", mr: "Marathi", bn: "Bengali",
    dual: "Dual Audio", multi: "Multi Audio",
  };

  const formatLang = (arr) =>
    arr?.map((l) => langMap[l] || l.toUpperCase()).slice(0, 2).join(" • ") || "Hindi • Dual Audio";

  const handleWatchlist = (e, movie) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWatchlist(movie);
    if (added) {
      toast.success(`"${movie.title}" added to your Watchlist!`);
    } else {
      toast.info(`"${movie.title}" removed from Watchlist.`);
    }
  };

  return (
    <section className="relative w-full min-h-[82dvh] md:min-h-[90dvh] pt-16 overflow-hidden bg-[#05070B]" aria-label="Featured movies slider">
      {!isMovieDataLoading ? (
        <>
          <Swiper
            modules={[Autoplay, Navigation, A11y, Pagination, EffectFade]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            loop={true}
            autoplay={{ delay: 6500, disableOnInteraction: false, pauseOnMouseEnter: true }}
            pagination={{ el: ".hero-pagination", clickable: true }}
            navigation={{ prevEl: ".hero-prev", nextEl: ".hero-next" }}
            className="hero-swiper w-full h-full"
          >
            {movieData.slice(0, 10).map((movie) => {
              const watchLink = movie.code
                ? `/filmsclub/t/${movie.code}`
                : movie.media_type === "movie"
                ? `/mov/${movie.tmdb_id}`
                : `/ser/${movie.tmdb_id}`;
              const genreStr = Array.isArray(movie.genres) && movie.genres.length > 0
                ? movie.genres.slice(0, 3).join(" • ")
                : "Action • Thriller • 4K Cinema";
              const inList = isInWatchlist(movie.tmdb_id || movie.code);
              const yearVal = movie.release_year || movie.year || "2026";
              const ratingVal = movie.rating ? Number(movie.rating).toFixed(1) : "8.2";

              return (
                <SwiperSlide key={movie.tmdb_id || movie.code || movie.title} className="bg-[#05070B]">
                  <div className="relative w-full min-h-[82dvh] md:min-h-[90dvh] flex items-end overflow-hidden">
                    {/* Full-Screen Edge-to-Edge Backdrop Image */}
                    <div className="absolute inset-0 bg-[#05070B]">
                      <LazyLoadImage
                        src={movie.backdrop || movie.poster}
                        alt={movie.title}
                        effect="opacity"
                        className="w-full h-full object-cover object-center md:object-right-top scale-105"
                        wrapperClassName="w-full h-full"
                      />

                      {/* Volumetric Cinema Gradient Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-r from-[#05070B] via-[#05070B]/85 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-[#05070B]/60 to-transparent" />

                      {/* Ambient Laser Neon Glow Orb */}
                      <div className="absolute top-1/4 left-10 w-[550px] h-[550px] bg-cyan-500/10 blur-[180px] rounded-full pointer-events-none" />
                      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-rose-600/10 blur-[160px] rounded-full pointer-events-none" />
                    </div>

                    {/* Content Box */}
                    <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-16 pb-16 md:pb-24">
                      <div className="max-w-xl sm:max-w-2xl space-y-4">
                        {/* FEATURED PREMIERE & SPEC ROW */}
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-500 text-slate-950 font-outfit font-black text-[0.68rem] tracking-wider uppercase shadow-[0_0_20px_rgba(0,242,254,0.6)]">
                            <HiSparkles /> 4K ULTRA HD PREMIERE
                          </div>

                          <span className="spec-badge spec-badge-4k">4K ULTRA HD</span>
                          <span className="spec-badge spec-badge-hdr">DOLBY VISION</span>
                          <span className="spec-badge spec-badge-atmos">ATMOS 7.1</span>
                        </div>

                        {/* Billboard Title */}
                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-outfit font-black tracking-tight text-white leading-tight drop-shadow-[0_12px_30px_rgba(0,0,0,0.95)] break-words line-clamp-2">
                          {movie.title}
                        </h1>

                        {/* Meta Info Row: Genre • Year • Duration • Rating */}
                        <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-300">
                          <span>{genreStr}</span>
                          <span className="text-slate-600">•</span>
                          <span className="text-slate-200">{yearVal}</span>
                          {movie.runtime && (
                            <>
                              <span className="text-slate-600">•</span>
                              <span className="text-slate-300">{movie.runtime} min</span>
                            </>
                          )}
                          <span className="text-slate-600">•</span>
                          <span className="inline-flex items-center gap-1 text-amber-300 bg-amber-500/15 border border-amber-400/30 px-2 py-0.5 rounded-md font-mono text-xs shadow">
                            <PiStarFill className="text-xs text-amber-400" /> {ratingVal}
                          </span>
                        </div>

                        {/* Audio Language Chips */}
                        <div className="flex flex-wrap items-center gap-2 text-[0.72rem] font-bold text-slate-400">
                          <span className="bg-white/10 px-2.5 py-0.5 rounded-md text-slate-200 border border-white/10 font-mono">
                            {formatLang(movie.languages)}
                          </span>
                          <span className="bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 px-2.5 py-0.5 rounded-md font-mono">
                            Lossless Master
                          </span>
                          <span className="spec-badge spec-badge-4k">
                            {movie.rip || movie.qualities?.[0] || "2160p REMUX"}
                          </span>
                        </div>

                        {/* Synopsis */}
                        {(movie.description || movie.overview) && (
                          <p className="text-slate-300 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3 leading-relaxed font-normal max-w-lg drop-shadow-md pt-0.5">
                            {movie.description || movie.overview}
                          </p>
                        )}

                        {/* CTA Suite */}
                        <div className="flex items-center flex-wrap gap-3 pt-3">
                          <Link
                            to={watchLink}
                            className="btn-cinema-primary px-7 py-3 text-xs sm:text-sm shadow-[0_0_30px_rgba(0,242,254,0.6)]"
                            aria-label={`Watch ${movie.title}`}
                          >
                            <BsPlayFill className="text-2xl mr-1" />
                            Stream 4K Cinema
                          </Link>

                          <button
                            type="button"
                            onClick={() => setTrailerMovie(movie)}
                            className="btn-cinema-frosted px-5 py-3 text-xs sm:text-sm flex items-center gap-2"
                            aria-label={`Watch trailer for ${movie.title}`}
                          >
                            <FaYoutube className="text-base text-rose-500" />
                            Trailer
                          </button>

                          <Link
                            to={watchLink}
                            className="btn-cinema-frosted px-5 py-3 text-xs sm:text-sm flex items-center gap-2"
                            aria-label={`Direct download ${movie.title}`}
                          >
                            <FaDownload className="text-xs text-cyan-400" />
                            Download
                          </Link>

                          <button
                            type="button"
                            onClick={(e) => handleWatchlist(e, movie)}
                            title={inList ? "Remove from Watchlist" : "Add to Watchlist"}
                            className="w-11 h-11 rounded-full bg-[#0E131F]/90 border border-white/[0.15] hover:border-cyan-400 flex items-center justify-center text-slate-300 hover:text-cyan-400 transition-colors shadow-md backdrop-blur-md"
                          >
                            {inList ? <BsBookmarkFill className="text-cyan-400" /> : <BsBookmark />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Navigation Controls */}
          <button
            className="hero-prev absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-[#080B12]/80 border border-cyan-400/30 text-cyan-400 hover:border-cyan-300 hover:text-white hover:bg-cyan-500/25 transition-all duration-300 shadow-[0_0_20px_rgba(0,242,254,0.25)] hidden md:flex backdrop-blur-xl"
            aria-label="Previous slide"
          >
            <HiChevronLeft className="text-2xl" />
          </button>
          <button
            className="hero-next absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-[#080B12]/80 border border-cyan-400/30 text-cyan-400 hover:border-cyan-300 hover:text-white hover:bg-cyan-500/25 transition-all duration-300 shadow-[0_0_20px_rgba(0,242,254,0.25)] hidden md:flex backdrop-blur-xl"
            aria-label="Next slide"
          >
            <HiChevronRight className="text-2xl" />
          </button>

          {/* Pagination Dots */}
          <div className="hero-pagination absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2" />

          {/* Trailer Modal Popup */}
          {trailerMovie && (
            <TrailerModal
              movie={trailerMovie}
              isOpen={!!trailerMovie}
              onClose={() => setTrailerMovie(null)}
            />
          )}
        </>
      ) : (
        <div className="w-full min-h-[82dvh] md:min-h-[90dvh] bg-[#0E131F] shimmer-effect" />
      )}
    </section>
  );
}
