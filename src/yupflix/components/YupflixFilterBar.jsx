import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const TYPE_TABS = [
  ['', 'All', '/filmsclub'],
  ['movie', 'Movies', '/filmsclub/browse/movie'],
  ['series', 'Series', '/filmsclub/browse/series'],
  ['anime', 'Anime', '/filmsclub/browse/anime']
];

const LANGUAGES = [
  'Hindi', 'English', 'Dual Audio', 'Punjabi', 'Tamil',
  'Telugu', 'Korean', 'Bengali', 'Malayalam', 'Marathi',
  'Kannada', 'Chinese'
];

const SORT_OPTIONS = [
  ['popular', 'Popularity'],
  ['year', 'Release year']
];

const INDUSTRY_OPTIONS = [
  ['', 'All'],
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

  const Dropdown = ({ value, filterKey, placeholder, options }) => (
    <select
      className={'fc' + (value ? ' set' : '')}
      value={value}
      aria-label={placeholder}
      onChange={e => setFilter(filterKey, e.target.value)}
    >
      <option value="">{placeholder}</option>
      {options.map(([val, label]) => (
        <option key={val} value={val}>{label}</option>
      ))}
    </select>
  );

  return (
    <div className="fbar">
      <div className="frow filt no-sb">
        {TYPE_TABS.map(([tKey, label, basePath]) => (
          <Link
            key={tKey}
            to={`${basePath}${buildQueryString()}`}
            className={type === tKey ? 'on' : ''}
            aria-current={type === tKey ? 'page' : undefined}
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="frow no-sb">
        {type !== 'anime' && (
          <>
            <div className="segn">
              {INDUSTRY_OPTIONS.map(([val, label]) => (
                <button
                  key={val || 'all'}
                  type="button"
                  aria-pressed={currentIndustry === val}
                  onClick={() => setFilter('industry', val)}
                >
                  {label}
                </button>
              ))}
            </div>
            <span className="gap" />
          </>
        )}

        <Dropdown
          value={currentGenre}
          filterKey="genre"
          placeholder="Genre"
          options={genres.map(g => [g, g])}
        />

        <Dropdown
          value={currentYear}
          filterKey="year"
          placeholder="Year"
          options={years.map(y => [String(y), String(y)])}
        />

        <Dropdown
          value={currentLang}
          filterKey="lang"
          placeholder="Language"
          options={LANGUAGES.map(l => [l, l])}
        />

        <select
          className={'fc' + (currentSort === 'new' ? '' : ' set')}
          value={currentSort === 'new' ? '' : currentSort}
          aria-label="Sort"
          onChange={e => setFilter('sort', e.target.value)}
        >
          <option value="">Newest added</option>
          {SORT_OPTIONS.map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>

        {hasActiveFilters && (
          <button type="button" className="clr" onClick={clearAllFilters}>
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
