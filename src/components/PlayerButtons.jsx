/**
 * PlayerButtons.jsx
 * Renders quality selector + 3 external player buttons:
 *  1. mpvEx Video Player (com.nextplayer.pro)
 *  2. MX Player (com.mxtech.videoplayer.ad)
 *  3. VLC (org.videolan.vlc)
 * Also renders a Download button.
 */
import React, { useState } from "react";
import { FaDownload, FaPlay, FaAndroid } from "react-icons/fa";
import { SiVlcmediaplayer } from "react-icons/si";
import { MdOndemandVideo, MdSmartDisplay } from "react-icons/md";
import { TbBrandTelegram } from "react-icons/tb";
import { HiChevronDown } from "react-icons/hi2";
import { AnimatePresence, motion } from "framer-motion";
import Spinner from "./svg/Spinner";
import { BASE_URL as BASE } from "../config/api";

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
const TG_USERNAME = import.meta.env.VITE_TG_USERNAME || "Filmy4uhdbot";

// Google Play Store link for mpvEx
const MPVEX_PLAY_LINK = "https://play.google.com/store/apps/details?id=com.nextplayer.pro";

const PLAYERS = [
  {
    id: "mpvex",
    name: "mpvEx Player",
    icon: <MdSmartDisplay className="text-lg" />,
    color: "#7C3AED",
  },
  {
    id: "mx",
    name: "MX Player",
    icon: <MdOndemandVideo className="text-lg" />,
    color: "#F59E0B",
  },
  {
    id: "vlc",
    name: "VLC Player",
    icon: <SiVlcmediaplayer className="text-lg" />,
    color: "#EF6C00",
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

const launchPlayer = (videoUrl, playerId) => {
  triggerPopunder();
  const isAndroid = /Android/i.test(navigator.userAgent);
  
  if (isAndroid) {
    let packageName = "";
    if (playerId === "mpvex") packageName = "com.nextplayer.pro";
    else if (playerId === "mx") packageName = "com.mxtech.videoplayer.ad";
    else if (playerId === "vlc") packageName = "org.videolan.vlc";
    
    // Correct Android Intent syntax with mime type video/* so media players load stream directly
    const intentUrl = `intent:${videoUrl}#Intent;type=video/*;package=${packageName};S.title=${encodeURIComponent("Filmy4uhd Stream")};end`;
    window.location.href = intentUrl;
  } else {
    // Non-Android fallback
    if (playerId === "vlc") {
      window.location.href = `vlc://${videoUrl.replace(/^https?:\/\//, "")}`;
    } else {
      window.open(videoUrl, "_blank", "noopener noreferrer");
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

// ─── Quality Pill ─────────────────────────────────────────────────────────
const QualityPill = ({ quality, selected, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded-full text-xs font-bold border transition-all duration-200 ${
      selected
        ? "bg-primaryBtn text-bgColor border-primaryBtn shadow-gold"
        : "bg-transparent text-secondaryTextColor border-border hover:border-primaryBtn hover:text-primaryBtn"
    }`}
  >
    {quality}
  </button>
);

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
    movieData.languages.forEach((l) => {
      const norm = normalizeLang(l);
      if (norm) set.add(norm);
    });
  } else if (movieData?.language) {
    const norm = normalizeLang(movieData.language);
    if (norm) set.add(norm);
  }

  if (Array.isArray(items)) {
    items.forEach((item) => {
      if (Array.isArray(item?.languages)) {
        item.languages.forEach((l) => {
          const norm = normalizeLang(l);
          if (norm) set.add(norm);
        });
      }
      ["language", "lang", "audio", "audio_language"].forEach((key) => {
        if (item && item[key]) {
          set.add(normalizeLang(item[key]));
        }
      });

      const titleStr = `${item?.name || ""} ${item?.quality || ""}`;
      if (/hindi/i.test(titleStr)) set.add("Hindi");
      if (/english/i.test(titleStr)) set.add("English");
      if (/dual/i.test(titleStr)) set.add("Dual Audio");
      if (/multi/i.test(titleStr)) set.add("Multi Audio");
      if (/tamil/i.test(titleStr)) set.add("Tamil");
      if (/telugu/i.test(titleStr)) set.add("Telugu");
    });
  }

  if (set.size === 0) {
    set.add("Hindi");
    set.add("English");
    set.add("Dual Audio");
  }

  const langs = Array.from(set);
  return langs;
};

const filterByLanguage = (items, selectedLang) => {
  if (!Array.isArray(items) || !selectedLang || selectedLang === "All Audio" || selectedLang === "All") {
    return items;
  }
  const langLower = selectedLang.toLowerCase();
  const filtered = items.filter((item) => {
    const titleStr = `${item?.name || ""} ${item?.quality || ""} ${item?.language || ""} ${item?.lang || ""} ${item?.audio || ""}`.toLowerCase();
    if (Array.isArray(item?.languages)) {
      if (item.languages.some((l) => String(l).toLowerCase().includes(langLower))) return true;
    }
    return titleStr.includes(langLower);
  });
  return filtered.length > 0 ? filtered : items;
};

// ─── Movie Player Section ─────────────────────────────────────────────────
const MoviePlayerSection = ({ telegram, movieData }) => {
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
    const finalUrl = await shortenUrl(rawUrl);
    setLoading((p) => ({ ...p, [player.id]: false }));
    launchPlayer(finalUrl, player.id);
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
    <div className="mt-4 space-y-5">
      {/* Step 1: Language Selector */}
      <div className="border-b border-border/10 pb-4">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-5 h-5 rounded-full bg-primaryBtn/10 border border-primaryBtn/30 flex items-center justify-center text-xs font-bold text-primaryBtn">
            1
          </div>
          <p className="text-xs text-primaryTextColor font-bold uppercase tracking-wider">
            Choose Audio Language
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {availableLangs.map((lang) => (
            <QualityPill
              key={lang}
              quality={lang}
              selected={selectedLanguage === lang}
              onClick={() => {
                setSelectedLanguage(lang);
                setSelectedQuality("");
              }}
            />
          ))}
        </div>
      </div>

      {/* Step 2: Quality Selector */}
      <div>
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-5 h-5 rounded-full bg-primaryBtn/10 border border-primaryBtn/30 flex items-center justify-center text-xs font-bold text-primaryBtn">
            2
          </div>
          <p className="text-xs text-primaryTextColor font-bold uppercase tracking-wider">
            Select Quality
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {availableQualities.map((t) => (
            <QualityPill
              key={t.id || t.quality}
              quality={t.quality}
              selected={(selectedQuality || selectedItem?.quality) === t.quality}
              onClick={() => setSelectedQuality(t.quality)}
            />
          ))}
        </div>
        {selectedItem && (
          <p className="mt-1.5 text-xs text-mutedText">
            Size: <span className="text-secondaryTextColor font-semibold">{selectedItem.size}</span>
            {selectedLanguage && (
              <span className="ml-3 text-cyan-400 font-medium">Selected Audio: {selectedLanguage}</span>
            )}
          </p>
        )}
      </div>

      {/* Step 3: Player Buttons */}
      <div>
        <p className="text-xs text-secondaryTextColor font-semibold uppercase tracking-wider mb-2">
          Open in Player
        </p>
        <div className="flex flex-wrap gap-2">
          {PLAYERS.map((player) => (
            <button
              key={player.id}
              onClick={() => handlePlayer(player)}
              disabled={!selectedItem || loading[player.id]}
              className="player-btn disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label={`Open in ${player.name}`}
            >
              {loading[player.id] ? <Spinner /> : player.icon}
              <span>{player.name}</span>
            </button>
          ))}
        </div>
        <a
          href={MPVEX_PLAY_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mt-2 text-xs text-mutedText hover:text-primaryBtn transition-colors"
        >
          <FaAndroid className="text-green-500" />
          Get mpvEx on Google Play
        </a>
      </div>

      {/* Action Buttons: Direct Download + Telegram Direct File */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleDownload}
          disabled={!selectedItem || loading.download}
          className="flex items-center gap-2 btn-gold px-5 py-2.5 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Download selected quality"
        >
          {loading.download ? <Spinner /> : <FaDownload />}
          Download {selectedItem?.quality && `(${selectedItem.quality})`}
        </button>

        {selectedItem && (
          <a
            href={`https://t.me/${TG_USERNAME}?start=file_${selectedItem.id || movieData?.tmdb_id}_${selectedItem.quality}_${selectedLanguage}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={triggerPopunder}
            className="flex items-center gap-2 bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold px-5 py-2.5 rounded-full text-sm transition-all shadow-md hover:scale-105"
          >
            <TbBrandTelegram className="text-lg" />
            Get File on Telegram
          </a>
        )}
      </div>
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
}) => {
  const episodeData = episodes?.find((e) => e.episode_number === parseInt(episodeNumber));
  const rawQualities = episodeData?.telegram || [];

  const availableLangs = getUniqueLanguages(rawQualities, movieData);
  const [selectedLanguage, setSelectedLanguage] = useState(availableLangs[0] || "Hindi");
  const [selectedQuality, setSelectedQuality] = useState("");
  const [loading, setLoading] = useState({});

  const filteredQualities = filterByLanguage(rawQualities, selectedLanguage);
  const qualities = filteredQualities.length > 0 ? filteredQualities : rawQualities;

  const handlePlayer = async (player) => {
    const q = qualities.find((q) => q.quality === selectedQuality) || qualities[0];
    if (!q) return;
    setLoading((p) => ({ ...p, [player.id]: true }));
    const rawUrl = generateVideoUrl(q.id, q.name);
    const finalUrl = await shortenUrl(rawUrl);
    setLoading((p) => ({ ...p, [player.id]: false }));
    launchPlayer(finalUrl, player.id);
  };

  const handleDownload = async () => {
    const q = qualities.find((q) => q.quality === selectedQuality) || qualities[0];
    if (!q) return;
    triggerPopunder();
    setLoading((p) => ({ ...p, download: true }));
    const rawUrl = generateVideoUrl(q.id, q.name);
    const finalUrl = await shortenUrl(rawUrl);
    setLoading((p) => ({ ...p, download: false }));
    window.open(finalUrl, "_blank", "noopener noreferrer");
  };

  const currentQualityItem = qualities.find((q) => q.quality === selectedQuality) || qualities[0];

  return (
    <div className="mt-4 space-y-6">
      {/* Step 1: Choose Season */}
      <div className="border-b border-border/10 pb-4">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-5 h-5 rounded-full bg-primaryBtn/10 border border-primaryBtn/30 flex items-center justify-center text-xs font-bold text-primaryBtn">
            1
          </div>
          <p className="text-xs text-primaryTextColor font-bold uppercase tracking-wider">
            Choose Season
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {seasons
            ?.filter((s) => s.season_number > 0)
            .sort((a, b) => a.season_number - b.season_number)
            .map((s) => (
              <QualityPill
                key={s.season_number}
                quality={`Season ${s.season_number}`}
                selected={parseInt(seasonNumber) === s.season_number}
                onClick={() => {
                  setSeasonNumber(s.season_number);
                  setEpisodeNumber("");
                  setSelectedLanguage(availableLangs[0] || "Hindi");
                  setSelectedQuality("");
                }}
              />
            ))}
        </div>
      </div>

      {/* Step 2: Choose Episode */}
      <div className="border-b border-border/10 pb-4">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-5 h-5 rounded-full bg-primaryBtn/10 border border-primaryBtn/30 flex items-center justify-center text-xs font-bold text-primaryBtn">
            2
          </div>
          <p className="text-xs text-primaryTextColor font-bold uppercase tracking-wider">
            Choose Episode
          </p>
        </div>
        {isEpisodesLoading ? (
          <div className="py-2">
            <div className="loader-episode" />
          </div>
        ) : episodes && episodes.length > 0 ? (
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
            {episodes
              .sort((a, b) => a.episode_number - b.episode_number)
              .map((ep) => (
                <QualityPill
                  key={ep.episode_number}
                  quality={`Ep ${ep.episode_number}: ${ep.title || `Episode ${ep.episode_number}`}`}
                  selected={parseInt(episodeNumber) === ep.episode_number}
                  onClick={() => {
                    setEpisodeNumber(ep.episode_number);
                    setSelectedLanguage(availableLangs[0] || "Hindi");
                    setSelectedQuality("");
                  }}
                />
              ))}
          </div>
        ) : (
          <p className="text-xs text-mutedText italic">Select a season first</p>
        )}
      </div>

      {/* Step 3: Choose Audio Language */}
      {episodeNumber && (
        <div className="border-b border-border/10 pb-4">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-5 h-5 rounded-full bg-primaryBtn/10 border border-primaryBtn/30 flex items-center justify-center text-xs font-bold text-primaryBtn">
              3
            </div>
            <p className="text-xs text-primaryTextColor font-bold uppercase tracking-wider">
              Choose Audio Language
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {availableLangs.map((lang) => (
              <QualityPill
                key={lang}
                quality={lang}
                selected={selectedLanguage === lang}
                onClick={() => {
                  setSelectedLanguage(lang);
                  setSelectedQuality("");
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Choose Quality */}
      {episodeNumber && (
        <div className="border-b border-border/10 pb-4">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-5 h-5 rounded-full bg-primaryBtn/10 border border-primaryBtn/30 flex items-center justify-center text-xs font-bold text-primaryBtn">
              4
            </div>
            <p className="text-xs text-primaryTextColor font-bold uppercase tracking-wider">
              Choose Quality
            </p>
          </div>
          {qualities.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {qualities.map((q) => (
                <QualityPill
                  key={q.quality}
                  quality={q.quality}
                  selected={(selectedQuality || qualities[0]?.quality) === q.quality}
                  onClick={() => setSelectedQuality(q.quality)}
                />
              ))}
            </div>
          ) : (
            <p className="text-xs text-mutedText italic">No qualities available for this episode</p>
          )}
          {currentQualityItem && (
            <p className="mt-1.5 text-xs text-mutedText">
              Size: <span className="text-secondaryTextColor font-semibold">{currentQualityItem.size}</span>
              {selectedLanguage && (
                <span className="ml-3 text-cyan-400 font-medium">Selected Audio: {selectedLanguage}</span>
              )}
            </p>
          )}
        </div>
      )}

      {/* Step 5: Open in Player & Action Buttons */}
      {episodeNumber && qualities.length > 0 && (
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-5 h-5 rounded-full bg-primaryBtn/10 border border-primaryBtn/30 flex items-center justify-center text-xs font-bold text-primaryBtn">
                5
              </div>
              <p className="text-xs text-primaryTextColor font-bold uppercase tracking-wider">
                Open in Player
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {PLAYERS.map((player) => (
                <button
                  key={player.id}
                  onClick={() => handlePlayer(player)}
                  disabled={loading[player.id]}
                  className="player-btn disabled:opacity-40"
                  aria-label={`Open in ${player.name}`}
                >
                  {loading[player.id] ? <Spinner /> : player.icon}
                  <span>{player.name}</span>
                </button>
              ))}
            </div>
            <a
              href={MPVEX_PLAY_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-2.5 text-xs text-mutedText hover:text-primaryBtn transition-colors"
            >
              <FaAndroid className="text-green-500" />
              Get mpvEx on Google Play
            </a>
          </div>

          {/* Direct Download & Telegram Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={handleDownload}
              disabled={loading.download}
              className="flex items-center gap-2 btn-gold px-5 py-2.5 text-xs sm:text-sm font-bold disabled:opacity-40"
              aria-label="Download episode"
            >
              {loading.download ? <Spinner /> : <FaDownload />}
              Download ({selectedQuality || qualities[0]?.quality})
            </button>

            {currentQualityItem && (
              <a
                href={`https://t.me/${TG_USERNAME}?start=file_${currentQualityItem.id || movieData?.tmdb_id}_${seasonNumber}_${episodeNumber}_${selectedQuality || qualities[0]?.quality}_${selectedLanguage}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={triggerPopunder}
                className="flex items-center gap-2 bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold px-5 py-2.5 rounded-full text-xs sm:text-sm transition-all shadow-md hover:scale-105"
              >
                <TbBrandTelegram className="text-lg" />
                Get Episode on Telegram
              </a>
            )}
          </div>
        </div>
      )}
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
  if (!movieData) return null;

  return (
    <div id="player-section" className="glass-card p-5 mt-4">
      <div className="flex items-center gap-2 mb-1">
        <FaPlay className="text-primaryBtn text-sm" />
        <h3 className="text-primaryTextColor font-bold text-sm">Watch & Download</h3>
      </div>
      <p className="text-xs text-mutedText mb-2">
        Select season, episode, language, and quality, then open in your favourite player or download directly.
      </p>

      {movieData.media_type === "movie" ? (
        <MoviePlayerSection telegram={movieData.telegram} movieData={movieData} />
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
        />
      )}
    </div>
  );
}
