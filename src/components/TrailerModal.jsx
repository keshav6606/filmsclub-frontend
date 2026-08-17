// src/components/TrailerModal.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BiX } from "react-icons/bi";
import { FaYoutube } from "react-icons/fa";
import { BASE_URL as BASE } from "../config/api";

export default function TrailerModal({ isOpen, onClose, tmdbId, mediaType = "movie", title = "" }) {
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!isOpen || !tmdbId) {
      setTrailerKey(null);
      setLoading(true);
      setError(false);
      return;
    }

    setLoading(true);
    setError(false);

    // Fetch trailer from backend or TMDb proxy
    fetch(`${BASE}/api/trailer/${mediaType}/${tmdbId}`)
      .then((res) => {
        if (!res.ok) throw new Error("No trailer found");
        return res.json();
      })
      .then((data) => {
        if (data?.key) {
          setTrailerKey(data.key);
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch(() => {
        // Fallback: search query on YouTube
        setTrailerKey(null);
        setError(true);
        setLoading(false);
      });
  }, [isOpen, tmdbId, mediaType]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="relative w-full max-w-4xl bg-[#0B0E17] border border-white/15 rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95)] z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/60">
            <div className="flex items-center gap-2">
              <FaYoutube className="text-red-500 text-xl" />
              <h3 className="text-sm sm:text-base font-extrabold text-white line-clamp-1">
                Official Trailer: <span className="text-amber-400">{title}</span>
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
            >
              <BiX className="text-2xl" />
            </button>
          </div>

          {/* Player Body */}
          <div className="relative aspect-video w-full bg-black flex items-center justify-center">
            {loading && (
              <div className="flex flex-col items-center gap-3 text-slate-400">
                <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-semibold">Loading official trailer...</span>
              </div>
            )}

            {!loading && trailerKey && (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`}
                title={`${title} Trailer`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}

            {!loading && (error || !trailerKey) && (
              <div className="p-8 text-center space-y-4">
                <FaYoutube className="text-5xl text-red-500/60 mx-auto" />
                <h4 className="text-base font-bold text-white">Trailer not directly embeddable</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Click below to watch the official {title} trailer directly on YouTube.
                </p>
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${title} official trailer`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-2.5 rounded-full text-xs transition-all shadow-md"
                >
                  <FaYoutube className="text-base" />
                  <span>Search on YouTube</span>
                </a>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
