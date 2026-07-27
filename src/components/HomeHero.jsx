import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Autoplay, Navigation, A11y, Pagination, EffectFade } from "swiper/modules";
import { motion } from "framer-motion";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "react-lazy-load-image-component/src/effects/opacity.css";

import { BsPlayFill } from "react-icons/bs";
import { FaDownload } from "react-icons/fa";
import { PiStarFill } from "react-icons/pi";
import { HiChevronLeft, HiChevronRight, HiSparkles } from "react-icons/hi2";
import { BiTime, BiCategory } from "react-icons/bi";

export default function HeroSlider({ movieData, isMovieDataLoading }) {
  const langMap = {
    hi: "Hindi", en: "English", ta: "Tamil", te: "Telugu",
    kn: "Kannada", ml: "Malayalam", mr: "Marathi", bn: "Bengali",
  };

  const formatLang = (arr) =>
    arr?.map((l) => langMap[l] || l.toUpperCase()).join(" · ") || "";

  return (
    <section className="relative w-full min-h-[75dvh] md:min-h-[88dvh] pt-16 overflow-hidden" aria-label="Featured movies slider">
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
            className="w-full h-full"
          >
            {movieData.slice(0, 8).map((movie, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full min-h-[75dvh] md:min-h-[88dvh] flex items-end overflow-hidden">
                  {/* Backdrop Image */}
                  <div className="absolute inset-0">
                    <LazyLoadImage
                      src={movie.backdrop || movie.poster}
                      alt={movie.title}
                      effect="opacity"
                      className="w-full h-full object-cover object-center scale-105"
                      wrapperClassName="w-full h-full"
                    />

                    {/* Ambient Glow & Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#06080D] via-[#06080D]/80 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#06080D] via-[#06080D]/40 to-transparent" />
                    <div className="absolute top-1/4 left-10 w-96 h-96 bg-amber-500/15 blur-[120px] rounded-full pointer-events-none" />
                    <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />
                  </div>

                  {/* Content Container */}
                  <div className="relative z-10 w-full max-w-[1600px] mx-auto px-5 sm:px-10 lg:px-16 pb-16 md:pb-24">
                    <motion.div
                      key={movie.tmdb_id}
                      initial={{ opacity: 0, y: 35 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="max-w-3xl glass-card p-6 sm:p-10 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
                    >
                      {/* Featured Badge & Genres */}
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-[0.68rem] tracking-wider uppercase shadow-md">
                          <HiSparkles /> FEATURED BLOCKBUSTER
                        </div>
                        {movie.genres?.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {movie.genres.slice(0, 3).map((g, i) => (
                              <span key={i} className="genre-pill">{g}</span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Movie Title */}
                      <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight mb-4 drop-shadow-2xl">
                        <span className="gold-text">{movie.title}</span>
                      </h1>

                      {/* Metadata Details Row */}
                      <div className="flex flex-wrap items-center gap-3.5 mb-5 text-xs sm:text-sm">
                        {movie.rating && (
                          <div className="flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/40 text-amber-400 font-extrabold rounded-full px-3.5 py-1 backdrop-blur-md shadow-md">
                            <PiStarFill className="text-amber-400 text-base" />
                            <span>{movie.rating.toFixed(1)} IMDb</span>
                          </div>
                        )}
                        {movie.release_year && (
                          <span className="text-slate-300 font-semibold bg-white/5 border border-white/10 rounded-full px-3 py-1">
                            {movie.release_year}
                          </span>
                        )}
                        {movie.runtime && (
                          <div className="flex items-center gap-1 text-slate-300 font-medium">
                            <BiTime className="text-amber-400 text-base" />
                            <span>{movie.runtime} min</span>
                          </div>
                        )}
                        {movie.languages?.length > 0 && (
                          <div className="flex items-center gap-1 text-slate-300 font-medium">
                            <BiCategory className="text-cyan-400 text-base" />
                            <span>{formatLang(movie.languages)}</span>
                          </div>
                        )}
                        {movie.rip && <span className="quality-badge">{movie.rip}</span>}
                      </div>

                      {/* Overview */}
                      {movie.description && (
                        <p className="text-slate-300 text-xs sm:text-sm sm:text-base line-clamp-2 sm:line-clamp-3 mb-6 max-w-2xl leading-relaxed">
                          {movie.description}
                        </p>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center flex-wrap gap-4">
                        <Link
                          to={movie.media_type === "movie" ? `/mov/${movie.tmdb_id}` : `/ser/${movie.tmdb_id}`}
                          className="btn-gold flex items-center gap-3 px-8 py-3.5 text-sm font-bold shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:scale-105"
                          aria-label={`Watch ${movie.title}`}
                        >
                          <BsPlayFill className="text-2xl" />
                          Watch Now
                        </Link>
                        <Link
                          to={movie.media_type === "movie" ? `/mov/${movie.tmdb_id}` : `/ser/${movie.tmdb_id}`}
                          className="btn-outline-gold flex items-center gap-3 px-7 py-3.5 text-sm font-bold"
                          aria-label={`Download ${movie.title}`}
                        >
                          <FaDownload className="text-sm" />
                          Download HD
                        </Link>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Arrows */}
          <button
            className="hero-prev absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-slate-950/70 border border-white/15 text-white hover:border-amber-400 hover:text-amber-400 hover:bg-amber-500/20 transition-all duration-300 shadow-xl hidden md:flex backdrop-blur-md"
            aria-label="Previous slide"
          >
            <HiChevronLeft className="text-2xl" />
          </button>
          <button
            className="hero-next absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-slate-950/70 border border-white/15 text-white hover:border-amber-400 hover:text-amber-400 hover:bg-amber-500/20 transition-all duration-300 shadow-xl hidden md:flex backdrop-blur-md"
            aria-label="Next slide"
          >
            <HiChevronRight className="text-2xl" />
          </button>

          {/* Pagination Dots */}
          <div className="hero-pagination absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2" />
        </>
      ) : (
        /* Skeleton */
        <div className="w-full min-h-[75dvh] md:min-h-[88dvh] bg-[#0E121B] shimmer-effect" />
      )}
    </section>
  );
}
