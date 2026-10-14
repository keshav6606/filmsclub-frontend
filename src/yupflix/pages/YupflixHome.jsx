import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { yupflixApi } from '../services/yupflixApi';
import { YupflixSpotlight } from '../components/YupflixSpotlight';
import { YupflixPlatformFilter, RankedRail, YupflixRail } from '../components/YupflixPlatformFilter';
import { YupflixFilterBar } from '../components/YupflixFilterBar';
import { YupflixCard } from '../components/YupflixCard';
import AdBanner from '../../components/AdBanner';
import { PROVIDERS_MAP } from '../utils/yupflixHelpers';
import { FaFilm, FaTv, FaBolt, FaSyncAlt } from 'react-icons/fa';

const FILTER_KEYS = ['prov', 'genre', 'year', 'lang', 'industry'];

const SECTION_TITLES = {
  movie: 'Trending Movies Today',
  series: 'Trending Web Series',
  anime: 'Trending Anime & Animation'
};

const BROWSE_ALL_TITLES = {
  movie: 'All Movies Catalog',
  series: 'All Web Series Collection',
  anime: 'Anime Library'
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
  const provKey = (searchParams.get('prov') || '').toLowerCase();
  const activeProvider = PROVIDERS_MAP[provKey] || null;

  const isDefaultFilter =
    !['prov', 'genre', 'year', 'lang'].some((k) => searchParams.get(k)) &&
    (searchParams.get('sort') || 'new') === 'new';

  const trendingTitle = SECTION_TITLES[type] || 'Trending on FilmsClub';
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
  const [dbFeaturedMovies, setDbFeaturedMovies] = useState([]);
  const [dbCinemaDrops, setDbCinemaDrops] = useState([]);

  // Fetch Database movies to mix into Hero and Rails
  useEffect(() => {
    fetch('https://screeching-cherye-filmy4uhd-b60bef55.koyeb.app/api/movies?sort_by=rating:desc&page=1&page_size=6')
      .then((r) => r.json())
      .then((d) => {
        if (d?.movies?.length) {
          const mapped = d.movies.map((m) => ({
            ...m,
            code: null,
            tmdb_id: m.tmdb_id,
            poster: m.poster,
            backdrop: m.backdrop || m.poster,
            title: m.title,
            year: m.release_year,
            type: m.media_type || 'movie',
            genres: m.genres || ['4K Cinema'],
            qualities: [m.rip || '4K UHD', '1080p'],
            rating: m.rating || 8.5,
          }));
          setDbFeaturedMovies(mapped);
        }
      })
      .catch(() => {});

    fetch('https://screeching-cherye-filmy4uhd-b60bef55.koyeb.app/api/movies?sort_by=updated_on:desc&page=1&page_size=14')
      .then((r) => r.json())
      .then((d) => {
        if (d?.movies?.length) {
          const mapped = d.movies.map((m) => ({
            ...m,
            code: null,
            tmdb_id: m.tmdb_id,
            poster: m.poster,
            backdrop: m.backdrop || m.poster,
            title: m.title,
            year: m.release_year,
            type: m.media_type || 'movie',
            genres: m.genres || ['4K Cinema'],
            qualities: [m.rip || '4K UHD', '1080p'],
            rating: m.rating || 8.0,
          }));
          setDbCinemaDrops(mapped);
        }
      })
      .catch(() => {});
  }, []);

  // Auto scroll to catalog when provider changes
  useEffect(() => {
    if (provKey) {
      const el = document.getElementById('catalog-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [provKey]);

  useEffect(() => {
    const ctrl = new AbortController();
    yupflixApi.genres(type, ctrl.signal).then((d) => setGenres(d.genres || [])).catch(() => {});
    return () => ctrl.abort();
  }, [type]);

  useEffect(() => {
    if (!isDefaultFilter) {
      setTrending([]);
      return;
    }
    const ctrl = new AbortController();
    yupflixApi.trending(type, industry, ctrl.signal).then((d) => setTrending(d.trending || [])).catch(() => {});
    return () => ctrl.abort();
  }, [isDefaultFilter, type, industry]);

  useEffect(() => {
    if (!showFeaturedRails) {
      setNewSeries([]);
      setLatestMovies([]);
      return;
    }
    const ctrl = new AbortController();
    yupflixApi.browse('type=series&page=1&limit=14', ctrl.signal).then((d) => setNewSeries(d.items || [])).catch(() => {});
    yupflixApi.browse('type=movie&page=1&limit=14', ctrl.signal).then((d) => setLatestMovies(d.items || [])).catch(() => {});
    return () => ctrl.abort();
  }, [showFeaturedRails]);

  const KOYEB_BASE = 'https://screeching-cherye-filmy4uhd-b60bef55.koyeb.app';

  // Helper to fetch Koyeb database items by type and page
  const fetchKoyebItems = async (browseType, pageNum, signal) => {
    try {
      if (browseType === 'series') {
        const res = await fetch(`${KOYEB_BASE}/api/tvshows?page=${pageNum}&page_size=18&sort_by=updated_on:desc`, { signal });
        const data = await res.json();
        return (data?.tv_shows || []).map(s => ({
          ...s,
          code: null,
          tmdb_id: s.tmdb_id,
          poster: s.poster,
          backdrop: s.backdrop || s.poster,
          title: s.title,
          year: s.release_year,
          type: 'series',
          media_type: 'tv',
          qualities: [s.rip || '1080p Web-DL'],
          genres: s.genres || ['Web Series'],
          rating: s.rating || 8.5,
          isDatabase: true,
          latestLabel: `${s.total_seasons || 1} Season`,
        }));
      } else {
        const sort = browseType === 'movie' ? 'updated_on:desc' : 'rating:desc';
        const res = await fetch(`${KOYEB_BASE}/api/movies?page=${pageNum}&page_size=18&sort_by=${sort}`, { signal });
        const data = await res.json();
        return (data?.movies || []).map(m => ({
          ...m,
          code: null,
          tmdb_id: m.tmdb_id,
          poster: m.poster,
          backdrop: m.backdrop || m.poster,
          title: m.title,
          year: m.release_year,
          type: 'movie',
          media_type: 'movie',
          qualities: [m.rip || '4K UHD', '1080p'],
          genres: m.genres || ['4K Cinema'],
          rating: m.rating || 8.2,
          isDatabase: true,
        }));
      }
    } catch {
      return [];
    }
  };

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    setPage(1);
    const p = new URLSearchParams(queryString);
    p.set('page', '1');
    p.set('limit', '28');

    Promise.all([
      yupflixApi.browse(p.toString(), ctrl.signal).catch(() => ({ items: [] })),
      fetchKoyebItems(type, 1, ctrl.signal),
    ])
      .then(([yupData, koyebItems]) => {
        const yupItems = yupData?.items || [];
        // Interleave Database 4K files and Scraped releases into one cohesive grid
        const combined = [];
        const seen = new Set();
        const maxLen = Math.max(koyebItems.length, yupItems.length);
        for (let i = 0; i < maxLen; i++) {
          if (koyebItems[i]) {
            const norm = koyebItems[i].title.toLowerCase().replace(/[^a-z0-9]/g, '');
            if (!seen.has(norm)) {
              seen.add(norm);
              combined.push(koyebItems[i]);
            }
          }
          if (yupItems[i]) {
            const norm = yupItems[i].title.toLowerCase().replace(/[^a-z0-9]/g, '');
            if (!seen.has(norm)) {
              seen.add(norm);
              combined.push(yupItems[i]);
            }
          }
        }
        setItems(combined);
        setTotalCount((yupData?.total || yupItems.length) + koyebItems.length);
        setHasMore(!!yupData?.hasMore || koyebItems.length >= 18);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    return () => ctrl.abort();
  }, [queryString, type]);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    const nextPage = page + 1;
    const p = new URLSearchParams(queryString);
    p.set('page', String(nextPage));
    p.set('limit', '28');

    try {
      const [yupData, koyebItems] = await Promise.all([
        yupflixApi.browse(p.toString()).catch(() => ({ items: [] })),
        fetchKoyebItems(type, nextPage),
      ]);
      const yupItems = yupData?.items || [];
      const combined = [];
      const seen = new Set(items.map((it) => it.title.toLowerCase().replace(/[^a-z0-9]/g, '')));
      const maxLen = Math.max(koyebItems.length, yupItems.length);
      for (let i = 0; i < maxLen; i++) {
        if (koyebItems[i]) {
          const norm = koyebItems[i].title.toLowerCase().replace(/[^a-z0-9]/g, '');
          if (!seen.has(norm)) {
            seen.add(norm);
            combined.push(koyebItems[i]);
          }
        }
        if (yupItems[i]) {
          const norm = yupItems[i].title.toLowerCase().replace(/[^a-z0-9]/g, '');
          if (!seen.has(norm)) {
            seen.add(norm);
            combined.push(yupItems[i]);
          }
        }
      }
      setItems((prev) => [...prev, ...combined]);
      setPage(nextPage);
      setHasMore(!!yupData?.hasMore || koyebItems.length >= 18);
    } finally {
      setLoadingMore(false);
    }
  };

  const spotlightItems = isDefaultFilter
    ? [...trending.slice(0, 4), ...dbFeaturedMovies.slice(0, 4)]
    : [];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* 1. Cinematic Spotlight Billboard */}
      {spotlightItems.length > 0 && <YupflixSpotlight items={spotlightItems} />}

      {/* 2. OTT Platform Filter Rail */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="font-outfit font-black text-lg sm:text-xl text-white">
            Browse By OTT Network
          </h3>
          <span className="text-xs text-zinc-400">Direct CDN Access</span>
        </div>
        <YupflixPlatformFilter />
      </section>

      {/* Responsive In-Feed Ad Banner */}
      <AdBanner slot="5754054742" className="my-8" />

      {/* 3. Top 10 Ranked Rail */}
      {isDefaultFilter && trending.length > 0 && (
        <RankedRail title={trendingTitle} items={trending} />
      )}

      {/* 4. Curated Featured Rails for Series & Movies */}
      {showFeaturedRails && (
        <>
          <YupflixRail
            title="Fresh Episodes & Web Series"
            to="/filmsclub/browse/series"
            items={newSeries}
          />
          <YupflixRail
            title="Latest Blockbuster Releases"
            to="/filmsclub/browse/movie"
            items={latestMovies}
          />
          {dbCinemaDrops.length > 0 && (
            <YupflixRail
              title="4K Cinema Premieres & Hindi Dubbed"
              to="/movies"
              items={dbCinemaDrops}
            />
          )}
        </>
      )}

      {/* 5. Main Catalog Grid & Filters */}
      <section className="mt-8 sm:mt-12" id="catalog-section">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 px-1">
          <div className="flex items-center gap-3">
            {activeProvider ? (
              <div className="flex items-center gap-3">
                {activeProvider.img ? (
                  <img
                    src={`/providers/${activeProvider.img}.jpeg`}
                    alt=""
                    className="w-10 h-10 rounded-xl object-cover border border-cyan-400/50 shadow-[0_0_15px_rgba(0,242,254,0.4)]"
                  />
                ) : (
                  <span
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shadow-md"
                    style={{ background: activeProvider.bg || '#222', color: activeProvider.fg || '#fff' }}
                  >
                    {activeProvider.label || activeProvider.name.slice(0, 2)}
                  </span>
                )}
                <div>
                  <h2 className="font-outfit font-black text-2xl sm:text-3xl text-white tracking-tight flex items-center gap-2">
                    {activeProvider.name} <span className="text-cyan-400 text-lg sm:text-xl font-normal">Catalog</span>
                  </h2>
                  <p className="text-xs text-zinc-400">Streaming releases & originals from {activeProvider.name}</p>
                </div>
              </div>
            ) : (
              <h2 className="font-outfit font-black text-2xl sm:text-3xl text-white tracking-tight">
                {BROWSE_ALL_TITLES[type] || 'Browse Full Library'}
              </h2>
            )}

            {!loading && totalCount > 0 && (
              <span className="text-xs font-bold text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/30 ml-2">
                {totalCount.toLocaleString()} Titles
              </span>
            )}
          </div>
        </div>

        {/* Filter Bar */}
        <YupflixFilterBar type={type} genres={genres} />

        {/* Media Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4 sm:gap-6">
            {Array.from({ length: 14 }).map((_, idx) => (
              <div
                key={idx}
                className="aspect-[2/3] rounded-2xl bg-white/5 animate-pulse border border-white/5"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-[#12141c]/50 rounded-3xl border border-white/10 my-8">
            <span className="text-4xl mb-3">🔍</span>
            <h4 className="font-outfit font-bold text-lg text-white mb-1">
              No Titles Match Active Filters
            </h4>
            <p className="text-zinc-400 text-xs sm:text-sm max-w-sm mb-4">
              Try resetting selected genres or industries to view more titles.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4 sm:gap-6">
            {items.map((item) => (
              <YupflixCard key={item.code} item={item} />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {hasMore && !loading && (
          <div className="flex justify-center mt-12 mb-8">
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-outfit font-bold text-sm border border-white/10 hover:border-white/20 transition-all shadow-lg hover:scale-105 disabled:opacity-50"
            >
              {loadingMore ? (
                <>
                  <FaSyncAlt className="animate-spin text-xs" />
                  Loading More Cinema...
                </>
              ) : (
                'Load More Titles'
              )}
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

export default YupflixHome;
