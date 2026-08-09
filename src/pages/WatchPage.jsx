import React, { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlay,
  FaPause,
  FaExpand,
  FaCompress,
  FaVolumeMute,
  FaVolumeUp,
  FaRedo,
  FaUndo,
  FaDownload,
  FaArrowLeft,
  FaAndroid,
  FaInfoCircle,
  FaCheckCircle,
  FaBookOpen,
  FaTv,
  FaShieldAlt,
  FaBolt,
} from "react-icons/fa";
import { MdSmartDisplay, MdOndemandVideo, MdOutlineHighQuality } from "react-icons/md";
import { SiVlcmediaplayer } from "react-icons/si";
import { TbBrandTelegram } from "react-icons/tb";
import SEO from "../components/SEO";
import { BASE_URL as BASE } from "../config/api";

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
const TG_USERNAME = import.meta.env.VITE_TG_USERNAME || "Filmy4uhdbot";
const MPVEX_PLAY_LINK = "https://play.google.com/store/apps/details?id=com.nextplayer.pro";

const PLAYERS = [
  {
    id: "mpvex",
    name: "mpvEx Player",
    packageName: "com.nextplayer.pro",
    icon: <MdSmartDisplay className="text-xl text-cyan-400" />,
    desc: "Recommended for hardware acceleration & smooth H.265 / 4K playback.",
    playStore: MPVEX_PLAY_LINK,
  },
  {
    id: "mx",
    name: "MX Player",
    packageName: "com.mxtech.videoplayer.ad",
    icon: <MdOndemandVideo className="text-xl text-blue-400" />,
    desc: "Supports multi-audio tracks, custom subtitles, and HW+ decoding.",
    playStore: "https://play.google.com/store/apps/details?id=com.mxtech.videoplayer.ad",
  },
  {
    id: "vlc",
    name: "VLC Player",
    packageName: "org.videolan.vlc",
    icon: <SiVlcmediaplayer className="text-xl text-orange-400" />,
    desc: "Open-source player with full AC3 / EAC3 audio codec compatibility.",
    playStore: "https://play.google.com/store/apps/details?id=org.videolan.vlc",
  },
];

const triggerPopunder = () => {
  const popunderUrl = import.meta.env.VITE_POPUNDER_URL;
  if (popunderUrl) {
    try {
      window.open(popunderUrl, "_blank", "noopener noreferrer");
    } catch (e) {
      console.warn("Popunder block warning:", e);
    }
  }
};

const shortenUrl = async (url) => {
  if (!API_URL || !API_KEY) return url;
  try {
    const res = await fetch(`${API_URL}?api=${API_KEY}&url=${encodeURIComponent(url)}&format=json`);
    const data = await res.json();
    return data?.shortenedUrl || data?.short || data?.url || url;
  } catch {
    return url;
  }
};

export default function WatchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const fileId = searchParams.get("id");
  const fileName = searchParams.get("name");
  const title = searchParams.get("title") || "Filmy4uhd Online Stream";
  const quality = searchParams.get("quality") || "HD";
  const language = searchParams.get("lang") || "Hindi";
  const tmdbId = searchParams.get("tmdb_id");
  const mediaType = searchParams.get("media_type") || "movie";

  // Construct direct video stream URL
  const videoUrl = searchParams.get("src") ||
    (fileId && fileName ? `${BASE}/dl/${fileId}/${encodeURIComponent(fileName)}` : "");

  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(true);
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);

  const controlsTimeoutRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
    setIsBuffering(false);
  };

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const skip = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(
        Math.max(videoRef.current.currentTime + seconds, 0),
        duration
      );
    }
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      setIsMuted(newVol === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.volume = volume || 1;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const changeSpeed = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.error);
      }
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3500);
  };

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return "00:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    const hours = Math.floor(minutes / 60);
    const displayMins = minutes % 60;
    if (hours > 0) {
      return `${hours}:${displayMins < 10 ? "0" : ""}${displayMins}:${seconds < 10 ? "0" : ""}${seconds}`;
    }
    return `${displayMins}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const launchExternalPlayer = (player) => {
    if (!videoUrl) return;
    triggerPopunder();
    const isAndroid = /Android/i.test(navigator.userAgent);
    const encodedTitle = encodeURIComponent(title);
    const cleanUrl = videoUrl.replace(/^https?:\/\//, "");
    const scheme = videoUrl.startsWith("https") ? "https" : "http";

    if (isAndroid) {
      const intentUrl = `intent://${cleanUrl}#Intent;scheme=${scheme};type=video/*;package=${player.packageName};S.title=${encodedTitle};S.browser_fallback_url=${encodeURIComponent(videoUrl)};end`;
      window.location.href = intentUrl;
    } else {
      if (player.id === "vlc") {
        window.location.href = `vlc://${cleanUrl}`;
      } else if (player.id === "mpvex") {
        window.location.href = `mpv://${cleanUrl}`;
      } else {
        window.open(videoUrl, "_blank", "noopener noreferrer");
      }
    }
  };

  const handleDownload = async () => {
    if (!videoUrl) return;
    triggerPopunder();
    setIsDownloadLoading(true);
    const finalUrl = await shortenUrl(videoUrl);
    setIsDownloadLoading(false);
    window.open(finalUrl, "_blank", "noopener noreferrer");
  };

  const backLink = tmdbId ? (mediaType === "tv" ? `/ser/${tmdbId}` : `/mov/${tmdbId}`) : "/";

  return (
    <div className="mt-20 mb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-white">
      <SEO
        title={`Watch ${title} Online | High Speed Stream & Download`}
        description={`Stream ${title} online free in high quality. Open in mpvEx Player, MX Player, or VLC Player.`}
        keywords={`${title}, watch ${title} online, stream mpvEx, MX player, VLC stream, free stream`}
      />

      {/* Top Breadcrumb / Back Button */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to={backLink}
          className="inline-flex items-center gap-2 bg-slate-900/80 hover:bg-amber-500 hover:text-slate-950 text-slate-300 px-4 py-2 rounded-full border border-white/10 text-xs font-bold transition-all shadow-md"
        >
          <FaArrowLeft />
          <span>Back to Details</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
            <MdOutlineHighQuality className="text-base" /> {quality}
          </span>
          <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold px-3 py-1 rounded-full">
            {language}
          </span>
        </div>
      </div>

      {/* Title Bar */}
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Streaming: <span className="gold-text">{title}</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Enjoy fast online web streaming below or open directly in your preferred video player app.
        </p>
      </div>

      {/* Hero Embedded Web Player Container */}
      <div className="glass-card overflow-hidden border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          className="relative aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden group"
        >
          {isBuffering && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/50 z-10">
              <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-slate-300 font-semibold tracking-wide">
                Buffering video stream...
              </span>
            </div>
          )}

          <video
            ref={videoRef}
            src={videoUrl}
            onClick={togglePlay}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onWaiting={() => setIsBuffering(true)}
            onPlaying={() => {
              setIsBuffering(false);
              setIsPlaying(true);
            }}
            onPause={() => setIsPlaying(false)}
            className="w-full h-full object-contain cursor-pointer"
            playsInline
            crossOrigin="anonymous"
          />

          {!isPlaying && !isBuffering && (
            <div
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/30"
            >
              <div className="w-20 h-20 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.8)] border-2 border-white/40 hover:scale-110 transition-transform">
                <FaPlay className="text-3xl ml-1" />
              </div>
            </div>
          )}

          {/* Bottom Player Controls */}
          <div
            className={`absolute bottom-0 inset-x-0 z-20 p-4 bg-gradient-to-t from-black/95 via-black/75 to-transparent flex flex-col gap-2 transition-opacity duration-300 ${
              showControls ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Seekbar */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-300 shrink-0">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min="0"
                max={duration || 0}
                step="0.1"
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:h-2.5 transition-all"
              />
              <span className="text-xs font-mono text-slate-400 shrink-0">
                {formatTime(duration)}
              </span>
            </div>

            {/* Buttons Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="p-2 text-white hover:text-amber-400 transition-colors text-xl"
                >
                  {isPlaying ? <FaPause /> : <FaPlay />}
                </button>

                <button
                  onClick={() => skip(-10)}
                  className="p-1.5 text-slate-300 hover:text-white transition-colors text-sm flex items-center gap-1"
                >
                  <FaUndo />
                  <span className="text-[10px] font-bold">10s</span>
                </button>
                <button
                  onClick={() => skip(10)}
                  className="p-1.5 text-slate-300 hover:text-white transition-colors text-sm flex items-center gap-1"
                >
                  <FaRedo />
                  <span className="text-[10px] font-bold">10s</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMute}
                    className="p-1.5 text-slate-300 hover:text-white transition-colors text-base"
                  >
                    {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-16 sm:w-24 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1">
                  {[0.75, 1, 1.25, 1.5, 2].map((s) => (
                    <button
                      key={s}
                      onClick={() => changeSpeed(s)}
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        playbackSpeed === s
                          ? "bg-amber-500 text-slate-950"
                          : "text-slate-300 hover:text-white"
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>

                <button
                  onClick={toggleFullscreen}
                  className="p-2 text-white hover:text-amber-400 transition-colors text-lg"
                >
                  {isFullscreen ? <FaCompress /> : <FaExpand />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* External Video Player Redirection Section */}
      <div className="glass-card p-6 space-y-4 border border-white/10">
        <div className="flex items-center gap-2">
          <FaTv className="text-amber-400 text-lg" />
          <h2 className="text-lg font-bold text-white">External Player Apps &amp; Downloads</h2>
        </div>
        <p className="text-xs text-slate-400">
          Click any player below to launch the video stream directly into your mobile or desktop media player app:
        </p>

        {/* Players Grid */}
        <div className="grid sm:grid-cols-3 gap-4 pt-2">
          {PLAYERS.map((player) => (
            <div
              key={player.id}
              className="p-4 rounded-xl bg-slate-900/80 border border-white/5 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center gap-3">
                {player.icon}
                <div>
                  <h3 className="font-bold text-sm text-white">{player.name}</h3>
                  <span className="text-[10px] text-slate-400">Android &amp; Desktop</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-snug">{player.desc}</p>
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <button
                  onClick={() => launchExternalPlayer(player)}
                  className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg text-xs transition-all shadow-md"
                >
                  <FaPlay className="text-[10px]" />
                  <span>Open Stream</span>
                </button>
                <a
                  href={player.playStore}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
                >
                  <FaAndroid className="text-green-500" />
                  <span>Get App</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Download & Telegram Row */}
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/10">
          <button
            onClick={handleDownload}
            disabled={isDownloadLoading}
            className="flex items-center gap-2 btn-gold px-6 py-2.5 text-sm font-bold shadow-gold"
          >
            <FaDownload />
            <span>Download Video File ({quality})</span>
          </button>

          <a
            href={`https://t.me/${TG_USERNAME}?start=file_${fileId || tmdbId}_${quality}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={triggerPopunder}
            className="flex items-center gap-2 bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold px-6 py-2.5 rounded-full text-sm transition-all shadow-md hover:scale-105"
          >
            <TbBrandTelegram className="text-xl" />
            <span>Get File on Telegram</span>
          </a>
        </div>
      </div>

      {/* ─── Detailed Blog Articles & User Guide Section ─── */}
      <div className="space-y-8 pt-4">
        <div className="flex items-center gap-2 border-b border-white/10 pb-4">
          <FaBookOpen className="text-amber-400 text-xl" />
          <h2 className="text-xl font-black tracking-tight text-white">
            Streaming Guides, App Reviews &amp; Setup Tips
          </h2>
        </div>

        {/* Article 1: mpvEx Player Guide */}
        <article className="glass-card p-6 sm:p-8 space-y-4 border border-white/10 leading-relaxed text-sm">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 text-xl border border-cyan-500/20">
              <MdSmartDisplay />
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">
                How to Watch &amp; Stream with mpvEx Player
              </h3>
              <p className="text-xs text-slate-400">High-Performance Video Acceleration &amp; Customization</p>
            </div>
          </div>

          <p className="text-slate-300">
            <strong>mpvEx Player</strong> (package: <code className="text-amber-400 bg-white/5 px-1.5 py-0.5 rounded">com.nextplayer.pro</code>) is an advanced video player tailored for Android devices. Powered by the renowned libmpv engine, it provides unmatched playback performance for modern video formats including H.265 (HEVC), AV1, and 4K Ultra HD videos.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 my-3">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5">
              <h4 className="font-bold text-amber-400 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FaBolt /> Hardware Decoding (HW+)
              </h4>
              <p className="text-xs text-slate-300">
                mpvEx utilizes direct GPU hardware decoding, lowering battery consumption and eliminating stuttering on high bitrate 1080p and 4K streams.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5">
              <h4 className="font-bold text-cyan-400 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FaShieldAlt /> Multi-Audio &amp; Subtitle Sync
              </h4>
              <p className="text-xs text-slate-300">
                Easily switch between Hindi, Dual Audio, and English tracks on the fly with custom subtitle font scaling and styling options.
              </p>
            </div>
          </div>

          <p className="text-slate-400 text-xs">
            To use mpvEx Player: Install <strong>mpvEx Video Player</strong> from Google Play. Once installed, simply click the <strong>mpvEx Player</strong> button on our site to launch high-speed video streaming directly in the app.
          </p>
        </article>

        {/* Article 2: MX Player & VLC Integration */}
        <article className="glass-card p-6 sm:p-8 space-y-4 border border-white/10 leading-relaxed text-sm">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 text-xl border border-blue-500/20">
              <MdOndemandVideo />
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">
                MX Player &amp; VLC Media Player Redirection Setup
              </h3>
              <p className="text-xs text-slate-400">Audio Codec Support &amp; Network Stream Compatibility</p>
            </div>
          </div>

          <p className="text-slate-300">
            Both <strong>MX Player</strong> and <strong>VLC Media Player</strong> are industry-standard media players supporting online HTTP streaming intents.
          </p>

          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <FaCheckCircle className="text-green-400 shrink-0 mt-0.5" />
              <span><strong>MX Player (Free / Pro):</strong> Excellent for pinch-to-zoom, gesture controls (volume &amp; brightness), and custom online stream title passing.</span>
            </li>
            <li className="flex items-start gap-2">
              <FaCheckCircle className="text-green-400 shrink-0 mt-0.5" />
              <span><strong>VLC Player:</strong> Open-source player natively decoding surround sound AC3, EAC3, and DTS audio without needing custom codec plugins.</span>
            </li>
          </ul>
        </article>

        {/* Article 3: Official Telegram Channel & Community Hub */}
        <article className="glass-card p-6 sm:p-8 space-y-4 border border-cyan-500/30 bg-gradient-to-br from-slate-900/90 to-cyan-950/40 leading-relaxed text-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="p-3 rounded-2xl bg-[#0088cc]/20 text-[#0088cc] text-2xl border border-[#0088cc]/40">
                <TbBrandTelegram />
              </span>
              <div>
                <h3 className="text-xl font-black text-white">Join Our Telegram Media Channel</h3>
                <p className="text-xs text-cyan-300">Get direct Telegram file links, daily updates &amp; fast cloud mirrors</p>
              </div>
            </div>

            <a
              href={`https://t.me/${TG_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#0088cc] hover:bg-[#0077b5] text-white font-extrabold px-6 py-3 rounded-full text-sm transition-all shadow-lg hover:scale-105"
            >
              <TbBrandTelegram className="text-xl" />
              <span>Join Telegram Channel</span>
            </a>
          </div>

          <p className="text-slate-300 text-xs leading-relaxed">
            Stay connected with our official Telegram channel for instantaneous notifications on new movie releases, web series season updates, fast cloud mirrors, and direct Telegram file downloads. All files are hosted on high-speed Telegram media servers.
          </p>
        </article>
      </div>
    </div>
  );
}
