import React from 'react';
import { Link } from 'react-router-dom';

export default function FilmsClubLogo({ className = '', to = '/filmsclub' }) {
  return (
    <Link to={to} className={`flex items-center gap-2.5 group shrink-0 ${className}`} aria-label="FilmsClub VIP Home">
      {/* Golden VIP Cinema Icon Badge */}
      <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#1c1810] via-[#12141a] to-[#0a0c10] p-1.5 border border-amber-400/40 flex items-center justify-center shadow-[0_0_18px_rgba(245,158,11,0.35)] group-hover:scale-105 group-hover:border-amber-400 group-hover:shadow-[0_0_22px_rgba(245,158,11,0.55)] transition-all">
        <svg viewBox="0 0 36 36" fill="none" className="w-full h-full drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]">
          <defs>
            <linearGradient id="fcVipGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            <linearGradient id="fcVipCrown" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="100%" stopColor="#FBBF24" />
            </linearGradient>
          </defs>

          {/* Film Strip Left & Right Sprockets */}
          <rect x="2" y="7" width="2.8" height="4" rx="0.8" fill="#F59E0B" />
          <rect x="2" y="14" width="2.8" height="4" rx="0.8" fill="#F59E0B" />
          <rect x="2" y="21" width="2.8" height="4" rx="0.8" fill="#F59E0B" />

          <rect x="31.2" y="7" width="2.8" height="4" rx="0.8" fill="#F59E0B" />
          <rect x="31.2" y="14" width="2.8" height="4" rx="0.8" fill="#F59E0B" />
          <rect x="31.2" y="21" width="2.8" height="4" rx="0.8" fill="#F59E0B" />

          {/* VIP Crown Accent */}
          <path d="M10 11.5L13.5 7.5L18 10.5L22.5 7.5L26 11.5L24 16H12L10 11.5Z" fill="url(#fcVipCrown)" opacity="0.95" />
          <circle cx="13.5" cy="7" r="0.9" fill="#FFFBEB" />
          <circle cx="18" cy="10" r="1.1" fill="#FFFBEB" />
          <circle cx="22.5" cy="7" r="0.9" fill="#FFFBEB" />

          {/* Cinema Reel / Play Circle */}
          <circle cx="18" cy="23" r="8" fill="#14161D" stroke="url(#fcVipGold)" strokeWidth="1.5" strokeDasharray="3 1.5" />
          <polygon points="16,20 21.5,23 16,26" fill="url(#fcVipGold)" />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1.5">
          <span className="font-black text-base sm:text-lg tracking-tight uppercase flex items-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">Films</span>
            <span className="text-white ml-0.5">Club</span>
          </span>
          <span className="text-[9px] font-black tracking-widest text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 px-1.5 py-0.5 rounded shadow-[0_0_10px_rgba(245,158,11,0.6)]">
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
