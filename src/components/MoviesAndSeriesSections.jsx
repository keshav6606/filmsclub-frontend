import React from "react";
import MovieCard from "./MovieCard";
import MovieCardSkeleton from "./MovieCardSkeleton";
import { HiSparkles } from "react-icons/hi2";
import { BiSortAlt2, BiFilterAlt } from "react-icons/bi";
import { IoCloseCircleOutline } from "react-icons/io5";

export const GENRE_LIST = [
  "All",
  "Action",
  "Comedy",
  "Thriller",
  "Drama",
  "Romance",
  "Horror",
  "Sci-Fi",
  "Anime",
  "Crime",
  "Adventure",
  "Animation",
  "Mystery",
  "Fantasy",
];

export const LANGUAGE_LIST = [
  { name: "All Languages", value: "all" },
  { name: "Hindi", value: "hi" },
  { name: "English", value: "en" },
  { name: "South Indian", value: "south" },
  { name: "Marathi", value: "mr" },
  { name: "Gujarati", value: "gu" },
  { name: "Punjabi", value: "pa" },
  { name: "Dual Audio", value: "dual" },
];

export default function MoviesAndSeriesSections({
  movieData = [],
  isMovieDataLoading = false,
  dataType = "movies",
  sectionTitle = "Browse Catalog",
  movieFilterVal = "updated_on",
  setMovieFilterVal,
  setMovieFilter,
  activeGenre = "All",
  setActiveGenre,
  activeLanguage = "all",
  setActiveLanguage,
  onResetFilters,
}) {
  const filterOptions = [
    { name: "⚡ Latest Drops", value: "updated_on" },
    { name: "⭐ Top Rated", value: "rating" },
    { name: "📅 New Releases", value: "release_year" },
  ];

  // Client-side fallback filter to ensure instantaneous response
  const displayData = React.useMemo(() => {
    if (!Array.isArray(movieData)) return [];
    return movieData.filter((item) => {
      // 1. Genre Match
      if (activeGenre && activeGenre.toLowerCase() !== "all") {
        const targetG = activeGenre.toLowerCase();
        const itemGenres = Array.isArray(item.genres)
          ? item.genres.map((g) => String(g).toLowerCase())
          : [];
        const titleStr = String(item.title || "").toLowerCase();
        const genreMatched =
          itemGenres.some((g) => g.includes(targetG) || targetG.includes(g)) ||
          titleStr.includes(targetG);
        if (!genreMatched) return false;
      }

      // 2. Language Match
      if (activeLanguage && activeLanguage.toLowerCase() !== "all") {
        const targetL = activeLanguage.toLowerCase();
        const itemLangs = Array.isArray(item.languages)
          ? item.languages.map((l) => String(l).toLowerCase())
          : [];
        const titleStr = `${item.title || ""} ${item.rip || ""}`.toLowerCase();

        if (targetL === "dual") {
          const isDual =
            itemLangs.some((l) => l.includes("dual")) ||
            titleStr.includes("dual") ||
            (item.telegram &&
              item.telegram.some((t) =>
                String(t.name || "").toLowerCase().includes("dual")
              ));
          if (!isDual) return false;
        } else if (targetL === "south") {
          const southLangs = ["ta", "te", "ml", "kn", "tamil", "telugu", "malayalam", "kannada"];
          const isSouth = itemLangs.some((l) => southLangs.includes(l));
          if (!isSouth) return false;
        } else {
          const langMatched =
            itemLangs.some((l) => l.includes(targetL)) || titleStr.includes(targetL);
          if (!langMatched) return false;
        }
      }

      return true;
    });
  }, [movieData, activeGenre, activeLanguage]);

  const hasActiveFilters =
    (activeGenre && activeGenre.toLowerCase() !== "all") ||
    (activeLanguage && activeLanguage.toLowerCase() !== "all");

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 mt-20 mb-8 space-y-6">
      {/* ── Category & Genre Pills Bar ── */}
      <div className="space-y-3 bg-[#0B0F19]/80 p-4 rounded-3xl border border-white/[0.08] backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider font-outfit">
            <BiFilterAlt className="text-cyan-400 text-sm" />
            <span>Select Category / Genre</span>
          </div>
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 font-outfit"
            >
              <IoCloseCircleOutline className="text-sm" />
              <span>Reset All</span>
            </button>
          )}
        </div>

        {/* Genre Pills Row */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {GENRE_LIST.map((genre) => {
            const isSelected =
              activeGenre.toLowerCase() === genre.toLowerCase();
            return (
              <button
                key={genre}
                onClick={() => setActiveGenre?.(genre)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold tracking-wide shrink-0 transition-all duration-300 border font-outfit ${
                  isSelected
                    ? "bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.5)] font-black scale-105"
                    : "bg-[#141A29]/80 text-slate-300 border-white/10 hover:border-cyan-400/40 hover:text-white"
                }`}
              >
                {genre}
              </button>
            );
          })}
        </div>

        {/* Language Filter Pills Row */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 pb-1">
          {LANGUAGE_LIST.map((lang) => {
            const isSelected =
              activeLanguage.toLowerCase() === lang.value.toLowerCase();
            return (
              <button
                key={lang.value}
                onClick={() => setActiveLanguage?.(lang.value)}
                className={`px-3.5 py-1 rounded-xl text-[0.72rem] font-bold shrink-0 transition-all duration-300 border font-mono ${
                  isSelected
                    ? "bg-cyan-500/25 text-cyan-300 border-cyan-400/80 shadow-[0_0_10px_rgba(0,242,254,0.3)]"
                    : "bg-[#070A12] text-slate-400 border-white/5 hover:border-white/20 hover:text-slate-200"
                }`}
              >
                {lang.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Sort & Filter Header Controls Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.2)]">
            <HiSparkles className="text-lg" />
          </div>
          <div>
            <h1 className="section-title text-xl md:text-2xl font-black">
              {sectionTitle}
              {activeGenre && activeGenre.toLowerCase() !== "all" && (
                <span className="text-cyan-400 font-bold ml-2">
                  • {activeGenre}
                </span>
              )}
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Showing {displayData.length} cinema titles available
            </p>
          </div>
        </div>

        {/* Sort Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {filterOptions.map((item) => (
            <button
              key={item.value}
              onClick={() => {
                setMovieFilterVal?.(item.value);
                setMovieFilter?.(item.value);
              }}
              className={`flex items-center gap-1.5 py-1.5 px-4 rounded-full text-xs font-bold border transition-all duration-300 font-outfit ${
                item.value === movieFilterVal
                  ? "bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.4)] font-black"
                  : "bg-[#0E131F] text-slate-300 border-white/10 hover:border-cyan-400/40 hover:text-white"
              }`}
            >
              <BiSortAlt2 className="text-sm" />
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Movie & Series Grid ── */}
      <div>
        {!isMovieDataLoading ? (
          displayData.length > 0 ? (
            <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 blgxl:grid-cols-6 xl:grid-cols-7 gap-3.5 sm:gap-4 md:gap-5">
              {displayData.map((movie, index) => (
                <MovieCard key={movie.tmdb_id || index} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-3xl bg-[#0E131F]/50 border border-white/5 space-y-4">
              <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 text-3xl shadow-[0_0_20px_rgba(0,242,254,0.2)]">
                🎬
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white font-outfit">
                No titles found in this category
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md">
                We couldn't find any {dataType === "series" ? "TV shows" : "movies"} matching{" "}
                <span className="text-cyan-400 font-bold">
                  {activeGenre !== "All" ? activeGenre : ""} {activeLanguage !== "all" ? `(${activeLanguage})` : ""}
                </span>
                . Try selecting another category or reset filters.
              </p>
              <button
                onClick={onResetFilters}
                className="btn-cinema-primary px-7 py-3 rounded-full text-xs shadow-lg"
              >
                Show All {dataType === "series" ? "Series" : "Movies"}
              </button>
            </div>
          )
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
