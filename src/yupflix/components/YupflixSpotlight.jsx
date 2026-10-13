import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { cleanTitle, filterGenres, TYPE_LABELS } from '../utils/yupflixHelpers';

export function YupflixSpotlight({ items = [] }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  if (!items.length) return null;
  const activeIdx = Math.min(currentIdx, items.length - 1);

  return (
    <>
      <div className="amb multi" aria-hidden="true">
        {items.map((item, idx) => (
          item.poster ? (
            <img
              key={item.code}
              className={idx === activeIdx ? 'on' : ''}
              src={item.poster}
              alt=""
            />
          ) : null
        ))}
      </div>

      <div
        className={'spotc' + (paused ? ' paused' : '')}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="slides">
          {items.map((item, idx) => {
            const title = cleanTitle(item.title);
            const typeStr = TYPE_LABELS[item.type] || 'Series';
            const genres = filterGenres(item.genres).slice(0, 2);
            const isActive = idx === activeIdx;

            return (
              <div
                key={item.code}
                className={'spot slide' + (isActive ? ' on' : '')}
                aria-hidden={!isActive}
              >
                <div>
                  <div className="eyebrow">
                    {item.latestLabel ? 'New episode' : `Trending ${typeStr.toLowerCase()}`}
                  </div>
                  <h2>{title}</h2>
                  <div className="facts">
                    <span>{typeStr}</span>
                    {(item.latestLabel || item.year) && (
                      <span>{item.latestLabel || item.year}</span>
                    )}
                    {genres.length > 0 && (
                      <span>{genres.join(', ')}</span>
                    )}
                  </div>
                  <Link
                    className="primary"
                    to={`/filmsclub/t/${item.code}`}
                    state={{ card: item }}
                    tabIndex={isActive ? 0 : -1}
                  >
                    {item.type === 'movie' ? 'View movie' : 'View episodes'}
                  </Link>
                </div>

                <Link
                  className="ph"
                  to={`/filmsclub/t/${item.code}`}
                  state={{ card: item }}
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  {item.poster && <img src={item.poster} alt="" />}
                </Link>
              </div>
            );
          })}
        </div>

        {items.length > 1 && (
          <div
            className="dots"
            onAnimationEnd={(e) => {
              if (e.animationName === 'fillbar') {
                setCurrentIdx((activeIdx + 1) % items.length);
              }
            }}
          >
            {items.map((item, idx) => (
              <button
                key={item.code}
                type="button"
                className={idx === activeIdx ? 'on' : ''}
                aria-label={`Show ${cleanTitle(item.title)}`}
                aria-current={idx === activeIdx}
                onClick={() => setCurrentIdx(idx)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
