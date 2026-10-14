import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaTimes, FaFilter } from 'react-icons/fa';

const TYPE_TABS = [
  ['', 'All Cinema', '/filmsclub'],
  ['movie', 'Movies', '/filmsclub/browse/movie'],
  ['series', 'Web Series', '/filmsclub/browse/series'],
  ['anime', 'Anime', '/filmsclub/browse/anime']
];

const LANGUAGES = [
  'Hindi', 'English', 'Dual Audio', 'Punjabi', 'Tamil',
  'Telugu', 'Korean', 'Bengali', 'Malayalam', 'Marathi',
  'Kannada', 'Chinese'
];

const SORT_OPTIONS = [
  ['popular', 'Most Popular'],
  ['year', 'Release Year']
];

const INDUSTRY_OPTIONS = [
  ['', 'All Industries'],
  ['hollywood', 'Hollywood'],
  ['bollywood', 'Bollywood']
];

const FILTER_KEYS = ['prov', 'genre', 'year', 'lang', 'industry'];

export function YupflixFilterBar({ type = '', genres = [] }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentGenre = searchParams.get('genre') || '';
  const currentYear = searchParams.get('year') || '';
  const currentLang = searchParams.get('lang') || '';
  const currentIndustry = searchParams.get('industry') || '';
  const currentSort = searchParams.get('sort') || 'new';

  const years = Array.from({ length: 30 }, (_, i) => 2026 - i);
  const hasActiveFilters = FILTER_KEYS.some(k => searchParams.get(k));

  const setFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value && (key !== 'sort' || value !== 'new')) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page');
    setSearchParams(params);
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams);
    for (const k of FILTER_KEYS) {
      params.delete(k);
    }
    params.delete('page');
    setSearchParams(params);
  };

  const buildQueryString = () => {
    const p = new URLSearchParams();
    for (const k of [...FILTER_KEYS, 'sort']) {
      const val = searchParams.get(k);
      if (val) p.set(k, val);
    }
    const str = p.toString();
    return str ? `?${str}` : '';
  };

  return (
    <div className="space-y-4 mb-8">
      {/* Type Pill Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-sb py-1">
        {TYPE_TABS.map(([tKey, label, basePath]) => {
          const isSelected = type === tKey;
          return (
            <Link
              key={tKey}
              to={`${basePath}${buildQueryString()}`}
              className={`px-4 sm:px-5 py-2 rounded-2xl text-xs sm:text-sm font-outfit font-bold transition-all duration-200 shrink-0 ${
                isSelected
                  ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(229,9,20,0.6)]'
                  : 'bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/5'
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>

      {/* Filter Dropdowns Row */}
      <div className="flex flex-wrap items-center gap-2.5 pt-1">
        {type !== 'anime' && (
          <div className="flex items-center p-1 rounded-2xl bg-white/5 border border-white/10">
            {INDUSTRY_OPTIONS.map(([val, label]) => (
              <button
                key={val || 'all'}
                type="button"
                onClick={() => setFilter('industry', val)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                  currentIndustry === val
                    ? 'bg-white/15 text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Genre Selector */}
        <select
          value={currentGenre}
          onChange={(e) => setFilter('genre', e.target.value)}
          className={`h-9 px-3.5 rounded-2xl text-xs font-bold outline-none cursor-pointer border transition-colors ${
            currentGenre
              ? 'bg-red-600/20 text-red-300 border-red-500/50'
              : 'bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10'
          }`}
        >
          <option value="" className="bg-[#12141c] text-white">All Genres</option>
          {genres.map((g) => (
            <option key={g} value={g} className="bg-[#12141c] text-white">
              {g}
            </option>
          ))}
        </select>

        {/* Year Selector */}
        <select
          value={currentYear}
          onChange={(e) => setFilter('year', e.target.value)}
          className={`h-9 px-3.5 rounded-2xl text-xs font-bold outline-none cursor-pointer border transition-colors ${
            currentYear
              ? 'bg-red-600/20 text-red-300 border-red-500/50'
              : 'bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10'
          }`}
        >
          <option value="" className="bg-[#12141c] text-white">All Years</option>
          {years.map((y) => (
            <option key={y} value={String(y)} className="bg-[#12141c] text-white">
              {y}
            </option>
          ))}
        </select>

        {/* Language Selector */}
        <select
          value={currentLang}
          onChange={(e) => setFilter('lang', e.target.value)}
          className={`h-9 px-3.5 rounded-2xl text-xs font-bold outline-none cursor-pointer border transition-colors ${
            currentLang
              ? 'bg-red-600/20 text-red-300 border-red-500/50'
              : 'bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10'
          }`}
        >
          <option value="" className="bg-[#12141c] text-white">All Languages</option>
          {LANGUAGES.map((l) => (
            <option key={l} value={l} className="bg-[#12141c] text-white">
              {l}
            </option>
          ))}
        </select>

        {/* Sort Selector */}
        <select
          value={currentSort === 'new' ? '' : currentSort}
          onChange={(e) => setFilter('sort', e.target.value)}
          className={`h-9 px-3.5 rounded-2xl text-xs font-bold outline-none cursor-pointer border transition-colors ${
            currentSort !== 'new'
              ? 'bg-red-600/20 text-red-300 border-red-500/50'
              : 'bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10'
          }`}
        >
          <option value="" className="bg-[#12141c] text-white">Sort: Newest First</option>
          {SORT_OPTIONS.map(([val, label]) => (
            <option key={val} value={val} className="bg-[#12141c] text-white">
              Sort: {label}
            </option>
          ))}
        </select>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="flex items-center gap-1.5 h-9 px-3.5 rounded-2xl bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white border border-white/10 text-xs font-bold transition-colors ml-auto"
          >
            <FaTimes className="text-[10px]" /> Clear
          </button>
        )}
      </div>
    </div>
  );
}

export default YupflixFilterBar;
