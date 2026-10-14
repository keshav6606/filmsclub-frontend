import React from 'react';
import { Link } from 'react-router-dom';

export default function FilmsClubLogo({ className = '', to = '/' }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2.5 group shrink-0 select-none ${className}`}
      aria-label="Filmy4UHD - Watch 4K Movies & Web Series Online Free"
    >
      {/* Straight & Simple Clean Streaming Icon */}
      <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#181a24] to-[#08090e] p-1.5 border border-red-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(229,9,20,0.3)] group-hover:border-red-500 group-hover:shadow-[0_0_20px_rgba(229,9,20,0.55)] transition-all duration-300">
        <svg viewBox="0 0 32 32" fill="none" className="w-full h-full drop-shadow-[0_0_8px_rgba(229,9,20,0.6)]">
          <defs>
            <linearGradient id="logoRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF334B" />
              <stop offset="100%" stopColor="#E50914" />
            </linearGradient>
            <linearGradient id="logoCyanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00F0FF" />
              <stop offset="100%" stopColor="#0088FF" />
            </linearGradient>
          </defs>

          {/* Straight Left Vertical Cyan Accent Bar */}
          <rect x="5" y="7" width="2.5" height="18" rx="1.25" fill="url(#logoCyanGrad)" />

          {/* Straight Play Mark */}
          <path d="M12 7.5L26 16L12 24.5V7.5Z" fill="url(#logoRedGrad)" />
        </svg>
      </div>

      {/* Brand Typography: filmy4uhd */}
      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1.5">
          <span className="font-outfit font-black text-lg sm:text-xl tracking-tight flex items-center">
            <span className="text-white">Filmy</span>
            <span className="text-red-500 ml-0.5 group-hover:text-red-400 transition-colors">4UHD</span>
          </span>
          <span className="text-[9px] font-black tracking-wider text-black bg-gradient-to-r from-red-500 to-red-400 text-white px-1.5 py-0.5 rounded shadow-[0_0_10px_rgba(229,9,20,0.4)] font-mono">
            4K
          </span>
        </div>
        <span className="text-[9px] text-zinc-400 font-semibold tracking-wider uppercase mt-0.5 hidden sm:block">
          Watch Movies & Web Series
        </span>
      </div>
    </Link>
  );
}
