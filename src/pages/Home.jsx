import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import HeroSlider from "../components/HomeHero";
import HomeSections from "../components/HomeSections";
import PopularCategories from "../components/PopularCategories";
import ContinueWatching from "../components/ContinueWatching";
import SEO from "../components/SEO";
import AdBanner from "../components/AdBanner";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL as BASE } from "../config/api";

// Scraped Catalog (FilmsClub / Yupflix) components & data
import { RankedRail, YupflixRail } from "../yupflix/components/YupflixPlatformFilter";
import { yupflixApi } from "../yupflix/services/yupflixApi";
import homeFallback from "../yupflix/data/home.json";
import browseMovieFallback from "../yupflix/data/browse_movie.json";
import { PROVIDERS } from "../yupflix/utils/yupflixHelpers";
import { RiMovie2Fill } from "react-icons/ri";

export default function Home() {
  const SITENAME = import.meta.env.VITE_SITENAME || "Filmy4uhd";

  // Backend Database States
  const [heroPopularMovies, setHeroPopularMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [recentlyAdded, setRecentlyAdded] = useState([]);
  const [trendingTv, setTrendingTv] = useState([]);
  const [isHeroLoading, setIsHeroLoading] = useState(true);
  const [isTrendingMoviesLoading, setIsTrendingMoviesLoading] = useState(true);
  const [isRecentlyAddedLoading, setIsRecentlyAddedLoading] = useState(true);
  const [isTrendingTvLoading, setIsTrendingTvLoading] = useState(true);

  // Scraped Catalog States
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
    <div className="pb-16 md:pb-10">
      <ToastContainer style={{ fontSize: "0.8rem" }} />
      {/* SEO SECTION */}
      <SEO
        title={`${SITENAME} - Watch 4K UHD Movies & OTT Series Online`}
        description={`Stream and download latest 4K Ultra HD movies, Netflix, Prime Video, Hotstar & TV shows online via NextPlayer with Dolby Sound on ${SITENAME}.`}
        name={SITENAME}
        type="website"
        keywords="watch movies online, watch hd movies, free 4k streaming, filmy4uhd, hindi dubbed movies, nextplayer, filmsclub"
        link={`https://${SITENAME.toLowerCase()}.site`}
      />

      {/* ── Screen 1: 1. Featured Blockbuster Hero ── */}
      <HeroSlider
        movieData={heroPopularMovies}
        isMovieDataLoading={isHeroLoading}
      />

      {/* ── OTT Platform Quick Channels (Scraped VIP Channels) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-8">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <RiMovie2Fill className="text-amber-400 text-lg" />
            <h2 className="font-outfit font-black text-sm sm:text-base text-white tracking-wide uppercase">
              Streaming Hubs & OTT Channels
            </h2>
          </div>
          <Link
            to="/filmsclub"
            className="text-xs font-bold text-amber-400 hover:text-amber-300 underline"
          >
            Explore VIP Library →
          </Link>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto no-sb py-1.5 px-0.5">
          {PROVIDERS.map((p) => (
            <Link
              key={p.key}
              to={`/filmsclub?prov=${p.key}`}
              className="group flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#12141c]/90 hover:bg-slate-900 border border-white/10 hover:border-amber-400/40 text-zinc-300 hover:text-white transition-all shrink-0 shadow-md"
            >
              {p.img ? (
                <img
                  src={`/providers/${p.img}.jpeg`}
                  alt=""
                  loading="lazy"
                  className="w-5 h-5 rounded-md object-cover shadow"
                />
              ) : (
                <span
                  className="w-5 h-5 rounded-md flex items-center justify-center font-black text-[10px]"
                  style={{ background: p.bg || '#222', color: p.fg || '#fff' }}
                >
                  {p.label?.slice(0, 2)}
                </span>
              )}
              <span className="font-outfit font-bold text-xs whitespace-nowrap">
                {p.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Continue Watching (Persisted Playback Row) ── */}
      <ContinueWatching />

      {/* ── Mixed Scraped Section: Top 10 Today Ranked Rail ── */}
      {yupflixHome?.trending?.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-4">
          <RankedRail
            title="Top 10 Trending Today"
            items={yupflixHome.trending}
          />
        </div>
      )}

      {/* ── Database Section: Trending Now ── */}
      <HomeSections
        movieData={trendingMovies}
        isMovieDataLoading={isTrendingMoviesLoading}
        sectionTitle="Trending Now"
        sectionSeeMoreButtonLink="/movies"
      />

      {/* ── Mixed Scraped Section: OTT Originals & Exclusives Rail ── */}
      {yupflixHome?.trending?.length > 10 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-4">
          <YupflixRail
            title="OTT Originals & VIP Releases"
            to="/filmsclub"
            items={yupflixHome.trending.slice(10, 26)}
          />
        </div>
      )}

      {/* ── Database Section: Popular Categories ── */}
      <PopularCategories />

      {/* ── Database Section: Recently Added Drops ── */}
      <HomeSections
        movieData={recentlyAdded}
        isMovieDataLoading={isRecentlyAddedLoading}
        sectionTitle="Recently Added"
        sectionSeeMoreButtonLink="/movies"
      />

      {/* Ad Banner */}
      <AdBanner slot="5754054742" />

      {/* ── Database Section: Popular Series ── */}
      <HomeSections
        movieData={trendingTv}
        isMovieDataLoading={isTrendingTvLoading}
        sectionTitle="Popular Series"
        sectionSeeMoreButtonLink="/series"
      />

      {/* ── Mixed Scraped Section: Latest Bollywood & Dual Audio Drops ── */}
      {scrapedMovies?.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
          <YupflixRail
            title="Cinema & Dual Audio Exclusives"
            to="/filmsclub?type=movie"
            items={scrapedMovies.slice(0, 16)}
          />
        </div>
      )}
    </div>
  );
}
