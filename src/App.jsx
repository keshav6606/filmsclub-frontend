import React, { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import ReactGa from "react-ga";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import PageLoader from "./components/PageLoader";
import TelegramBanner from "./components/TelegramBanner";

// Lazy Loaded Pages
const Home = lazy(() => import("./pages/Home"));
const MovieDetails = lazy(() => import("./pages/MovieDetails"));
const TvDetails = lazy(() => import("./pages/TvDetails"));
const Movies = lazy(() => import("./pages/Movies"));
const Series = lazy(() => import("./pages/Series"));
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

function ApiCatchHandler() {
  const location = useLocation();
  useEffect(() => {
    window.location.href = location.pathname + location.search;
  }, [location]);
  return (
    <div className="flex items-center justify-center min-h-[50vh] text-center p-6 text-white">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-red-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-300 text-sm">Connecting to FilmsClub Stream Link...</p>
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

  const isStreamingHub =
    location.pathname.toLowerCase().startsWith("/filmsclub") ||
    location.pathname.toLowerCase().startsWith("/yupflix");

  return (
    <>
      <Nav />
      <div className="w-full min-h-screen overflow-x-hidden">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />

            {/* FilmsClub VIP Streaming Hub & Aliases */}
            <Route path="/filmsclub/*" element={<YupflixModule />} />
            <Route path="/filmsclub" element={<YupflixModule />} />
            <Route path="/FilmsClub/*" element={<YupflixModule />} />
            <Route path="/FilmsClub" element={<YupflixModule />} />
            <Route path="/yupflix/*" element={<YupflixModule />} />
            <Route path="/yupflix" element={<YupflixModule />} />

            {/* Filmy4UHD Core Routes */}
            <Route path="/mov/:movieID" element={<MovieDetails />} />
            <Route path="/ser/:seriesID" element={<TvDetails />} />
            <Route path="/watch" element={<WatchPage />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/Movies" element={<Movies />} />
            <Route path="/series" element={<Series />} />
            <Route path="/Series" element={<Series />} />
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
      </div>
      {!isStreamingHub && <TelegramBanner />}
      {!isStreamingHub && <Footer />}
    </>
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
