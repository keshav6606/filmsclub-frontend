import React, { useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PROVIDERS, PROVIDERS_MAP, cleanTitle } from '../utils/helpers';
import { TitleCard, PosterImage } from './TitleCard';
import { api } from '../services/api';

// Platform Filter Row
export function PlatformFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentProv = (searchParams.get('prov') || '').split(',').filter(k => PROVIDERS_MAP[k])[0] || null;

  const toggleProvider = (key) => {
    const params = new URLSearchParams(searchParams);
    if (key === currentProv) {
      params.delete('prov');
    } else {
      params.set('prov', key);
    }
    params.delete('page');
    setSearchParams(params, { replace: false });
  };

  return (
    <div className={'provs no-sb' + (currentProv ? ' has-on' : '')}>
      {PROVIDERS.map((p) => (
        <button
          key={p.key}
          type="button"
          title={p.name}
          aria-label={p.name}
          aria-pressed={p.key === currentProv}
          onClick={() => toggleProvider(p.key)}
          style={p.img ? undefined : { background: p.bg }}
        >
          {p.img ? (
            <img
              src={`/providers/${p.img}.jpeg`}
              alt=""
              loading="lazy"
              width={56}
              height={56}
            />
          ) : (
            <span className={'lbl' + (p.small ? ' sm' : '')} style={{ color: p.fg }}>
              {p.label}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// Arrow Buttons
const ArrowLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m15 5-7 7 7 7" />
  </svg>
);

const ArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m9 5 7 7-7 7" />
  </svg>
);

export function SectionRail({ title, aside, className, children }) {
  const scrollRef = useRef(null);

  const scrollByAmount = (dir) => {
    const el = scrollRef.current;
    if (el) {
      el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
    }
  };

  return (
    <section className="sec">
      <header>
        <h2>{title}</h2>
        <span className="hr">
          <span className="arrs">
            <button type="button" aria-label="Scroll left" onClick={() => scrollByAmount(-1)}>
              <ArrowLeft />
            </button>
            <button type="button" aria-label="Scroll right" onClick={() => scrollByAmount(1)}>
              <ArrowRight />
            </button>
          </span>
          {aside}
        </span>
      </header>
      <div className={className + ' no-sb'} ref={scrollRef}>
        {children}
      </div>
    </section>
  );
}

// Top 10 Ranked Rail
export function RankedRail({ title, items = [] }) {
  const topItems = items.slice(0, 10);
  if (!topItems.length) return null;

  return (
    <SectionRail
      title={title}
      className="rank"
      aside={<span className="sub">Top {topItems.length}</span>}
    >
      {topItems.map((item, idx) => {
        const titleText = cleanTitle(item.title);
        return (
          <Link
            key={item.code}
            to={`/t/${item.code}`}
            state={{ card: item }}
            title={titleText}
            onPointerEnter={() => api.prefetchTitle(item.code)}
            onPointerDown={() => api.prefetchTitle(item.code)}
          >
            <span className="rn">{idx + 1}</span>
            <span className="p">
              <PosterImage src={item.poster} alt={titleText} title={titleText} />
            </span>
          </Link>
        );
      })}
    </SectionRail>
  );
}

// Simple Horizontal Rail
export function Rail({ title, to, items = [] }) {
  if (!items.length) return null;

  return (
    <SectionRail
      title={title}
      className="rail"
      aside={to ? <Link className="all" to={to}>See all</Link> : undefined}
    >
      {items.map((item) => (
        <TitleCard key={item.code} item={item} />
      ))}
    </SectionRail>
  );
}
