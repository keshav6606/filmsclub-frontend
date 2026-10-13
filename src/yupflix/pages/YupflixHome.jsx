import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { yupflixApi } from '../services/yupflixApi';
import { YupflixSpotlight } from '../components/YupflixSpotlight';
import { YupflixPlatformFilter, RankedRail, YupflixRail } from '../components/YupflixPlatformFilter';
import { YupflixFilterBar } from '../components/YupflixFilterBar';
import { YupflixCard } from '../components/YupflixCard';

const FILTER_KEYS = ['prov', 'genre', 'year', 'lang', 'industry'];

const SECTION_TITLES = {
  movie: 'Trending movies',
  series: 'Trending series',
  anime: 'Trending anime'
};

const BROWSE_ALL_TITLES = {
  movie: 'All movies',
  series: 'All series',
  anime: 'All anime'
};

export function YupflixCatalogView({ type = '' }) {
  const [searchParams] = useSearchParams();

  const queryString = useMemo(() => {
    const p = new URLSearchParams();
    if (type) p.set('type', type);
    for (const k of [...FILTER_KEYS, 'sort']) {
      const val = searchParams.get(k);
      if (val) p.set(k, val);
    }
    return p.toString();
  }, [type, searchParams]);

  const industry = searchParams.get('industry') || '';
  const isDefaultFilter = !['prov', 'genre', 'year', 'lang'].some(k => searchParams.get(k)) &&
    (searchParams.get('sort') || 'new') === 'new';

  const trendingTitle = SECTION_TITLES[type] || 'Trending now';
  const showFeaturedRails = type === '' && isDefaultFilter && !industry;

  const [items, setItems] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [genres, setGenres] = useState([]);
  const [trending, setTrending] = useState([]);
  const [newSeries, setNewSeries] = useState([]);
  const [latestMovies, setLatestMovies] = useState([]);

  useEffect(() => {
    const ctrl = new AbortController();
    yupflixApi.genres(type, ctrl.signal).then(d => setGenres(d.genres || [])).catch(() => {});
    return () => ctrl.abort();
  }, [type]);

  useEffect(() => {
    if (!isDefaultFilter) {
      setTrending([]);
      return;
    }
    const ctrl = new AbortController();
    yupflixApi.trending(type, industry, ctrl.signal).then(d => setTrending(d.trending || [])).catch(() => {});
    return () => ctrl.abort();
  }, [isDefaultFilter, type, industry]);

  useEffect(() => {
    if (!showFeaturedRails) {
      setNewSeries([]);
      setLatestMovies([]);
      return;
    }
    const ctrl = new AbortController();
    yupflixApi.browse('type=series&page=1&limit=14', ctrl.signal).then(d => setNewSeries(d.items || [])).catch(() => {});
    yupflixApi.browse('type=movie&page=1&limit=14', ctrl.signal).then(d => setLatestMovies(d.items || [])).catch(() => {});
    return () => ctrl.abort();
  }, [showFeaturedRails]);

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    setPage(1);
    const p = new URLSearchParams(queryString);
    p.set('page', '1');
    p.set('limit', '42');

    yupflixApi.browse(p.toString(), ctrl.signal)
      .then(d => {
        setItems(d.items || []);
        setTotalCount(d.total || (d.items?.length || 0));
        setHasMore(!!d.hasMore);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    return () => ctrl.abort();
  }, [queryString]);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    const nextPage = page + 1;
    const p = new URLSearchParams(queryString);
    p.set('page', String(nextPage));
    p.set('limit', '42');

    try {
      const res = await yupflixApi.browse(p.toString());
      setItems(prev => [...prev, ...(res.items || [])]);
      setPage(nextPage);
      setHasMore(!!res.hasMore);
    } finally {
      setLoadingMore(false);
    }
  };

  const spotlightItems = isDefaultFilter ? trending.slice(0, 5) : [];

  return (
    <div className="catalog">
      {spotlightItems.length > 0 && <YupflixSpotlight items={spotlightItems} />}

      <section className="sec platforms">
        <header>
          <h2>Browse by platform</h2>
        </header>
        <YupflixPlatformFilter />
      </section>

      {isDefaultFilter && trending.length > 0 && (
        <RankedRail title={trendingTitle} items={trending} />
      )}

      {showFeaturedRails && (
        <>
          <YupflixRail title="New episodes" to="/yupflix/browse/series" items={newSeries} />
          <YupflixRail title="Latest movies" to="/yupflix/browse/movie" items={latestMovies} />
        </>
      )}

      <section className="sec" id="browse">
        <header>
          <h2>{BROWSE_ALL_TITLES[type] || 'Browse all'}</h2>
          {!loading && <span className="sub">{totalCount.toLocaleString()} titles</span>}
        </header>

        <YupflixFilterBar type={type} genres={genres} />

        {loading ? (
          <div className="grid">
            {Array.from({ length: 14 }).map((_, idx) => (
              <div key={idx} className="sk" style={{ aspectRatio: '2/3' }} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="empty">
            <b>No titles match these filters</b>
            Try removing a filter to see more.
          </div>
        ) : (
          <div className="grid">
            {items.map(item => (
              <YupflixCard key={item.code} item={item} />
            ))}
          </div>
        )}

        {hasMore && !loading && (
          <div className="more">
            <button
              type="button"
              className="ghost"
              onClick={handleLoadMore}
              disabled={loadingMore}
            >
              {loadingMore ? 'Loading…' : 'Show more'}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export function YupflixHome() {
  return <YupflixCatalogView type="" />;
}

export function YupflixBrowse() {
  const { type = '' } = useParams();
  const normalizedType = type === 'all' ? '' : type;
  return <YupflixCatalogView key={normalizedType} type={normalizedType} />;
}
