import React from "react";
import { Link } from "react-router-dom";
import MovieCard from "./MovieCard";
import MovieCardSkeleton from "./MovieCardSkeleton";
import { HiArrowRight, HiSparkles } from "react-icons/hi2";

export default function HomeSection({ movieData, isMovieDataLoading, sectionTitle, sectionSeeMoreButtonLink }) {
  return (
    <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 mt-12 md:mt-16">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md">
            <HiSparkles className="text-lg" />
          </div>
          <h2 className="section-title text-xl md:text-2xl">{sectionTitle}</h2>
        </div>

        <Link
          to={sectionSeeMoreButtonLink}
          className="flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-4 py-2 rounded-full transition-all group shadow-md"
          aria-label={`See all ${sectionTitle}`}
        >
          See all
          <HiArrowRight className="text-base group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Cards Grid */}
      {!isMovieDataLoading ? (
        <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 blgxl:grid-cols-6 xl:grid-cols-7 gap-4 md:gap-5">
          {movieData?.map((movie, i) => (
            <MovieCard key={i} movie={movie} />
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
