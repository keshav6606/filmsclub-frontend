import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { loadSearchIndex, searchTitles } from '../services/search';
import { TitleCard } from '../components/TitleCard';

const TYPE_TABS = [
  ['', 'All'],
  ['movie', 'Movies'],
  ['series', 'Series'],
  ['anime', 'Anime']
];

export function SearchPage() {
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
    <div className="searchpage">
      <section className="sec">
        <header>
          <h2>{query ? `Results for "${query}"` : 'Search'}</h2>
          {query && loaded && (
            <span className="sub">{results.length} title{results.length === 1 ? '' : 's'}</span>
          )}
        </header>

        {query && loaded && results.length > 0 && (
          <div className="frow filt no-sb" style={{ marginBottom: 18 }}>
            {TYPE_TABS.map(([tKey, label]) => (
              <button
                key={tKey || 'all'}
                type="button"
                aria-pressed={currentType === tKey}
                onClick={() => handleTabChange(tKey)}
              >
                {label} <span className="scnt">{counts[tKey]}</span>
              </button>
            ))}
          </div>
        )}

        {query ? (
          loaded ? (
            results.length === 0 ? (
              <div className="empty">
                <b>No titles match "{query}"</b>
                Check the spelling or try a shorter name.
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="empty">
                <b>No {TYPE_TABS.find(([k]) => k === currentType)?.[1]?.toLowerCase()} match "{query}"</b>
                Try the All tab.
              </div>
            ) : (
              <div className="grid">
                {filteredResults.map(item => (
                  <TitleCard key={item.code} item={item} />
                ))}
              </div>
            )
          ) : (
            <div className="grid">
              {Array.from({ length: 12 }).map((_, idx) => (
                <div key={idx} className="sk" style={{ aspectRatio: '2/3' }} />
              ))}
            </div>
          )
        ) : (
          <div className="empty">
            <b>Find something to watch</b>
            Type a title in the search bar above.
          </div>
        )}
      </section>
    </div>
  );
}
