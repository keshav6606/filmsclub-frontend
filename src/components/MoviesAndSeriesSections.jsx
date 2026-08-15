import React, { useState } from "react";
import MovieCard from "./MovieCard";
import MovieCardSkeleton from "./MovieCardSkeleton";
import { HiSparkles, HiAdjustmentsHorizontal } from "react-icons/hi2";
import { BiSortAlt2 } from "react-icons/bi";

export default function MoviesAndSeriesSections(props) {
  const languagePills = [
    { name: "All", value: "all" },
    { name: "Bollywood", value: "hi" },
    { name: "Hollywood", value: "en" },
    { name: "South", value: "south" },
    { name: "Marathi", value: "mr" },
    { name: "Gujarati", value: "gu" },
    { name: "Punjabi", value: "pa" },
    { name: "Dual Audio", value: "dual" },
  ];

  const seriesGenrePills = [
    { name: "All", value: "all" },
    { name: "Drama", value: "Drama" },
    { name: "Thriller", value: "Thriller" },
    { name: "Comedy", value: "Comedy" },
    { name: "Romance", value: "Romance" },
    { name: "Action", value: "Action" },
    { name: "Crime", value: "Crime" },
  ];

  const [selectedPill, setSelectedPill] = useState("all");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const filterOptions = [
    { name: "⚡ Latest Drops", value: "updated_on" },
    { name: "⭐ Top Rated", value: "rating" },
    { name: "📅 New Releases", value: "release_year" },
  ];

  const pills = props.dataType === "series" ? seriesGenrePills : languagePills;

  // Filter items locally by active pill if needed
  const displayData = React.useMemo(() => {
    if (!props.movieData || selectedPill === "all") return props.movieData || [];
    const lower = selectedPill.toLowerCase();
    return props.movieData.filter((item) => {
      const titleStr = `${item.title || ""} ${item.language || ""} ${item.genres?.join(" ") || ""}`.toLowerCase();
      if (Array.isArray(item.languages) && item.languages.some((l) => String(l).toLowerCase().includes(lower))) return true;
      if (Array.isArray(item.genres) && item.genres.some((g) => String(g).toLowerCase().includes(lower))) return true;
      return titleStr.includes(lower);
    });
  }, [props.movieData, selectedPill]);

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 mt-20 mb-8">
      {/* ── Screen 2 / Screen 4: Category / Language Filter Pills Bar ── */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-4">
        {pills.map((pill) => (
          <button
            key={pill.name}
            onClick={() => setSelectedPill(pill.value)}
            className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wide shrink-0 transition-all duration-200 border ${
              selectedPill === pill.value
                ? "bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)] scale-105"
                : "bg-slate-900/80 text-slate-300 border-white/10 hover:border-amber-400/40 hover:text-white"
            }`}
          >
            {pill.name}
          </button>
        ))}
      </div>

      {/* ── Sort & Filter Header Controls Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md">
            <HiSparkles className="text-lg" />
          </div>
          <h1 className="section-title text-xl md:text-2xl font-black">
            {props.sectionTitle}
          </h1>
        </div>

        {/* Sort & Filter Buttons (Matching Screen 2) */}
        <div className="flex items-center gap-2 flex-wrap">
          {filterOptions.map((item) => (
            <button
              key={item.value}
              onClick={() => {
                props.setMovieFilterVal?.(item.value);
                props.setMovieFilter?.(item.value);
              }}
              className={`flex items-center gap-1.5 py-1.5 px-3.5 rounded-full text-xs font-extrabold border transition-all duration-200 ${
                item.value === props.movieFilterVal
                  ? "bg-amber-400 text-slate-950 border-amber-400 shadow-md"
                  : "bg-slate-900 text-slate-300 border-white/10 hover:border-amber-400/40 hover:text-white"
              }`}
            >
              <BiSortAlt2 className="text-sm" />
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── 2-Column Responsive Grid ── */}
      <div>
        {!props.isMovieDataLoading ? (
          <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 blgxl:grid-cols-6 xl:grid-cols-7 gap-3.5 sm:gap-4 md:gap-5">
            {displayData.map((movie, index) => (
              <MovieCard key={movie.tmdb_id || index} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 blgxl:grid-cols-6 xl:grid-cols-7 gap-3.5 sm:gap-4 md:gap-5">
            {Array.from({ length: 14 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
