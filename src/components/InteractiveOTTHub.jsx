import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiSparkles, HiArrowRight, HiFire } from "react-icons/hi2";
import { MdOutlineLiveTv, MdLocalMovies } from "react-icons/md";
import { RiMovie2Fill } from "react-icons/ri";
import { YupflixCard } from "../yupflix/components/YupflixCard";
import providersCache from "../yupflix/data/providers_cache.json";

const OTT_CHANNELS = [
  {
    key: "netflix",
    name: "Netflix",
    tag: "N",
    color: "from-red-600 via-rose-600 to-red-800",
    glow: "rgba(229, 9, 20, 0.45)",
    border: "border-red-500/40",
    textGradient: "from-red-400 to-rose-200",
    defaultTotal: 1714,
    description: "Original series, Hollywood blockbusters & exclusive 4K cinema releases",
  },
  {
    key: "prime",
    name: "Prime Video",
    tag: "P",
    color: "from-sky-500 via-blue-600 to-indigo-800",
    glow: "rgba(0, 168, 225, 0.45)",
    border: "border-sky-500/40",
    textGradient: "from-sky-300 to-blue-200",
    defaultTotal: 792,
    description: "Amazon Originals, global premieres, and blockbuster action franchises",
  },
  {
    key: "hotstar",
    name: "JioHotstar",
    tag: "H",
    color: "from-blue-600 via-indigo-600 to-violet-900",
    glow: "rgba(30, 64, 175, 0.45)",
    border: "border-indigo-500/40",
    textGradient: "from-blue-300 to-indigo-200",
    defaultTotal: 241,
    description: "Disney+, Marvel, HBO exclusives, Indian cinema & live sports universe",
  },
  {
    key: "zee5",
    name: "ZEE5",
    tag: "Z",
    color: "from-purple-600 via-fuchsia-600 to-violet-900",
    glow: "rgba(147, 51, 234, 0.45)",
    border: "border-purple-500/40",
    textGradient: "from-purple-300 to-fuchsia-200",
    defaultTotal: 221,
    description: "Direct-to-digital Hindi, South Indian cinema and top regional originals",
  },
  {
    key: "sonyliv",
    name: "SonyLIV",
    tag: "S",
    color: "from-emerald-500 via-teal-600 to-cyan-800",
    glow: "rgba(16, 185, 129, 0.45)",
    border: "border-emerald-500/40",
    textGradient: "from-emerald-300 to-teal-200",
    defaultTotal: 103,
    description: "Premium thrillers, investigative crime sagas & Sony Pictures library",
  },
  {
    key: "apple",
    name: "Apple TV+",
    tag: "A",
    color: "from-slate-400 via-slate-600 to-zinc-900",
    glow: "rgba(148, 163, 184, 0.35)",
    border: "border-slate-400/40",
    textGradient: "from-slate-200 to-zinc-300",
    defaultTotal: 19108,
    description: "Master-grade 4K Dolby Vision sci-fi epics and critically acclaimed cinema",
  },
];

export default function InteractiveOTTHub({ onPlatformChange }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlProv = searchParams.get("prov");

  const [activeChannelKey, setActiveChannelKey] = useState(
    urlProv && OTT_CHANNELS.some((c) => c.key === urlProv) ? urlProv : "netflix"
  );
  const [filterType, setFilterType] = useState("all"); // 'all' | 'movie' | 'series'
  const [items, setItems] = useState([]);
  const [totalCount, setTotalCount] = useState(1714);
  const [isLoading, setIsLoading] = useState(false);

  // Sync if URL search parameter changes
  useEffect(() => {
    if (urlProv && OTT_CHANNELS.some((c) => c.key === urlProv)) {
      setActiveChannelKey(urlProv);
    }
  }, [urlProv]);

  // Load items for active channel
  useEffect(() => {
    setIsLoading(true);

    // Initial instant sync from cached data
    const cached = providersCache[activeChannelKey];
    if (cached) {
      let filtered = cached.items || [];
      if (filterType !== "all") {
        filtered = filtered.filter((i) => i.type === filterType);
      }
      setItems(filtered.slice(0, 18));
      setTotalCount(cached.total || 0);
    }

    // Live fetch in background to get latest drops
    const typeParam = filterType !== "all" ? `&type=${filterType}` : "";
    fetch(`/api/browse?prov=${activeChannelKey}&limit=24${typeParam}`)
      .then((res) => {
        if (!res.ok) throw new Error("Network response not ok");
        return res.json();
      })
      .then((data) => {
        if (data?.items?.length) {
          setItems(data.items.slice(0, 18));
          if (data.total) setTotalCount(data.total);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [activeChannelKey, filterType]);

  const activeChannel =
    OTT_CHANNELS.find((c) => c.key === activeChannelKey) || OTT_CHANNELS[0];

  const handleChannelSelect = (channelKey) => {
    setActiveChannelKey(channelKey);
    // Update URL param shallowly without full reload
    const current = new URLSearchParams(window.location.search);
    current.set("prov", channelKey);
    window.history.replaceState(null, "", `?${current.toString()}`);
    if (onPlatformChange) onPlatformChange(channelKey);
  };

  return (
    <section
      id="ott-channels-hub"
      className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 mt-12 md:mt-16 scroll-mt-24"
      aria-label="OTT Streaming Hub & Channels"
    >
      {/* ── Section Title & Ambient Glow ── */}
      <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 font-outfit font-black text-xs uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            LIVE STREAMING CHANNELS
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-outfit font-black tracking-tight text-white flex items-center gap-3">
            OTT Streaming Universe
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
            Stream original series and 4K cinema direct from top streaming platforms with one click.
          </p>
        </div>

        {/* View Full Catalog Link */}
        <Link
          to={`/filmsclub?prov=${activeChannel.key}`}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-cyan-400 hover:text-white px-5 py-2.5 rounded-xl bg-[#0E131F] hover:bg-cyan-500/20 border border-cyan-400/30 transition-all font-outfit group shrink-0"
        >
          <span>Explore All {totalCount.toLocaleString()} {activeChannel.name} Titles</span>
          <HiArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* ── Channel Selector Tabs (Branded OTT Pills) ── */}
      <div className="relative rounded-2xl bg-[#0A0D16]/90 backdrop-blur-xl border border-white/[0.08] p-2 sm:p-3 mb-6 shadow-2xl">
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-sb scroll-smooth pb-1 pt-0.5">
          {OTT_CHANNELS.map((ch) => {
            const isActive = ch.key === activeChannelKey;
            return (
              <button
                key={ch.key}
                type="button"
                onClick={() => handleChannelSelect(ch.key)}
                className={`relative flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-xl transition-all duration-300 shrink-0 font-outfit select-none ${
                  isActive
                    ? `bg-gradient-to-r ${ch.color} text-white font-extrabold shadow-lg scale-105`
                    : "bg-[#121724] hover:bg-[#1A2234] text-slate-300 hover:text-white border border-white/[0.06] hover:border-white/20"
                }`}
                style={isActive ? { boxShadow: `0 0 25px ${ch.glow}` } : {}}
              >
                {/* Platform Tag Box */}
                <span
                  className={`w-5 h-5 rounded flex items-center justify-center text-xs font-black text-white ${
                    isActive ? "bg-black/30" : `bg-gradient-to-br ${ch.color}`
                  }`}
                >
                  {ch.tag}
                </span>

                <span className="text-xs sm:text-sm tracking-tight whitespace-nowrap">
                  {ch.name}
                </span>

                {/* Live Count Chip */}
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    isActive
                      ? "bg-black/40 text-white font-bold"
                      : "bg-white/5 text-slate-400"
                  }`}
                >
                  {(ch.key === activeChannelKey ? totalCount : ch.defaultTotal).toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Active Channel Sub-header with Media Type Filters ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 px-1">
        <div className="flex items-center gap-2">
          <span
            className={`w-3 h-3 rounded-full bg-gradient-to-br ${activeChannel.color}`}
          />
          <span className="text-sm sm:text-base font-outfit font-black text-white">
            {activeChannel.name} Highlights
          </span>
          <span className="text-xs text-slate-400 hidden sm:inline">
            — {activeChannel.description}
          </span>
        </div>

        {/* Filter Pills (All / Movies / Series) */}
        <div className="flex items-center gap-1.5 bg-[#0E131F] p-1 rounded-xl border border-white/[0.08] text-xs font-outfit">
          <button
            type="button"
            onClick={() => setFilterType("all")}
            className={`px-3 py-1 rounded-lg transition-colors font-bold ${
              filterType === "all"
                ? "bg-cyan-500 text-slate-950 shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilterType("movie")}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors font-bold ${
              filterType === "movie"
                ? "bg-cyan-500 text-slate-950 shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <MdLocalMovies className="text-sm" />
            Movies
          </button>
          <button
            type="button"
            onClick={() => setFilterType("series")}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors font-bold ${
              filterType === "series"
                ? "bg-cyan-500 text-slate-950 shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <MdOutlineLiveTv className="text-sm" />
            Series
          </button>
        </div>
      </div>

      {/* ── Titles Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {items.map((item) => (
          <YupflixCard key={item.code} item={item} />
        ))}
      </div>

      {/* ── Bottom CTA ── */}
      <div className="mt-8 text-center">
        <Link
          to={`/filmsclub?prov=${activeChannel.key}`}
          className="inline-flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 text-slate-950 font-outfit font-black text-sm tracking-wide shadow-[0_0_30px_rgba(0,242,254,0.4)] hover:shadow-[0_0_40px_rgba(0,242,254,0.7)] hover:scale-105 transition-all duration-300"
        >
          <HiSparkles className="text-base" />
          <span>Browse Complete {activeChannel.name} Library ({totalCount.toLocaleString()} Titles)</span>
          <HiArrowRight className="text-base" />
        </Link>
      </div>
    </section>
  );
}
