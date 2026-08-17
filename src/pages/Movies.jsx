// src/pages/Movies.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import MoviesAndSeriesSections from "../components/MoviesAndSeriesSections";
import Pagination from "../components/Pagination";
import SEO from "../components/SEO";
import { BASE_URL as BASE } from "../config/api";

export default function Movies() {
  const SITENAME = import.meta.env.VITE_SITENAME || "Filmy4uhd";
  const [searchParams, setSearchParams] = useSearchParams();

  // URL query params
  const initialGenre = searchParams.get("genre") || "All";
  const initialLang = searchParams.get("lang") || "all";

  // States
  const [movies, setMovies] = useState([]);
  const [isMoviesDataLoading, setIsMoviesDataLoading] = useState(true);
  const [moviesDataForPageCount, setMoviesDataForPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [movieFilter, setMovieFilter] = useState("updated_on");
  const [movieFilterVal, setMovieFilterVal] = useState("updated_on");
  const [activeGenre, setActiveGenreState] = useState(initialGenre);
  const [activeLanguage, setActiveLanguageState] = useState(initialLang);

  // Sync state when URL params change
  useEffect(() => {
    const g = searchParams.get("genre") || "All";
    const l = searchParams.get("lang") || "all";
    setActiveGenreState(g);
    setActiveLanguageState(l);
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
    setActiveGenreState(genre);
    updateFilters(genre, activeLanguage);
  };

  const handleSetLanguage = (lang) => {
    setActiveLanguageState(lang);
    updateFilters(activeGenre, lang);
  };

  const handleResetFilters = () => {
    setActiveGenreState("All");
    setActiveLanguageState("all");
    setSearchParams({});
  };

  // FETCH MOVIE DATA SECTION
  useEffect(() => {
    setIsMoviesDataLoading(true);
    window.scrollTo(0, 0);

    const apiParams = {
      sort_by: `${movieFilter}:desc`,
      page: currentPage,
      page_size: 40, // Increased page size for rich catalog browsing
    };

    if (activeGenre && activeGenre.toLowerCase() !== "all") {
      apiParams.genre = activeGenre;
    }
    if (activeLanguage && activeLanguage.toLowerCase() !== "all") {
      apiParams.language = activeLanguage;
    }

    axios
      .get(`${BASE}/api/movies`, { params: apiParams })
      .then((response) => {
        const list = response.data.movies || [];
        setMovies(list);
        setMoviesDataForPageCount(response.data.total_count || list.length);
        setIsMoviesDataLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
        setIsMoviesDataLoading(false);
      });
  }, [movieFilter, currentPage, activeGenre, activeLanguage, BASE]);

  return (
    <div>
      {/* SEO SECTION */}
      <SEO
        title={`Browse ${activeGenre !== "All" ? `${activeGenre} ` : ""}Movies Online - Watch Free HD Movies - ${SITENAME}`}
        description={`Explore the full catalog of ${activeGenre !== "All" ? `${activeGenre} ` : ""}movies online on ${SITENAME}. Find latest action, comedy, horror, romance, and sci-fi movies, filter by rating and release date, and stream in full HD quality.`}
        name={SITENAME}
        type="website"
        keywords="watch movies online, free movies online, HD movie streaming, stream latest movies, free movie website"
        link={`https://${SITENAME.toLowerCase()}.site/movies`}
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
        activeGenre={activeGenre}
        setActiveGenre={handleSetGenre}
        activeLanguage={activeLanguage}
        setActiveLanguage={handleSetLanguage}
        onResetFilters={handleResetFilters}
      />

      {/* Call Pagination Component */}
      <Pagination
        currentPage={currentPage}
        total={moviesDataForPageCount}
        pagesNum={Math.ceil((moviesDataForPageCount || 1) / 40)}
        onPageChange={(p) => {
          setCurrentPage(p);
        }}
        limit={40}
      />
    </div>
  );
}
