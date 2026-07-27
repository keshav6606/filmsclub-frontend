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
import { HiChevronLeft, HiChevronRight, HiOutlineSparkles } from "react-icons/hi2";
import { BiTime, BiCategory } from "react-icons/bi";

export default function HeroSlider({ movieData, isMovieDataLoading }) {
  const langMap = {
    hi: "Hindi", en: "English", ta: "Tamil", te: "Telugu",
    kn: "Kannada", ml: "Malayalam", mr: "Marathi", bn: "Bengali",
  };

  const formatLang = (arr) =>
    arr?.map((l) => langMap[l] || l.toUpperCase()).join(" · ") || "";

  return (
    <section className="relative w-full min-h-[72dvh] md:min-h-[85dvh] pt-16" aria-label="Featured movies">
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
                <div className="relative w-full min-h-[72dvh] md:min-h-[85dvh] flex items-end overflow-hidden">
                  
                  {/* Backdrop Image with Ambient Radial Glow */}
                  <div className="absolute inset-0">
                    <LazyLoadImage
                      src={movie.backdrop || movie.poster}
                      alt={movie.title}
                      effect="opacity"
                      className="w-full h-full object-cover object-top filter brightness-90"
                      wrapperClassName="w-full h-full"
                    />
                    {/* Multi-layered Cinematic Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-r from-bgColor via-bgColor/75 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-bgColor via-bgColor/40 to-transparent" />
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full filter blur-3xl pointer-events-none" />
                  </div>

                  {/* Hero Content */}
                  <div className="relative z-10 w-full max-w-[1600px] mx-auto px-5 sm:px-10 lg:px-16 pb-16 md:pb-20">
                    <motion.div
                      key={movie.tmdb_id}
                      initial={{ opacity: 0, y: 25 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="max-w-2xl"
                    >
                      {/* Trending Tag & Genres */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="inline-flex items-center gap-1 text-[0.65rem] font-bold px-2.5 py-1 rounded-full bg-primaryBtn text-bgColor uppercase tracking-wider shadow-gold">
                          <HiOutlineSparkles className="text-xs" /> Featured Premiere
                        </span>
                        {movie.genres?.slice(0, 3).map((g, i) => (
                          <span key={i} className="genre-pill">{g}</span>
                        ))}
                      </div>

                      {/* Title */}
                      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-primaryTextColor leading-tight line-clamp-2 mb-3 drop-shadow-xl">
                        {movie.title}
                      </h1>

                      {/* Metadata Row */}
                      <div className="flex flex-wrap items-center gap-3 mb-4 text-xs sm:text-sm">
                        {/* Rating */}
                        {movie.rating && (
                          <div className="flex items-center gap-1.5 bg-goldLight/10 border border-goldLight/30 text-goldLight rounded-full px-3 py-1 font-bold">
                            <PiStarFill className="text-goldLight" />
                            <span>{movie.rating.toFixed(1)}</span>
                          </div>
                        )}
                        {/* Year */}
                        {movie.release_year && (
                          <span className="text-secondaryTextColor font-semibold">{movie.release_year}</span>
                        )}
                        {/* Runtime */}
                        {movie.runtime && (
                          <div className="flex items-center gap-1 text-secondaryTextColor font-medium">
                            <BiTime />
                            <span>{movie.runtime} min</span>
                          </div>
                        )}
                        {/* Language */}
                        {movie.languages?.length > 0 && (
                          <div className="flex items-center gap-1 text-secondaryTextColor font-medium">
                            <BiCategory />
                            <span>{formatLang(movie.languages)}</span>
                          </div>
                        )}
                        {/* Quality */}
                        {movie.rip && <span className="quality-badge">{movie.rip}</span>}
                      </div>

                      {/* Description */}
                      {movie.description && (
                        <p className="text-secondaryTextColor text-xs sm:text-sm md:text-base line-clamp-2 sm:line-clamp-3 mb-6 max-w-xl leading-relaxed">
                          {movie.description}
                        </p>
                      )}

                      {/* CTA Buttons */}
                      <div className="flex items-center flex-wrap gap-3.5">
                        <Link
                          to={movie.media_type === "movie" ? `/mov/${movie.tmdb_id}` : `/ser/${movie.tmdb_id}`}
                          className="btn-gold flex items-center gap-2.5 px-6 py-3 text-sm font-bold shadow-gold hover:shadow-goldStrong"
                          aria-label={`Watch ${movie.title}`}
                        >
                          <BsPlayFill className="text-xl" />
                          Watch Now
                        </Link>
                        <Link
                          to={movie.media_type === "movie" ? `/mov/${movie.tmdb_id}` : `/ser/${movie.tmdb_id}`}
                          className="btn-outline-gold flex items-center gap-2.5 px-6 py-3 text-sm font-bold"
                          aria-label={`Download ${movie.title}`}
                        >
                          <FaDownload className="text-xs" />
                          Download
                        </Link>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Controls */}
          <button
            className="hero-prev absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-bgColorSecondary/80 border border-border text-primaryTextColor hover:border-primaryBtn hover:text-primaryBtn transition-all duration-200 hidden md:flex shadow-card"
            aria-label="Previous slide"
          >
            <HiChevronLeft className="text-xl" />
          </button>
          <button
            className="hero-next absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-bgColorSecondary/80 border border-border text-primaryTextColor hover:border-primaryBtn hover:text-primaryBtn transition-all duration-200 hidden md:flex shadow-card"
            aria-label="Next slide"
          >
            <HiChevronRight className="text-xl" />
          </button>

          {/* Pagination Dots */}
          <div className="hero-pagination absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2" />
        </>
      ) : (
        /* Shimmer Skeleton */
        <div className="w-full min-h-[72dvh] md:min-h-[85dvh] bg-bgColorSecondary shimmer-effect rounded-2xl" />
      )}
    </section>
  );
}
