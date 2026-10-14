import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { yupflixApi, getYupflixDownloadUrl } from '../services/yupflixApi';
import {
  cleanTitle,
  filterGenres,
  formatQuality,
  formatSize,
  parseMediaInfo,
  parseSeasonEpisode,
  extractEpisodeNumber,
  sortSources,
  TYPE_LABELS
} from '../utils/yupflixHelpers';
import { YupflixRail } from '../components/YupflixPlatformFilter';
import { YupflixPlayerModal } from '../components/YupflixPlayerModal';
import {
  FaPlay,
  FaDownload,
  FaArrowLeft,
  FaStar,
  FaBookmark,
  FaCheck,
  FaLayerGroup,
  FaTv,
  FaFilm,
  FaSlidersH
} from 'react-icons/fa';

export function YupflixDetail() {
  const { code = '' } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const stateCard = location.state?.card;

  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [newestFirst, setNewestFirst] = useState(true);
  const [seriesTab, setSeriesTab] = useState('episodes');
  const [preferredQuality, setPreferredQuality] = useState('1080p');
  const [isSaved, setIsSaved] = useState(false);

  // Video Player Modal State
  const [playingSource, setPlayingSource] = useState(null);
  const [playingTitle, setPlayingTitle] = useState('');
  const [playingEpMeta, setPlayingEpMeta] = useState(null);

  useEffect(() => {
    const ctrl = new AbortController();
    setData(null);
    setError(false);
    setSelectedSeason(null);
    setNewestFirst(true);
    setSeriesTab('episodes');

    yupflixApi.title(code, ctrl.signal)
      .then(d => setData(d))
      .catch(() => setError(true));

    window.scrollTo(0, 0);
    return () => ctrl.abort();
  }, [code]);

  // Check Watchlist status
  useEffect(() => {
    try {
      const list = JSON.parse(localStorage.getItem('filmsclub_watchlist') || '[]');
      setIsSaved(list.some(it => it.code === code));
    } catch {}
  }, [code]);

  const toggleWatchlist = (item) => {
    try {
      const list = JSON.parse(localStorage.getItem('filmsclub_watchlist') || '[]');
      let nextList;
      if (isSaved) {
        nextList = list.filter(it => it.code !== code);
        setIsSaved(false);
      } else {
        nextList = [...list, { ...item, code, title: cleanTitle(item.title) }];
        setIsSaved(true);
      }
      localStorage.setItem('filmsclub_watchlist', JSON.stringify(nextList));
      window.dispatchEvent(new Event('watchlistUpdated'));
    } catch {}
  };

  const titleInfo = data?.title ?? stateCard;

  if (!titleInfo && error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 py-20 text-zinc-300">
        <h2 className="text-2xl font-bold font-outfit text-white mb-2">Title Not Found</h2>
        <p className="text-zinc-400 text-sm mb-6">The requested movie or series could not be loaded.</p>
        <Link
          to="/filmsclub"
          className="px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(229,9,20,0.5)] transition-all"
        >
          Return to FilmsClub Home
        </Link>
      </div>
    );
  }

  if (!titleInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-24">
        <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin shadow-[0_0_25px_rgba(229,9,20,0.5)]" />
        <span className="text-zinc-400 text-xs font-semibold mt-4">Loading Cinema Data...</span>
      </div>
    );
  }

  const rawTitle = data?.title ?? (stateCard?.sources?.length ? {
    ...stateCard,
    genres: stateCard.genres || [],
    languages: [],
    tags: [],
    qualities: [],
    sources: stateCard.sources
  } : undefined);

  const episodes = rawTitle ? rawTitle.sources.filter(s => s.kind === 'episode') : [];
  const zips = rawTitle ? rawTitle.sources.filter(s => s.kind === 'zip') : [];
  const movieSources = rawTitle ? rawTitle.sources.filter(s => s.kind !== 'episode' && s.kind !== 'zip').sort(sortSources) : [];

  const isSeries = episodes.length > 0 || zips.length > 0;
  const latestParsed = parseSeasonEpisode(rawTitle?.latestLabel);

  const availableSeasons = [...new Set([...episodes, ...zips].map(s => s.season || 1))].sort((a, b) => b - a);
  const defaultSeason = latestParsed?.season && availableSeasons.includes(latestParsed.season) ? latestParsed.season : availableSeasons[0];
  const activeSeason = selectedSeason != null && availableSeasons.includes(selectedSeason) ? selectedSeason : defaultSeason;

  const groupSources = (list, fallbackLabel) => {
    const map = new Map();
    for (const item of list) {
      const lbl = item.label || fallbackLabel;
      if (!map.has(lbl)) map.set(lbl, []);
      map.get(lbl).push(item);
    }
    return [...map.entries()].map(([lbl, items]) => ({
      label: lbl,
      num: extractEpisodeNumber(lbl),
      list: items
    }));
  };

  const seasonEpisodes = episodes.filter(s => (s.season || 1) === activeSeason);
  const seasonZips = zips.filter(s => (s.season || 1) === activeSeason);

  const groupedEpisodes = groupSources(seasonEpisodes, 'Episode').sort((a, b) =>
    newestFirst ? b.num - a.num : a.num - b.num
  );
  const groupedZips = groupSources(seasonZips, 'Complete Season');

  const hasEp = groupedEpisodes.length > 0;
  const hasZip = groupedZips.length > 0;
  const activeTab = hasEp && hasZip ? seriesTab : (hasEp ? 'episodes' : 'zips');

  const cleanTitleName = cleanTitle(titleInfo.title);
  const typeStr = TYPE_LABELS[titleInfo.type] || (isSeries ? 'Series' : 'Movie');
  const genresList = filterGenres(rawTitle?.genres ?? titleInfo.genres);

  const movieFirstSourceInfo = parseMediaInfo((movieSources[0] || rawTitle?.sources?.[0])?.label);
  const audioStr = movieFirstSourceInfo.audio || (rawTitle?.languages?.length ? rawTitle.languages.join(', ') : '');
  const sourceStr = movieFirstSourceInfo.source || '';
  const qualitiesBadges = [...new Set((rawTitle?.qualities?.length ? rawTitle.qualities : (rawTitle?.sources || []).map(s => s.quality)).filter(Boolean))];
  const uniqueEpisodeCount = new Set(episodes.map(s => `${s.season || 1}|${s.label}`)).size;
  const overviewText = rawTitle?.overview && rawTitle.overview.trim().length > 40 ? rawTitle.overview.trim() : '';

  const bestMovieSource = movieSources.find(s => s.quality === '1080p') || movieSources.find(s => s.quality === '2160p') || movieSources[0];
  const latestEpList = latestParsed?.ep
    ? episodes.filter(s => (s.season || 1) === defaultSeason && extractEpisodeNumber(s.label) === latestParsed.ep).sort(sortSources)
    : [];
  const bestLatestEp = latestEpList.find(s => s.quality === preferredQuality) || latestEpList[0] || episodes[0];

  const facts = [
    titleInfo.year ? ['Released', String(titleInfo.year)] : null,
    isSeries && availableSeasons.length ? ['Total Seasons', String(availableSeasons.length)] : null,
    isSeries && rawTitle?.latestLabel ? ['Latest Episode', rawTitle.latestLabel] : null,
    audioStr ? ['Audio Tracks', audioStr] : null,
    sourceStr ? ['Master Source', sourceStr] : null,
    genresList.length ? ['Genres', genresList.join(', ')] : null
  ].filter(Boolean);

  const openPlayer = (src, titleSuffix = '', epMeta = null) => {
    setPlayingSource(src);
    setPlayingTitle(`${cleanTitleName} ${titleSuffix}`);
    setPlayingEpMeta(epMeta);
  };

  return (
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-20">
      {/* Active Cinema Video Player Modal */}
      {playingSource && (
        <YupflixPlayerModal
          title={playingTitle}
          source={playingSource}
          item={rawTitle || titleInfo}
          season={playingEpMeta?.season || activeSeason || 1}
          episode={playingEpMeta?.episode || (latestParsed?.ep || 1)}
          onClose={() => {
            setPlayingSource(null);
            setPlayingEpMeta(null);
          }}
        />
      )}

      {/* Dynamic Ambient Blur Backdrop */}
      {titleInfo.poster && (
        <div className="absolute top-0 inset-x-0 h-96 -z-10 overflow-hidden pointer-events-none opacity-25 filter blur-3xl">
          <img src={titleInfo.poster} alt="" className="w-full h-full object-cover scale-150" />
        </div>
      )}

      {/* Back to FilmsClub Button */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/filmsclub'))}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 text-xs font-bold transition-all"
        >
          <FaArrowLeft className="text-[10px]" />
          Back
        </button>
      </div>

      {/* Hero Presentation Header */}
      <div className="relative grid grid-cols-1 md:grid-cols-12 gap-8 items-start bg-[#12141c]/80 backdrop-blur-2xl p-6 sm:p-8 lg:p-10 rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
        {/* Poster Key Art */}
        <div className="md:col-span-4 lg:col-span-3 flex justify-center">
          <div className="relative aspect-[2/3] w-48 sm:w-56 lg:w-full rounded-2xl overflow-hidden bg-black/80 border border-white/15 shadow-[0_15px_35px_rgba(0,0,0,0.9)]">
            {titleInfo.poster ? (
              <img src={titleInfo.poster} alt={cleanTitleName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-500 font-bold">FilmsClub</div>
            )}
            <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-red-600/90 text-white font-black text-[10px] tracking-wider uppercase font-mono shadow-md">
              {qualitiesBadges[0] || '1080p'}
            </div>
          </div>
        </div>

        {/* Title & Metadata Details */}
        <div className="md:col-span-8 lg:col-span-9 flex flex-col space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30">
              {typeStr}
            </span>
            {titleInfo.year && (
              <span className="text-[11px] font-bold text-zinc-400 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/5">
                {titleInfo.year}
              </span>
            )}
            <span className="flex items-center gap-1 text-amber-400 font-bold text-xs bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-400/20">
              <FaStar className="text-[10px]" /> 8.8 IMDb
            </span>
          </div>

          <h1 className="font-outfit font-black text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
            {cleanTitleName}
          </h1>

          {/* Quick Info Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-300">
            {isSeries ? (
              <>
                {availableSeasons.length > 0 && (
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 font-medium">
                    {availableSeasons.length} Season{availableSeasons.length === 1 ? '' : 's'}
                  </span>
                )}
                {uniqueEpisodeCount > 0 && (
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 font-medium">
                    {uniqueEpisodeCount} Episodes
                  </span>
                )}
              </>
            ) : null}
            {audioStr && (
              <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-400/20 font-medium">
                {audioStr}
              </span>
            )}
            {genresList.map((g) => (
              <span key={g} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 font-medium text-zinc-300">
                {g}
              </span>
            ))}
          </div>

          {/* Resolution Pills */}
          {qualitiesBadges.length > 0 && (
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-xs font-bold text-zinc-400 mr-1">Available in:</span>
              {qualitiesBadges.map((q) => (
                <span
                  key={q}
                  className="text-[11px] font-black uppercase font-mono px-2 py-0.5 rounded bg-white/10 text-zinc-200 border border-white/10"
                >
                  {formatQuality(q)}
                </span>
              ))}
            </div>
          )}

          {/* Prominent Action CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 pt-3">
            {bestMovieSource ? (
              <>
                <button
                  type="button"
                  onClick={() => openPlayer(bestMovieSource, `(${formatQuality(bestMovieSource.quality)})`, { season: 1, episode: 1 })}
                  className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-outfit font-black text-sm sm:text-base tracking-wide shadow-[0_0_25px_rgba(229,9,20,0.5)] hover:shadow-[0_0_35px_rgba(229,9,20,0.8)] hover:scale-105 transition-all duration-300"
                >
                  <FaPlay className="text-xs" />
                  Stream Now ({formatQuality(bestMovieSource.quality)})
                </button>
                <a
                  href={getYupflixDownloadUrl(bestMovieSource.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/10 hover:border-white/20 transition-all"
                >
                  <FaDownload className="text-xs text-zinc-400" />
                  Direct Download
                </a>
              </>
            ) : bestLatestEp ? (
              <>
                <button
                  type="button"
                  onClick={() => openPlayer(bestLatestEp, `Episode ${latestParsed?.ep || 1}`, { season: defaultSeason, episode: latestParsed?.ep || 1 })}
                  className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-outfit font-black text-sm sm:text-base tracking-wide shadow-[0_0_25px_rgba(229,9,20,0.5)] hover:shadow-[0_0_35px_rgba(229,9,20,0.8)] hover:scale-105 transition-all duration-300"
                >
                  <FaPlay className="text-xs" />
                  Play Latest (Ep {latestParsed?.ep || 1})
                </button>
                <a
                  href={getYupflixDownloadUrl(bestLatestEp.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/10 hover:border-white/20 transition-all"
                >
                  <FaDownload className="text-xs text-zinc-400" />
                  Download Ep {latestParsed?.ep || 1}
                </a>
              </>
            ) : null}

            <button
              type="button"
              onClick={() => toggleWatchlist(titleInfo)}
              className={`inline-flex items-center gap-2 px-4 py-3.5 rounded-2xl border text-sm font-bold transition-all ${
                isSaved
                  ? 'bg-amber-400/20 text-amber-400 border-amber-400/40'
                  : 'bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10'
              }`}
            >
              {isSaved ? <FaCheck className="text-amber-400" /> : <FaBookmark className="text-zinc-400" />}
              {isSaved ? 'In Watchlist' : 'Watchlist'}
            </button>
          </div>
        </div>
      </div>

      {/* Stream & Downloads / Series Section */}
      <section className="mt-10">
        {/* Movies Quality Links */}
        {movieSources.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="font-outfit font-black text-xl sm:text-2xl text-white">
                Stream & Download Links
              </h2>
              <span className="text-xs font-bold text-zinc-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                {movieSources.length} Qualities Available
              </span>
            </div>

            <div className="space-y-2.5">
              {movieSources.map((src, idx) => {
                const info = parseMediaInfo(src.label);
                const tagStr = [info.source, info.codec].filter(Boolean).join(' · ');
                return (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-[#12141c]/90 border border-white/10 hover:border-red-500/40 hover:bg-[#161822] transition-all gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="w-16 h-12 rounded-xl bg-black/50 border border-white/10 text-cyan-400 font-mono font-black text-sm flex items-center justify-center shrink-0">
                        {formatQuality(src.quality)}
                      </span>
                      <div>
                        <strong className="block text-white font-outfit text-sm sm:text-base leading-snug">
                          {tagStr || src.label || `${cleanTitleName} ${src.quality}`}
                        </strong>
                        <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
                          {info.audio && <span>{info.audio} Audio</span>}
                          {src.size && (
                            <span className="font-mono text-zinc-300 font-semibold bg-white/5 px-1.5 py-0.5 rounded">
                              {formatSize(src.size)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
                      <button
                        type="button"
                        onClick={() => openPlayer(src, `(${formatQuality(src.quality)})`, { season: 1, episode: 1 })}
                        className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(229,9,20,0.4)] transition-all"
                      >
                        <FaPlay className="text-[10px]" /> Play Online
                      </button>
                      <a
                        href={getYupflixDownloadUrl(src.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center gap-1.5 border border-white/10 transition-colors"
                      >
                        <FaDownload className="text-[10px]" /> Download
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Series Episodes & Packs */}
        {isSeries && (
          <div className="space-y-5 mt-8">
            <div className="flex items-center justify-between px-1">
              <h2 className="font-outfit font-black text-xl sm:text-2xl text-white">
                {activeTab === 'episodes' ? 'Series Episodes' : 'Season Packs'}
              </h2>
              {activeTab === 'episodes' && groupedEpisodes.length > 1 && (
                <button
                  type="button"
                  onClick={() => setNewestFirst((b) => !b)}
                  className="text-xs text-zinc-400 hover:text-white font-bold underline"
                >
                  {newestFirst ? 'Showing Newest First' : 'Showing Oldest First'}
                </button>
              )}
            </div>

            {/* Season Selector Tabs */}
            {availableSeasons.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto no-sb py-1">
                {availableSeasons.map((sNum) => {
                  const isSel = sNum === activeSeason;
                  return (
                    <button
                      key={sNum}
                      type="button"
                      onClick={() => setSelectedSeason(sNum)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                        isSel
                          ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(229,9,20,0.5)]'
                          : 'bg-white/5 hover:bg-white/10 text-zinc-400 border border-white/5'
                      }`}
                    >
                      Season {sNum}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Episodes List */}
            <div className="space-y-2">
              {groupedEpisodes.map((ep) => {
                const epBest = ep.list.find((s) => s.quality === preferredQuality) || ep.list[0];
                return (
                  <div
                    key={ep.label}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-[#12141c]/90 border border-white/10 hover:border-white/20 transition-all gap-3"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="w-10 h-10 rounded-xl bg-red-600/15 border border-red-500/30 text-red-500 font-mono font-black text-sm flex items-center justify-center shrink-0">
                        {ep.num ? String(ep.num).padStart(2, '0') : 'EP'}
                      </span>
                      <div>
                        <span className="text-white font-outfit font-bold text-sm block">
                          {ep.label}
                        </span>
                        <span className="text-zinc-400 text-xs">
                          {ep.list.length} resolution streams available
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      {epBest && (
                        <>
                          <button
                            type="button"
                            onClick={() => openPlayer(epBest, ep.label, { season: activeSeason, episode: ep.num || 1 })}
                            className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-red-600/30 transition-all"
                          >
                            <FaPlay className="text-[9px]" /> Play ({formatQuality(epBest.quality)})
                          </button>
                          <a
                            href={getYupflixDownloadUrl(epBest.url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center gap-1.5 border border-white/10 transition-colors"
                          >
                            <FaDownload className="text-[9px]" /> Download
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* Media Specifications Card */}
      {(facts.length > 0 || overviewText) && (
        <section className="mt-12 p-6 sm:p-8 rounded-3xl bg-[#12141c]/70 border border-white/10">
          <h3 className="font-outfit font-black text-lg sm:text-xl text-white mb-4">
            Production & Technical Specifications
          </h3>
          {overviewText && (
            <p className="text-zinc-300 text-sm leading-relaxed mb-6 max-w-3xl">
              {overviewText}
            </p>
          )}
          {facts.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {facts.map(([k, v]) => (
                <div key={k} className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1">
                    {k}
                  </span>
                  <span className="block text-xs sm:text-sm font-semibold text-white truncate">
                    {v}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Recommended / Similar Titles Rail */}
      {data?.similar && data.similar.length > 0 && (
        <div className="mt-12">
          <YupflixRail title="Recommended For You" items={data.similar} />
        </div>
      )}
    </div>
  );
}

export default YupflixDetail;
