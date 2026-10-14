import React from "react";
import { Link } from "react-router-dom";
import MovieCard from "./MovieCard";
import MovieCardSkeleton from "./MovieCardSkeleton";
import { HiArrowRight, HiSparkles, HiFire } from "react-icons/hi2";

export default function HomeSection({ movieData, isMovieDataLoading, sectionTitle, sectionSeeMoreButtonLink }) {
  const isTrending = sectionTitle.toLowerCase().includes("trending");

  return (
    <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 mt-12 md:mt-16">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6 pb-2.5 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-md ${
            isTrending
              ? "bg-rose-500/15 border border-rose-500/30 text-rose-400 shadow-[0_0_15px_rgba(255,42,85,0.25)]"
              : "bg-cyan-500/15 border border-cyan-400/30 text-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.25)]"
          }`}>
            {isTrending ? <HiFire className="text-xl" /> : <HiSparkles className="text-lg" />}
          </div>
          <div>
            <h2 className="section-title text-xl md:text-2xl">{sectionTitle}</h2>
          </div>
        </div>

        <Link
          to={sectionSeeMoreButtonLink}
          className="flex items-center gap-2 text-xs sm:text-sm font-bold text-cyan-400 hover:text-cyan-300 bg-[#0E131F]/90 hover:bg-[#141A29] border border-cyan-400/30 hover:border-cyan-400 px-4 py-2 rounded-full transition-all group shadow-sm font-outfit"
          aria-label={`See all ${sectionTitle}`}
        >
          <span>Explore All</span>
          <HiArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Cards Grid */}
      {!isMovieDataLoading ? (
        <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 blgxl:grid-cols-6 xl:grid-cols-7 gap-4 md:gap-5">
          {movieData?.map((movie, i) => (
            <MovieCard key={movie.tmdb_id || i} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 blgxl:grid-cols-6 xl:grid-cols-7 gap-4 md:gap-5">
          {Array.from({ length: 14 }).map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      )}
    </section>
  );
}
