import React from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { HiSparkles, HiFire } from "react-icons/hi2";
import { MdOutlineHighQuality, MdLanguage } from "react-icons/md";

const PLATFORMS = [
  { name: "All Cinema", key: "all", icon: <HiSparkles />, color: "from-cyan-400 to-blue-600", path: "/" },
  { name: "Netflix", key: "netflix", tag: "N", color: "from-red-600 to-rose-700", prov: "netflix" },
  { name: "Prime Video", key: "prime", tag: "P", color: "from-sky-400 to-blue-700", prov: "prime" },
  { name: "JioHotstar", key: "hotstar", tag: "H", color: "from-blue-600 to-indigo-800", prov: "hotstar" },
  { name: "SonyLIV", key: "sonyliv", tag: "S", color: "from-emerald-400 to-teal-700", prov: "sonyliv" },
  { name: "ZEE5", key: "zee5", tag: "Z", color: "from-purple-500 to-violet-800", prov: "zee5" },
  { name: "Apple TV+", key: "apple", tag: "A", color: "from-slate-400 to-zinc-700", prov: "apple" },
  { name: "4K UHD Cinema", key: "4k", icon: <MdOutlineHighQuality />, color: "from-amber-400 to-orange-600", path: "/movies?genre=4k" },
  { name: "Hindi Dubbed", key: "hindi", icon: <MdLanguage />, color: "from-cyan-400 to-teal-600", path: "/movies?lang=hi" },
  { name: "Top Trending", key: "trending", icon: <HiFire />, color: "from-orange-500 to-red-600", path: "/movies?sort_by=rating:desc" },
];

export default function CinemaQuickDock({ activeKey }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const currentProv = searchParams.get("prov");
  const currentGenre = searchParams.get("genre");
  const currentLang = searchParams.get("lang");

  let selected = activeKey;
  if (!selected) {
    if (currentProv) {
      selected = currentProv;
    } else if (currentGenre === "4k") {
      selected = "4k";
    } else if (currentLang === "hi") {
      selected = "hindi";
    } else if (location.pathname === "/") {
      selected = "all";
    }
  }

  const handleSelect = (item) => {
    if (item.prov) {
      if (location.pathname === "/") {
        // If already on Home page, scroll down smoothly to OTT channels hub & trigger active state
        const current = new URLSearchParams(window.location.search);
        current.set("prov", item.prov);
        window.history.pushState(null, "", `?${current.toString()}`);
        window.dispatchEvent(new Event("popstate"));

        const hub = document.getElementById("ott-channels-hub");
        if (hub) {
          hub.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } else {
        navigate(`/?prov=${item.prov}#ott-channels-hub`);
      }
    } else if (item.path) {
      if (item.path === "/" && location.pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate(item.path);
      }
    }
  };

  return (
    <section className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 -mt-8 sm:-mt-12 z-20" aria-label="Cinema Quick Platform Dock">
      {/* Floating Glass Shell */}
      <div className="relative rounded-3xl bg-[#0B0F19]/90 backdrop-blur-2xl border border-white/[0.12] p-2 sm:p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(0,242,254,0.12)]">
        {/* Top subtle light-catcher */}
        <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

        <div className="flex items-center gap-2 overflow-x-auto no-sb scroll-smooth px-1 py-1">
          {PLATFORMS.map((item) => {
            const isCurrent = selected === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => handleSelect(item)}
                className={`relative flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-2xl transition-all duration-300 shrink-0 font-outfit select-none group ${
                  isCurrent
                    ? "bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 font-black shadow-[0_0_20px_rgba(0,242,254,0.6)] scale-105"
                    : "bg-[#141A29]/70 hover:bg-[#1C2438] text-slate-300 hover:text-white border border-white/[0.06] hover:border-cyan-400/40"
                }`}
              >
                {/* Platform Badge / Icon */}
                {item.icon ? (
                  <span className={`text-sm ${isCurrent ? "text-slate-950" : "text-cyan-400 group-hover:scale-110 transition-transform"}`}>
                    {item.icon}
                  </span>
                ) : (
                  <span
                    className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] font-black text-white bg-gradient-to-br ${item.color} shadow-sm`}
                  >
                    {item.tag}
                  </span>
                )}

                <span className="text-xs sm:text-sm font-bold tracking-tight whitespace-nowrap">
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
