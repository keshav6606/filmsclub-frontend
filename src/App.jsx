import React, { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import ReactGa from "react-ga";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import { YupflixHeader } from "./yupflix/components/YupflixHeader";
import Footer from "./components/Footer";
import PageLoader from "./components/PageLoader";
import TelegramBanner from "./components/TelegramBanner";

// Lazy Loaded Pages
const Home = lazy(() => import("./pages/Home"));
const MovieDetails = lazy(() => import("./pages/MovieDetails"));
const TvDetails = lazy(() => import("./pages/TvDetails"));
const SimilarMov = lazy(() => import("./pages/SimilarMov"));
const SimilarSeries = lazy(() => import("./pages/SimilarSeries"));
const SearResults = lazy(() => import("./pages/SearchResults"));
const NotFoundPage = lazy(() => import("./pages/NotFound"));
const Disclaimer = lazy(() => import("./pages/Disclaimer"));
const About = lazy(() => import("./pages/About"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Terms = lazy(() => import("./pages/Terms"));
const Contact = lazy(() => import("./pages/Contact"));
const WatchPage = lazy(() => import("./pages/WatchPage"));
const Watchlist = lazy(() => import("./pages/Watchlist"));
const YupflixModule = lazy(() => import("./yupflix"));

function MoviesBrowseWrapper() {
  const { YupflixCatalogView } = lazy(() => import("./yupflix/pages/YupflixHome"));
  return <YupflixCatalogView type="movie" />;
}

function SeriesBrowseWrapper() {
  const { YupflixCatalogView } = lazy(() => import("./yupflix/pages/YupflixHome"));
  return <YupflixCatalogView type="series" />;
}

const YupflixBrowseMovie = lazy(() =>
  import("./yupflix/pages/YupflixHome").then((m) => ({ default: () => <m.YupflixCatalogView type="movie" /> }))
);
const YupflixBrowseSeries = lazy(() =>
  import("./yupflix/pages/YupflixHome").then((m) => ({ default: () => <m.YupflixCatalogView type="series" /> }))
);
const YupflixBrowseAnime = lazy(() =>
  import("./yupflix/pages/YupflixHome").then((m) => ({ default: () => <m.YupflixCatalogView type="anime" /> }))
);

function ApiCatchHandler() {
  const location = useLocation();
  useEffect(() => {
    window.location.href = location.pathname + location.search;
  }, [location]);
  return (
    <div className="flex items-center justify-center min-h-[50vh] text-center p-6 text-white">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-red-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-300 text-sm">Connecting to Stream Link...</p>
      </div>
    </div>
  );
}

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    ReactGa.initialize("G-JDFS7KRV40");
    ReactGa.pageview(location.pathname + location.search);
  }, [location]);

  return (
    <div className="min-h-screen bg-[#07080c] text-white flex flex-col font-sans selection:bg-red-600 selection:text-white">
      <ToastContainer style={{ fontSize: "0.85rem" }} />
      {/* Yupflix Universal Header */}
      <YupflixHeader />

      <main className="w-full flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />

            {/* Yupflix Full Architecture for Movies, Series & Anime */}
            <Route path="/movies" element={<YupflixBrowseMovie />} />
            <Route path="/Movies" element={<YupflixBrowseMovie />} />
            <Route path="/series" element={<YupflixBrowseSeries />} />
            <Route path="/Series" element={<YupflixBrowseSeries />} />
            <Route path="/anime" element={<YupflixBrowseAnime />} />

            {/* FilmsClub Streaming Hub & Aliases */}
            <Route path="/filmsclub/*" element={<YupflixModule />} />
            <Route path="/filmsclub" element={<YupflixModule />} />
            <Route path="/FilmsClub/*" element={<YupflixModule />} />
            <Route path="/FilmsClub" element={<YupflixModule />} />
            <Route path="/yupflix/*" element={<YupflixModule />} />
            <Route path="/yupflix" element={<YupflixModule />} />

            {/* Core Cinema Routes */}
            <Route path="/mov/:movieID" element={<MovieDetails />} />
            <Route path="/ser/:seriesID" element={<TvDetails />} />
            <Route path="/watch" element={<WatchPage />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/similarMov/:movieID" element={<SimilarMov />} />
            <Route path="/similarSeries/:seriesID" element={<SimilarSeries />} />
            <Route path="/search/:searchResult" element={<SearResults />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/api/*" element={<ApiCatchHandler />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      <TelegramBanner />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
