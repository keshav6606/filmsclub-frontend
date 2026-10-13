import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
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
} from '../utils/helpers';
import { FileDownloadItem, EpisodeItem } from '../components/EpisodeItem';
import { Rail } from '../components/PlatformFilter';

// Icons
const ArrowLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m15 5-7 7 7 7" />
  </svg>
);

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 4v11" />
    <path d="m7 11 5 5 5-5" />
    <path d="M5 20h14" />
  </svg>
);

export function TitleDetailPage() {
  const { code = '' } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const stateCard = location.state?.card;

  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [newestFirst, setNewestFirst] = useState(true);
  const [seriesTab, setSeriesTab] = useState('episodes'); // 'episodes' | 'zips'
  const [preferredQuality, setPreferredQuality] = useState(() => {
    try { return localStorage.getItem('yf_q') || '1080p'; } catch { return '1080p'; }
  });

  useEffect(() => {
    const ctrl = new AbortController();
    setData(null);
    setError(false);
    setSelectedSeason(null);
    setNewestFirst(true);
    setSeriesTab('episodes');

    api.title(code, ctrl.signal)
      .then(d => setData(d))
      .catch(err => {
        if (err.name !== 'AbortError') setError(true);
      });

    window.scrollTo(0, 0);
    return () => ctrl.abort();
  }, [code]);

  const setQuality = (q) => {
    setPreferredQuality(q);
    try { localStorage.setItem('yf_q', q); } catch {}
  };

  const titleInfo = data?.title ?? stateCard;

  if (!titleInfo && error) {
    return (
      <div className="center">
        Title not found. <Link to="/" className="lnk">Go to Home</Link>
      </div>
    );
  }

  if (!titleInfo) {
    return (
      <div className="center">
        <div className="spin" />
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

  // Group items by label
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

  const seasonNotes = (rawTitle?.seasonInfo || {})[String(activeSeason)];
  const seasonNotesInfo = parseMediaInfo(seasonNotes);
  const seasonDesc = [seasonNotesInfo.source, seasonNotesInfo.audio ? `${seasonNotesInfo.audio} audio` : ''].filter(Boolean).join(' · ') || (seasonNotes || '').replace(/[\s\-–:]+$/, '');

  const seasonItemCount = (sNum) => new Set([...episodes, ...zips].filter(s => (s.season || 1) === sNum).map(s => s.label)).size;
  const availableQualities = [...new Set([...seasonEpisodes, ...seasonZips].map(s => s.quality).filter(Boolean))];

  const cleanTitleName = cleanTitle(titleInfo.title);
  const typeStr = TYPE_LABELS[titleInfo.type] || 'Series';
  const genresList = filterGenres(rawTitle?.genres ?? titleInfo.genres);

  const movieFirstSourceInfo = parseMediaInfo((movieSources[0] || rawTitle?.sources?.[0])?.label);
  const audioStr = movieFirstSourceInfo.audio || seasonNotesInfo.audio || (rawTitle?.languages?.length ? rawTitle.languages.join(', ') : '');
  const sourceStr = movieFirstSourceInfo.source || seasonNotesInfo.source || '';

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

  return (
    <div className="detail">
      {titleInfo.poster && (
        <div className="amb" aria-hidden="true">
          <img src={titleInfo.poster} alt="" />
        </div>
      )}

      <button
        type="button"
        className="back"
        onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/')}
      >
        <ArrowLeft />
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
                {availableSeasons.length > 0 && (
                  <span>{availableSeasons.length} season{availableSeasons.length === 1 ? '' : 's'}</span>
                )}
                {uniqueEpisodeCount > 0 && (
                  <span>{uniqueEpisodeCount} episode{uniqueEpisodeCount === 1 ? '' : 's'}</span>
                )}
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

          <div className="cta">
            {bestMovieSource ? (
              <a
                className="primary"
                href={bestMovieSource.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <DownloadIcon />
                Download {formatQuality(bestMovieSource.quality)}
                {bestMovieSource.size && <small>{formatSize(bestMovieSource.size)}</small>}
              </a>
            ) : bestLatestEp ? (
              <a
                className="primary"
                href={bestLatestEp.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <DownloadIcon />
                Download latest
                <small>Episode {latestParsed?.ep} · {formatQuality(bestLatestEp.quality)}</small>
              </a>
            ) : (
              <a className="primary" href="#downloads">
                <DownloadIcon />
                {isSeries ? 'See episodes' : 'Download'}
              </a>
            )}
            <a className="ghost" href="#downloads">
              {isSeries ? 'All episodes' : 'All versions'}
            </a>
          </div>
        </div>
      </div>

      <section className="sec" id="downloads">
        {rawTitle ? (
          <>
            {movieSources.length > 0 && (
              <>
                <header>
                  <h2>Download</h2>
                  <span className="sub">{movieSources.length} version{movieSources.length === 1 ? '' : 's'}</span>
                </header>
                <ul className="files">
                  {movieSources.map((src, idx) => (
                    <FileDownloadItem
                      key={idx}
                      source={src}
                      isRecommended={src === bestMovieSource && movieSources.length > 1}
                      fallbackLabel={`${cleanTitleName} ${src.quality || ''}`}
                    />
                  ))}
                </ul>
              </>
            )}

            {isSeries && (
              <div className={movieSources.length ? 'series gapt' : 'series'}>
                <header>
                  <h2>{activeTab === 'episodes' ? 'Episodes' : 'Season packs'}</h2>
                  {activeTab === 'episodes' && groupedEpisodes.length > 1 ? (
                    <button
                      type="button"
                      className="sortbtn"
                      onClick={() => setNewestFirst(b => !b)}
                    >
                      {newestFirst ? 'Newest first' : 'Oldest first'}
                    </button>
                  ) : (
                    <span className="sub">
                      {activeTab === 'episodes'
                        ? `${groupedEpisodes.length} episode${groupedEpisodes.length === 1 ? '' : 's'}`
                        : `${groupedZips.length} pack${groupedZips.length === 1 ? '' : 's'}`}
                    </span>
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
                        <span className="cnt">{seasonItemCount(sNum)}</span>
                      </button>
                    ))}
                  </div>
                )}

                {seasonDesc && <p className="sinfo">{seasonDesc}</p>}

                <div className="pref">
                  {hasEp && hasZip && (
                    <div className="segn">
                      <button
                        type="button"
                        aria-pressed={activeTab === 'episodes'}
                        onClick={() => setSeriesTab('episodes')}
                      >
                        Episodes
                      </button>
                      <button
                        type="button"
                        aria-pressed={activeTab === 'zips'}
                        onClick={() => setSeriesTab('zips')}
                      >
                        Season packs
                      </button>
                    </div>
                  )}

                  {availableQualities.length > 1 && (
                    <>
                      <span className="pl">Quick download in</span>
                      <div className="segn">
                        {availableQualities.map(q => (
                          <button
                            key={q}
                            type="button"
                            aria-pressed={q === preferredQuality}
                            onClick={() => setQuality(q)}
                          >
                            {formatQuality(q)}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <ul className="files">
                  {activeTab === 'episodes' ? (
                    groupedEpisodes.map(ep => {
                      const isNew = activeSeason === latestParsed?.season && ep.num === latestParsed?.ep && !!latestParsed?.ep;
                      return (
                        <EpisodeItem
                          key={ep.label}
                          label={ep.label}
                          list={ep.list}
                          preferredQuality={preferredQuality}
                          isNew={isNew}
                        />
                      );
                    })
                  ) : (
                    groupedZips.map(pack => (
                      <EpisodeItem
                        key={pack.label}
                        label={pack.label}
                        list={pack.list}
                        preferredQuality={preferredQuality}
                        isPack={true}
                      />
                    ))
                  )}
                </ul>

                <div className="hint">
                  <span>Plays best in VLC.</span>
                  <a href="https://t.me/+YVnrgnm-dcwzNWU9" target="_blank" rel="noopener noreferrer">
                    Updates and requests on Telegram
                  </a>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <header><h2>Download</h2></header>
            {[0, 1, 2].map(i => (
              <div key={i} className="sk" style={{ height: 72, marginBottom: 8 }} />
            ))}
          </>
        )}
      </section>

      {(facts.length > 0 || overviewText) && (
        <section className="sec">
          <header><h2>Details</h2></header>
          {overviewText && <p className="overview">{overviewText}</p>}
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
        <Rail title="More like this" items={data.similar} />
      )}
    </div>
  );
}
