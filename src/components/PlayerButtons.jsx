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
} from "react-icons/fa";
import { SiVlcmediaplayer } from "react-icons/si";
import { MdOndemandVideo, MdSmartDisplay, MdOutlineHighQuality } from "react-icons/md";
import { TbBrandTelegram, TbDeviceTv } from "react-icons/tb";
import { LuLanguages } from "react-icons/lu";
import { HiChevronDown, HiChevronUp } from "react-icons/hi2";
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
    desc: "Stream instantly inside your web browser",
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
    desc: "Gesture controls & multi-audio support",
    icon: <MdOndemandVideo className="text-xl text-blue-400" />,
    accent: "blue",
    playStore: "https://play.google.com/store/apps/details?id=com.mxtech.videoplayer.ad",
  },
  {
    id: "vlc",
    name: "VLC Player",
    tag: "Open Source",
    desc: "Native DTS & surround audio support",
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
    }, 2000);

    window.location.href = intentUrl;
  } else {
    if (playerId === "vlc") {
      window.location.href = `vlc://${cleanUrl}`;
    } else if (playerId === "nextplayer" || playerId === "mpvex" || playerId === "mpv") {
      window.location.href = `mpv://${cleanUrl}`;
    } else {
      window.open(directStreamUrl, "_blank", "noopener noreferrer");
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

const generateVideoUrl = (id, name) =>
  `${BASE}/dl/${id}/${encodeURIComponent(name)}`;

// ─── Lang helpers ─────────────────────────────────────────────────────────
const langMap = {
  hi: "Hindi", en: "English", ta: "Tamil", te: "Telugu",
  kn: "Kannada", ml: "Malayalam", mr: "Marathi", bn: "Bengali",
  dual: "Dual Audio", multi: "Multi Audio",
};

const normalizeLang = (str) => {
  if (!str || typeof str !== "string") return null;
  const s = str.trim();
  const lower = s.toLowerCase();
  if (langMap[lower]) return langMap[lower];
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const getUniqueLanguages = (items = [], movieData = {}) => {
  const set = new Set();

  if (Array.isArray(movieData?.languages)) {
    movieData.languages.forEach((l) => { const n = normalizeLang(l); if (n) set.add(n); });
  } else if (movieData?.language) {
    const n = normalizeLang(movieData.language);
    if (n) set.add(n);
  }

  if (Array.isArray(items)) {
    items.forEach((item) => {
      if (Array.isArray(item?.languages)) {
        item.languages.forEach((l) => { const n = normalizeLang(l); if (n) set.add(n); });
      }
      ["language", "lang", "audio", "audio_language"].forEach((key) => {
        if (item?.[key]) set.add(normalizeLang(item[key]));
      });
      const titleStr = `${item?.name || ""} ${item?.quality || ""}`;
      if (/hindi/i.test(titleStr)) set.add("Hindi");
      if (/english/i.test(titleStr)) set.add("English");
      if (/dual/i.test(titleStr)) set.add("Dual Audio");
      if (/multi/i.test(titleStr)) set.add("Multi Audio");
      if (/tamil/i.test(titleStr)) set.add("Tamil");
      if (/telugu/i.test(titleStr)) set.add("Telugu");
      if (/kannada/i.test(titleStr)) set.add("Kannada");
      if (/malayalam/i.test(titleStr)) set.add("Malayalam");
    });
  }

  if (set.size === 0) {
    set.add("Hindi");
    set.add("English");
    set.add("Dual Audio");
  }

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

// ─── Quality Card Component ───────────────────────────────────────────────
const QualityCard = ({ item, isSelected, onClick }) => {
  const quality = item?.quality || "HD";
  const size = item?.size || "";

  return (
    <button
      onClick={onClick}
      className={`relative group flex flex-col items-start p-3.5 rounded-2xl border transition-all duration-300 text-left min-w-[130px] sm:min-w-[150px] flex-1 ${
        isSelected
          ? "bg-gradient-to-br from-amber-500/20 via-slate-900/90 to-amber-600/10 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.35)] scale-[1.02]"
          : "bg-slate-900/70 border-white/10 hover:border-amber-400/50 hover:bg-slate-900/90 hover:scale-[1.01]"
      }`}
    >
      {/* Top row: Quality pill + Check indicator */}
      <div className="flex items-center justify-between w-full mb-2">
        <span
          className={`text-xs font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider ${
            isSelected
              ? "bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md"
              : "bg-white/10 text-slate-200 group-hover:text-amber-400 group-hover:bg-amber-400/10"
          }`}
        >
          {quality}
        </span>
        {isSelected && (
          <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[10px] font-black shadow-sm">
            <FaCheck />
          </div>
        )}
      </div>

      {/* Bottom row: File size info */}
      {size ? (
        <span className="text-[0.72rem] text-slate-400 font-semibold group-hover:text-slate-300">
          Size: <strong className="text-slate-200">{size}</strong>
        </span>
      ) : (
        <span className="text-[0.72rem] text-slate-400 font-semibold">High Bitrate</span>
      )}
    </button>
  );
};

// ─── Player App Launch Card ───────────────────────────────────────────────
const PlayerCard = ({ player, onClick, loading, disabled }) => {
  return (
    <div
      className={`relative p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-3 ${
        player.id === "nextplayer"
          ? "bg-gradient-to-br from-cyan-950/40 via-slate-900/90 to-slate-950 border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:border-cyan-400"
          : player.id === "web"
          ? "bg-gradient-to-br from-amber-950/30 via-slate-900/90 to-slate-950 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:border-amber-400"
          : "bg-slate-900/80 border-white/10 hover:border-white/20 shadow-md"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-xl border ${
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
            <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
              {player.name}
            </h4>
            <span className="text-[0.68rem] text-slate-400 leading-tight block mt-0.5">
              {player.desc}
            </span>
          </div>
        </div>

        <span
          className={`text-[0.62rem] font-black uppercase px-2 py-0.5 rounded-full shrink-0 ${
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

      <div className="flex items-center justify-between pt-2 border-t border-white/5 gap-2">
        <button
          onClick={onClick}
          disabled={disabled || loading}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-black transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${
            player.id === "web"
              ? "bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md hover:brightness-110 hover:scale-[1.02]"
              : player.id === "nextplayer"
              ? "bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-950 shadow-md hover:brightness-110 hover:scale-[1.02]"
              : "bg-white/10 text-white hover:bg-white/20 hover:scale-[1.02]"
          }`}
        >
          {loading ? (
            <Spinner />
          ) : (
            <>
              <FaPlay className="text-[10px]" />
              <span>{player.isWeb ? "Play in Browser" : "Launch Player"}</span>
            </>
          )}
        </button>

        {player.playStore && (
          <a
            href={player.playStore}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-[0.7rem] font-bold text-slate-400 hover:text-white bg-slate-950/60 hover:bg-slate-950 border border-white/10 transition-colors shrink-0"
            title={`Get ${player.name} App`}
          >
            <FaAndroid className="text-green-400" />
            <span>App</span>
          </a>
        )}
      </div>
    </div>
  );
};

// ─── Movie Player Section ─────────────────────────────────────────────────
const MoviePlayerSection = ({ telegram, movieData, onOpenWebPlayer }) => {
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
      onOpenWebPlayer({
        id: selectedItem.id,
        name: selectedItem.name,
        title,
        quality: selectedItem.quality,
        language: selectedLanguage,
        tmdbId: movieData?.tmdb_id,
        mediaType: movieData?.media_type || "movie",
      });
    } else {
      launchPlayer(rawUrl, player.id, title);
    }
  };

  const handleDownload = async () => {
    if (!selectedItem) return;
    triggerPopunder();
    setLoading((p) => ({ ...p, download: true }));
    const rawUrl = generateVideoUrl(selectedItem.id, selectedItem.name);
    const finalUrl = await shortenUrl(rawUrl);
    setLoading((p) => ({ ...p, download: false }));
    window.open(finalUrl, "_blank", "noopener noreferrer");
  };

  return (
    <div className="space-y-6">
      {/* ── 1. Audio Language Switcher ── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <LuLanguages className="text-cyan-400 text-base" />
          <span className="text-xs font-black uppercase tracking-wider text-slate-300">
            Select Audio Track
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {availableLangs.map((lang) => (
            <button
              key={lang}
              onClick={() => { setSelectedLanguage(lang); setSelectedQuality(""); }}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 border ${
                selectedLanguage === lang
                  ? "bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)] scale-105"
                  : "bg-slate-900/80 text-slate-300 border-white/10 hover:border-amber-400/40 hover:text-white"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* ── 2. Quality & Resolution Selector Cards ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MdOutlineHighQuality className="text-amber-400 text-lg" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-300">
              Select Video Stream Resolution
            </span>
          </div>
          {selectedItem && (
            <span className="text-[0.72rem] text-cyan-400 font-bold bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
              Selected: {selectedItem.quality} • {selectedLanguage}
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {availableQualities.map((t, i) => (
            <QualityCard
              key={t.id || t.quality || i}
              item={t}
              isSelected={(selectedQuality || selectedItem?.quality) === t.quality}
              onClick={() => setSelectedQuality(t.quality)}
            />
          ))}
        </div>
      </div>

      {/* ── 3. Audio Notice & Player Grid ── */}
      <div className="space-y-3 pt-2">
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-500/15 via-slate-900 to-amber-500/15 border border-cyan-500/30 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <FaVolumeUp className="text-amber-400 text-lg shrink-0" />
            <span className="text-slate-200 text-[0.75rem] font-medium">
              Want 100% Dolby audio? Launch in <strong>NextPlayer</strong> or <strong>MX Player</strong> below.
            </span>
          </div>
          <a
            href={NEXTPLAYER_PLAY_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-[0.7rem] font-bold text-cyan-400 hover:text-cyan-300 underline"
          >
            Get NextPlayer &rarr;
          </a>
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

      {/* ── 4. Direct Cloud Download & Telegram Hub ── */}
      <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/10">
        <button
          onClick={handleDownload}
          disabled={!selectedItem || loading.download}
          className="flex items-center gap-2 btn-gold px-8 py-3.5 text-sm font-extrabold shadow-[0_0_25px_rgba(245,158,11,0.5)] disabled:opacity-40"
          aria-label="Download selected quality"
        >
          {loading.download ? <Spinner /> : <FaDownload />}
          <span>Download File {selectedItem?.quality ? `(${selectedItem.quality})` : ""}</span>
        </button>

        {selectedItem && (
          <a
            href={`https://t.me/${TG_USERNAME}?start=file_${selectedItem.id || movieData?.tmdb_id}_${selectedItem.quality}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={triggerPopunder}
            className="flex items-center gap-2.5 bg-[#0088cc] hover:bg-[#0077b5] text-white font-extrabold px-7 py-3.5 rounded-full text-sm transition-all shadow-[0_0_25px_rgba(0,136,204,0.4)] hover:scale-105"
          >
            <TbBrandTelegram className="text-xl" />
            <span>Get on Telegram</span>
          </a>
        )}
      </div>
    </div>
  );
};

// ─── Single Episode Expandable Card ───────────────────────────────────────
const EpisodeCard = ({ ep, isSelected, onToggle, movieData, seasonNumber, onOpenWebPlayer }) => {
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
      onOpenWebPlayer({
        id: currentQualityItem.id,
        name: currentQualityItem.name,
        title,
        quality: currentQualityItem.quality,
        language: selectedLanguage,
        tmdbId: movieData?.tmdb_id,
        mediaType: "tv",
      });
    } else {
      launchPlayer(rawUrl, player.id, title);
    }
  };

  const handleDownload = async () => {
    if (!currentQualityItem) return;
    triggerPopunder();
    setLoading((p) => ({ ...p, download: true }));
    const rawUrl = generateVideoUrl(currentQualityItem.id, currentQualityItem.name);
    const finalUrl = await shortenUrl(rawUrl);
    setLoading((p) => ({ ...p, download: false }));
    window.open(finalUrl, "_blank", "noopener noreferrer");
  };

  const isCombined =
    String(ep.episode_number).includes("-") ||
    (ep.title && ep.title.toLowerCase().includes("combined"));

  return (
    <div className="space-y-1">
      {/* Episode Header Row Button */}
      <button
        onClick={onToggle}
        className={`w-full text-left px-4 py-3.5 rounded-2xl border flex items-center justify-between text-xs sm:text-sm font-bold transition-all duration-300 ${
          isSelected
            ? "bg-gradient-to-r from-amber-500/20 via-slate-900 to-amber-600/10 text-amber-400 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
            : "bg-slate-900/60 text-slate-200 border-white/10 hover:bg-slate-900 hover:border-amber-500/30"
        }`}
      >
        <div className="flex items-center gap-3 overflow-hidden min-w-0">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
              isSelected ? "bg-amber-400 text-slate-950 shadow-md" : "bg-white/10 text-slate-300"
            }`}
          >
            {ep.episode_number}
          </div>
          <span className="truncate font-extrabold">
            Episode {ep.episode_number}
            {ep.title ? ` : ${ep.title.toUpperCase()}` : ""}
            {isCombined && (
              <span className="ml-2 text-cyan-400 text-[10px] font-bold bg-cyan-400/15 border border-cyan-400/30 px-2 py-0.5 rounded-full">
                COMBINED
              </span>
            )}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-2">
          <span className="text-[0.7rem] text-slate-400 font-semibold hidden sm:inline">
            {qualities.length} {qualities.length === 1 ? "stream" : "streams"}
          </span>
          {isSelected ? (
            <HiChevronUp className="text-amber-400 text-lg" />
          ) : (
            <HiChevronDown className="text-slate-400 text-lg" />
          )}
        </div>
      </button>

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
            <div className="p-5 rounded-2xl bg-slate-950/90 border border-amber-500/30 space-y-5 shadow-2xl mt-1 mb-2">
              {/* Audio Languages */}
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">
                  Select Audio Track
                </span>
                <div className="flex flex-wrap gap-2">
                  {availableLangs.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => { setSelectedLanguage(lang); setSelectedQuality(""); }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        selectedLanguage === lang
                          ? "bg-amber-400 text-slate-950 shadow-md scale-105"
                          : "bg-slate-900 text-slate-300 border border-white/10 hover:text-white"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Qualities */}
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">
                  Select Resolution
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
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

              {/* Download & Telegram */}
              <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/10">
                <button
                  onClick={handleDownload}
                  disabled={loading.download || !currentQualityItem}
                  className="flex items-center gap-2 btn-gold px-6 py-2.5 text-xs font-bold disabled:opacity-40"
                  aria-label="Download episode"
                >
                  {loading.download ? <Spinner /> : <FaDownload />}
                  <span>Download Episode ({selectedQuality || qualities[0]?.quality})</span>
                </button>

                {currentQualityItem && (
                  <a
                    href={`https://t.me/${TG_USERNAME}?start=file_${currentQualityItem.id || movieData?.tmdb_id}_s${seasonNumber}e${ep.episode_number}_${selectedQuality || qualities[0]?.quality}`}
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── TV Show Player Section ────────────────────────────────────────────────
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
      {/* Season Selector Bar */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <TbDeviceTv className="text-amber-400 text-lg" />
          <span className="text-xs font-black uppercase tracking-wider text-slate-300">
            Select Season
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
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
                className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all duration-200 border ${
                  parseInt(seasonNumber) === s.season_number
                    ? "bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-105"
                    : "bg-slate-900/80 text-slate-300 border-white/10 hover:border-amber-400/40 hover:text-white"
                }`}
              >
                Season {s.season_number}
              </button>
            ))}
        </div>
      </div>

      {/* Episodes List Deck */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-black uppercase tracking-wider text-slate-300">
            Season {seasonNumber} Episodes
          </span>
          {episodes?.length > 0 && (
            <span className="text-[0.72rem] text-slate-400 font-semibold">
              {episodes.length} Episodes available
            </span>
          )}
        </div>

        {isEpisodesLoading ? (
          <div className="flex items-center justify-center gap-3 py-12 text-sm text-slate-400 bg-slate-900/40 rounded-2xl border border-white/5">
            <Spinner /> <span>Loading season episodes...</span>
          </div>
        ) : episodes && episodes.length > 0 ? (
          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {episodes
              .sort((a, b) => a.episode_number - b.episode_number)
              .map((ep) => (
                <EpisodeCard
                  key={ep.episode_number}
                  ep={ep}
                  isSelected={parseInt(episodeNumber) === ep.episode_number}
                  onToggle={() =>
                    setEpisodeNumber(
                      parseInt(episodeNumber) === ep.episode_number ? "" : ep.episode_number
                    )
                  }
                  movieData={movieData}
                  seasonNumber={seasonNumber}
                  onOpenWebPlayer={onOpenWebPlayer}
                />
              ))}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-400 bg-slate-900/40 rounded-2xl border border-white/5">
            {seasonNumber ? "No episodes found for this season." : "Select a season above to load episodes."}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Export ───────────────────────────────────────────────────────────
export default function PlayerButtons({
  movieData,
  episodes,
  seasonNumber,
  setSeasonNumber,
  episodeNumber,
  setEpisodeNumber,
  isEpisodesLoading,
}) {
  const navigate = useNavigate();

  if (!movieData) return null;

  const handleOpenWebPlayer = ({ id, name, title, quality, language, tmdbId, mediaType }) => {
    const params = new URLSearchParams();
    if (id) params.set("id", id);
    if (name) params.set("name", name);
    if (title) params.set("title", title);
    if (quality) params.set("quality", quality);
    if (language) params.set("lang", language);
    if (tmdbId) params.set("tmdb_id", tmdbId);
    if (mediaType) params.set("media_type", mediaType);

    navigate(`/watch?${params.toString()}`);
  };

  return (
    <div id="player-section" className="glass-card p-6 sm:p-8 border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.85)]">
      {/* Cockpit Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.6)]">
            <FaPlay className="text-base ml-0.5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
              Streaming &amp; Download Cockpit
            </h3>
            <p className="text-xs text-slate-400">
              Select your preferred audio track and resolution below to stream or download.
            </p>
          </div>
        </div>
      </div>

      {movieData.media_type === "movie" ? (
        <MoviePlayerSection
          telegram={movieData.telegram}
          movieData={movieData}
          onOpenWebPlayer={handleOpenWebPlayer}
        />
      ) : (
        <TvPlayerSection
          seasons={movieData.seasons}
          episodes={episodes}
          seasonNumber={seasonNumber}
          setSeasonNumber={setSeasonNumber}
          episodeNumber={episodeNumber}
          setEpisodeNumber={setEpisodeNumber}
          isEpisodesLoading={isEpisodesLoading}
          movieData={movieData}
          onOpenWebPlayer={handleOpenWebPlayer}
        />
      )}
    </div>
  );
}
