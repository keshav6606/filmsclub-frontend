import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlay, FaInfoCircle, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { cleanTitle, filterGenres, TYPE_LABELS } from '../utils/yupflixHelpers';

export function YupflixSpotlight({ items = [] }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || items.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % items.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [paused, items.length]);

  if (!items.length) return null;
  const activeIdx = Math.min(currentIdx, items.length - 1);
  const activeItem = items[activeIdx];

  const title = cleanTitle(activeItem.title);
  const typeStr = TYPE_LABELS[activeItem.type] || (activeItem.type === 'movie' ? 'Movie' : 'Series');
  const genres = filterGenres(activeItem.genres).slice(0, 3);
  const has4K = activeItem.qualities?.includes('2160p') || activeItem.genres?.some(g => g.toLowerCase().includes('4k'));

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden mb-10 bg-[#0d0f16] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Dynamic Ambient Backdrop */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {items.map((item, idx) => (
          item.poster ? (
            <img
              key={item.code}
              src={item.poster}
              alt=""
              className={`absolute inset-0 w-full h-full object-cover filter blur-3xl scale-125 transition-opacity duration-1000 ${
                idx === activeIdx ? 'opacity-40' : 'opacity-0'
              }`}
            />
          ) : null
        ))}
        {/* Cinematic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0f16] via-[#0d0f16]/90 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f16] via-transparent to-black/40 z-10" />
      </div>

      {/* Main Content Layout */}
      <div className="relative z-20 px-6 sm:px-10 lg:px-14 py-10 sm:py-14 lg:py-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-center min-h-[460px]">
        {/* Left Col: Info & Actions */}
        <div className="md:col-span-8 flex flex-col justify-center space-y-4 max-w-2xl">
          {/* Eyebrow Pill */}
          <div className="flex items-center gap-2.5">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-black uppercase tracking-wider shadow-[0_0_15px_rgba(229,9,20,0.3)]">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              {activeItem.latestLabel ? 'New Episode Available' : 'Featured OTT Premiere'}
            </span>

            {has4K && (
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-[10px] font-black uppercase tracking-widest font-mono">
                4K Ultra HD
              </span>
            )}
          </div>

          {/* Big Display Title */}
          <h1 className="font-outfit font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.05] drop-shadow-md">
            {title}
          </h1>

          {/* Facts / Meta Badges */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm text-zinc-300 font-medium">
            <span className="flex items-center gap-1 text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-400/20">
              <FaStar className="text-xs" /> 8.8
            </span>
            <span className="px-2 py-0.5 rounded bg-white/10 text-white font-semibold">
              {typeStr}
            </span>
            {(activeItem.latestLabel || activeItem.year) && (
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-300">
                {activeItem.latestLabel || activeItem.year}
              </span>
            )}
            {genres.map(g => (
              <span key={g} className="px-2.5 py-0.5 rounded-full bg-white/5 text-zinc-400 text-xs border border-white/5">
                {g}
              </span>
            ))}
          </div>

          {/* Synopses / Highlights */}
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed line-clamp-2 max-w-xl">
            Stream directly in original high-definition multi-audio with zero buffering. High-speed 10Gbps CDN nodes active.
          </p>

          {/* Action CTAs */}
          {(() => {
            const itemLink = activeItem.code
              ? `/filmsclub/t/${activeItem.code}`
              : activeItem.media_type === 'movie'
              ? `/mov/${activeItem.tmdb_id}`
              : `/ser/${activeItem.tmdb_id}`;
            return (
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  to={itemLink}
                  state={{ card: activeItem }}
                  className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-outfit font-black text-sm sm:text-base tracking-wide shadow-[0_0_25px_rgba(229,9,20,0.5)] hover:shadow-[0_0_35px_rgba(229,9,20,0.8)] hover:scale-105 transition-all duration-300"
                >
                  <FaPlay className="text-xs" />
                  Stream 4K Cinema
                </Link>

                <Link
                  to={itemLink}
                  state={{ card: activeItem }}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/10 hover:border-white/20 backdrop-blur-md transition-all duration-300"
                >
                  <FaInfoCircle className="text-base text-zinc-400" />
                  Details & Links
                </Link>
              </div>
            );
          })()}
        </div>

        {/* Right Col: Poster Key Art */}
        <div className="hidden md:flex md:col-span-4 justify-end items-center">
          {(() => {
            const itemLink = activeItem.code
              ? `/filmsclub/t/${activeItem.code}`
              : activeItem.media_type === 'movie'
              ? `/mov/${activeItem.tmdb_id}`
              : `/ser/${activeItem.tmdb_id}`;
            return (
              <Link
                to={itemLink}
                state={{ card: activeItem }}
                className="group relative block aspect-[2/3] w-56 lg:w-64 rounded-2xl overflow-hidden bg-black/60 border border-white/15 shadow-[0_20px_45px_rgba(0,0,0,0.9)] hover:scale-105 hover:border-red-500/50 transition-all duration-500"
              >
                {activeItem.poster && (
                  <img
                    src={activeItem.poster}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-[0_0_25px_rgba(229,9,20,0.8)]">
                    <FaPlay className="ml-1 text-base" />
                  </div>
                </div>
              </Link>
            );
          })()}
        </div>
      </div>

      {/* Bottom Slider Thumbnails & Progress Bar */}
      {items.length > 1 && (
        <div className="relative z-20 px-6 sm:px-10 pb-5 pt-2 border-t border-white/5 bg-[#0a0c10]/70 backdrop-blur-md flex items-center justify-between gap-4">
          {/* Thumbnails Row */}
          <div className="flex items-center gap-2 overflow-x-auto no-sb py-1">
            {items.map((item, idx) => {
              const isSel = idx === activeIdx;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setCurrentIdx(idx)}
                  className={`relative flex items-center gap-2.5 px-3 py-1.5 rounded-xl border text-left transition-all ${
                    isSel
                      ? 'bg-red-600/15 border-red-500/50 shadow-[0_0_12px_rgba(229,9,20,0.3)]'
                      : 'bg-white/5 hover:bg-white/10 border-white/5 text-zinc-400'
                  }`}
                >
                  <span className="w-6 h-9 rounded-md overflow-hidden bg-black/50 shrink-0">
                    {item.poster && <img src={item.poster} alt="" className="w-full h-full object-cover" />}
                  </span>
                  <span className={`text-xs font-bold truncate max-w-[120px] ${isSel ? 'text-white' : 'text-zinc-400'}`}>
                    {cleanTitle(item.title)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Prev/Next Controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setCurrentIdx((prev) => (prev - 1 + items.length) % items.length)}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-zinc-300 flex items-center justify-center transition-colors"
              aria-label="Previous Slide"
            >
              <FaChevronLeft className="text-xs" />
            </button>
            <button
              onClick={() => setCurrentIdx((prev) => (prev + 1) % items.length)}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-zinc-300 flex items-center justify-center transition-colors"
              aria-label="Next Slide"
            >
              <FaChevronRight className="text-xs" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default YupflixSpotlight;
