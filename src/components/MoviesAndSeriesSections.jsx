import React from "react";
import MovieCard from "./MovieCard";
import MovieCardSkeleton from "./MovieCardSkeleton";
import { HiSparkles } from "react-icons/hi2";

export default function HomeSection(props) {
  const filterOptions = [
    { name: "⚡ Latest Drops", value: "updated_on" },
    { name: "⭐ Top Rated", value: "rating" },
    { name: "📅 New Releases", value: "release_year" },
  ];

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 mt-20 mb-8">
      {/* Title & Filter Options Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md">
            <HiSparkles className="text-xl" />
          </div>
          <h1 className="section-title text-2xl md:text-3xl font-black">
            {props.sectionTitle}
          </h1>
        </div>

        {/* Filter Buttons */}
        {(props.dataType === "movies" || props.dataType === "series") && (
          <div className="flex items-center gap-2 flex-wrap bg-slate-900/80 p-1.5 rounded-full border border-white/10 backdrop-blur-md">
            {filterOptions.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  props.setMovieFilterVal(item.value);
                  props.setMovieFilter(item.value);
                }}
                className={`py-2 px-4 rounded-full text-xs font-bold transition-all duration-250 ${
                  item.value === props.movieFilterVal
                    ? "bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.5)] scale-105"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Cards Grid */}
      <div>
        {!props.isMovieDataLoading ? (
          <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 blgxl:grid-cols-6 xl:grid-cols-7 gap-4 md:gap-5">
            {props.movieData.map((movie, index) => (
              <MovieCard key={index} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 blgxl:grid-cols-6 xl:grid-cols-7 gap-4 md:gap-5">
            {Array.from({ length: 14 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
