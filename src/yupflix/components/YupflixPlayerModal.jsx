import React, { useState, useEffect, useRef } from 'react';
import {
  FaPlay,
  FaPause,
  FaTimes,
  FaExternalLinkAlt,
  FaCopy,
  FaCheck,
  FaDownload,
  FaServer,
  FaExpand,
  FaVolumeUp,
  FaVolumeMute,
  FaRedo,
  FaChevronDown
} from 'react-icons/fa';
import { SiVlcmediaplayer } from 'react-icons/si';
import { MdSmartDisplay, MdOndemandVideo, MdHighQuality, MdOutlineHd, MdSubtitles } from 'react-icons/md';
import { yupflixApi, getYupflixDownloadUrl } from '../services/yupflixApi';
import { cleanTitle, formatQuality } from '../utils/yupflixHelpers';

const NEXTPLAYER_PLAY_LINK = "https://play.google.com/store/apps/details?id=com.nextplayer.pro";
const MX_PLAY_LINK = "https://play.google.com/store/apps/details?id=com.mxtech.videoplayer.ad";
const VLC_PLAY_LINK = "https://play.google.com/store/apps/details?id=org.videolan.vlc";

export function YupflixPlayerModal({
  title,
  source,
  item = null,
  season = 1,
  episode = 1,
  onClose
}) {
  const [resolvedData, setResolvedData] = useState(null);
  const [streamUrl, setStreamUrl] = useState('');
  const [activeServer, setActiveServer] = useState('vidlink'); // 'vidlink' | 'cinesrc' | 'vidfast' | 'twoembed' | 'direct'
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [tmdbInfo, setTmdbInfo] = useState(null);
  const [currentSeason, setCurrentSeason] = useState(season || 1);
  const [currentEpisode, setCurrentEpisode] = useState(episode || 1);

  const videoRef = useRef(null);

  const cleanMovieTitle = cleanTitle(item?.title || title || 'Movie');
  const mediaType = item?.type === 'series' || item?.type === 'anime' || season > 0 && item?.sources?.some(s => s.kind === 'episode') ? 'tv' : 'movie';
  const isSeries = mediaType === 'tv';

  // 1. Resolve TMDB ID for online embed streaming servers
  useEffect(() => {
    let active = true;
    const directTmdb = item?.tmdb_id || item?.tmdbId || item?.id;
    if (directTmdb) {
      setTmdbInfo({ id: directTmdb, mediaType });
      return;
    }

    yupflixApi.findTmdbId(cleanMovieTitle, item?.year, mediaType)
      .then(info => {
        if (!active) return;
        if (info) {
          setTmdbInfo(info);
        }
      })
      .catch(err => console.warn('[PlayerModal] TMDB lookup fallback:', err));

    return () => { active = false; };
  }, [cleanMovieTitle, item, mediaType]);

  // 2. Resolve Direct VIP stream token in parallel (for NextPlayer/VLC/Direct Server)
  useEffect(() => {
    let active = true;
    if (!source?.url) return;

    yupflixApi.resolveStream(source.url)
      .then(data => {
        if (!active) return;
        setResolvedData(data);
        const directUrl = data.directStreamUrl || data.downloadUrl || getYupflixDownloadUrl(source.url);
        setStreamUrl(directUrl);
      })
      .catch(err => {
        console.warn('Resolution fallback:', err);
        if (!active) return;
        const fallbackUrl = getYupflixDownloadUrl(source.url);
        setStreamUrl(fallbackUrl);
      });

    return () => { active = false; };
  }, [source]);

  // Stop loading indicator once iframe or stream is ready
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [activeServer, currentSeason, currentEpisode]);

  // Dynamic Embed Server URLs
  const tmdbId = tmdbInfo?.id;
  const currentMediaType = tmdbInfo?.mediaType || mediaType;
  const isCurrentTv = currentMediaType === 'tv';

  const embedUrls = {
    vidlink: tmdbId
      ? (isCurrentTv ? `https://vidlink.pro/tv/${tmdbId}/${currentSeason}/${currentEpisode}` : `https://vidlink.pro/movie/${tmdbId}`)
      : '',
    cinesrc: tmdbId
      ? (isCurrentTv ? `https://cinesrc.st/embed/tv/${tmdbId}?s=${currentSeason}&e=${currentEpisode}&back=close` : `https://cinesrc.st/embed/movie/${tmdbId}?back=close`)
      : '',
    vidfast: tmdbId
      ? (isCurrentTv ? `https://vidfast.vc/tv/${tmdbId}/${currentSeason}/${currentEpisode}` : `https://vidfast.vc/movie/${tmdbId}`)
      : '',
    twoembed: tmdbId
      ? (isCurrentTv ? `https://www.2embed.cc/embedtv/${tmdbId}&s=${currentSeason}&e=${currentEpisode}` : `https://www.2embed.cc/embed/${tmdbId}`)
      : ''
  };

  const SERVERS = [
    {
      id: 'vidlink',
      name: 'Server 1 (VidLink 4K)',
      badge: 'RECOMMENDED · FAST',
      type: 'embed',
      url: embedUrls.vidlink
    },
    {
      id: 'cinesrc',
      name: 'Server 2 (CineSRC 4K)',
      badge: 'ULTRA HD · SUBS',
      type: 'embed',
      url: embedUrls.cinesrc
    },
    {
      id: 'vidfast',
      name: 'Server 3 (VidFast)',
      badge: 'ZERO BUFFER',
      type: 'embed',
      url: embedUrls.vidfast
    },
    {
      id: 'twoembed',
      name: 'Server 4 (2Embed VIP)',
      badge: 'MULTI-AUDIO',
      type: 'embed',
      url: embedUrls.twoembed
    },
    {
      id: 'direct',
      name: 'Server 5 (Direct VIP Node)',
      badge: 'ORIGINAL FILE',
      type: 'direct',
      url: streamUrl
    }
  ];

  // Android & Desktop External Player Launchers
  const launchExternalPlayer = (playerId) => {
    const targetUrl = streamUrl || (source?.url ? getYupflixDownloadUrl(source.url) : '');
    if (!targetUrl) return;

    const isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);
    const encodedTitle = encodeURIComponent(`${cleanMovieTitle} ${isSeries ? `S${currentSeason}E${currentEpisode}` : ''}`);
    const isHttps = targetUrl.startsWith('https');
    const scheme = isHttps ? 'https' : 'http';
    const cleanTarget = targetUrl.replace(/^https?:\/\//, '');

    let packageName = '';
    let playStoreUrl = '';

    if (playerId === 'nextplayer') {
      packageName = 'com.nextplayer.pro';
      playStoreUrl = NEXTPLAYER_PLAY_LINK;
    } else if (playerId === 'mx') {
      packageName = 'com.mxtech.videoplayer.ad';
      playStoreUrl = MX_PLAY_LINK;
    } else if (playerId === 'vlc') {
      packageName = 'org.videolan.vlc';
      playStoreUrl = VLC_PLAY_LINK;
    }

    if (isAndroid && packageName) {
      const encodedFallback = encodeURIComponent(playStoreUrl);
      const intentUrl = `intent://${cleanTarget}#Intent;scheme=${scheme};action=android.intent.action.VIEW;type=video/*;package=${packageName};S.title=${encodedTitle};S.browser_fallback_url=${encodedFallback};end`;

      const start = Date.now();
      setTimeout(() => {
        if (Date.now() - start < 2500 && !document.hidden && playStoreUrl) {
          window.location.href = playStoreUrl;
        }
      }, 1500);

      window.location.href = intentUrl;
      return;
    }

    // Windows / macOS / Desktop Launch
    if (playerId === 'vlc') {
      window.location.href = `vlc://${targetUrl}`;
      setTimeout(() => {
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      }, 1200);
      return;
    }

    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const copyUrl = () => {
    const urlToCopy = streamUrl || (source?.url ? getYupflixDownloadUrl(source.url) : '');
    if (urlToCopy) {
      navigator.clipboard?.writeText(urlToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadTarget = streamUrl || (source?.url ? getYupflixDownloadUrl(source.url) : '#');
  const qualityLabel = source?.quality || '1080p FHD';
  const fileSizeLabel = resolvedData?.size || source?.size || '';

  const activeServerObj = SERVERS.find(s => s.id === activeServer) || SERVERS[0];
  const isDirectMode = activeServer === 'direct';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-2 sm:p-4 animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-[#0d0e14] border border-white/10 rounded-2xl sm:rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[96vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/10 bg-[#12131a]/95 backdrop-blur-md">
          <div className="flex items-center gap-3 overflow-hidden pr-2">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/10 text-red-500 border border-red-500/30 flex items-center justify-center font-black text-sm shadow-[0_0_15px_rgba(229,9,20,0.3)] shrink-0">
              <FaPlay className="ml-0.5 text-xs" />
            </span>
            <div className="overflow-hidden">
              <h3 className="text-white font-bold text-sm sm:text-base md:text-lg leading-tight truncate">
                {title || cleanMovieTitle}
              </h3>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-400/30 shrink-0">
                  {qualityLabel}
                </span>
                {fileSizeLabel && (
                  <span className="text-[11px] text-zinc-400 font-medium font-mono shrink-0">
                    {fileSizeLabel}
                  </span>
                )}
                {isSeries && (
                  <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 shrink-0">
                    Season {currentSeason} · Episode {currentEpisode}
                  </span>
                )}
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 hidden sm:inline">
                  VIP Direct Cinema Link
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-2 sm:p-2.5 rounded-xl hover:bg-white/10 transition-colors shrink-0"
            aria-label="Close Cinema Player"
          >
            <FaTimes className="text-lg sm:text-xl" />
          </button>
        </div>

        {/* Video Viewport Container */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
          {loading && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-black/75 backdrop-blur-sm">
              <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(229,9,20,0.6)]" />
              <p className="text-white font-bold text-sm tracking-wide">
                Buffering Cinema Stream...
              </p>
            </div>
          )}

          {/* Mode 1: Live Web Embed Streaming Server (Default & Always Working) */}
          {!isDirectMode && activeServerObj.url && (
            <iframe
              key={`${activeServer}-${currentSeason}-${currentEpisode}`}
              src={activeServerObj.url}
              title={title}
              className="w-full h-full border-0"
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
            />
          )}

          {/* Fallback if TMDB not found for embed */}
          {!isDirectMode && !activeServerObj.url && (
            <div className="flex flex-col items-center justify-center p-6 text-center max-w-md gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-xl">
                <MdHighQuality />
              </div>
              <h4 className="text-white font-bold text-base">Direct VIP Streaming Ready</h4>
              <p className="text-zinc-300 text-xs">
                Connecting to direct Cloudflare high-speed stream node.
              </p>
              <button
                type="button"
                onClick={() => setActiveServer('direct')}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition-all"
              >
                Switch to Direct Video Player
              </button>
            </div>
          )}

          {/* Mode 2: Direct Video Stream Player (MKV / MP4 / R2 Node) */}
          {isDirectMode && (
            <>
              {streamUrl ? (
                <video
                  ref={videoRef}
                  src={streamUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain bg-black"
                  onError={() => {
                    console.warn("Direct HTML5 video decode failed, showing player options");
                    setVideoError(true);
                  }}
                />
              ) : (
                <div className="text-center p-6 space-y-3">
                  <div className="w-10 h-10 border-3 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-zinc-300 text-xs">Resolving high-speed CDN token...</p>
                </div>
              )}

              {/* Codec / Container Incompatibility Overlay */}
              {videoError && (
                <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-10 animate-fadeIn">
                  <div className="w-12 h-12 rounded-2xl bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center mb-2 text-xl">
                    <MdOutlineHd />
                  </div>
                  <h4 className="text-white font-bold text-base sm:text-lg mb-1">
                    MKV / HEVC Dolby Audio Stream
                  </h4>
                  <p className="text-zinc-300 text-xs sm:text-sm max-w-md mb-4 leading-relaxed">
                    This file uses an MKV/Dolby container. Watch instantly in your web browser via <strong>Server 1</strong>, or open in <strong>NextPlayer / MX Player</strong> on your phone with full surround sound!
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setVideoError(false);
                        setActiveServer('vidlink');
                      }}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-xs sm:text-sm shadow-lg shadow-red-600/40 transition-all"
                    >
                      ▶ Play in Web Player (Server 1)
                    </button>
                    <button
                      type="button"
                      onClick={() => launchExternalPlayer('nextplayer')}
                      className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
                    >
                      <MdSmartDisplay /> NextPlayer
                    </button>
                    <button
                      type="button"
                      onClick={() => launchExternalPlayer('mx')}
                      className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
                    >
                      <MdOndemandVideo /> MX Player
                    </button>
                    <a
                      href={downloadTarget}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 border border-white/10 transition-colors"
                    >
                      <FaDownload /> Download File
                    </a>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Server Switcher Bar */}
        <div className="px-3 sm:px-6 py-2.5 bg-[#0a0c10] border-t border-white/5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-black text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
              <FaServer className="text-red-500 text-xs" /> Streaming Servers:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {SERVERS.map((srv) => {
                const isSel = activeServer === srv.id;
                return (
                  <button
                    key={srv.id}
                    type="button"
                    onClick={() => {
                      setActiveServer(srv.id);
                      setVideoError(false);
                      setLoading(true);
                    }}
                    className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                      isSel
                        ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(229,9,20,0.6)] scale-105'
                        : 'bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/5'
                    }`}
                  >
                    <span>{srv.name}</span>
                    <span className="text-[9px] opacity-75 font-mono hidden md:inline">
                      {srv.badge.split('·')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Episode Quick Switcher if Series */}
          {isSeries && (
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-zinc-400 font-semibold">Ep:</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={currentEpisode <= 1}
                  onClick={() => setCurrentEpisode(prev => Math.max(1, prev - 1))}
                  className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-xs text-white disabled:opacity-30 disabled:pointer-events-none"
                >
                  Prev
                </button>
                <span className="px-2 py-1 bg-white/10 text-white text-xs font-mono font-bold rounded">
                  {currentEpisode}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentEpisode(prev => prev + 1)}
                  className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-xs text-white"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Audio Codec & Surround Sound Tip Banner */}
        <div className="px-4 sm:px-6 py-2 bg-gradient-to-r from-amber-500/10 via-black to-cyan-500/10 border-t border-white/5 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-amber-400 text-sm shrink-0">
              <FaVolumeUp />
            </span>
            <span className="text-zinc-300 text-[11px] truncate">
              Want 5.1 Dolby Sound or Hardware Acceleration? Open in <strong>NextPlayer</strong>, <strong>MX Player</strong>, or <strong>VLC</strong> below!
            </span>
          </div>
          <button
            type="button"
            onClick={() => launchExternalPlayer('nextplayer')}
            className="shrink-0 text-cyan-400 hover:text-cyan-300 font-bold text-[11px] underline flex items-center gap-1"
          >
            Launch NextPlayer
          </button>
        </div>

        {/* Player Options, External Launchers & Download CTA */}
        <div className="p-3 sm:p-4 bg-[#12131a] border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          {/* External App Launchers */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider hidden sm:inline mr-1">
              External Apps:
            </span>
            <button
              type="button"
              onClick={() => launchExternalPlayer('nextplayer')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-400 border border-cyan-500/30 text-xs font-bold transition-all shadow-sm"
              title="Open in NextPlayer Pro (Hardware Decode)"
            >
              <MdSmartDisplay className="text-sm" /> NextPlayer
            </button>
            <button
              type="button"
              onClick={() => launchExternalPlayer('mx')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 border border-blue-500/30 text-xs font-bold transition-all shadow-sm"
              title="Open in MX Player (HW+)"
            >
              <MdOndemandVideo className="text-sm" /> MX Player
            </button>
            <button
              type="button"
              onClick={() => launchExternalPlayer('vlc')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 text-orange-400 border border-orange-500/30 text-xs font-bold transition-all shadow-sm"
              title="Open in VLC Media Player"
            >
              <SiVlcmediaplayer className="text-sm" /> VLC Player
            </button>
          </div>

          {/* Stream Link Copy & Download Buttons */}
          <div className="flex items-center gap-2.5 ml-auto">
            <button
              type="button"
              onClick={copyUrl}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-200 text-xs font-bold transition-all"
            >
              {copied ? <FaCheck className="text-emerald-400" /> : <FaCopy className="text-zinc-400" />}
              {copied ? 'Copied' : 'Copy Link'}
            </button>
            <a
              href={downloadTarget}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs sm:text-sm font-extrabold shadow-[0_0_20px_rgba(229,9,20,0.4)] transition-all"
            >
              <FaDownload className="text-xs" />
              Download {qualityLabel}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default YupflixPlayerModal;
