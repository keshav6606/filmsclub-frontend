import React from 'react';
import { Link } from 'react-router-dom';

export default function FilmsClubLogo({ className = '', to = '/filmsclub' }) {
  return (
    <Link to={to} className={`flex items-center gap-2.5 group shrink-0 ${className}`} aria-label="FilmsClub VIP Cinema">
      {/* Cinematic Scarlet VIP Badge */}
      <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#200b0f] via-[#14161f] to-[#0a0c10] p-1.5 border border-red-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(229,9,20,0.4)] group-hover:scale-105 group-hover:border-red-500 group-hover:shadow-[0_0_25px_rgba(229,9,20,0.6)] transition-all duration-300">
        <svg viewBox="0 0 36 36" fill="none" className="w-full h-full drop-shadow-[0_0_8px_rgba(229,9,20,0.8)]">
          <defs>
            <linearGradient id="fcScarlet" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff4d58" />
              <stop offset="50%" stopColor="#e50914" />
              <stop offset="100%" stopColor="#8f0007" />
            </linearGradient>
            <linearGradient id="fcCyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7df4ff" />
              <stop offset="100%" stopColor="#00dbe9" />
            </linearGradient>
          </defs>

          {/* Film Strip Left & Right Sprockets */}
          <rect x="2" y="7" width="2.8" height="4" rx="0.8" fill="url(#fcScarlet)" />
          <rect x="2" y="14" width="2.8" height="4" rx="0.8" fill="url(#fcScarlet)" />
          <rect x="2" y="21" width="2.8" height="4" rx="0.8" fill="url(#fcScarlet)" />

          <rect x="31.2" y="7" width="2.8" height="4" rx="0.8" fill="url(#fcScarlet)" />
          <rect x="31.2" y="14" width="2.8" height="4" rx="0.8" fill="url(#fcScarlet)" />
          <rect x="31.2" y="21" width="2.8" height="4" rx="0.8" fill="url(#fcScarlet)" />

          {/* Crown Accent */}
          <path d="M10 11.5L13.5 7.5L18 10.5L22.5 7.5L26 11.5L24 16H12L10 11.5Z" fill="url(#fcCyan)" opacity="0.9" />
          <circle cx="13.5" cy="7" r="0.9" fill="#fff" />
          <circle cx="18" cy="10" r="1.1" fill="#fff" />
          <circle cx="22.5" cy="7" r="0.9" fill="#fff" />

          {/* Cinema Reel / Play Circle */}
          <circle cx="18" cy="23" r="8" fill="#10121a" stroke="url(#fcScarlet)" strokeWidth="1.5" strokeDasharray="3 1.5" />
          <polygon points="16,20 21.5,23 16,26" fill="url(#fcScarlet)" />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1.5">
          <span className="font-outfit font-black text-base sm:text-lg tracking-tight uppercase flex items-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-zinc-300">Films</span>
            <span className="text-red-500 ml-0.5">Club</span>
          </span>
          <span className="text-[9px] font-black tracking-widest text-white bg-gradient-to-r from-red-600 to-red-700 px-1.5 py-0.5 rounded shadow-[0_0_10px_rgba(229,9,20,0.6)]">
            VIP
          </span>
        </div>
        <span className="text-[9px] text-zinc-400 font-semibold tracking-widest uppercase mt-0.5 hidden sm:block">
          Cinema & Stream
        </span>
      </div>
    </Link>
  );
}
