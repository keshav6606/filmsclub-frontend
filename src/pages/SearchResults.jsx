import React, { useState, useEffect } from "react";
import axios from "axios";
import MoviesAndSeriesSections from "../components/MoviesAndSeriesSections";
import Pagination from "../components/Pagination";
import { useParams, Link } from "react-router-dom";
import SEO from "../components/SEO";
import { BASE_URL as BASE } from "../config/api";
import { loadSearchIndex, searchTitles } from "../yupflix/services/yupflixSearch";
import { YupflixCard } from "../yupflix/components/YupflixCard";
import { RiMovie2Fill } from "react-icons/ri";

export default function SearchResults() {
  const SITENAME = import.meta.env.VITE_SITENAME || "Filmy4uhd";

  // States
  const [movies, setMovies] = useState([]);
  const [scrapedResults, setScrapedResults] = useState([]);
  const [isMoviesDataLoading, setIsMoviesDataLoading] = useState(true);
  const [moviesDataForPageCount, setMoviesDataForPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const { searchResult = "" } = useParams();

  // Load scraped index in background
  useEffect(() => {
    loadSearchIndex()
      .then(() => {
        if (searchResult) {
          const matches = searchTitles(searchResult, 30);
          setScrapedResults(matches);
        }
      })
      .catch(() => {});
  }, [searchResult]);

  // Fetch Database Movie Data Section
  useEffect(() => {
    setIsMoviesDataLoading(true);
    window.scrollTo(0, 0);

    axios
      .get(`${BASE}/api/search/`, {
        params: {
          query: searchResult,
          page: currentPage,
          page_size: 20,
        },
      })
      .then((response) => {
        setMovies(response.data.results || []);
        setMoviesDataForPageCount(response.data.total_count || 0);
        setIsMoviesDataLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching movie data:", error);
        setMovies([]);
        setIsMoviesDataLoading(false);
      });
  }, [searchResult, currentPage, BASE]);

  return (
    <div className="pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* SEO SECTION */}
      <SEO
        title={`Search Results for "${searchResult}" - ${SITENAME}`}
        description={`Watch movies and TV series matching "${searchResult}" online for free in 4K & HD quality on ${SITENAME}.`}
        name={SITENAME}
        type="website"
        keywords={`search ${searchResult}, ${searchResult} movies, watch ${searchResult} online`}
        link={`https://${SITENAME}.com/search/${encodeURIComponent(searchResult)}`}
      />

      {/* Database Results Section */}
      <div className="mt-4">
        <MoviesAndSeriesSections
          movieData={movies}
          isMovieDataLoading={isMoviesDataLoading}
          dataType="searchResult"
          sectionTitle={`Database Results: "${searchResult}"`}
        />

        {/* Pagination Component for Database Results */}
        {moviesDataForPageCount > 20 && (
          <Pagination
            currentPage={currentPage}
            total={moviesDataForPageCount}
            pagesNum={Math.ceil(moviesDataForPageCount / 20)}
            onPageChange={(p) => setCurrentPage(p)}
            limit={20}
          />
        )}
      </div>

      {/* Scraped Catalog VIP Results Section */}
      {scrapedResults.length > 0 && (
        <section className="mt-14 mb-8 pt-8 border-t border-white/10">
          <div className="flex items-center justify-between mb-6 px-1">
            <div className="flex items-center gap-2.5">
              <RiMovie2Fill className="text-red-500 text-xl" />
              <h2 className="font-outfit font-black text-xl sm:text-2xl text-white">
                FilmsClub VIP Catalog Matches ({scrapedResults.length})
              </h2>
            </div>
            <Link
              to="/filmsclub"
              className="text-xs font-bold text-zinc-400 hover:text-white px-3 py-1 rounded-full bg-white/5 border border-white/10"
            >
              Browse All VIP
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4">
            {scrapedResults.map((item) => (
              <YupflixCard key={item.code} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Empty State when zero results found on both sides */}
      {!isMoviesDataLoading && movies.length === 0 && scrapedResults.length === 0 && (
        <div className="py-24 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-white/5 mx-auto flex items-center justify-center text-2xl text-slate-400">
            🔍
          </div>
          <h3 className="text-xl font-bold text-white">No matches found for "{searchResult}"</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Try checking for typos or browse our full collection by category, platform, or year.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              to="/movies"
              className="px-5 py-2.5 rounded-full bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 transition-colors"
            >
              Browse Movies
            </Link>
            <Link
              to="/filmsclub"
              className="px-5 py-2.5 rounded-full bg-white/10 text-white font-bold text-xs hover:bg-white/20 transition-colors"
            >
              Browse VIP FilmsClub
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
