import { useEffect } from "react";

export default function WatchTrailer(props) {
  useEffect(() => {
    if (props.isWatchMoviePopupOpen || props.isWatchEpisodePopupOpen) {
      // Find the player buttons section and scroll to it smoothly
      const target = document.getElementById("player-section");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      closePopup();
    }
  }, [props.isWatchMoviePopupOpen, props.isWatchEpisodePopupOpen]);

  const closePopup = () => {
    if (props.popUpType === "movie") {
      props.setIsWatchMoviePopupOpen(false);
    } else if (props.popUpType === "episode") {
      props.setIsWatchEpisodePopupOpen(false);
    }
  };

  return null;
}
