import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import { YupflixCard } from "../yupflix/components/YupflixCard";
import SEO from "../components/SEO";
import { getWatchlist, clearWatchlist } from "../utils/storage";
import { HiBookmark, HiTrash } from "react-icons/hi2";
import { BiCameraMovie } from "react-icons/bi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Watchlist() {
  const SITENAME = import.meta.env.VITE_SITENAME || "FilmsClub";
  const [watchlist, setWatchlist] = useState([]);

  const loadList = () => {
    setWatchlist(getWatchlist());
  };

  useEffect(() => {
    loadList();
    window.scrollTo(0, 0);

    const onUpdate = () => loadList();
    window.addEventListener("watchlistUpdated", onUpdate);
    return () => window.removeEventListener("watchlistUpdated", onUpdate);
  }, []);

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear your entire watchlist?")) {
      clearWatchlist();
      setWatchlist([]);
      toast.info("Watchlist cleared.");
    }
  };

  return (
    <div className="pb-20 md:pb-16 pt-16 bg-[#05070B] min-h-screen">
      <ToastContainer style={{ fontSize: "0.85rem" }} />
      <SEO
        title={`My Watchlist & Saved Favorites - ${SITENAME}`}
        description={`Manage and watch your saved favorite movies and TV web series on ${SITENAME}.`}
        name={SITENAME}
        type="website"
        keywords="my watchlist, saved movies, favorite movies online, filmsclub watchlist"
        link={`https://${SITENAME.toLowerCase()}.site/watchlist`}
      />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 mt-6 space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-400 text-xl shadow-[0_0_15px_rgba(0,242,254,0.25)]">
              <HiBookmark />
            </div>
            <div>
              <h1 className="section-title text-2xl md:text-3xl font-black">
                My Watchlist
              </h1>
              <p className="text-xs text-slate-400 font-medium">
                {watchlist.length} {watchlist.length === 1 ? "title" : "titles"} saved to your personal library
              </p>
            </div>
          </div>

          {watchlist.length > 0 && (
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-all shadow-sm self-start sm:self-auto font-outfit"
            >
              <HiTrash className="text-sm" />
              <span>Clear Watchlist</span>
            </button>
          )}
        </div>

        {/* Watchlist Grid or Empty State */}
        {watchlist.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4 sm:gap-6">
            {watchlist.map((movie) => (
              <YupflixCard key={movie.code || movie.tmdb_id} item={movie} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 px-4 text-center rounded-3xl bg-[#0E131F]/50 border border-white/5 space-y-4">
            <div className="w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 text-3xl shadow-[0_0_25px_rgba(0,242,254,0.25)]">
              <BiCameraMovie />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-outfit">
              Your Watchlist is Empty
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md">
              Explore our trending movies and TV shows, and click the bookmark icon on any poster to save it here for instant access.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Link
                to="/movies"
                className="btn-cinema-primary px-7 py-3 rounded-full text-xs shadow-lg"
              >
                Browse Movies
              </Link>
              <Link
                to="/filmsclub"
                className="btn-cinema-frosted px-6 py-3 rounded-full text-xs"
              >
                Explore OTT Channels
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
