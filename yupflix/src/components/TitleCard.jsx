import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { cleanTitle, cleanEpisodeLabel, isRecentUpdate, TYPE_LABELS } from '../utils/helpers';

export function PosterImage({ src, alt, title }) {
  const [error, setError] = useState(!src);

  if (!src || error) {
    return <div className="poster-fallback">{title || alt}</div>;
  }

  return (
    <img
      src={src}
      alt={alt || ''}
      loading="lazy"
      decoding="async"
      onError={() => setError(true)}
    />
  );
}

export function TitleCard({ item }) {
  const title = cleanTitle(item.title);
  const typeStr = TYPE_LABELS[item.type] || 'Series';
  const meta = item.latestLabel
    ? cleanEpisodeLabel(item.latestLabel)
    : [item.year, typeStr].filter(Boolean).join(' · ');

  const showDot = item.latestLabel && isRecentUpdate(item.updatedAt);

  return (
    <Link
      to={`/t/${item.code}`}
      state={{ card: item }}
      className="c"
      onPointerEnter={() => api.prefetchTitle(item.code)}
      onPointerDown={() => api.prefetchTitle(item.code)}
    >
      <div className="p">
        <PosterImage src={item.poster} alt="" title={title} />
      </div>
      <div className="ct">{title}</div>
      <div className="cm">
        {showDot && <span className="dot" title="New episode" />}
        {meta}
      </div>
    </Link>
  );
}
