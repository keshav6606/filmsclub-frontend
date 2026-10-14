import React from 'react';
import { Link } from 'react-router-dom';

export default function FilmsClubLogo({ className = '', to = '/' }) {
  return (
    <Link to={to} className={`flex items-center gap-2.5 group shrink-0 select-none ${className}`} aria-label="FilmsClub 4K Cinema">
      {/* Holographic Cinema Emblem */}
      <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-b from-[#181F33] via-[#0D1220] to-[#05070B] p-1.5 border border-cyan-400/40 border-t-white/30 flex items-center justify-center shadow-[0_0_20px_rgba(0,242,254,0.35)] group-hover:scale-105 group-hover:border-cyan-300 group-hover:shadow-[0_0_25px_rgba(0,242,254,0.6)] transition-all duration-300">
        <svg viewBox="0 0 36 36" fill="none" className="w-full h-full drop-shadow-[0_0_10px_rgba(0,242,254,0.7)]">
          <defs>
            <linearGradient id="fcCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#00F2FE" />
              <stop offset="100%" stopColor="#00C6FF" />
            </linearGradient>
            <linearGradient id="fcCrimsonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF4D73" />
              <stop offset="100%" stopColor="#E50914" />
            </linearGradient>
          </defs>

          {/* Film Strip Left & Right Sprockets */}
          <rect x="2" y="7" width="2.6" height="4" rx="0.8" fill="url(#fcCyanGrad)" />
          <rect x="2" y="14" width="2.6" height="4" rx="0.8" fill="url(#fcCyanGrad)" />
          <rect x="2" y="21" width="2.6" height="4" rx="0.8" fill="url(#fcCyanGrad)" />

          <rect x="31.4" y="7" width="2.6" height="4" rx="0.8" fill="url(#fcCrimsonGrad)" />
          <rect x="31.4" y="14" width="2.6" height="4" rx="0.8" fill="url(#fcCrimsonGrad)" />
          <rect x="31.4" y="21" width="2.6" height="4" rx="0.8" fill="url(#fcCrimsonGrad)" />

          {/* Crown Accent */}
          <path d="M10 11.5L13.5 7.5L18 10.5L22.5 7.5L26 11.5L24 16H12L10 11.5Z" fill="url(#fcCyanGrad)" opacity="0.95" />
          <circle cx="13.5" cy="7" r="1" fill="#fff" />
          <circle cx="18" cy="10" r="1.2" fill="#fff" />
          <circle cx="22.5" cy="7" r="1" fill="#fff" />

          {/* Cinema Reel / Play Circle */}
          <circle cx="18" cy="23" r="8" fill="#0A0E18" stroke="url(#fcCyanGrad)" strokeWidth="1.5" strokeDasharray="3 1.5" />
          <polygon points="16,20 21.5,23 16,26" fill="url(#fcCyanGrad)" />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1.5">
          <span className="font-outfit font-black text-base sm:text-lg tracking-tight uppercase flex items-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300">Films</span>
            <span className="text-cyan-400 ml-0.5 group-hover:text-cyan-300 transition-colors">Club</span>
          </span>
          <span className="text-[9px] font-black tracking-widest text-slate-950 bg-gradient-to-r from-cyan-400 to-cyan-300 px-1.5 py-0.5 rounded shadow-[0_0_12px_rgba(0,242,254,0.6)] font-mono">
            4K UHD
          </span>
        </div>
        <span className="text-[9px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5 hidden sm:block">
          NextGen Cinema Hub
        </span>
      </div>
    </Link>
  );
}
