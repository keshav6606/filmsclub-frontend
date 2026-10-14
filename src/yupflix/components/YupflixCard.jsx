import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlay } from 'react-icons/fa';
import { cleanTitle, cleanEpisodeLabel, isRecentUpdate, TYPE_LABELS } from '../utils/yupflixHelpers';

export function PosterImage({ src, alt, title }) {
  const [error, setError] = useState(!src);

  if (!src || error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#161822] to-[#0c0d14] p-3 text-center text-zinc-400 text-xs font-semibold">
        <span className="text-xl mb-1 opacity-50">🎬</span>
        <span className="line-clamp-2">{title || alt || 'FilmsClub'}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || ''}
      loading="lazy"
      decoding="async"
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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

  return (
    <Link
      to={`/filmsclub/t/${item.code}`}
      state={{ card: item }}
      className="group relative flex flex-col w-full text-left transition-all duration-300"
    >
      {/* Poster Container */}
      <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-[#12141c] border border-white/10 group-hover:border-red-500/50 group-hover:shadow-[0_0_25px_rgba(229,9,20,0.35)] transition-all duration-300">
        <PosterImage src={item.poster} alt={title} title={title} />

        {/* Top Badges */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between gap-1 pointer-events-none z-10">
          {mainTag && (
            <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-zinc-300 border border-white/10 truncate max-w-[90px]">
              {mainTag.replace(' Movies', '').replace(' Series', '')}
            </span>
          )}

          <span className="ml-auto text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 backdrop-blur-md text-cyan-300 border border-cyan-400/40 font-mono shadow-[0_0_10px_rgba(0,240,255,0.3)]">
            {qualityBadge}
          </span>
        </div>

        {/* Hover Action Glow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-3">
          <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-[0_0_20px_rgba(229,9,20,0.8)] transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <FaPlay className="ml-0.5 text-sm" />
          </div>

          <div className="absolute bottom-2.5 inset-x-2.5 text-center">
            <span className="inline-block text-[10px] font-extrabold uppercase text-white bg-red-600/80 px-2.5 py-1 rounded-full shadow-lg">
              Stream Now
            </span>
          </div>
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="mt-2.5 px-0.5">
        <h4 className="font-outfit font-bold text-white text-xs sm:text-sm leading-tight line-clamp-1 group-hover:text-red-400 transition-colors">
          {title}
        </h4>
        <div className="flex items-center gap-1.5 mt-1 text-[11px] text-zinc-400 font-medium">
          {showDot && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          )}
          <span className="truncate">{metaText}</span>
        </div>
      </div>
    </Link>
  );
}

export default YupflixCard;
