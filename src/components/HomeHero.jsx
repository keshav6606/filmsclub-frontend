import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Autoplay, Navigation, A11y, Pagination, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "react-lazy-load-image-component/src/effects/opacity.css";

import { BsPlayFill } from "react-icons/bs";
import { FaDownload } from "react-icons/fa";
import { PiStarFill } from "react-icons/pi";
import { HiChevronLeft, HiChevronRight, HiSparkles } from "react-icons/hi2";

export default function HeroSlider({ movieData, isMovieDataLoading }) {
  const langMap = {
    hi: "Hindi", en: "English", ta: "Tamil", te: "Telugu",
    kn: "Kannada", ml: "Malayalam", mr: "Marathi", bn: "Bengali",
    dual: "Dual Audio", multi: "Multi Audio",
  };

  const formatLang = (arr) =>
    arr?.map((l) => langMap[l] || l.toUpperCase()).slice(0, 2).join(" • ") || "Hindi • Dual Audio";

  return (
    <section className="relative w-full min-h-[80dvh] md:min-h-[88dvh] pt-16 overflow-hidden bg-[#0a0c10]" aria-label="Featured movies slider">
      {!isMovieDataLoading ? (
        <>
          <Swiper
            modules={[Autoplay, Navigation, A11y, Pagination, EffectFade]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            loop={true}
            autoplay={{ delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            pagination={{ el: ".hero-pagination", clickable: true }}
            navigation={{ prevEl: ".hero-prev", nextEl: ".hero-next" }}
            className="hero-swiper w-full h-full"
          >
            {movieData.slice(0, 8).map((movie) => {
              const watchLink = movie.media_type === "movie" ? `/mov/${movie.tmdb_id}` : `/ser/${movie.tmdb_id}`;
              const genreStr = movie.genres?.length > 0 ? movie.genres.slice(0, 2).join(" • ") : "Action • Drama";

              return (
                <SwiperSlide key={movie.tmdb_id || movie.title} className="bg-[#0a0c10]">
                  <div className="relative w-full min-h-[80dvh] md:min-h-[88dvh] flex items-end overflow-hidden">
                    {/* Full-Screen Edge-to-Edge Backdrop Image */}
                    <div className="absolute inset-0 bg-[#0a0c10]">
                      <LazyLoadImage
                        src={movie.backdrop || movie.poster}
                        alt={movie.title}
                        effect="opacity"
                        className="w-full h-full object-cover object-center md:object-right-top scale-105"
                        wrapperClassName="w-full h-full"
                      />

                      {/* Cinematic Gradient Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0c10] via-[#0a0c10]/80 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10] via-[#0a0c10]/50 to-transparent" />
                      <div className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-amber-500/10 blur-[160px] rounded-full pointer-events-none" />
                    </div>

                    {/* Content Box (Matching Screen 1) */}
                    <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-16 pb-16 md:pb-24">
                      <div className="max-w-xl sm:max-w-2xl space-y-3.5">
                        {/* FEATURED BLOCKBUSTER Pill Badge */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[0.68rem] tracking-wider uppercase shadow-[0_0_20px_rgba(245,158,11,0.6)]">
                          <HiSparkles /> FEATURED BLOCKBUSTER
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl sm:text-4xl md:text-6xl font-black tracking-tight text-white leading-tight drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)] break-words line-clamp-2">
                          {movie.title}
                        </h1>

                        {/* Meta Info Row 1: Genre • Year • Duration */}
                        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-bold text-slate-300">
                          <span>{genreStr}</span>
                          <span>•</span>
                          <span>{movie.release_year || "2026"}</span>
                          {movie.runtime && (
                            <>
                              <span>•</span>
                              <span>{movie.runtime} min</span>
                            </>
                          )}
                          {movie.rating && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1 text-amber-400">
                                <PiStarFill className="text-xs" /> {movie.rating.toFixed(1)}
                              </span>
                            </>
                          )}
                        </div>

                        {/* Meta Info Row 2: Audio • Format Chips */}
                        <div className="flex flex-wrap items-center gap-2 text-[0.72rem] font-bold text-slate-400">
                          <span className="bg-white/10 px-2.5 py-0.5 rounded-md text-slate-200">
                            {formatLang(movie.languages)}
                          </span>
                          <span className="bg-white/10 px-2.5 py-0.5 rounded-md text-amber-300">
                            ORG Audio
                          </span>
                          <span className="quality-badge">{movie.rip || "Web-DL"}</span>
                        </div>

                        {/* Synopsis */}
                        {movie.description && (
                          <p className="text-slate-300 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3 leading-relaxed font-normal max-w-lg drop-shadow-md pt-1">
                            {movie.description}
                          </p>
                        )}

                        {/* CTA Action Buttons */}
                        <div className="flex items-center flex-wrap gap-3 pt-3">
                          <Link
                            to={watchLink}
                            className="btn-gold flex items-center gap-2.5 px-7 py-3 text-xs sm:text-sm font-black shadow-[0_0_30px_rgba(245,158,11,0.6)] hover:scale-105"
                            aria-label={`Watch ${movie.title}`}
                          >
                            <BsPlayFill className="text-xl" />
                            Watch Now
                          </Link>
                          <Link
                            to={watchLink}
                            className="btn-outline-gold flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-extrabold"
                            aria-label={`Download ${movie.title}`}
                          >
                            <FaDownload className="text-xs" />
                            Download HD
                          </Link>
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
            className="hero-prev absolute left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-slate-950/80 border border-amber-500/40 text-amber-400 hover:border-amber-400 hover:text-white hover:bg-amber-500/30 transition-all duration-300 shadow-2xl hidden md:flex backdrop-blur-md"
            aria-label="Previous slide"
          >
            <HiChevronLeft className="text-xl" />
          </button>
          <button
            className="hero-next absolute right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-slate-950/80 border border-amber-500/40 text-amber-400 hover:border-amber-400 hover:text-white hover:bg-amber-500/30 transition-all duration-300 shadow-2xl hidden md:flex backdrop-blur-md"
            aria-label="Next slide"
          >
            <HiChevronRight className="text-xl" />
          </button>

          {/* Pagination Dots */}
          <div className="hero-pagination absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2" />
        </>
      ) : (
        <div className="w-full min-h-[80dvh] md:min-h-[88dvh] bg-[#0E121B] shimmer-effect" />
      )}
    </section>
  );
}
