import { useEffect } from "react";

export default function WatchTrailer(props) {
  const PLAYER_SITE = "https://creativmind2-0.vercel.app"; // 🔴 अपनी site

  useEffect(() => {
    if (props.isWatchMoviePopupOpen || props.isWatchEpisodePopupOpen) {
      let pageUrl = "";

      // 🎬 Movie
      if (props.popUpType === "movie" && props.id?._id) {
        pageUrl = `${PLAYER_SITE}/watch/movie/${props.id._id}`;
      }

      // 📺 Episode
      if (
        props.popUpType === "episode" &&
        props.id?._id &&
        props.seasonNumber &&
        props.episodeNumber
      ) {
        pageUrl = `${PLAYER_SITE}/watch/episode/${props.id._id}?season=${props.seasonNumber}&episode=${props.episodeNumber}`;
      }

      // 🚀 HTML PAGE खोलो (video file नहीं)
      if (pageUrl) {
        window.open(pageUrl, "_blank");
      }

      closePopup();
    }
  }, [
    props.isWatchMoviePopupOpen,
    props.isWatchEpisodePopupOpen,
  ]);

  const closePopup = () => {
    if (props.popUpType === "movie") {
      props.setIsWatchMoviePopupOpen(false);
    } else if (props.popUpType === "episode") {
      props.setIsWatchEpisodePopupOpen(false);
    }
  };

  return null;
}

