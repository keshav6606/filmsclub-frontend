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

  let { seriesID } = useParams();

  // States
  const [seriesDetail, setSeriesDetail] = useState({});
  const [similarSeries, setSimilarSeries] = useState([]);
  const [isDetailsLoading, setDetailsIsLoading] = useState(true);
  const [isSimilarLoading, setIsSimilarLoading] = useState(true);

  const [episodeNumber, setEpisodeNumber] = useState();
  const [seasonNumber, setSeasonNumber] = useState(1);
  const [isEpisodesLoading, setIsEpisodesLoading] = useState(true);
  const [episodes, setEpisodes] = useState([]);

  // Fetch Series Details Data
  useEffect(() => {
    setDetailsIsLoading(true);
    window.scrollTo(0, 0);

    axios
      .get(`${BASE}/api/id/${seriesID}`)
      .then((response) => {
        const sortedSeasons = response.data.seasons.sort(
          (a, b) => a.season_number - b.season_number
        );

        setSeriesDetail({ ...response.data, seasons: sortedSeasons });

        if (sortedSeasons.length > 0) {
          setSeasonNumber(sortedSeasons[0].season_number);
        }

        setDetailsIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching series details:", error);
        setDetailsIsLoading(false);
      });
  }, [seriesID, BASE]);

  // Fetch Similar Series
  useEffect(() => {
    setIsSimilarLoading(true);

    axios
      .get(`${BASE}/api/similar/`, {
        params: {
          tmdb_id: seriesID,
          media_type: "tvshow",
          limit: 10,
        },
      })
      .then((response) => {
        setSimilarSeries(response.data.similar_media);
        setIsSimilarLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching similar series:", error);
        setIsSimilarLoading(false);
      });
  }, [seriesID, BASE]);

  // Fetch Episode List for each season
  useEffect(() => {
    if (seasonNumber === undefined) return; // Prevent unnecessary API calls if seasonNumber is not set

    setIsEpisodesLoading(true);

    axios
      .get(`${BASE}/api/id/${seriesID}`, {
        params: { season_number: seasonNumber },
      })
      .then((response) => {
        setEpisodes(response.data.episodes);
        setIsEpisodesLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching episodes:", error);
        setIsEpisodesLoading(false);
      });
  }, [seasonNumber, seriesID, BASE]);

  // Dynamic SEO variables
  const tvTitle = seriesDetail.title ? `Watch ${seriesDetail.title} (All Seasons) Online Free - ${SITENAME}` : `${SITENAME} - Watch TV Series Online`;
  const tvDesc = seriesDetail.description ? `Stream ${seriesDetail.title} all seasons and episodes for free on ${SITENAME}. Status: ${seriesDetail.status || "Ongoing"}. Genres: ${seriesDetail.genres?.join(", ") || ""}. Seasons: ${seriesDetail.total_seasons || ""}. Episodes: ${seriesDetail.total_episodes || ""}. ${seriesDetail.description.slice(0, 120)}...` : `Stream movies and series for free on ${SITENAME}.`;
  const tvKeywords = seriesDetail.title ? `${seriesDetail.title}, watch ${seriesDetail.title} online, stream ${seriesDetail.title} free, ${seriesDetail.genres?.join(", ") || ""}, watch tv series online, free tv shows` : `watch tv series online, free tv shows`;
  const tvImage = seriesDetail.backdrop || seriesDetail.poster || "";

  const tvSchema = seriesDetail.title ? {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    "name": seriesDetail.title,
    "image": tvImage,
    "description": seriesDetail.description,
    "numberOfSeasons": seriesDetail.total_seasons,
    "numberOfEpisodes": seriesDetail.total_episodes,
    "aggregateRating": seriesDetail.rating ? {
      "@type": "AggregateRating",
      "ratingValue": seriesDetail.rating.toFixed(1),
      "bestRating": "10",
      "worstRating": "1",
      "ratingCount": "100"
    } : undefined
  } : undefined;

  return (
    <div>
      <ToastContainer style={{ fontSize: "0.8rem" }} />

      {/* SEO SECTION */}
      <SEO
        title={tvTitle}
        description={tvDesc}
        name={SITENAME}
        type="video.other"
        keywords={tvKeywords}
        link={`https://${SITENAME}.com/ser/${seriesID}`}
        image={tvImage}
        schema={tvSchema}
      />
      {/* Call MoviesAndSeriesDetailsSections Component */}
      <MoviesAndSeriesDetailsSections
        movieData={seriesDetail}
        isMovieDataLoading={isDetailsLoading}
        detailType="series"
        seasonNumber={seasonNumber}
        episodeNumber={episodeNumber}
        setEpisodeNumber={setEpisodeNumber}
        setSeasonNumber={setSeasonNumber}
        isEpisodesLoading={isEpisodesLoading}
        episodes={episodes}
        setEpisodes={setEpisodes}
      />

      <Similars
        movieData={similarSeries}
        isMovieDataLoading={isSimilarLoading}
        sectionTitle="You may also like"
        detailType="similarMovies"
        seeMoreButtonLink={`/similarSeries/${seriesID}`}
      />
    </div>
  );
}
