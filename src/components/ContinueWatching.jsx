import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BsPlayFill, BsX } from "react-icons/bs";
import { MdHistory } from "react-icons/md";
import { getContinueWatching, removeContinueWatching } from "../utils/storage";
import posterPlaceholder from "../assets/images/poster-placeholder.png";

export default function ContinueWatching() {
  const [items, setItems] = useState([]);

  const loadItems = () => {
    setItems(getContinueWatching());
  };

  useEffect(() => {
    loadItems();
    const handler = () => loadItems();
    window.addEventListener("continueWatchingUpdated", handler);
    return () => window.removeEventListener("continueWatchingUpdated", handler);
  }, []);

  if (!items || items.length === 0) return null;

  const handleDismiss = (e, tmdbId) => {
    e.preventDefault();
    e.stopPropagation();
    removeContinueWatching(tmdbId);
    setItems((prev) => prev.filter((i) => String(i.tmdb_id) !== String(tmdbId)));
  };

  return (
    <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 mt-10 md:mt-14" aria-label="Continue Watching">
      <div className="flex items-center justify-between mb-5 pb-2.5 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.2)]">
            <MdHistory className="text-xl" />
          </div>
          <h2 className="section-title text-xl md:text-2xl font-black">
            Continue Watching
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {items.map((item) => {
          const watchUrl = `/watch?id=${item.fileId || ""}&name=${encodeURIComponent(item.fileName || "")}&title=${encodeURIComponent(item.title)}&quality=${item.quality || "HD"}&tmdb_id=${item.tmdb_id}&media_type=${item.media_type || "movie"}&resume=${Math.floor(item.currentTime || 0)}`;

          return (
            <div
              key={item.tmdb_id}
              className="group relative rounded-2xl overflow-hidden bg-[#0E131F] border border-white/[0.08] hover:border-cyan-400/50 transition-all duration-300 shadow-[0_8px_25px_rgba(0,0,0,0.7)]"
            >
              {/* Thumbnail Container */}
              <Link to={watchUrl} className="block relative aspect-video w-full overflow-hidden bg-[#070A12]">
                <img
                  src={item.poster || posterPlaceholder}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => { e.target.src = posterPlaceholder; }}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

                {/* Center Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-slate-950 flex items-center justify-center shadow-[0_0_20px_rgba(0,242,254,0.8)] group-hover:scale-110 transition-transform">
                    <BsPlayFill className="text-2xl ml-0.5" />
                  </div>
                </div>

                {/* Dismiss Button */}
                <button
                  onClick={(e) => handleDismiss(e, item.tmdb_id)}
                  title="Remove from history"
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[#05070B]/85 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center text-sm transition-colors z-10"
                >
                  <BsX />
                </button>

                {/* Progress Bar at Bottom of Thumbnail */}
                <div className="absolute bottom-0 inset-x-0 h-1.5 bg-slate-900">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_8px_rgba(0,242,254,0.9)]"
                    style={{ width: `${item.progressPercent || 0}%` }}
                  />
                </div>
              </Link>

              {/* Title & Info */}
              <div className="p-3 space-y-1 bg-[#0B0F19]">
                <Link to={watchUrl} className="block">
                  <h3 className="text-xs font-bold text-white line-clamp-1 group-hover:text-cyan-300 transition-colors font-outfit">
                    {item.title}
                  </h3>
                </Link>
                <div className="flex items-center justify-between text-[0.68rem] text-slate-400 font-mono">
                  <span>{item.progressPercent || 0}% watched</span>
                  <span className="spec-badge spec-badge-4k">{item.quality || "HD"}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
