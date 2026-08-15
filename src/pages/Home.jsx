import React, { useState, useEffect } from "react";
import axios from "axios";
import HeroSlider from "../components/HomeHero";
import HomeSections from "../components/HomeSections";
import PopularCategories from "../components/PopularCategories";
import SEO from "../components/SEO";
import AdBanner from "../components/AdBanner";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL as BASE } from "../config/api";

export default function Home() {
  const SITENAME = import.meta.env.VITE_SITENAME || "Filmy4uhd";

  // States
  const [heroPopularMovies, setHeroPopularMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [recentlyAdded, setRecentlyAdded] = useState([]);
  const [trendingTv, setTrendingTv] = useState([]);
  const [isHeroLoading, setIsHeroLoading] = useState(true);
  const [isTrendingMoviesLoading, setIsTrendingMoviesLoading] = useState(true);
  const [isRecentlyAddedLoading, setIsRecentlyAddedLoading] = useState(true);
  const [isTrendingTvLoading, setIsTrendingTvLoading] = useState(true);

  // 1. Featured Movies for Hero
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

  // 2. Trending Now
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

  // 3. Recently Added Drops
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

  // 4. Trending TV Shows
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
    <div className="pb-16 md:pb-10">
      <ToastContainer style={{ fontSize: "0.8rem" }} />
      {/* SEO SECTION */}
      <SEO
        title={`${SITENAME} - Watch 4K UHD Movies & Series Online`}
        description={`Stream and download latest 4K Ultra HD & 1080p Full HD movies, TV shows, and dual audio releases for free on ${SITENAME}.`}
        name={SITENAME}
        type="website"
        keywords="watch movies online, watch hd movies, free 4k streaming, filmy4uhd, hindi dubbed movies, nextplayer"
        link={`https://${SITENAME.toLowerCase()}.site`}
      />

      {/* ── Screen 1: 1. Featured Blockbuster Hero ── */}
      <HeroSlider
        movieData={heroPopularMovies}
        isMovieDataLoading={isHeroLoading}
      />

      {/* ── Screen 1: 2. Trending Now Section ── */}
      <HomeSections
        movieData={trendingMovies}
        isMovieDataLoading={isTrendingMoviesLoading}
        sectionTitle="Trending Now"
        sectionSeeMoreButtonLink="/movies"
      />

      {/* ── Screen 1: 3. Popular Categories ── */}
      <PopularCategories />

      {/* ── Screen 1: 4. Recently Added Drops ── */}
      <HomeSections
        movieData={recentlyAdded}
        isMovieDataLoading={isRecentlyAddedLoading}
        sectionTitle="Recently Added"
        sectionSeeMoreButtonLink="/movies"
      />

      {/* Ad Banner */}
      <AdBanner slot="5754054742" />

      {/* ── Screen 1: 5. Popular Series Section ── */}
      <HomeSections
        movieData={trendingTv}
        isMovieDataLoading={isTrendingTvLoading}
        sectionTitle="Popular Series"
        sectionSeeMoreButtonLink="/series"
      />
    </div>
  );
}
