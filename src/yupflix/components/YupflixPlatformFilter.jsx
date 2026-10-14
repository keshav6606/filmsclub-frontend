import React, { useRef } from 'react';
import { Link, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { PROVIDERS, PROVIDERS_MAP, cleanTitle } from '../utils/yupflixHelpers';
import { YupflixCard, PosterImage } from './YupflixCard';
import { FaChevronLeft, FaChevronRight, FaFire } from 'react-icons/fa';

export function YupflixPlatformFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const currentProv = (searchParams.get('prov') || '').split(',').filter(k => PROVIDERS_MAP[k])[0] || null;

  const toggleProvider = (key) => {
    if (!location.pathname.startsWith('/filmsclub')) {
      navigate(`/filmsclub?prov=${key}`);
      return;
    }

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
            className={`group relative flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border transition-all duration-300 shrink-0 select-none ${
              isSelected
                ? 'bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 font-black border-cyan-400 shadow-[0_0_20px_rgba(0,242,254,0.6)] scale-105'
                : 'bg-[#0E131F] hover:bg-[#141A29] text-slate-300 hover:text-white border-white/[0.08] hover:border-cyan-400/40'
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
    <section className="mb-14">
      {/* Rail Header */}
      <div className="flex items-center justify-between mb-5 pb-2.5 border-b border-white/[0.08] px-1">
        <div className="flex items-center gap-3">
          {icon && <span className="text-cyan-400 text-xl">{icon}</span>}
          <h2 className="section-title text-xl md:text-2xl">
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
              className="w-8 h-8 rounded-full bg-[#0E131F] hover:bg-[#141A29] text-slate-300 hover:text-white flex items-center justify-center border border-white/10 hover:border-cyan-400/40 transition-colors shadow-sm"
            >
              <FaChevronLeft className="text-xs" />
            </button>
            <button
              type="button"
              aria-label="Scroll right"
              onClick={() => scrollByAmount(1)}
              className="w-8 h-8 rounded-full bg-[#0E131F] hover:bg-[#141A29] text-slate-300 hover:text-white flex items-center justify-center border border-white/10 hover:border-cyan-400/40 transition-colors shadow-sm"
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
      icon={<FaFire className="text-rose-500 animate-pulse text-2xl" />}
      aside={
        <span className="spec-badge spec-badge-vip">
          🔥 TOP 10 TODAY
        </span>
      }
    >
      {topItems.map((item, idx) => {
        const titleText = cleanTitle(item.title);
        return (
          <Link
            key={item.code || item.tmdb_id || idx}
            to={`/filmsclub/t/${item.code}`}
            state={{ card: item }}
            className="group relative flex items-end shrink-0 select-none"
            title={titleText}
          >
            {/* Massive Stylized Holographic Rank Number */}
            <span className="font-outfit font-black text-6xl sm:text-7xl lg:text-8xl leading-none text-transparent bg-clip-text bg-gradient-to-t from-cyan-400/80 via-blue-500/35 to-transparent -mr-5 z-0 select-none group-hover:from-cyan-300 group-hover:to-rose-400 transition-all duration-300 drop-shadow-[0_12px_25px_rgba(0,0,0,0.9)]">
              {idx + 1}
            </span>

            {/* Poster Card */}
            <div className="relative aspect-[2/3] w-32 sm:w-36 lg:w-40 rounded-2xl overflow-hidden bg-[#0E131F] border border-white/[0.08] border-t-white/[0.18] group-hover:border-cyan-400/60 group-hover:shadow-[0_12px_35px_rgba(0,242,254,0.35)] transition-all duration-300 z-10 shadow-lg">
              <PosterImage src={item.poster} alt={titleText} title={titleText} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-transparent to-transparent opacity-85 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-2.5 inset-x-2 text-center">
                <span className="font-outfit font-bold text-white text-xs line-clamp-1 group-hover:text-cyan-300 transition-colors">
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
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 px-4 py-1.5 rounded-full bg-[#0E131F] hover:bg-[#141A29] border border-cyan-400/30 transition-colors font-outfit"
            to={to}
          >
            Explore All &rarr;
          </Link>
        ) : undefined
      }
    >
      {items.map((item, idx) => (
        <div key={item.code || item.tmdb_id || item._id || idx} className="w-36 sm:w-44 lg:w-48 shrink-0">
          <YupflixCard item={item} />
        </div>
      ))}
    </SectionRail>
  );
}

export default YupflixPlatformFilter;
