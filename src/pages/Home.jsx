import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import HeroSlider from "../components/HomeHero";
import CinemaQuickDock from "../components/CinemaQuickDock";
import InteractiveOTTHub from "../components/InteractiveOTTHub";
import HomeSections from "../components/HomeSections";
import PopularCategories from "../components/PopularCategories";
import ContinueWatching from "../components/ContinueWatching";
import SEO from "../components/SEO";
import AdBanner from "../components/AdBanner";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL as BASE } from "../config/api";

// Unified Catalog components & data
import { RankedRail, YupflixRail } from "../yupflix/components/YupflixPlatformFilter";
import { yupflixApi } from "../yupflix/services/yupflixApi";
import homeFallback from "../yupflix/data/home.json";
import browseMovieFallback from "../yupflix/data/browse_movie.json";

export default function Home() {
  const SITENAME = import.meta.env.VITE_SITENAME || "FilmsClub";

  // Backend Database States
  const [heroPopularMovies, setHeroPopularMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [recentlyAdded, setRecentlyAdded] = useState([]);
  const [trendingTv, setTrendingTv] = useState([]);
  const [isHeroLoading, setIsHeroLoading] = useState(true);
  const [isTrendingMoviesLoading, setIsTrendingMoviesLoading] = useState(true);
  const [isRecentlyAddedLoading, setIsRecentlyAddedLoading] = useState(true);
  const [isTrendingTvLoading, setIsTrendingTvLoading] = useState(true);

  // Scraped / OTT Catalog States
  const [yupflixHome, setYupflixHome] = useState(homeFallback);
  const [scrapedMovies, setScrapedMovies] = useState(browseMovieFallback.items || []);

  // Fetch Scraped Live Catalog
  useEffect(() => {
    yupflixApi.home()
      .then((data) => {
        if (data?.trending?.length) setYupflixHome(data);
      })
      .catch(() => {});
  }, []);

  // 1. Featured Movies for Hero (Database)
  useEffect(() => {
    setIsHeroLoading(true);
    window.scrollTo(0, 0);
    axios
      .get(`${BASE}/api/movies`, {
        params: {
          sort_by: "release_year:desc",
          page: 1,
          page_size: 10,
        },
      })
      .then((response) => {
        setHeroPopularMovies(response.data.movies || []);
        setIsHeroLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching hero popular movies:", error);
        setIsHeroLoading(false);
      });
  }, [BASE]);

  // Combined Hero Movies: Mix database blockbusters with top OTT trending drops
  const combinedHeroMovies = [
    ...heroPopularMovies,
    ...(yupflixHome?.trending?.slice(0, 5) || [])
  ];

  // 2. Trending Now (Database)
  useEffect(() => {
    setIsTrendingMoviesLoading(true);
    axios
      .get(`${BASE}/api/movies`, {
        params: {
          sort_by: "rating:desc",
          page: 1,
          page_size: 14,
        },
      })
      .then((response) => {
        setTrendingMovies(response.data.movies || []);
        setIsTrendingMoviesLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching trending movies:", error);
        setIsTrendingMoviesLoading(false);
      });
  }, [BASE]);

  // 3. Recently Added Drops (Database)
  useEffect(() => {
    setIsRecentlyAddedLoading(true);
    axios
      .get(`${BASE}/api/movies`, {
        params: {
          sort_by: "updated_on:desc",
          page: 1,
          page_size: 14,
        },
      })
      .then((response) => {
        setRecentlyAdded(response.data.movies || []);
        setIsRecentlyAddedLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching recently added movies:", error);
        setIsRecentlyAddedLoading(false);
      });
  }, [BASE]);

  // 4. Trending TV Shows (Database)
  useEffect(() => {
    setIsTrendingTvLoading(true);
    axios
      .get(`${BASE}/api/tvshows`, {
        params: {
          sort_by: "updated_on:desc",
          page: 1,
          page_size: 14,
        },
      })
      .then((response) => {
        setTrendingTv(response.data.tv_shows || []);
        setIsTrendingTvLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching trending TV shows:", error);
        setIsTrendingTvLoading(false);
      });
  }, [BASE]);

  return (
    <div className="pb-20 md:pb-16 bg-[#05070B] overflow-x-hidden min-h-screen">
      <ToastContainer style={{ fontSize: "0.85rem" }} />

      {/* Dynamic SEO */}
      <SEO
        title={`${SITENAME} - NextGen 4K UHD Movies & OTT Streaming Universe`}
        description={`Stream master-grade 4K Ultra HD movies, Netflix, Prime Video, Hotstar & TV shows online with Dolby Sound on ${SITENAME}.`}
        name={SITENAME}
        type="website"
        keywords="watch movies online, watch hd movies, free 4k streaming, filmy4uhd, hindi dubbed movies, netflix movies, prime video online"
        link={`https://${SITENAME.toLowerCase()}.site`}
      />

      {/* ── 1. NextGen Billboard Hero Slider (Unified with Database & OTT Drops) ── */}
      <HeroSlider
        movieData={combinedHeroMovies.length > 0 ? combinedHeroMovies : heroPopularMovies}
        isMovieDataLoading={isHeroLoading && combinedHeroMovies.length === 0}
      />

      {/* ── 2. Advanced Interactive Floating Platform Nebula Dock ── */}
      <CinemaQuickDock />

      {/* ── 3. Interactive OTT Streaming Hub & Live Channels (Immediate On-Page Filtering) ── */}
      <InteractiveOTTHub />

      {/* ── 4. Continue Watching (Persisted Playback Session) ── */}
      <ContinueWatching />

      {/* ── 5. Top 10 Today Ranked Rail ── */}
      {yupflixHome?.trending?.length > 0 && (
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 mt-12 md:mt-16">
          <RankedRail
            title="Top 10 Trending Today"
            items={yupflixHome.trending}
          />
        </div>
      )}

      {/* ── 6. Trending Blockbusters (Database) ── */}
      <HomeSections
        movieData={trendingMovies}
        isMovieDataLoading={isTrendingMoviesLoading}
        sectionTitle="Trending Blockbusters"
        sectionSeeMoreButtonLink="/movies?sort_by=rating:desc"
      />

      {/* ── 7. OTT Originals & Exclusive Premieres ── */}
      {yupflixHome?.trending?.length > 10 && (
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 mt-12 md:mt-16">
          <YupflixRail
            title="OTT Originals & Exclusive Premieres"
            to="/filmsclub"
            items={yupflixHome.trending.slice(10, 26)}
          />
        </div>
      )}

      {/* ── 8. Genre Circle Categories Row ── */}
      <PopularCategories />

      {/* ── 9. Fresh Cinema Drops (Database) ── */}
      <HomeSections
        movieData={recentlyAdded}
        isMovieDataLoading={isRecentlyAddedLoading}
        sectionTitle="Recently Added Premieres"
        sectionSeeMoreButtonLink="/movies?sort_by=updated_on:desc"
      />

      {/* Ad Banner Container */}
      <AdBanner slot="5754054742" />

      {/* ── 10. Binge-Worthy Series & Shows ── */}
      <HomeSections
        movieData={trendingTv}
        isMovieDataLoading={isTrendingTvLoading}
        sectionTitle="Binge-Worthy Series & Shows"
        sectionSeeMoreButtonLink="/series"
      />

      {/* ── 11. Cinema & Hindi Dubbed Exclusives ── */}
      {scrapedMovies?.length > 0 && (
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 mt-12 md:mt-16">
          <YupflixRail
            title="Cinema & Hindi Dubbed Exclusives"
            to="/filmsclub?type=movie"
            items={scrapedMovies.slice(0, 16)}
          />
        </div>
      )}
    </div>
  );
}
