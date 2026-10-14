import React, { useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PROVIDERS, PROVIDERS_MAP, cleanTitle } from '../utils/yupflixHelpers';
import { YupflixCard, PosterImage } from './YupflixCard';
import { FaChevronLeft, FaChevronRight, FaFire, FaPlay } from 'react-icons/fa';

export function YupflixPlatformFilter() {
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
    <div className="flex items-center gap-3 overflow-x-auto no-sb py-2 px-1">
      {PROVIDERS.map((p) => {
        const isSelected = p.key === currentProv;
        return (
          <button
            key={p.key}
            type="button"
            title={p.name}
            aria-label={p.name}
            aria-pressed={isSelected}
            onClick={() => toggleProvider(p.key)}
            className={`group relative flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border transition-all duration-300 shrink-0 ${
              isSelected
                ? 'bg-red-600 text-white border-red-500 shadow-[0_0_20px_rgba(229,9,20,0.5)] scale-105'
                : 'bg-[#12141c]/80 hover:bg-[#1a1d28] text-zinc-300 border-white/10 hover:border-white/20'
            }`}
          >
            {p.img ? (
              <img
                src={`/providers/${p.img}.jpeg`}
                alt=""
                loading="lazy"
                className="w-5 h-5 rounded-md object-cover shadow"
              />
            ) : (
              <span
                className="w-5 h-5 rounded-md flex items-center justify-center font-black text-[10px]"
                style={{ background: p.bg || '#222', color: p.fg || '#fff' }}
              >
                {p.label?.slice(0, 2)}
              </span>
            )}
            <span className="font-outfit font-bold text-xs sm:text-sm whitespace-nowrap">
              {p.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function SectionRail({ title, aside, children, icon }) {
  const scrollRef = useRef(null);

  const scrollByAmount = (dir) => {
    const el = scrollRef.current;
    if (el) {
      el.scrollBy({ left: dir * el.clientWidth * 0.75, behavior: 'smooth' });
    }
  };

  return (
    <section className="mb-12">
      {/* Rail Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2.5">
          {icon && <span className="text-red-500 text-lg">{icon}</span>}
          <h2 className="font-outfit font-black text-xl sm:text-2xl text-white tracking-tight">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {aside}
          <div className="flex items-center gap-1.5 hidden sm:flex">
            <button
              type="button"
              aria-label="Scroll left"
              onClick={() => scrollByAmount(-1)}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-zinc-300 flex items-center justify-center border border-white/10 transition-colors"
            >
              <FaChevronLeft className="text-xs" />
            </button>
            <button
              type="button"
              aria-label="Scroll right"
              onClick={() => scrollByAmount(1)}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-zinc-300 flex items-center justify-center border border-white/10 transition-colors"
            >
              <FaChevronRight className="text-xs" />
            </button>
          </div>
        </div>
      </div>

      {/* Rail Horizontal Scroll Area */}
      <div
        className="flex items-stretch gap-4 overflow-x-auto no-sb pb-4 pt-1 px-1 scroll-smooth"
        ref={scrollRef}
      >
        {children}
      </div>
    </section>
  );
}

export function RankedRail({ title, items = [] }) {
  const topItems = items.slice(0, 10);
  if (!topItems.length) return null;

  return (
    <SectionRail
      title={title}
      icon={<FaFire className="text-red-500 animate-pulse" />}
      aside={
        <span className="text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-red-600/15 text-red-400 border border-red-500/30">
          Top 10 Today
        </span>
      }
    >
      {topItems.map((item, idx) => {
        const titleText = cleanTitle(item.title);
        return (
          <Link
            key={item.code}
            to={`/filmsclub/t/${item.code}`}
            state={{ card: item }}
            className="group relative flex items-end shrink-0 select-none"
            title={titleText}
          >
            {/* Massive Stylized Rank Number */}
            <span className="font-outfit font-black text-6xl sm:text-7xl lg:text-8xl leading-none text-transparent bg-clip-text bg-gradient-to-t from-red-600/80 via-red-500/40 to-transparent -mr-5 z-0 select-none group-hover:from-red-500 group-hover:to-cyan-400 transition-all duration-300 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
              {idx + 1}
            </span>

            {/* Poster Card */}
            <div className="relative aspect-[2/3] w-32 sm:w-36 lg:w-40 rounded-2xl overflow-hidden bg-[#12141c] border border-white/10 group-hover:border-red-500/60 group-hover:shadow-[0_0_25px_rgba(229,9,20,0.4)] transition-all duration-300 z-10">
              <PosterImage src={item.poster} alt={titleText} title={titleText} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-2.5 inset-x-2 text-center">
                <span className="font-outfit font-bold text-white text-xs line-clamp-1">
                  {titleText}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </SectionRail>
  );
}

export function YupflixRail({ title, to, items = [] }) {
  if (!items.length) return null;

  return (
    <SectionRail
      title={title}
      aside={
        to ? (
          <Link
            className="text-xs font-bold text-zinc-400 hover:text-white px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            to={to}
          >
            See all
          </Link>
        ) : undefined
      }
    >
      {items.map((item) => (
        <div key={item.code} className="w-36 sm:w-44 lg:w-48 shrink-0">
          <YupflixCard item={item} />
        </div>
      ))}
    </SectionRail>
  );
}

export default YupflixPlatformFilter;
