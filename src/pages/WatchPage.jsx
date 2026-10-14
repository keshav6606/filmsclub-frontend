import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  FaDownload,
  FaArrowLeft,
  FaAndroid,
  FaCheck,
  FaCopy,
  FaVolumeUp,
  FaShieldAlt,
  FaBolt,
  FaPlay,
} from "react-icons/fa";
import { MdSmartDisplay, MdOndemandVideo, MdOutlineHighQuality } from "react-icons/md";
import { SiVlcmediaplayer } from "react-icons/si";
import { TbBrandTelegram } from "react-icons/tb";
import SEO from "../components/SEO";
import { BASE_URL as BASE } from "../config/api";
import {
  launchNextPlayer,
  launchMxPlayer,
  launchVlcPlayer,
  triggerDirectDownload,
  NEXTPLAYER_PLAY_LINK,
  MX_PLAY_LINK,
  VLC_PLAY_LINK,
} from "../utils/playerLauncher";

const TG_USERNAME = import.meta.env.VITE_TG_USERNAME || "Filmy4uhdBot";

export default function WatchPage() {
  const [searchParams] = useSearchParams();

  const fileId = searchParams.get("id");
  const fileName = searchParams.get("name");
  const title = searchParams.get("title") || "Online Stream";
  const quality = searchParams.get("quality") || "HD";
  const language = searchParams.get("lang") || "Hindi";
  const tmdbId = searchParams.get("tmdb_id");
  const mediaType = searchParams.get("media_type") || "movie";

  // Direct video stream URL
  const videoUrl =
    searchParams.get("src") ||
    (fileId && fileName ? `${BASE}/dl/${fileId}/${encodeURIComponent(fileName)}` : "");

  const [copied, setCopied] = useState(false);
  const [launching, setLaunching] = useState(true);

  // Auto-launch NextPlayer when landing on this streaming page
  useEffect(() => {
    window.scrollTo(0, 0);
    if (videoUrl) {
      launchNextPlayer(videoUrl, title);
      const timer = setTimeout(() => setLaunching(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [videoUrl, title]);

  const handleLaunchNextPlayer = () => {
    setLaunching(true);
    launchNextPlayer(videoUrl, title);
    setTimeout(() => setLaunching(false), 1500);
  };

  const handleLaunchMx = () => {
    launchMxPlayer(videoUrl, title);
  };

  const handleLaunchVlc = () => {
    launchVlcPlayer(videoUrl, title);
  };

  const handleDirectDownload = () => {
    const rawDownloadUrl =
      fileId && fileName
        ? `${BASE}/dl/${fileId}/${encodeURIComponent(fileName)}?dl=1`
        : videoUrl.includes("?")
        ? `${videoUrl}&dl=1`
        : `${videoUrl}?dl=1`;
    const dlFilename = fileName || `${title}_${quality}.mp4`;
    triggerDirectDownload(rawDownloadUrl, dlFilename);
  };

  const handleCopyLink = () => {
    if (!videoUrl) return;
    navigator.clipboard.writeText(videoUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const backLink = tmdbId
    ? mediaType === "tv"
      ? `/ser/${tmdbId}`
      : `/mov/${tmdbId}`
    : "/";

  return (
    <div className="mt-20 mb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-white">
      <SEO
        title={`Stream in NextPlayer: ${title} | High Speed Playback`}
        description={`Stream ${title} in NextPlayer with full AC3/Dolby surround sound and hardware acceleration.`}
        keywords={`${title}, watch in NextPlayer, NextPlayer pro, stream ${title}, filmy4uhd, filmsclub`}
      />

      {/* Top Navigation */}
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

      {/* Main Streaming Cockpit Header */}
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs font-extrabold uppercase tracking-wider">
          <MdSmartDisplay className="text-base" /> External Player Streaming
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Streaming: <span className="gold-text">{title}</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Online streaming is optimized for <strong>NextPlayer</strong> with full multi-channel Dolby audio, subtitle support, and 4K hardware acceleration.
        </p>
      </div>

      {/* NextPlayer Launch Card (Hero Cockpit) */}
      <div className="relative glass-card p-6 sm:p-10 rounded-3xl border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.2)] text-center space-y-6 overflow-hidden">
        {/* Glow ambient circle */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col items-center space-y-3">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-600 via-cyan-400 to-amber-400 p-0.5 shadow-[0_0_35px_rgba(6,182,212,0.6)] flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
              <MdSmartDisplay className="text-4xl text-cyan-400" />
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">
            {launching ? "Opening NextPlayer..." : "Launch Stream in NextPlayer"}
          </h2>
          <p className="text-xs text-slate-400 max-w-md">
            If NextPlayer didn't launch automatically or is not installed, click below to open or install from Google Play Store.
          </p>
        </div>

        {/* Primary CTA Buttons */}
        <div className="relative flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
          <button
            onClick={handleLaunchNextPlayer}
            className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-amber-400 hover:from-cyan-400 hover:to-amber-300 text-slate-950 font-black text-sm shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:scale-105 transition-all"
          >
            <FaPlay className="text-xs" />
            <span>Open in NextPlayer</span>
          </button>

          <a
            href={NEXTPLAYER_PLAY_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/15 hover:border-cyan-400/40 transition-all"
          >
            <FaAndroid className="text-green-400 text-base" />
            <span>Get on Play Store</span>
          </a>
        </div>

        {/* Direct Download Option */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-slate-400">Prefer to download the movie file directly?</span>
          <button
            onClick={handleDirectDownload}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black transition-all shadow-md cursor-pointer"
          >
            <FaDownload className="text-xs" />
            <span>Direct Download File</span>
          </button>
        </div>
      </div>

      {/* Alternative Players Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-black uppercase tracking-wider text-slate-300">
            Alternative Video Players
          </span>
          <span className="text-xs text-slate-400">For devices with MX or VLC installed</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* MX Player Card */}
          <div className="p-4 rounded-2xl bg-[#12141c]/90 border border-white/10 flex items-center justify-between gap-3 hover:border-blue-500/40 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 text-2xl border border-blue-500/20">
                <MdOndemandVideo />
              </div>
              <div>
                <strong className="block text-white text-sm font-bold">MX Player</strong>
                <span className="text-[11px] text-slate-400">HW+ decoder & multi-audio tracks</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleLaunchMx}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors"
              >
                Launch
              </button>
              <a
                href={MX_PLAY_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
                title="Install MX Player"
              >
                <FaAndroid className="text-green-400 text-xs" />
              </a>
            </div>
          </div>

          {/* VLC Player Card */}
          <div className="p-4 rounded-2xl bg-[#12141c]/90 border border-white/10 flex items-center justify-between gap-3 hover:border-orange-500/40 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400 text-2xl border border-orange-500/20">
                <SiVlcmediaplayer />
              </div>
              <div>
                <strong className="block text-white text-sm font-bold">VLC Player</strong>
                <span className="text-[11px] text-slate-400">DTS / AC3 audio and subtitle sync</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleLaunchVlc}
                className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition-colors"
              >
                Launch
              </button>
              <a
                href={VLC_PLAY_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
                title="Install VLC Player"
              >
                <FaAndroid className="text-green-400 text-xs" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copy Direct Stream Link Card (For PC / PotPlayer / Custom players) */}
      {videoUrl && (
        <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">
              Direct Stream URL (For PC VLC, PotPlayer or Network Stream):
            </span>
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300"
            >
              {copied ? <FaCheck className="text-green-400" /> : <FaCopy />}
              <span>{copied ? "Copied!" : "Copy URL"}</span>
            </button>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950 font-mono text-[11px] text-slate-400 break-all select-all border border-white/5">
            {videoUrl}
          </div>
        </div>
      )}

      {/* Why NextPlayer Information Card */}
      <div className="p-5 rounded-2xl bg-[#12141c]/60 border border-white/10 space-y-3 text-xs text-slate-300">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
          <FaVolumeUp />
          <span>Why does streaming open in NextPlayer?</span>
        </div>
        <p className="leading-relaxed">
          Modern high-definition cinema releases use multi-channel Dolby Digital AC3 and EAC3 surround sound codecs. Web browsers (Chrome, Safari, Firefox) do not license or decode AC3 audio tracks natively, which causes streams to play without sound inside a browser.
        </p>
        <p className="leading-relaxed">
          <strong>NextPlayer</strong> provides full native decoding for Dolby Audio, multi-audio language switching, and smooth hardware decoding for crystal-clear playback.
        </p>
      </div>
    </div>
  );
}
