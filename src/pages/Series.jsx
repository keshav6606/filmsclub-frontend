// src/pages/Series.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "../components/Pagination";
import MoviesAndSeriesSections from "../components/MoviesAndSeriesSections";
import SEO from "../components/SEO"; // import SEO

export default function Series() {
  const BASE = import.meta.env.VITE_BASE_URL; // Base URL for backend
  const SITENAME = import.meta.env.VITE_SITENAME;


  // States
  const [series, setSeries] = useState([]);
  const [isSeriesDataLoading, setIsSeriesDataLoading] = useState(true); 
  const [seriesDataForPageCount, setSeriesDataForPageCount] = useState("");
  const [currentPage, setCurrentPage] = useState(1); 
  const [seriesFilter, setSeriesFilter] = useState("updated_on"); 
  const [seriesFilterVal, setSeriesFilterVal] = useState("updated_on"); 

  // FETCH SERIES DATA SECTION
  useEffect(() => {
    setIsSeriesDataLoading(true); 
    window.scrollTo(0, 0); 

    axios.get(`${BASE}/api/tvshows`, {
      params: {
        sort_by: `${seriesFilter}:desc`,
        page: currentPage,
        page_size: 20
      }
    })
    .then(response => {
      setSeries(response.data.tv_shows);
      setSeriesDataForPageCount(response.data.total_count);
      setIsSeriesDataLoading(false); 
    })
    .catch(error => {
      console.error("Error fetching series:", error);
      setIsSeriesDataLoading(false); // Set loading state to false even if there is an error
    });
  }, [seriesFilter, currentPage, BASE]); // Added BASE as a dependency

  return (
    <div>
      {/* SEO SECTION */}
      <SEO
        title={`Browse TV Series & Web Shows Online - Stream free - ${SITENAME}`}
        description={`Explore the full catalog of TV Series, Web Shows, and Anime seasons on ${SITENAME}. Stream the latest releases, filter by updated date, and watch seasons and episodes in high quality.`}
        name={SITENAME}
        type="website"
        keywords="watch tv series online, stream web shows free, watch tv shows online free, free tv shows website"
        link={`https://${SITENAME}.com/Series`}
      />
      {/* Series component */}
      <MoviesAndSeriesSections
        movieData={series}
        isMovieDataLoading={isSeriesDataLoading}
        dataType="series"
        sectionTitle="Browse Series"
        setMovieFilter={setSeriesFilter}
        movieFilterVal={seriesFilterVal}
        setMovieFilterVal={setSeriesFilterVal}
      />

      {/* Call Pagination Component */}
      <Pagination
        currentPage={currentPage}
        total={seriesDataForPageCount} 
        pagesNum={Math.ceil(seriesDataForPageCount / 20)} 
        onPageChange={(p) => {
          setCurrentPage(p); 
        }}
        limit={20}
      />
    </div>
  );
}
