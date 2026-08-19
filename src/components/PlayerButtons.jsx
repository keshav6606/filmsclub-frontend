/**
 * PlayerButtons.jsx
 * State-of-the-art streaming cockpit and download hub:
 *  1. In-Browser Web Player Modal
 *  2. NextPlayer (com.nextplayer.pro) - Recommended with Dolby Audio
 *  3. MX Player (com.mxtech.videoplayer.ad)
 *  4. VLC Media Player (org.videolan.vlc)
 *  5. Direct High-Speed Download & Telegram Cloud File deep-link
 */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaDownload,
  FaPlay,
  FaAndroid,
  FaCheck,
  FaVolumeUp,
  FaEllipsisV,
} from "react-icons/fa";
import { SiVlcmediaplayer } from "react-icons/si";
import { MdOndemandVideo, MdSmartDisplay, MdOutlineHighQuality } from "react-icons/md";
import { TbBrandTelegram, TbDeviceTv } from "react-icons/tb";
import { LuLanguages } from "react-icons/lu";
import { HiChevronDown, HiChevronUp, HiSparkles } from "react-icons/hi2";
import { BsPlayFill } from "react-icons/bs";
import { BiTime } from "react-icons/bi";
import { AnimatePresence, motion } from "framer-motion";
import Spinner from "./svg/Spinner";
import { BASE_URL as BASE } from "../config/api";

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
const TG_USERNAME = import.meta.env.VITE_TG_USERNAME || "Filmy4uhdBot";

// Google Play Store link for NextPlayer
const NEXTPLAYER_PLAY_LINK = "https://play.google.com/store/apps/details?id=com.nextplayer.pro";

const PLAYERS = [
  {
    id: "web",
    name: "Web Player",
    tag: "Instant Play",
    desc: "Stream instantly in browser",
    icon: <FaPlay className="text-xs text-amber-400" />,
    isWeb: true,
    accent: "amber",
  },
  {
    id: "nextplayer",
    name: "NextPlayer",
    tag: "Recommended",
    desc: "Full AC3/Dolby Audio + HW acceleration",
    icon: <MdSmartDisplay className="text-xl text-cyan-400" />,
    accent: "cyan",
    playStore: NEXTPLAYER_PLAY_LINK,
  },
  {
    id: "mx",
    name: "MX Player",
    tag: "HW+ Codec",
    desc: "Gesture controls & multi-audio",
    icon: <MdOndemandVideo className="text-xl text-blue-400" />,
    accent: "blue",
    playStore: "https://play.google.com/store/apps/details?id=com.mxtech.videoplayer.ad",
  },
  {
    id: "vlc",
    name: "VLC Player",
    tag: "Open Source",
    desc: "Surround sound & subtitle support",
    icon: <SiVlcmediaplayer className="text-xl text-orange-400" />,
    accent: "orange",
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

/**
 * Launch external video player apps or direct stream link
 */
const launchPlayer = (directStreamUrl, playerId, title = "Filmy4uhd Stream") => {
  if (!directStreamUrl) return;
  triggerPopunder();
  const isAndroid = /Android/i.test(navigator.userAgent);
  const encodedTitle = encodeURIComponent(title);

  const isHttps = directStreamUrl.startsWith("https");
  const scheme = isHttps ? "https" : "http";
  const cleanUrl = directStreamUrl.replace(/^https?:\/\//, "");

  let packageName = "";
  let playStoreUrl = "";

  if (playerId === "nextplayer" || playerId === "mpvex") {
    packageName = "com.nextplayer.pro";
    playStoreUrl = NEXTPLAYER_PLAY_LINK;
  } else if (playerId === "mx") {
    packageName = "com.mxtech.videoplayer.ad";
    playStoreUrl = "https://play.google.com/store/apps/details?id=com.mxtech.videoplayer.ad";
  } else if (playerId === "vlc") {
    packageName = "org.videolan.vlc";
    playStoreUrl = "https://play.google.com/store/apps/details?id=org.videolan.vlc";
  }

  if (isAndroid && packageName) {
    const encodedFallback = encodeURIComponent(playStoreUrl);
    const intentUrl = `intent://${cleanUrl}#Intent;scheme=${scheme};action=android.intent.action.VIEW;type=video/*;package=${packageName};S.title=${encodedTitle};S.browser_fallback_url=${encodedFallback};end`;

    const start = Date.now();
    setTimeout(() => {
      if (Date.now() - start < 2500 && !document.hidden && playStoreUrl) {
        window.location.href = playStoreUrl;
      }
    }, 1500);

    window.location.href = intentUrl;
    return;
  }

  // Windows / Mac / Desktop Fallback
  if (playerId === "vlc") {
    window.location.href = `vlc://${directStreamUrl}`;
    setTimeout(() => {
      window.open(directStreamUrl, "_blank");
    }, 1200);
    return;
  }

  window.open(directStreamUrl, "_blank");
};

/**
 * Shorten URL via configured shortener or return direct link
 */
const shortenUrl = async (url) => {
  if (!API_URL || !API_KEY) return url;
  try {
    const endpoint = API_URL.startsWith("http") ? API_URL : `https://${API_URL}`;
    const separator = endpoint.includes("?") ? "&" : "?";
    const res = await fetch(
      `${endpoint}${separator}api=${API_KEY}&url=${encodeURIComponent(url)}&format=json`
    );
    const data = await res.json();
    return data?.shortenedUrl || data?.short || data?.url || url;
  } catch (err) {
    console.warn("Shorten URL error:", err);
    return url;
  }
};

/**
 * Generate stream URL for media players and web player
 */
const generateVideoUrl = (id, name = "") => {
  const isDirectUrl = id?.startsWith("http://") || id?.startsWith("https://");
  if (isDirectUrl) return id;

  const origin = BASE.replace(/\/$/, "");
  const encodedName = encodeURIComponent(name || "video.mp4");
  return `${origin}/dl/${id}/${encodedName}`;
};

/**
 * Generate high-speed direct download URL with attachment header
 */
const generateDownloadUrl = (id, name = "") => {
  const isDirectUrl = id?.startsWith("http://") || id?.startsWith("https://");
  if (isDirectUrl) return id;

  const origin = BASE.replace(/\/$/, "");
  const encodedName = encodeURIComponent(name || "video.mp4");
  return `${origin}/dl/${id}/${encodedName}?dl=1`;
};

// Language Helpers
const langMap = {
  hi: "Hindi", en: "English", ta: "Tamil", te: "Telugu",
  kn: "Kannada", ml: "Malayalam", mr: "Marathi", bn: "Bengali",
  gu: "Gujarati", pa: "Punjabi", dual: "Dual Audio", multi: "Multi Audio",
};

const getUniqueLanguages = (items, movieData) => {
  const set = new Set();
  if (movieData?.languages?.length > 0) {
    movieData.languages.forEach((l) => set.add(langMap[l] || l.toUpperCase()));
  }
  if (Array.isArray(items)) {
    items.forEach((item) => {
      if (item?.languages?.length > 0) {
        item.languages.forEach((l) => set.add(langMap[l] || l.toUpperCase()));
      }
      if (item?.language) set.add(langMap[item.language] || item.language.toUpperCase());
    });
  }
  if (set.size === 0) set.add("Hindi");
  const langs = Array.from(set);
  if (langs.length > 1) langs.push("All Audio");
  return langs;
};

const filterByLanguage = (items, selectedLang) => {
  if (!Array.isArray(items) || !selectedLang || selectedLang === "All Audio" || selectedLang === "All") {
    return items;
  }
  const langLower = selectedLang.toLowerCase();
  const filtered = items.filter((item) => {
    const titleStr = `${item?.name || ""} ${item?.quality || ""} ${item?.language || ""} ${item?.lang || ""} ${item?.audio || ""}`.toLowerCase();
    if (Array.isArray(item?.languages) && item.languages.some((l) => String(l).toLowerCase().includes(langLower))) return true;
    return titleStr.includes(langLower);
  });
  return filtered.length > 0 ? filtered : items;
};

// ─── Quality Card Component (Matching Screen 3) ───────────────────────────
const QualityCard = ({ item, isSelected, onClick }) => {
  const quality = item?.quality || "HD";
  const size = item?.size || "";

  return (
    <button
      onClick={onClick}
      className={`relative group flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 text-center flex-1 min-w-[100px] ${
        isSelected
          ? "bg-gradient-to-br from-amber-500/20 via-slate-900/90 to-amber-600/10 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-105"
          : "bg-slate-900/70 border-white/10 hover:border-amber-400/40 hover:bg-slate-900/90"
      }`}
    >
      <span
        className={`text-xs sm:text-sm font-black uppercase tracking-wider ${
          isSelected ? "text-amber-400" : "text-white"
        }`}
      >
        {quality}
      </span>
      {size ? (
        <span className="text-[0.68rem] text-slate-400 font-semibold mt-1">
          {size}
        </span>
      ) : (
        <span className="text-[0.68rem] text-slate-400 font-semibold mt-1">
          High Bitrate
        </span>
      )}
    </button>
  );
};

// ─── Player App Launch Card ───────────────────────────────────────────────
const PlayerCard = ({ player, onClick, loading, disabled }) => {
  return (
    <div
      className={`relative p-3.5 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-2.5 ${
        player.id === "nextplayer"
          ? "bg-gradient-to-br from-cyan-950/40 via-slate-900/90 to-slate-950 border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:border-cyan-400"
          : player.id === "web"
          ? "bg-gradient-to-br from-amber-950/30 via-slate-900/90 to-slate-950 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:border-amber-400"
          : "bg-slate-900/80 border-white/10 hover:border-white/20 shadow-md"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div
            className={`p-2 rounded-xl border ${
              player.id === "nextplayer"
                ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                : player.id === "web"
                ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                : player.id === "mx"
                ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                : "bg-orange-500/10 border-orange-500/30 text-orange-400"
            }`}
          >
            {player.icon}
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-white">
              {player.name}
            </h4>
            <span className="text-[0.62rem] text-slate-400 leading-tight block">
              {player.desc}
            </span>
          </div>
        </div>

        <span
          className={`text-[0.58rem] font-black uppercase px-2 py-0.5 rounded-full shrink-0 ${
            player.id === "nextplayer"
              ? "bg-cyan-400/20 text-cyan-300 border border-cyan-400/40"
              : player.id === "web"
              ? "bg-amber-400/20 text-amber-300 border border-amber-400/40"
              : "bg-white/10 text-slate-300 border border-white/15"
          }`}
        >
          {player.tag}
        </span>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-white/5 gap-2">
        <button
          onClick={onClick}
          disabled={disabled || loading}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-black transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${
            player.id === "web"
              ? "bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md hover:scale-[1.02]"
              : player.id === "nextplayer"
              ? "bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-950 shadow-md hover:scale-[1.02]"
              : "bg-white/10 text-white hover:bg-white/20 hover:scale-[1.02]"
          }`}
        >
          {loading ? (
            <Spinner />
          ) : (
            <>
              <FaPlay className="text-[9px]" />
              <span>{player.isWeb ? "Play in Browser" : "Launch Player"}</span>
            </>
          )}
        </button>

        {player.playStore && (
          <a
            href={player.playStore}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[0.65rem] font-bold text-slate-400 hover:text-white bg-slate-950/60 border border-white/10 transition-colors shrink-0"
            title={`Get ${player.name} App`}
          >
            <FaAndroid className="text-green-400 text-xs" />
            <span>App</span>
          </a>
        )}
      </div>
    </div>
  );
};

// ─── Screen 3: Movie Player Section (Stream or Download) ───────────────────
const MoviePlayerSection = ({ telegram, movieData, onOpenWebPlayer }) => {
  const navigate = useNavigate();
  const availableLangs = getUniqueLanguages(telegram, movieData);
  const [selectedLanguage, setSelectedLanguage] = useState(availableLangs[0] || "Hindi");
  const [selectedQuality, setSelectedQuality] = useState("");
  const [loading, setLoading] = useState({});

  const filteredItems = filterByLanguage(telegram, selectedLanguage);
  const availableQualities = filteredItems.length > 0 ? filteredItems : (telegram || []);
  const selectedItem = availableQualities.find((t) => t.quality === selectedQuality) || availableQualities[0];

  const handlePlayer = async (player) => {
    if (!selectedItem) return;
    setLoading((p) => ({ ...p, [player.id]: true }));
    const rawUrl = generateVideoUrl(selectedItem.id, selectedItem.name);
    const title = `${movieData?.title || "Movie"} (${selectedItem.quality || ""})`;
    setLoading((p) => ({ ...p, [player.id]: false }));

    if (player.id === "web") {
      onOpenWebPlayer?.({
        id: selectedItem.id,
        name: selectedItem.name,
        title,
        quality: selectedItem.quality,
        language: selectedLanguage,
        tmdbId: movieData?.tmdb_id,
        mediaType: movieData?.media_type || "movie",
      });
      const params = new URLSearchParams({
        id: selectedItem.id || "",
        name: selectedItem.name || "",
        title: title,
        quality: selectedItem.quality || "HD",
        lang: selectedLanguage || "Hindi",
        tmdb_id: movieData?.tmdb_id || "",
        media_type: movieData?.media_type || "movie",
      });
      navigate(`/watch?${params.toString()}`);
    } else {
      launchPlayer(rawUrl, player.id, title);
    }
  };

  const handleDownload = async () => {
    if (!selectedItem) return;
    triggerPopunder();
    setLoading((p) => ({ ...p, download: true }));
    const rawUrl = generateDownloadUrl(selectedItem.id, selectedItem.name);
    const finalUrl = await shortenUrl(rawUrl);
    setLoading((p) => ({ ...p, download: false }));
    window.open(finalUrl, "_blank", "noopener noreferrer");
  };

  return (
    <div className="space-y-6">
      {/* ── Screen 3: Stream or Download Section ── */}
      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">
          Stream or Download
        </h3>

        {/* Resolution Selector Cards (Screen 3: 480p, 720p, 1080p, 4K UHD) */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          {availableQualities.map((item, idx) => (
            <QualityCard
              key={item.id || item.quality || idx}
              item={item}
              isSelected={(selectedQuality || availableQualities[0]?.quality) === item.quality}
              onClick={() => setSelectedQuality(item.quality)}
            />
          ))}
        </div>

        {/* Big Prominent "Watch Now" Gold CTA Button (Matching Screen 3) */}
        <button
          onClick={() => handlePlayer(PLAYERS[0])}
          disabled={!selectedItem}
          className="btn-gold w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-black shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:scale-[1.01]"
        >
          <BsPlayFill className="text-2xl" />
          <span>Watch Now</span>
        </button>
      </div>

      {/* External Player Decks */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400">
            External Video Players
          </span>
          <span className="text-[0.68rem] text-cyan-400 font-bold">
            ✨ NextPlayer Recommended
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PLAYERS.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              onClick={() => handlePlayer(player)}
              disabled={!selectedItem}
              loading={loading[player.id]}
            />
          ))}
        </div>
      </div>

      {/* Direct High-Speed Download and Telegram Links */}
      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/10">
        <button
          onClick={handleDownload}
          disabled={loading.download || !selectedItem}
          className="flex items-center gap-2 btn-outline-gold px-6 py-2.5 text-xs font-bold disabled:opacity-40"
          aria-label="Direct Download Movie"
        >
          {loading.download ? <Spinner /> : <FaDownload />}
          <span>Direct Download ({selectedItem?.quality || "HD"})</span>
        </button>

        {selectedItem && (
          <a
            href={`https://t.me/${TG_USERNAME}?start=file_${selectedItem.id || movieData?.tmdb_id}_${selectedItem.quality || "HD"}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={triggerPopunder}
            className="flex items-center gap-2 bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold px-6 py-2.5 rounded-full text-xs transition-all shadow-md hover:scale-105"
          >
            <TbBrandTelegram className="text-base" />
            <span>Get on Telegram</span>
          </a>
        )}
      </div>
    </div>
  );
};

// ─── Screen 6: Episode Item Card ──────────────────────────────────────────
const EpisodeCard = ({ ep, isSelected, onToggle, movieData, seasonNumber, onOpenWebPlayer }) => {
  const navigate = useNavigate();
  const rawQualities = ep?.telegram || [];
  const availableLangs = getUniqueLanguages(rawQualities, movieData);
  const [selectedLanguage, setSelectedLanguage] = useState(availableLangs[0] || "Hindi");
  const [selectedQuality, setSelectedQuality] = useState("");
  const [loading, setLoading] = useState({});

  const filteredQualities = filterByLanguage(rawQualities, selectedLanguage);
  const qualities = filteredQualities.length > 0 ? filteredQualities : rawQualities;
  const currentQualityItem = qualities.find((q) => q.quality === selectedQuality) || qualities[0];

  const handlePlayer = async (player) => {
    if (!currentQualityItem) return;
    setLoading((p) => ({ ...p, [player.id]: true }));
    const rawUrl = generateVideoUrl(currentQualityItem.id, currentQualityItem.name);
    const title = `${movieData?.title || "Series"} - S${seasonNumber}E${ep.episode_number} (${currentQualityItem.quality || ""})`;
    setLoading((p) => ({ ...p, [player.id]: false }));

    if (player.id === "web") {
      onOpenWebPlayer?.({
        id: currentQualityItem.id,
        name: currentQualityItem.name,
        title,
        quality: currentQualityItem.quality,
        language: selectedLanguage,
        tmdbId: movieData?.tmdb_id,
        mediaType: "tv",
      });
      const params = new URLSearchParams({
        id: currentQualityItem.id || "",
        name: currentQualityItem.name || "",
        title: title,
        quality: currentQualityItem.quality || "HD",
        lang: selectedLanguage || "Hindi",
        tmdb_id: movieData?.tmdb_id || "",
        media_type: "tv",
      });
      navigate(`/watch?${params.toString()}`);
    } else {
      launchPlayer(rawUrl, player.id, title);
    }
  };

  const handleDownload = async () => {
    if (!currentQualityItem) return;
    triggerPopunder();
    setLoading((p) => ({ ...p, download: true }));
    const rawUrl = generateDownloadUrl(currentQualityItem.id, currentQualityItem.name);
    const finalUrl = await shortenUrl(rawUrl);
    setLoading((p) => ({ ...p, download: false }));
    window.open(finalUrl, "_blank", "noopener noreferrer");
  };

  return (
    <div className="space-y-1">
      {/* Episode Row (Screen 6 format: Thumbnail left, title & duration center, download & menu right) */}
      <div
        className={`w-full px-3.5 py-3 rounded-2xl border flex items-center justify-between gap-3 text-xs sm:text-sm font-bold transition-all duration-300 ${
          isSelected
            ? "bg-slate-900 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
            : "bg-slate-900/60 text-slate-200 border-white/10 hover:bg-slate-900 hover:border-amber-400/30"
        }`}
      >
        {/* Left: Thumbnail with Play Overlay */}
        <div
          onClick={onToggle}
          className="relative w-16 sm:w-20 aspect-video rounded-xl bg-slate-950 overflow-hidden shrink-0 cursor-pointer group border border-white/10"
        >
          <img
            src={ep.thumbnail || movieData?.backdrop || movieData?.poster}
            alt={`Episode ${ep.episode_number}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-md">
              <BsPlayFill className="text-base ml-0.5" />
            </div>
          </div>
        </div>

        {/* Center: Title & Duration */}
        <div onClick={onToggle} className="flex-1 min-w-0 cursor-pointer">
          <p className="font-extrabold text-white text-xs sm:text-sm line-clamp-1">
            {ep.episode_number}. Season {seasonNumber} - Episode {ep.episode_number}
            {ep.title ? `: ${ep.title}` : ""}
          </p>
          <div className="flex items-center gap-2 mt-1 text-[0.68rem] text-slate-400 font-semibold">
            <BiTime className="text-amber-400" />
            <span>{ep.duration || "55 min"}</span>
          </div>
        </div>

        {/* Right: Actions (Download + Expand Toggle) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleDownload}
            className="p-2 rounded-xl bg-white/5 hover:bg-amber-400 hover:text-slate-950 text-slate-300 transition-colors"
            title="Download Episode"
          >
            <FaDownload className="text-xs" />
          </button>
          <button
            onClick={onToggle}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 transition-colors"
            title="Options & Streaming Decks"
          >
            <FaEllipsisV className="text-xs" />
          </button>
        </div>
      </div>

      {/* Expanded Deck */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            key={`ep-${ep.episode_number}-panel`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/95 border border-amber-500/30 space-y-4 shadow-2xl mt-1 mb-2">
              {/* Qualities */}
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">
                  Select Resolution
                </span>
                <div className="flex items-center gap-2.5 flex-wrap">
                  {qualities.map((q, i) => (
                    <QualityCard
                      key={q.id || q.quality || i}
                      item={q}
                      isSelected={(selectedQuality || qualities[0]?.quality) === q.quality}
                      onClick={() => setSelectedQuality(q.quality)}
                    />
                  ))}
                </div>
              </div>

              {/* Players Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
                {PLAYERS.map((player) => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    onClick={() => handlePlayer(player)}
                    disabled={!currentQualityItem}
                    loading={loading[player.id]}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Screen 6: TV Show Player Section (Seasons + Episode List) ─────────────
const TvPlayerSection = ({
  seasons,
  episodes,
  seasonNumber,
  setSeasonNumber,
  episodeNumber,
  setEpisodeNumber,
  isEpisodesLoading,
  movieData,
  onOpenWebPlayer,
}) => {
  return (
    <div className="space-y-6">
      {/* ── Screen 5 & 6: Seasons Selector Bar ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TbDeviceTv className="text-amber-400 text-lg" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-300">
              Seasons
            </span>
          </div>
          <span className="text-xs text-amber-400 font-bold">See all</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {seasons
            ?.filter((s) => s.season_number > 0)
            .sort((a, b) => a.season_number - b.season_number)
            .map((s) => (
              <button
                key={s.season_number}
                onClick={() => {
                  setSeasonNumber(s.season_number);
                  setEpisodeNumber("");
                }}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 border shrink-0 ${
                  parseInt(seasonNumber) === s.season_number
                    ? "bg-slate-900 border-amber-400 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)] scale-105"
                    : "bg-slate-900/60 text-slate-300 border-white/10 hover:border-white/20"
                }`}
              >
                Season {s.season_number}
              </button>
            ))}
        </div>
      </div>

      {/* ── Screen 6: Episode List Deck ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-black uppercase tracking-wider text-slate-300">
            Season {seasonNumber} Episode List
          </span>
          {episodes?.length > 0 && (
            <span className="text-[0.72rem] text-slate-400 font-semibold">
              {episodes.length} Episodes available
            </span>
          )}
        </div>

        {!isEpisodesLoading && episodes?.length > 0 ? (
          <div className="space-y-2.5">
            {episodes.map((ep) => (
              <EpisodeCard
                key={ep.episode_number}
                ep={ep}
                isSelected={String(episodeNumber) === String(ep.episode_number)}
                onToggle={() =>
                  setEpisodeNumber((prev) =>
                    String(prev) === String(ep.episode_number) ? "" : String(ep.episode_number)
                  )
                }
                movieData={movieData}
                seasonNumber={seasonNumber}
                onOpenWebPlayer={onOpenWebPlayer}
              />
            ))}
          </div>
        ) : isEpisodesLoading ? (
          <div className="space-y-2.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 rounded-2xl shimmer-effect" />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 text-xs bg-slate-900/40 rounded-2xl border border-white/5">
            No episode streams found for Season {seasonNumber}.
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main PlayerButtons Component ──────────────────────────────────────────
export default function PlayerButtons(props) {
  const isMovie = props.movieData?.media_type === "movie";

  return (
    <section className="glass-card p-5 sm:p-7 rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
      {isMovie ? (
        <MoviePlayerSection
          telegram={props.movieData?.telegram || []}
          movieData={props.movieData}
          onOpenWebPlayer={props.onOpenWebPlayer}
        />
      ) : (
        <TvPlayerSection
          seasons={props.movieData?.seasons || []}
          episodes={props.episodes || []}
          seasonNumber={props.seasonNumber}
          setSeasonNumber={props.setSeasonNumber}
          episodeNumber={props.episodeNumber}
          setEpisodeNumber={props.setEpisodeNumber}
          isEpisodesLoading={props.isEpisodesLoading}
          movieData={props.movieData}
          onOpenWebPlayer={props.onOpenWebPlayer}
        />
      )}
    </section>
  );
}
