import React, { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ReactGa from "react-ga";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import PageLoader from "./components/PageLoader";

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


function App() {
  ReactGa.initialize("G-JDFS7KRV40");
  useEffect(() => {
    ReactGa.pageview(window.location.pathname + window.location.search);
  }, []);

  return (

    <BrowserRouter>
      <Nav />
      <div className="p-3 md:p-10">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="mov/:movieID"
              element={<MovieDetails />}
            />
            <Route
              path="ser/:seriesID"
              element={<TvDetails />}
            />
            <Route
              path="/Movies"
              element={<Movies />}
            />
            <Route
              path="/Series"
              element={<Series />}
            />
            <Route
              path="*"
              element={<NotFoundPage />}
            />
            <Route
              path="/similarMov/:movieID"
              element={<SimilarMov />}
            />
            <Route
              path="/similarSeries/:seriesID"
              element={<SimilarSeries />}
            />

            <Route
              path="/search/:searchResult"
              element={<SearResults />}
            />
            <Route
              path="/disclaimer"
              element={<Disclaimer />}
            />
          </Routes>
        </Suspense>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
