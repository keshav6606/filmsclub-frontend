import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { loadSearchIndex, searchTitles } from '../services/yupflixSearch';
import { YupflixCard } from '../components/YupflixCard';
import { BiSearch } from 'react-icons/bi';

const TYPE_TABS = [
  ['', 'All Titles'],
  ['movie', 'Movies'],
  ['series', 'Web Series'],
  ['anime', 'Anime']
];

export function YupflixSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const currentType = searchParams.get('t') || '';

  const [results, setResults] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    loadSearchIndex()
      .then(() => {
        if (active) {
          setLoaded(true);
          setResults(searchTitles(query, 300));
        }
      })
      .catch(() => {
        if (active) setLoaded(true);
      });

    return () => { active = false; };
  }, [query]);

  const counts = useMemo(() => ({
    '': results.length,
    movie: results.filter(r => r.type === 'movie').length,
    series: results.filter(r => r.type === 'series').length,
    anime: results.filter(r => r.type === 'anime').length
  }), [results]);

  const filteredResults = currentType
    ? results.filter(r => r.type === currentType)
    : results;

  const handleTabChange = (tKey) => {
    const params = new URLSearchParams(searchParams);
    if (tKey) {
      params.set('t', tKey);
    } else {
      params.delete('t');
    }
    setSearchParams(params, { replace: true });
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-outfit font-black text-2xl sm:text-3xl text-white">
            {query ? `Search Results for "${query}"` : 'Browse Catalog'}
          </h2>
          {query && loaded && (
            <p className="text-zinc-400 text-xs sm:text-sm mt-1">
              Found {results.length} title{results.length === 1 ? '' : 's'} matching your query
            </p>
          )}
        </div>
      </div>

      {/* Tabs */}
      {query && loaded && results.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto no-sb mb-6">
          {TYPE_TABS.map(([tKey, label]) => {
            const isSel = currentType === tKey;
            return (
              <button
                key={tKey || 'all'}
                type="button"
                onClick={() => handleTabChange(tKey)}
                className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-outfit font-bold transition-all shrink-0 ${
                  isSel
                    ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(229,9,20,0.6)]'
                    : 'bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/5'
                }`}
              >
                {label} <span className="text-[11px] opacity-70 ml-1 font-mono">({counts[tKey]})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Results Grid */}
      {query ? (
        !loaded ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4 sm:gap-6">
            {Array.from({ length: 14 }).map((_, idx) => (
              <div key={idx} className="aspect-[2/3] rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-14 text-center bg-[#12141c]/50 rounded-3xl border border-white/10 my-8">
            <BiSearch className="text-5xl text-zinc-600 mb-3" />
            <h4 className="font-outfit font-bold text-lg text-white mb-1">
              No Titles Match "{query}"
            </h4>
            <p className="text-zinc-400 text-xs sm:text-sm max-w-sm">
              Check the spelling or try searching for another actor, movie, or series title.
            </p>
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-14 text-center bg-[#12141c]/50 rounded-3xl border border-white/10 my-8">
            <h4 className="font-outfit font-bold text-lg text-white mb-1">
              No {TYPE_TABS.find(([k]) => k === currentType)?.[1]} found
            </h4>
            <p className="text-zinc-400 text-xs sm:text-sm">
              Try switching back to the "All Titles" tab.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4 sm:gap-6">
            {filteredResults.map((item) => (
              <YupflixCard key={item.code} item={item} />
            ))}
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center p-16 text-center text-zinc-400">
          <BiSearch className="text-5xl text-zinc-600 mb-3" />
          <h4 className="font-outfit font-bold text-lg text-white mb-1">
            Search FilmsClub VIP Cinema
          </h4>
          <p className="text-xs sm:text-sm max-w-sm">
            Type any movie, web series, or anime in the search bar above to begin.
          </p>
        </div>
      )}
    </div>
  );
}

export default YupflixSearch;
