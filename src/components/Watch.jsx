import { useEffect } from "react";

export default function WatchTrailer(props) {
  // 🔴 अपनी external player site यहाँ डालो
  const PLAYER_SITE = "https://creativmind2-0.vercel.app";

  useEffect(() => {
    if (props.isWatchMoviePopupOpen || props.isWatchEpisodePopupOpen) {
      let redirectUrl = "";

      // 🎬 MOVIE CASE
      if (props.popUpType === "movie" && props.id?._id) {
        redirectUrl = `${PLAYER_SITE}/watch/movie/${props.id._id}`;
      }

      // 📺 EPISODE CASE
      if (
        props.popUpType === "episode" &&
        props.id?._id &&
        props.seasonNumber &&
        props.episodeNumber
      ) {
        redirectUrl = `${PLAYER_SITE}/watch/episode/${props.id._id}?season=${props.seasonNumber}&episode=${props.episodeNumber}`;
      }

      // 🚀 External redirect
      if (redirectUrl) {
        window.open(redirectUrl, "_blank");
      }

      // 🔒 Main site popup close
      closePopup();
    }
  }, [
    props.isWatchMoviePopupOpen,
    props.isWatchEpisodePopupOpen,
  ]);

  // 🔐 Popup close handler (same as your logic)
  const closePopup = () => {
    if (props.popUpType === "trailer") {
      props.setIsTrailerPopupOpen(false);
    } else if (props.popUpType === "movie") {
      props.setIsWatchMoviePopupOpen(false);
    } else {
      props.setIsWatchEpisodePopupOpen(false);
    }
  };

  // ❌ UI render नहीं होगा
  return null;
}
