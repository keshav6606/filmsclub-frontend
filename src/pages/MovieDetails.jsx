import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import MoviesAndSeriesDetailsSections from "../components/MoviesAndSeriesDetailsSections";
import Similars from "../components/Similars";
import SEO from "../components/SEO"; // import SEO
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function MovieDetails() {
  const BASE = import.meta.env.VITE_BASE_URL; // Base URL for backend
  const SITENAME = import.meta.env.VITE_SITENAME;

  let { movieID } = useParams();

  // States
  const [movieDetail, setMovieDetail] = useState({});
  const [similarMovies, setSimilarMovies] = useState([]);
  const [isDetailsLoading, setDetailsIsLoading] = useState(true);
  const [isSimilarLoading, setIsSimilarLoading] = useState(true);

  // Fetch Movie Details Data
  useEffect(() => {
    setDetailsIsLoading(true);
    window.scrollTo(0, 0);

    axios
      .get(`${BASE}/api/id/${movieID}`)
      .then((response) => {
        setMovieDetail(response.data);
        setDetailsIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching movie details:", error);
        setDetailsIsLoading(false);
      });
  }, [movieID, BASE]);

  // Fetch Similar Movies
  useEffect(() => {
    setIsSimilarLoading(true);

    axios
      .get(`${BASE}/api/similar/`, {
        params: {
          tmdb_id: movieID,
          media_type: "movie",
          limit: 10,
        },
      })
      .then((response) => {
        setSimilarMovies(response.data.similar_media);
        setIsSimilarLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching similar movies:", error);
        setIsSimilarLoading(false);
      });
  }, [movieID, BASE]);

  // Dynamic SEO variables
  const movieTitle = movieDetail.title ? `Watch ${movieDetail.title} (${movieDetail.release_year || ""}) Online Free in HD - ${SITENAME}` : `${SITENAME} - Watch Movies Online`;
  const movieDesc = movieDetail.description ? `Stream ${movieDetail.title} (${movieDetail.release_year || ""}) online for free on ${SITENAME}. Genres: ${movieDetail.genres?.join(", ") || ""}. Runtime: ${movieDetail.runtime || ""} min. Quality: ${movieDetail.rip || "HD"}. ${movieDetail.description.slice(0, 120)}...` : `Stream movies and series for free on ${SITENAME}.`;
  const movieKeywords = movieDetail.title ? `${movieDetail.title}, watch ${movieDetail.title} online, stream ${movieDetail.title} free, ${movieDetail.genres?.join(", ") || ""}, watch movies online, free hd movies` : `watch movies online, free hd movies`;
  const movieImage = movieDetail.backdrop || movieDetail.poster || "";

  const movieSchema = movieDetail.title ? {
    "@context": "https://schema.org",
    "@type": "Movie",
    "name": movieDetail.title,
    "image": movieImage,
    "description": movieDetail.description,
    "dateCreated": movieDetail.release_year ? `${movieDetail.release_year}-01-01` : undefined,
    "aggregateRating": movieDetail.rating ? {
      "@type": "AggregateRating",
      "ratingValue": movieDetail.rating.toFixed(1),
      "bestRating": "10",
      "worstRating": "1",
      "ratingCount": "100"
    } : undefined
  } : undefined;

  return (
    <div className="pb-16 md:pb-0">
      {/* SEO SECTION */}
      <ToastContainer style={{ fontSize: "0.8rem" }} />

      <SEO
        title={movieTitle}
        description={movieDesc}
        name={SITENAME}
        type="video.other"
        keywords={movieKeywords}
        link={`https://${SITENAME}.com/mov/${movieID}`}
        image={movieImage}
        schema={movieSchema}
        breadcrumbs={[
          { name: "Home", url: `https://${SITENAME}.com` },
          { name: "Movies", url: `https://${SITENAME}.com/movies` },
          { name: movieDetail.title || "Movie", url: `https://${SITENAME}.com/mov/${movieID}` },
        ]}
      />
      {/* Call MoviesAndSeriesDetailsSections Component */}
      <MoviesAndSeriesDetailsSections
        movieData={movieDetail}
        isMovieDataLoading={isDetailsLoading}
        detailType="movie"
      />
      <Similars
        movieData={similarMovies}
        isMovieDataLoading={isSimilarLoading}
        sectionTitle="You may also like"
        detailType="similarMovies"
        seeMoreButtonLink={`/similarMov/${movieID}`}
      />
    </div>
  );
}
