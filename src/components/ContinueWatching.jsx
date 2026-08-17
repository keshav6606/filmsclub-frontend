// src/components/ContinueWatching.jsx
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
    <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 mt-10 md:mt-12" aria-label="Continue Watching">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <MdHistory className="text-lg" />
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
              className="group relative rounded-2xl overflow-hidden bg-[#0F131C] border border-white/10 hover:border-amber-400/50 transition-all duration-300 shadow-md"
            >
              {/* Thumbnail Container */}
              <Link to={watchUrl} className="block relative aspect-video w-full overflow-hidden bg-slate-950">
                <img
                  src={item.poster || posterPlaceholder}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => { e.target.src = posterPlaceholder; }}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

                {/* Center Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-9 h-9 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <BsPlayFill className="text-xl ml-0.5" />
                  </div>
                </div>

                {/* Dismiss Button */}
                <button
                  onClick={(e) => handleDismiss(e, item.tmdb_id)}
                  title="Remove from history"
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-slate-950/80 hover:bg-red-500 text-slate-300 hover:text-white flex items-center justify-center text-sm transition-colors z-10"
                >
                  <BsX />
                </button>

                {/* Progress Bar at Bottom of Thumbnail */}
                <div className="absolute bottom-0 inset-x-0 h-1.5 bg-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                    style={{ width: `${item.progressPercent || 0}%` }}
                  />
                </div>
              </Link>

              {/* Title & Info */}
              <div className="p-2.5 space-y-1">
                <Link to={watchUrl} className="block">
                  <h3 className="text-xs font-bold text-white line-clamp-1 group-hover:text-amber-400 transition-colors">
                    {item.title}
                  </h3>
                </Link>
                <div className="flex items-center justify-between text-[0.68rem] text-slate-400">
                  <span>{item.progressPercent || 0}% watched</span>
                  <span className="text-amber-400 font-bold uppercase">{item.quality || "HD"}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
