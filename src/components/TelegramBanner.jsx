import React, { useState, useEffect } from "react";
import { TbBrandTelegram } from "react-icons/tb";
import { BiX } from "react-icons/bi";
import { FaBolt } from "react-icons/fa";

const TG_USERNAME = import.meta.env.VITE_TG_USERNAME || "Filmy4uhdBot";

export default function TelegramBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("tg_banner_dismissed");
    if (!dismissed) {
      const t = setTimeout(() => setVisible(true), 3500);
      return () => clearTimeout(t);
    }
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    sessionStorage.setItem("tg_banner_dismissed", "true");
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-24 md:bottom-6 right-4 sm:right-6 z-40 max-w-sm w-[calc(100%-2rem)] sm:w-auto animate-fade-in font-outfit">
      <div className="relative p-4 rounded-2xl bg-gradient-to-br from-[#0c1f36]/95 via-[#081320]/95 to-[#05070B]/95 border border-[#0088cc]/50 shadow-[0_15px_40px_rgba(0,136,204,0.35)] backdrop-blur-2xl text-white flex items-center gap-3">
        {/* Dismiss Button */}
        <button
          onClick={handleDismiss}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#05070B] border border-white/20 text-slate-300 hover:text-white flex items-center justify-center text-sm shadow-md transition-colors"
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
          <div className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-[#38bdf8] font-mono">
            <FaBolt className="text-cyan-400 text-[10px]" /> Fast Cloud Media
          </div>
          <p className="text-xs font-bold text-slate-100 line-clamp-1 font-outfit">
            Join Official Telegram Bot
          </p>
          <p className="text-[10px] text-slate-400 line-clamp-1">
            Instant 4K downloads &amp; daily updates
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
