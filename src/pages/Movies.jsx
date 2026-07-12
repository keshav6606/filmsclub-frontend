// src/pages/Movies.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import MoviesAndSeriesSections from "../components/MoviesAndSeriesSections";
import Pagination from "../components/Pagination";
import SEO from "../components/SEO"; // import SEO

export default function Movies() {
  const BASE = import.meta.env.VITE_BASE_URL; // Base Url for backend
  const SITENAME = import.meta.env.VITE_SITENAME;

  // States
  const [movies, setMovies] = useState([]);
  const [isMoviesDataLoading, setIsMoviesDataLoading] = useState(true);
  const [moviesDataForPageCount, setMoviesDataForPageCount] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [movieFilter, setMovieFilter] = useState("updated_on");
  const [movieFilterVal, setMovieFilterVal] = useState("updated_on");

  // FETCH MOVIE DATA SECTION
  useEffect(() => {
    setIsMoviesDataLoading(true);
    window.scrollTo(0, 0);

    axios
      .get(`${BASE}/api/movies`, {
        params: {
          sort_by: `${movieFilter}:desc`,
          page: currentPage,
          page_size: 20,
        },
      })
      .then((response) => {
        setMovies(response.data.movies);
        setMoviesDataForPageCount(response.data.total_count);
        setIsMoviesDataLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
        setIsMoviesDataLoading(false);
      });
  }, [movieFilter, currentPage, BASE]);

  return (
    <div>
      {/* SEO SECTION */}
      <SEO
        title={`Browse All Movies Online - Watch free HD Movies - ${SITENAME}`}
        description={`Explore the full catalog of movies online on ${SITENAME}. Find latest action, comedy, horror, romance, and sci-fi movies, filter by rating and release date, and stream in full HD quality.`}
        name={SITENAME}
        type="website"
        keywords="watch movies online, free movies online, HD movie streaming, stream latest movies, free movie website"
        link={`https://${SITENAME}.com/Movies`}
      />
      {/* Movies component */}
      <MoviesAndSeriesSections
        movieData={movies}
        isMovieDataLoading={isMoviesDataLoading}
        dataType="movies"
        sectionTitle="Browse Movies"
        setMovieFilter={setMovieFilter}
        movieFilterVal={movieFilterVal}
        setMovieFilterVal={setMovieFilterVal}
      />

      {/* Call Pagination Component */}
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
