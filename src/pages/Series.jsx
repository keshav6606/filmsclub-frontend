// src/pages/Series.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { BsPlayFill } from "react-icons/bs";
import Pagination from "../components/Pagination";
import MovieCard from "../components/MovieCard";
import MovieCardSkeleton from "../components/MovieCardSkeleton";
import SEO from "../components/SEO";
import { BASE_URL as BASE } from "../config/api";
import { GENRE_LIST, LANGUAGE_LIST } from "../components/MoviesAndSeriesSections";
import { BiFilterAlt } from "react-icons/bi";
import { IoCloseCircleOutline } from "react-icons/io5";

export default function Series() {
  const SITENAME = import.meta.env.VITE_SITENAME || "Filmy4uhd";
  const [searchParams, setSearchParams] = useSearchParams();

  // URL query params
  const initialGenre = searchParams.get("genre") || "All";
  const initialLang = searchParams.get("lang") || "all";

  // States
  const [series, setSeries] = useState([]);
  const [featuredSeries, setFeaturedSeries] = useState(null);
  const [isSeriesDataLoading, setIsSeriesDataLoading] = useState(true);
  const [seriesDataForPageCount, setSeriesDataForPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [selectedLanguage, setSelectedLanguage] = useState(initialLang);

  // Sync when URL params change
  useEffect(() => {
    const g = searchParams.get("genre") || "All";
    const l = searchParams.get("lang") || "all";
    setSelectedGenre(g);
    setSelectedLanguage(l);
    setCurrentPage(1);
  }, [searchParams]);

  const updateFilters = useCallback(
    (newGenre, newLang) => {
      const params = {};
      if (newGenre && newGenre.toLowerCase() !== "all") {
        params.genre = newGenre;
      }
      if (newLang && newLang.toLowerCase() !== "all") {
        params.lang = newLang;
      }
      setSearchParams(params);
    },
    [setSearchParams]
  );

  const handleSetGenre = (genre) => {
    setSelectedGenre(genre);
    updateFilters(genre, selectedLanguage);
  };

  const handleSetLanguage = (lang) => {
    setSelectedLanguage(lang);
    updateFilters(selectedGenre, lang);
  };

  const handleResetFilters = () => {
    setSelectedGenre("All");
    setSelectedLanguage("all");
    setSearchParams({});
  };

  // FETCH SERIES DATA
  useEffect(() => {
    setIsSeriesDataLoading(true);
    window.scrollTo(0, 0);

    const apiParams = {
      sort_by: "updated_on:desc",
      page: currentPage,
      page_size: 40,
    };

    if (selectedGenre && selectedGenre.toLowerCase() !== "all") {
      apiParams.genre = selectedGenre;
    }
    if (selectedLanguage && selectedLanguage.toLowerCase() !== "all") {
      apiParams.language = selectedLanguage;
    }

    axios
      .get(`${BASE}/api/tvshows`, { params: apiParams })
      .then((response) => {
        const tvList = response.data.tv_shows || [];
        setSeries(tvList);
        if (tvList.length > 0) setFeaturedSeries(tvList[0]);
        setSeriesDataForPageCount(response.data.total_count || tvList.length);
        setIsSeriesDataLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching series:", error);
        setIsSeriesDataLoading(false);
      });
  }, [currentPage, selectedGenre, selectedLanguage, BASE]);

  // Local filter fallback
  const filteredSeries = React.useMemo(() => {
    if (!Array.isArray(series)) return [];
    return series.filter((s) => {
      // 1. Genre
      if (selectedGenre && selectedGenre.toLowerCase() !== "all") {
        const targetG = selectedGenre.toLowerCase();
        const sGenres = Array.isArray(s.genres)
          ? s.genres.map((g) => String(g).toLowerCase())
          : [];
        const titleStr = String(s.title || "").toLowerCase();
        const genreMatched =
          sGenres.some((g) => g.includes(targetG) || targetG.includes(g)) ||
          titleStr.includes(targetG);
        if (!genreMatched) return false;
      }

      // 2. Language
      if (selectedLanguage && selectedLanguage.toLowerCase() !== "all") {
        const targetL = selectedLanguage.toLowerCase();
        const sLangs = Array.isArray(s.languages)
          ? s.languages.map((l) => String(l).toLowerCase())
          : [];
        const titleStr = String(s.title || "").toLowerCase();

        if (targetL === "dual") {
          const isDual =
            sLangs.some((l) => l.includes("dual")) ||
            titleStr.includes("dual");
          if (!isDual) return false;
        } else if (targetL === "south") {
          const southLangs = ["ta", "te", "ml", "kn", "tamil", "telugu", "malayalam", "kannada"];
          if (!sLangs.some((l) => southLangs.includes(l))) return false;
        } else {
          if (!sLangs.some((l) => l.includes(targetL)) && !titleStr.includes(targetL)) return false;
        }
      }

      return true;
    });
  }, [series, selectedGenre, selectedLanguage]);

  const hasActiveFilters =
    (selectedGenre && selectedGenre.toLowerCase() !== "all") ||
    (selectedLanguage && selectedLanguage.toLowerCase() !== "all");

  return (
    <div className="pb-16 md:pb-10 pt-16">
      {/* SEO SECTION */}
      <SEO
        title={`Browse ${selectedGenre !== "All" ? `${selectedGenre} ` : ""}TV Series & Web Shows Online - Stream Free - ${SITENAME}`}
        description={`Explore full seasons of top TV Series, Web Shows, and Hindi originals on ${SITENAME}. Stream in 4K UHD and 1080p HD.`}
        name={SITENAME}
        type="website"
        keywords="watch tv series online, stream web shows free, filmy4uhd series, hindi web series"
        link={`https://${SITENAME.toLowerCase()}.site/series`}
      />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 space-y-8 mt-4">
        {/* ── Category & Genre Filter Pills Bar ── */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
              <BiFilterAlt className="text-amber-400 text-sm" />
              <span>Select Category / Genre</span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
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
                selectedGenre.toLowerCase() === genre.toLowerCase();
              return (
                <button
                  key={genre}
                  onClick={() => handleSetGenre(genre)}
                  className={`px-4 py-2 rounded-full text-xs font-black tracking-wide shrink-0 transition-all duration-200 border ${
                    isSelected
                      ? "bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)] scale-105"
                      : "bg-slate-900/80 text-slate-300 border-white/10 hover:border-amber-400/40 hover:text-white"
                  }`}
                >
                  {genre}
                </button>
              );
            })}
          </div>

          {/* Language Pills Row */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 pb-1">
            {LANGUAGE_LIST.map((lang) => {
              const isSelected =
                selectedLanguage.toLowerCase() === lang.value.toLowerCase();
              return (
                <button
                  key={lang.value}
                  onClick={() => handleSetLanguage(lang.value)}
                  className={`px-3.5 py-1 rounded-full text-[0.72rem] font-bold shrink-0 transition-all duration-200 border ${
                    isSelected
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-400/60 shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                      : "bg-slate-950/60 text-slate-400 border-white/5 hover:border-white/20 hover:text-slate-200"
                  }`}
                >
                  {lang.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Featured Series Hero Banner (only when no restrictive filter is active) ── */}
        {!hasActiveFilters && featuredSeries && (
          <div className="relative rounded-3xl overflow-hidden bg-[#0A0D15] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] min-h-[320px] sm:min-h-[400px] flex items-end">
            <img
              src={featuredSeries.backdrop || featuredSeries.poster}
              alt={featuredSeries.title}
              className="absolute inset-0 w-full h-full object-cover object-center md:object-right-top"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#06080D] via-[#06080D]/85 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#06080D] via-[#06080D]/40 to-transparent" />

            <div className="relative z-10 p-6 sm:p-10 max-w-2xl space-y-3">
              <h2 className="text-3xl sm:text-5xl font-black text-white uppercase drop-shadow-md">
                {featuredSeries.title}
              </h2>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-300">
                <span>{featuredSeries.genres?.[0] || "Thriller"}</span>
                <span>•</span>
                <span>{featuredSeries.release_year || "2026"}</span>
                <span>•</span>
                <span>{featuredSeries.total_seasons || 1} Seasons</span>
                <span>•</span>
                <span className="bg-white/10 px-2 py-0.5 rounded text-[0.68rem] text-amber-300">A</span>
              </div>
              {featuredSeries.description && (
                <p className="text-slate-300 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3 leading-relaxed max-w-lg">
                  {featuredSeries.description}
                </p>
              )}
              <div className="pt-2">
                <Link
                  to={`/ser/${featuredSeries.tmdb_id}`}
                  className="btn-gold inline-flex items-center gap-2 px-7 py-3 text-xs sm:text-sm font-black shadow-[0_0_25px_rgba(245,158,11,0.5)] hover:scale-105"
                >
                  <BsPlayFill className="text-xl" />
                  <span>Watch Now</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ── Popular Series Section ── */}
        <div>
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
            <div>
              <h2 className="section-title text-xl md:text-2xl font-black">
                {selectedGenre !== "All" ? `${selectedGenre} Series` : "Popular Series"}
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Showing {filteredSeries.length} shows available
              </p>
            </div>
          </div>

          {!isSeriesDataLoading ? (
            filteredSeries.length > 0 ? (
              <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 blgxl:grid-cols-6 xl:grid-cols-7 gap-3.5 sm:gap-4 md:gap-5">
                {filteredSeries.map((s, index) => (
                  <MovieCard key={s.tmdb_id || index} movie={s} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-3xl bg-slate-900/30 border border-white/5 space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-3xl shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                  📺
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  No series found in this category
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md">
                  We couldn't find any TV shows matching{" "}
                  <span className="text-amber-400 font-bold">{selectedGenre}</span>. Try selecting another category or reset filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="btn-gold px-6 py-2.5 rounded-full text-xs font-black shadow-lg"
                >
                  Show All Series
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

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          total={seriesDataForPageCount}
          pagesNum={Math.ceil((seriesDataForPageCount || 1) / 40)}
          onPageChange={(p) => setCurrentPage(p)}
          limit={40}
        />
      </div>
    </div>
  );
}
