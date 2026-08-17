// src/components/TelegramBanner.jsx
import React, { useState, useEffect } from "react";
import { TbBrandTelegram } from "react-icons/tb";
import { BiX } from "react-icons/bi";
import { FaBolt } from "react-icons/fa";

const TG_USERNAME = import.meta.env.VITE_TG_USERNAME || "Filmy4uhdBot";

export default function TelegramBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show after 3 seconds if not dismissed previously in this session
    const dismissed = sessionStorage.getItem("tg_banner_dismissed");
    if (!dismissed) {
      const t = setTimeout(() => setVisible(true), 3000);
      return () => clearTimeout(t);
    }
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    sessionStorage.setItem("tg_banner_dismissed", "true");
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 max-w-sm w-[calc(100%-2rem)] sm:w-auto animate-fade-in">
      <div className="relative p-4 rounded-2xl bg-gradient-to-br from-[#0a1f33]/95 via-[#081320]/95 to-[#06080D]/95 border border-[#0088cc]/50 shadow-[0_15px_40px_rgba(0,136,204,0.35)] backdrop-blur-2xl text-white flex items-center gap-3">
        {/* Dismiss Button */}
        <button
          onClick={handleDismiss}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 border border-white/20 text-slate-300 hover:text-white flex items-center justify-center text-sm shadow-md transition-colors"
          aria-label="Dismiss Telegram prompt"
        >
          <BiX />
        </button>

        {/* Telegram Icon */}
        <div className="w-11 h-11 rounded-2xl bg-[#0088cc] text-white flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(0,136,204,0.6)] shrink-0">
          <TbBrandTelegram />
        </div>

        {/* Text Details */}
        <div className="min-w-0 pr-1">
          <div className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-[#38bdf8]">
            <FaBolt className="text-amber-400 text-[10px]" /> Fast Cloud Media
          </div>
          <p className="text-xs font-bold text-slate-100 line-clamp-1">
            Join Official Telegram Bot
          </p>
          <p className="text-[10px] text-slate-400 line-clamp-1">
            Instant downloads, no buffer &amp; updates
          </p>
        </div>

        {/* Action Button */}
        <a
          href={`https://t.me/${TG_USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleDismiss}
          className="shrink-0 bg-[#0088cc] hover:bg-[#0077b5] text-white text-xs font-extrabold px-3.5 py-2 rounded-xl transition-all shadow-md hover:scale-105"
        >
          Join
        </a>
      </div>
    </div>
  );
}
