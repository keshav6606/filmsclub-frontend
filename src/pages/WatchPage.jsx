import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  FaDownload,
  FaArrowLeft,
  FaAndroid,
  FaCheck,
  FaCopy,
  FaVolumeUp,
  FaPlay,
} from "react-icons/fa";
import { MdSmartDisplay, MdOndemandVideo, MdOutlineHighQuality } from "react-icons/md";
import { SiVlcmediaplayer } from "react-icons/si";
import SEO from "../components/SEO";
import AdBanner from "../components/AdBanner";
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

export default function WatchPage() {
  const [searchParams] = useSearchParams();

  const fileId = searchParams.get("id");
  const fileName = searchParams.get("name");
  const title = searchParams.get("title") || "Online Cinema Stream";
  const quality = searchParams.get("quality") || "4K UHD";
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
        title={`Stream in NextPlayer 4K: ${title} | 4K Passthrough`}
        description={`Stream ${title} in NextPlayer with full AC3/Dolby surround sound and hardware acceleration.`}
        keywords={`${title}, watch in NextPlayer, NextPlayer pro, stream ${title}, filmsclub`}
      />

      {/* Top Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to={backLink}
          className="inline-flex items-center gap-2 bg-[#0E131F] hover:bg-[#141A29] text-slate-300 hover:text-cyan-400 px-4 py-2 rounded-full border border-white/10 hover:border-cyan-400/40 text-xs font-bold transition-all shadow-md font-outfit"
        >
          <FaArrowLeft />
          <span>Back to Details</span>
        </Link>

        <div className="flex items-center gap-2 font-mono">
          <span className="spec-badge spec-badge-4k flex items-center gap-1.5">
            <MdOutlineHighQuality className="text-sm" /> {quality}
          </span>
          <span className="spec-badge spec-badge-hdr">
            {language}
          </span>
          <span className="spec-badge spec-badge-atmos">
            DOLBY ATMOS
          </span>
        </div>
      </div>

      {/* Main Streaming Cockpit Header */}
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-black uppercase tracking-wider font-mono">
          <MdSmartDisplay className="text-base text-cyan-400" /> EXTERNAL HARDWARE PLAYER STREAM
        </span>
        <h1 className="text-2xl sm:text-4xl font-outfit font-black text-white tracking-tight">
          Streaming: <span className="cyan-gradient-text">{title}</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-medium">
          Theatrical bitrate streams are pre-configured for <strong>NextPlayer</strong> with full multi-channel Dolby Atmos audio and 4K hardware acceleration.
        </p>
      </div>

      {/* NextPlayer Launch Card (Hero Cockpit) */}
      <div className="relative glass-panel-elevated p-6 sm:p-10 rounded-3xl border border-cyan-400/30 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(0,242,254,0.15)] text-center space-y-6 overflow-hidden">
        {/* Glow ambient circle */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative flex flex-col items-center space-y-3">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-violet-600 p-0.5 shadow-[0_0_35px_rgba(0,242,254,0.6)] flex items-center justify-center">
            <div className="w-full h-full bg-[#05070B] rounded-[22px] flex items-center justify-center">
              <MdSmartDisplay className="text-4xl text-cyan-400" />
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-outfit font-black text-white">
            {launching ? "Opening NextPlayer Stream..." : "Launch Stream in NextPlayer"}
          </h2>
          <p className="text-xs text-slate-400 max-w-md">
            If NextPlayer didn't launch automatically or is not installed on this Android device, click below to open or install from Google Play Store.
          </p>
        </div>

        {/* Primary CTA Buttons */}
        <div className="relative flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
          <button
            onClick={handleLaunchNextPlayer}
            className="w-full sm:flex-1 btn-cinema-primary py-3.5 px-6 rounded-2xl text-sm font-black shadow-[0_0_30px_rgba(0,242,254,0.6)]"
          >
            <FaPlay className="text-xs mr-2" />
            <span>Open in NextPlayer</span>
          </button>

          <a
            href={NEXTPLAYER_PLAY_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:flex-1 btn-cinema-frosted py-3.5 px-6 rounded-2xl font-bold text-sm"
          >
            <FaAndroid className="text-emerald-400 text-base mr-2" />
            <span>Get on Play Store</span>
          </a>
        </div>

        {/* Direct Download Option */}
        <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-slate-400">Prefer to save this movie file directly to storage?</span>
          <button
            onClick={handleDirectDownload}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black transition-all shadow-md cursor-pointer font-outfit"
          >
            <FaDownload className="text-xs" />
            <span>Direct 4K Download</span>
          </button>
        </div>
      </div>

      {/* Ad Banner In Watch Cockpit */}
      <AdBanner slot="5754054742" className="my-6" />

      {/* Alternative Players Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-black uppercase tracking-wider text-slate-300 font-outfit">
            Alternative Video Players
          </span>
          <span className="text-xs text-slate-400">For devices with MX or VLC installed</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* MX Player Card */}
          <div className="p-4 rounded-2xl bg-[#0E131F] border border-white/[0.08] flex items-center justify-between gap-3 hover:border-blue-500/40 transition-all shadow-md">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 text-2xl border border-blue-500/20">
                <MdOndemandVideo />
              </div>
              <div>
                <strong className="block text-white text-sm font-bold font-outfit">MX Player</strong>
                <span className="text-[11px] text-slate-400">HW+ decoder & multi-audio tracks</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleLaunchMx}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors font-outfit"
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
          <div className="p-4 rounded-2xl bg-[#0E131F] border border-white/[0.08] flex items-center justify-between gap-3 hover:border-orange-500/40 transition-all shadow-md">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400 text-2xl border border-orange-500/20">
                <SiVlcmediaplayer />
              </div>
              <div>
                <strong className="block text-white text-sm font-bold font-outfit">VLC Player</strong>
                <span className="text-[11px] text-slate-400">DTS / AC3 audio and subtitle sync</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleLaunchVlc}
                className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition-colors font-outfit"
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

      {/* Copy Direct Stream Link Card */}
      {videoUrl && (
        <div className="p-5 rounded-2xl bg-[#0E131F] border border-white/[0.08] space-y-2.5 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 font-outfit">
              Direct Stream URL (For PC VLC, PotPlayer, Infuse or Kodi):
            </span>
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 font-outfit"
            >
              {copied ? <FaCheck className="text-emerald-400" /> : <FaCopy />}
              <span>{copied ? "Copied to Clipboard!" : "Copy URL"}</span>
            </button>
          </div>
          <div className="p-3 rounded-xl bg-[#05070B] font-mono text-[11px] text-slate-300 break-all select-all border border-white/5">
            {videoUrl}
          </div>
        </div>
      )}

      {/* Ad Banner Before Specs */}
      <AdBanner slot="7317709042" className="my-6" />

      {/* Why NextPlayer Information Card */}
      <div className="p-5 rounded-2xl bg-[#0E131F]/70 border border-white/[0.08] space-y-3 text-xs text-slate-300 shadow-md">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm font-outfit">
          <FaVolumeUp />
          <span>Why is NextPlayer recommended for streaming?</span>
        </div>
        <p className="leading-relaxed">
          Theatrical 4K and BluRay releases encode multi-channel spatial audio using Dolby Digital AC3, EAC3, and Atmos. Standard web browsers lack native AC3 hardware decoders, resulting in silent video playback inside a browser window.
        </p>
        <p className="leading-relaxed">
          <strong>NextPlayer</strong> provides zero-latency hardware decoding, spatial Dolby audio passthrough, and custom subtitle styling for the ultimate home theater experience.
        </p>
      </div>
    </div>
  );
}
