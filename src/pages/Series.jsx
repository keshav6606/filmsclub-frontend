// src/pages/Series.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { BsPlayFill } from "react-icons/bs";
import { PiStarFill } from "react-icons/pi";
import { HiSparkles } from "react-icons/hi2";
import Pagination from "../components/Pagination";
import MovieCard from "../components/MovieCard";
import MovieCardSkeleton from "../components/MovieCardSkeleton";
import SEO from "../components/SEO";
import { BASE_URL as BASE } from "../config/api";

const GENRES = ["All", "Drama", "Thriller", "Comedy", "Romance", "Action", "Crime"];

export default function Series() {
  const SITENAME = import.meta.env.VITE_SITENAME || "Filmy4uhd";

  // States
  const [series, setSeries] = useState([]);
  const [featuredSeries, setFeaturedSeries] = useState(null);
  const [isSeriesDataLoading, setIsSeriesDataLoading] = useState(true);
  const [seriesDataForPageCount, setSeriesDataForPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState("All");

  // FETCH SERIES DATA
  useEffect(() => {
    setIsSeriesDataLoading(true);
    window.scrollTo(0, 0);

    axios
      .get(`${BASE}/api/tvshows`, {
        params: {
          sort_by: "updated_on:desc",
          page: currentPage,
          page_size: 20,
        },
      })
      .then((response) => {
        const tvList = response.data.tv_shows || [];
        setSeries(tvList);
        if (tvList.length > 0) setFeaturedSeries(tvList[0]);
        setSeriesDataForPageCount(response.data.total_count || 0);
        setIsSeriesDataLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching series:", error);
        setIsSeriesDataLoading(false);
      });
  }, [currentPage, BASE]);

  // Local filter by genre
  const filteredSeries = React.useMemo(() => {
    if (selectedGenre === "All") return series;
    const lower = selectedGenre.toLowerCase();
    return series.filter((s) => {
      const gStr = `${s.genres?.join(" ") || ""} ${s.title || ""}`.toLowerCase();
      return gStr.includes(lower);
    });
  }, [series, selectedGenre]);

  return (
    <div className="pb-16 md:pb-10 pt-16">
      {/* SEO SECTION */}
      <SEO
        title={`Browse TV Series & Web Shows Online - Stream Free - ${SITENAME}`}
        description={`Explore full seasons of top TV Series, Web Shows, and Hindi originals on ${SITENAME}. Stream in 4K UHD and 1080p HD.`}
        name={SITENAME}
        type="website"
        keywords="watch tv series online, stream web shows free, filmy4uhd series, hindi web series"
        link={`https://${SITENAME.toLowerCase()}.site/series`}
      />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 space-y-8 mt-4">
        {/* ── Screen 4: Genre Filter Pills Bar ── */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-5 py-2 rounded-full text-xs font-black tracking-wide shrink-0 transition-all duration-200 border ${
                selectedGenre === genre
                  ? "bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)] scale-105"
                  : "bg-slate-900/80 text-slate-300 border-white/10 hover:border-amber-400/40 hover:text-white"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* ── Screen 4: Featured Series Hero Banner ── */}
        {featuredSeries && (
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

        {/* ── Screen 4: Popular Series Section ── */}
        <div>
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
            <h2 className="section-title text-xl md:text-2xl font-black">
              Popular Series
            </h2>
          </div>

          {!isSeriesDataLoading ? (
            <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 blgxl:grid-cols-6 xl:grid-cols-7 gap-3.5 sm:gap-4 md:gap-5">
              {filteredSeries.map((s, index) => (
                <MovieCard key={s.tmdb_id || index} movie={s} />
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

        {/* ── Screen 4: New Episodes Section ── */}
        <div>
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
            <h2 className="section-title text-xl md:text-2xl font-black">
              New Episodes
            </h2>
          </div>

          <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 blgxl:grid-cols-6 xl:grid-cols-7 gap-3.5 sm:gap-4 md:gap-5">
            {series.slice(0, 7).map((s, idx) => (
              <MovieCard key={`new-ep-${s.tmdb_id || idx}`} movie={s} badgeText="New Ep" />
            ))}
          </div>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          total={seriesDataForPageCount}
          pagesNum={Math.ceil(seriesDataForPageCount / 20)}
          onPageChange={(p) => setCurrentPage(p)}
          limit={20}
        />
      </div>
    </div>
  );
}
