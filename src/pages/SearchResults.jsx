import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import SEO from "../components/SEO";
import { BASE_URL as BASE } from "../config/api";
import { loadSearchIndex, searchTitles } from "../yupflix/services/yupflixSearch";
import { YupflixCard } from "../yupflix/components/YupflixCard";
import MovieCard from "../components/MovieCard";
import AdBanner from "../components/AdBanner";
import { RiMovie2Fill, RiSearchEyeLine } from "react-icons/ri";
import { HiSparkles, HiOutlineFilm, HiOutlineTv } from "react-icons/hi2";

export default function SearchResults() {
  const SITENAME = import.meta.env.VITE_SITENAME || "Filmy4UHD";
  const { searchResult = "" } = useParams();

  // States
  const [dbMovies, setDbMovies] = useState([]);
  const [scrapedResults, setScrapedResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all"); // 'all' | 'movie' | 'series' | '4k'

  // 1. Search Scraped Catalog (19,000+ titles)
  useEffect(() => {
    loadSearchIndex()
      .then(() => {
        if (searchResult) {
          const matches = searchTitles(searchResult, 60);
          setScrapedResults(matches);
        }
      })
      .catch(() => {});
  }, [searchResult]);

  // 2. Search Database Movies
  useEffect(() => {
    setIsLoading(true);
    window.scrollTo(0, 0);

    axios
      .get(`${BASE}/api/search/`, {
        params: {
          query: searchResult,
          page: 1,
          page_size: 40,
        },
      })
      .then((response) => {
        setDbMovies(response.data.results || []);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching database movie data:", error);
        setDbMovies([]);
        setIsLoading(false);
      });
  }, [searchResult, BASE]);

  // 3. Unified and Deduplicated Results List
  const unifiedResults = useMemo(() => {
    const list = [];
    const seenTitles = new Set();

    // Add Database items first
    for (const item of dbMovies) {
      const cleanTitle = (item.title || "").toLowerCase().trim();
      if (!seenTitles.has(cleanTitle)) {
        seenTitles.add(cleanTitle);
        list.push({ ...item, isDatabase: true });
      }
    }

    // Add Scraped items
    for (const item of scrapedResults) {
      const cleanTitle = (item.title || "").toLowerCase().trim();
      if (!seenTitles.has(cleanTitle)) {
        seenTitles.add(cleanTitle);
        list.push({ ...item, isScraped: true });
      }
    }

    return list;
  }, [dbMovies, scrapedResults]);

  // 4. Filtered Results by Type Pill
  const filteredResults = useMemo(() => {
    if (activeFilter === "all") return unifiedResults;
    if (activeFilter === "movie") {
      return unifiedResults.filter(
        (i) => i.media_type === "movie" || i.type === "movie"
      );
    }
    if (activeFilter === "series") {
      return unifiedResults.filter(
        (i) => i.media_type === "series" || i.type === "series" || !!i.latestLabel
      );
    }
    if (activeFilter === "4k") {
      return unifiedResults.filter(
        (i) =>
          i.rip?.includes("4K") ||
          i.rip?.includes("2160p") ||
          i.qualities?.includes("2160p") ||
          i.genres?.some((g) => g.toLowerCase().includes("4k"))
      );
    }
    return unifiedResults;
  }, [unifiedResults, activeFilter]);

  const movieCount = unifiedResults.filter(
    (i) => i.media_type === "movie" || i.type === "movie"
  ).length;
  const seriesCount = unifiedResults.filter(
    (i) => i.media_type === "series" || i.type === "series" || !!i.latestLabel
  ).length;

  return (
    <div className="pb-24 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 pt-20 sm:pt-24 min-h-screen bg-[#05070B]">
      {/* SEO */}
      <SEO
        title={`Search Results for "${searchResult}" - ${SITENAME}`}
        description={`Watch movies and TV series matching "${searchResult}" online in 4K & HD quality on ${SITENAME}.`}
        name={SITENAME}
        type="website"
        keywords={`search ${searchResult}, ${searchResult} movies, watch ${searchResult} online`}
        link={`https://${SITENAME}.com/search/${encodeURIComponent(searchResult)}`}
      />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 font-outfit font-black text-xs uppercase tracking-wider mb-2">
            <RiSearchEyeLine className="text-base" />
            UNIFIED CINEMA SEARCH
          </div>
          <h1 className="text-2xl sm:text-4xl font-outfit font-black tracking-tight text-white flex items-center gap-3">
            Results for <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">"{searchResult}"</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Found {unifiedResults.length} master-grade titles across all streaming channels and cinema library.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#0E131F] p-1.5 rounded-2xl border border-white/[0.08] text-xs font-outfit overflow-x-auto no-sb shrink-0">
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className={`px-3.5 py-1.5 rounded-xl transition-all font-bold whitespace-nowrap ${
              activeFilter === "all"
                ? "bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 font-black shadow-[0_0_15px_rgba(0,242,254,0.5)]"
                : "text-slate-300 hover:text-white"
            }`}
          >
            All ({unifiedResults.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("movie")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all font-bold whitespace-nowrap ${
              activeFilter === "movie"
                ? "bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 font-black shadow-[0_0_15px_rgba(0,242,254,0.5)]"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <HiOutlineFilm /> Movies ({movieCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("series")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all font-bold whitespace-nowrap ${
              activeFilter === "series"
                ? "bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 font-black shadow-[0_0_15px_rgba(0,242,254,0.5)]"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <HiOutlineTv /> Series ({seriesCount})
          </button>
        </div>
      </div>

      {/* Ad Banner Above Search Results */}
      <AdBanner slot="5754054742" className="my-6" />

      {/* Results Grid */}
      {filteredResults.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4 sm:gap-6">
            {filteredResults.map((item) => (
              <YupflixCard
                key={item.code ? `scraped-${item.code}` : `db-${item.tmdb_id}`}
                item={item}
              />
            ))}
          </div>

          {/* Ad Banner Below Search Results */}
          <AdBanner slot="7317709042" className="my-10" />
        </>
      ) : isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[2/3] rounded-2xl bg-[#0E131F] shimmer-effect border border-white/5"
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-24 text-center space-y-4 rounded-3xl bg-[#0B0F19]/80 border border-white/5 p-8 max-w-xl mx-auto backdrop-blur-xl">
          <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-400/30 mx-auto flex items-center justify-center text-3xl text-cyan-400 shadow-[0_0_20px_rgba(0,242,254,0.2)]">
            🎬
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white font-outfit">
            No matches found for "{searchResult}"
          </h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Try checking your spelling, or explore our top streaming channels and popular genres.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <Link
              to="/movies"
              className="btn-cinema-primary px-7 py-3 rounded-full text-xs shadow-lg font-outfit"
            >
              Explore Movies
            </Link>
            <Link
              to="/filmsclub"
              className="btn-cinema-frosted px-6 py-3 rounded-full text-xs font-outfit"
            >
              Browse Streaming Channels
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
