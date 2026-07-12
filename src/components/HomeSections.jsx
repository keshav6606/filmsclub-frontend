import React from "react";
import { Link } from "react-router-dom";
import MovieCard from "./MovieCard";
import MovieCardSkeleton from "./MovieCardSkeleton";
import { HiArrowRight } from "react-icons/hi2";

export default function HomeSection({ movieData, isMovieDataLoading, sectionTitle, sectionSeeMoreButtonLink }) {
  return (
    <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 mt-12 md:mt-16">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="section-title text-lg">{sectionTitle}</h2>
        <Link
          to={sectionSeeMoreButtonLink}
          className="flex items-center gap-1.5 text-xs font-semibold text-primaryBtn hover:text-accent transition-colors group"
          aria-label={`See all ${sectionTitle}`}
        >
          See all
          <HiArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Cards Grid */}
      {!isMovieDataLoading ? (
        <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 blgxl:grid-cols-6 xl:grid-cols-7 gap-3 md:gap-4">
          {movieData?.map((movie, i) => (
            <MovieCard key={i} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 blgxl:grid-cols-6 xl:grid-cols-7 gap-3 md:gap-4">
          {Array.from({ length: 14 }).map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      )}
    </section>
  );
}
