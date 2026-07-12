import React, { useState, useEffect } from "react";
import axios from "axios";
import MoviesAndSeriesSections from "../components/MoviesAndSeriesSections";
import Pagination from "../components/Pagination";
import { useParams } from "react-router-dom";
import SEO from "../components/SEO"; // import SEO

export default function SimilarMovies() {
  const BASE = import.meta.env.VITE_BASE_URL; // Base URL for backend
  const SITENAME = import.meta.env.VITE_SITENAME;


  // States
  const [movies, setMovies] = useState([]);
  const [isMoviesDataLoading, setIsMoviesDataLoading] = useState(true);
  const [moviesDataForPageCount, setMoviesDataForPageCount] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  let { searchResult } = useParams();

  // Fetch Movie Data Section
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
        setMovies(response.data.results);
        setMoviesDataForPageCount(response.data.total_count);
        setIsMoviesDataLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching movie data:", error);
        setIsMoviesDataLoading(false);
      });
  }, [searchResult, currentPage, BASE]);

  return (
    <div>
      {/* SEO SECTION */}
      <SEO
        title={`Search Results for "${searchResult}" - ${SITENAME}`}
        description={`Watch movies and TV series matching "${searchResult}" online for free in HD quality on ${SITENAME}.`}
        name={SITENAME}
        type="website"
        keywords={`search ${searchResult}, ${searchResult} movies, watch ${searchResult} online`}
        link={`https://${SITENAME}.com/search/${encodeURIComponent(searchResult)}`}
      />
      {/* Movies Component */}
      <MoviesAndSeriesSections
        movieData={movies}
        isMovieDataLoading={isMoviesDataLoading}
        dataType="searchResult"
        sectionTitle={`results for : ${searchResult}`}
      />
      {/* Pagination Component */}
      <Pagination
        currentPage={currentPage}
        total={moviesDataForPageCount} 
        pagesNum={Math.ceil(moviesDataForPageCount / 20)} 
        onPageChange={(p) => {
          setCurrentPage(p); 
        }}
        limit={20}
      />
    </div>
  );
}
