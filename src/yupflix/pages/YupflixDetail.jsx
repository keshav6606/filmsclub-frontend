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
import { FaPlay, FaDownload, FaArrowLeft, FaChevronDown } from 'react-icons/fa';

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

  // Video Player Modal State
  const [playingSource, setPlayingSource] = useState(null);
  const [playingTitle, setPlayingTitle] = useState('');

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

  const titleInfo = data?.title ?? stateCard;

  if (!titleInfo && error) {
    return (
      <div className="center text-center py-20 text-gray-300">
        Title not found. <Link to="/filmsclub" className="text-amber-400 font-bold ml-2 underline">Go to FilmsClub Home</Link>
      </div>
    );
  }

  if (!titleInfo) {
    return (
      <div className="center flex items-center justify-center py-24">
        <div className="spin w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
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
  const typeStr = TYPE_LABELS[titleInfo.type] || 'Series';
  const genresList = filterGenres(rawTitle?.genres ?? titleInfo.genres);

  const movieFirstSourceInfo = parseMediaInfo((movieSources[0] || rawTitle?.sources?.[0])?.label);
  const audioStr = movieFirstSourceInfo.audio || (rawTitle?.languages?.length ? rawTitle.languages.join(', ') : '');
  const sourceStr = movieFirstSourceInfo.source || '';
  const qualitiesBadges = [...new Set((rawTitle?.qualities?.length ? rawTitle.qualities : (rawTitle?.sources || []).map(s => s.quality)).filter(Boolean))];
  const uniqueEpisodeCount = new Set(episodes.map(s => `${s.season || 1}|${s.label}`)).size;
  const overviewText = rawTitle?.overview && rawTitle.overview.trim().length > 40 ? rawTitle.overview.trim() : '';

  const bestMovieSource = movieSources.find(s => s.quality === '1080p') || movieSources[0];
  const latestEpList = latestParsed?.ep
    ? episodes.filter(s => (s.season || 1) === defaultSeason && extractEpisodeNumber(s.label) === latestParsed.ep).sort(sortSources)
    : [];
  const bestLatestEp = latestEpList.find(s => s.quality === preferredQuality) || latestEpList[0];

  const facts = [
    titleInfo.year ? ['Released', String(titleInfo.year)] : null,
    isSeries && availableSeasons.length ? ['Seasons', String(availableSeasons.length)] : null,
    isSeries && rawTitle?.latestLabel ? ['Latest', rawTitle.latestLabel] : null,
    audioStr ? ['Audio', audioStr] : null,
    sourceStr ? ['Source', sourceStr] : null,
    genresList.length ? ['Genres', genresList.join(', ')] : null
  ].filter(Boolean);

  const openPlayer = (src, titleSuffix = '') => {
    setPlayingSource(src);
    setPlayingTitle(`${cleanTitleName} ${titleSuffix}`);
  };

  return (
    <div className="detail">
      {/* Player Modal */}
      {playingSource && (
        <YupflixPlayerModal
          title={playingTitle}
          source={playingSource}
          onClose={() => setPlayingSource(null)}
        />
      )}

      {titleInfo.poster && (
        <div className="amb" aria-hidden="true">
          <img src={titleInfo.poster} alt="" />
        </div>
      )}

      <button
        type="button"
        className="back"
        onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/filmsclub')}
      >
        <FaArrowLeft className="mr-2 inline" />
        Back
      </button>

      <div className="head">
        <div className="ph">
          {titleInfo.poster && <img src={titleInfo.poster} alt={`${cleanTitleName} poster`} />}
        </div>
        <div className="tx">
          <div className="kind">{typeStr}</div>
          <h1 className="t">{cleanTitleName}</h1>
          <div className="facts">
            {isSeries ? (
              <>
                {availableSeasons.length > 0 && <span>{availableSeasons.length} season{availableSeasons.length === 1 ? '' : 's'}</span>}
                {uniqueEpisodeCount > 0 && <span>{uniqueEpisodeCount} episode{uniqueEpisodeCount === 1 ? '' : 's'}</span>}
              </>
            ) : (
              titleInfo.year && <span>{titleInfo.year}</span>
            )}
            {audioStr && <span>{audioStr}</span>}
            {!isSeries && genresList.length > 0 && <span>{genresList.slice(0, 2).join(', ')}</span>}
          </div>

          {qualitiesBadges.length > 0 && (
            <div className="avail">
              {qualitiesBadges.slice(0, 5).map(q => (
                <span key={q}>{formatQuality(q)}</span>
              ))}
            </div>
          )}

          {/* Action CTAs: Play Online & Download */}
          <div className="cta flex flex-wrap gap-3">
            {bestMovieSource ? (
              <>
                <button
                  type="button"
                  className="primary !bg-red-600 hover:!bg-red-700 !text-white flex items-center gap-2"
                  onClick={() => openPlayer(bestMovieSource, `(${formatQuality(bestMovieSource.quality)})`)}
                >
                  <FaPlay className="text-sm" />
                  Play Online
                  <small className="opacity-80">Stream in HD</small>
                </button>
                <a
                  className="ghost flex items-center gap-2"
                  href={getYupflixDownloadUrl(bestMovieSource.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaDownload className="text-sm" />
                  Download {formatQuality(bestMovieSource.quality)}
                </a>
              </>
            ) : bestLatestEp ? (
              <>
                <button
                  type="button"
                  className="primary !bg-red-600 hover:!bg-red-700 !text-white flex items-center gap-2"
                  onClick={() => openPlayer(bestLatestEp, `Episode ${latestParsed?.ep}`)}
                >
                  <FaPlay className="text-sm" />
                  Play Latest (Ep {latestParsed?.ep})
                </button>
                <a
                  className="ghost flex items-center gap-2"
                  href={getYupflixDownloadUrl(bestLatestEp.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaDownload className="text-sm" />
                  Download Latest
                </a>
              </>
            ) : null}
          </div>
        </div>
      </div>

      {/* Downloads & Episodes Section */}
      <section className="sec" id="downloads">
        {movieSources.length > 0 && (
          <>
            <header>
              <h2>Stream & Download Links</h2>
              <span className="sub">{movieSources.length} quality options</span>
            </header>
            <ul className="files">
              {movieSources.map((src, idx) => {
                const info = parseMediaInfo(src.label);
                const tagStr = [info.source, info.codec].filter(Boolean).join(' · ');
                return (
                  <li key={idx}>
                    <div className="file flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="qb font-bold text-center px-2 py-1 rounded bg-white/10 text-xs">
                          {formatQuality(src.quality)}
                        </span>
                        <div>
                          <strong className="block text-white text-sm">
                            {tagStr || src.label || `${cleanTitleName} ${src.quality}`}
                          </strong>
                          {info.audio && <span className="text-gray-400 text-xs">{info.audio} audio</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="s text-gray-300 text-xs font-semibold mr-2">{formatSize(src.size || '')}</span>
                        <button
                          type="button"
                          className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                          onClick={() => openPlayer(src, `(${formatQuality(src.quality)})`)}
                        >
                          <FaPlay className="text-[10px]" /> Play
                        </button>
                        <a
                          href={getYupflixDownloadUrl(src.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                        >
                          <FaDownload className="text-[10px]" /> Download
                        </a>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        {isSeries && (
          <div className={movieSources.length ? 'series gapt' : 'series'}>
            <header>
              <h2>{activeTab === 'episodes' ? 'Episodes' : 'Season packs'}</h2>
              {activeTab === 'episodes' && groupedEpisodes.length > 1 && (
                <button
                  type="button"
                  className="sortbtn text-gray-400 hover:text-white text-xs underline"
                  onClick={() => setNewestFirst(b => !b)}
                >
                  {newestFirst ? 'Newest first' : 'Oldest first'}
                </button>
              )}
            </header>

            {availableSeasons.length > 1 && (
              <div className="seasonrow no-sb">
                {availableSeasons.map(sNum => (
                  <button
                    key={sNum}
                    type="button"
                    aria-pressed={sNum === activeSeason}
                    onClick={() => setSelectedSeason(sNum)}
                  >
                    Season {sNum}
                  </button>
                ))}
              </div>
            )}

            <ul className="files space-y-2 mt-4">
              {groupedEpisodes.map(ep => {
                const epBest = ep.list.find(s => s.quality === preferredQuality) || ep.list[0];
                return (
                  <li key={ep.label}>
                    <div className="file flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="num font-bold text-red-500 text-base">
                          {ep.num ? String(ep.num).padStart(2, '0') : ''}
                        </span>
                        <div>
                          <span className="text-white font-bold text-sm">{ep.label}</span>
                          <span className="text-gray-400 text-xs block">{ep.list.length} quality links</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {epBest && (
                          <>
                            <button
                              type="button"
                              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                              onClick={() => openPlayer(epBest, ep.label)}
                            >
                              <FaPlay className="text-[10px]" /> Play
                            </button>
                            <a
                              href={getYupflixDownloadUrl(epBest.url)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                            >
                              <FaDownload className="text-[10px]" /> Download
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </section>

      {/* Details & Facts */}
      {(facts.length > 0 || overviewText) && (
        <section className="sec">
          <header><h2>Details</h2></header>
          {overviewText && <p className="overview text-gray-300 text-sm leading-relaxed mb-4">{overviewText}</p>}
          {facts.length > 0 && (
            <dl className="facts2">
              {facts.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          )}
        </section>
      )}

      {data?.similar && data.similar.length > 0 && (
        <YupflixRail title="More like this" items={data.similar} />
      )}
    </div>
  );
}
