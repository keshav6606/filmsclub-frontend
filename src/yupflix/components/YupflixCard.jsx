import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlay } from 'react-icons/fa';
import { cleanTitle, cleanEpisodeLabel, isRecentUpdate, TYPE_LABELS } from '../utils/yupflixHelpers';

export function PosterImage({ src, alt, title }) {
  const [error, setError] = useState(!src);

  if (!src || error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#141A29] to-[#070A12] p-3 text-center text-slate-400 text-xs font-semibold">
        <span className="text-2xl mb-1 opacity-60">🎬</span>
        <span className="line-clamp-2 font-outfit">{title || alt || 'Cinema'}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || ''}
      loading="lazy"
      decoding="async"
      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-108"
      onError={() => setError(true)}
    />
  );
}

export function YupflixCard({ item }) {
  const title = cleanTitle(item.title);
  const typeStr = TYPE_LABELS[item.type] || (item.type === 'movie' ? 'Movie' : 'Series');
  const isSeries = item.type === 'series' || !!item.latestLabel;
  const metaText = item.latestLabel
    ? cleanEpisodeLabel(item.latestLabel)
    : [item.year, typeStr].filter(Boolean).join(' · ');

  const showDot = item.latestLabel && isRecentUpdate(item.updatedAt);

  // Quality badge deduction
  const has4K = item.qualities?.includes('2160p') || item.genres?.some(g => g.toLowerCase().includes('4k'));
  const has1080p = item.qualities?.includes('1080p');
  const qualityBadge = has4K ? '4K UHD' : has1080p ? '1080p' : (item.qualities?.[0] || 'HD');

  // Main genre or platform
  const mainTag = item.genres?.find(g =>
    ['Netflix', 'Amazon Prime Video', 'JioHotstar', 'SonyLIV', 'Bollywood', 'Hollywood', 'Action', 'Sci-Fi', 'Anime'].includes(g)
  ) || item.genres?.[0] || typeStr;

  const targetLink = item.code
    ? `/filmsclub/t/${item.code}`
    : item.media_type === 'movie'
    ? `/mov/${item.tmdb_id}`
    : `/ser/${item.tmdb_id}`;

  return (
    <Link
      to={targetLink}
      state={{ card: item }}
      className="group relative flex flex-col w-full text-left transition-all duration-300 select-none"
    >
      {/* Poster Container with Obsidian Substrate and Specular Sheen */}
      <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-[#0E131F] border border-white/[0.08] border-t-white/[0.18] group-hover:border-cyan-400/50 group-hover:shadow-[0_12px_40px_rgba(0,242,254,0.35)] transition-all duration-300">
        <PosterImage src={item.poster} alt={title} title={title} />

        {/* Top Floating Badges */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between gap-1 pointer-events-none z-10">
          {mainTag && (
            <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#05070B]/85 backdrop-blur-md text-slate-300 border border-white/10 truncate max-w-[95px] font-outfit shadow">
              {mainTag.replace(' Movies', '').replace(' Series', '')}
            </span>
          )}

          <span className="ml-auto spec-badge spec-badge-4k shadow">
            {qualityBadge}
          </span>
        </div>

        {/* Hover Action Glow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070B]/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-slate-950 flex items-center justify-center shadow-[0_0_25px_rgba(0,242,254,0.9)] transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <FaPlay className="ml-0.5 text-sm" />
          </div>

          <div className="absolute bottom-3 inset-x-3 text-center">
            <span className="inline-block text-[10px] font-black uppercase tracking-wider text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 px-3 py-1 rounded-full shadow-[0_0_15px_rgba(0,242,254,0.6)] font-outfit">
              Stream in 4K
            </span>
          </div>
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="mt-2.5 px-0.5 space-y-0.5">
        <h4 className="font-outfit font-bold text-white text-xs sm:text-sm leading-tight line-clamp-1 group-hover:text-cyan-300 transition-colors">
          {title}
        </h4>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium font-mono">
          {showDot && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500 shadow-[0_0_6px_#ff2a55]"></span>
            </span>
          )}
          <span className="truncate">{metaText}</span>
        </div>
      </div>
    </Link>
  );
}
