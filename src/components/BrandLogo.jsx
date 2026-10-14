import React from "react";

export default function BrandLogo({ className = "w-10 h-10" }) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className} group select-none`}>
      {/* Photonic Ambient Aura Glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400 via-violet-600 to-rose-600 blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Main Glass Shield Container */}
      <div className="relative w-full h-full rounded-2xl bg-gradient-to-b from-[#131929] via-[#0b0e17] to-[#05070b] p-2 border border-cyan-400/40 border-t-white/30 flex items-center justify-center shadow-[0_0_20px_rgba(0,242,254,0.35)] group-hover:scale-105 group-hover:border-cyan-300 transition-all duration-300">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-[0_0_12px_rgba(0,242,254,0.7)]"
          fill="none"
        >
          <defs>
            <linearGradient id="brandCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#00F2FE" />
              <stop offset="100%" stopColor="#00A3FF" />
            </linearGradient>

            <linearGradient id="brandCrimsonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF6B8B" />
              <stop offset="50%" stopColor="#FF2A55" />
              <stop offset="100%" stopColor="#9D0026" />
            </linearGradient>

            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00F2FE" />
              <stop offset="50%" stopColor="#7928CA" />
              <stop offset="100%" stopColor="#FF2A55" />
            </linearGradient>
          </defs>

          {/* Left Film Strip Perforations */}
          <rect x="8" y="18" width="7" height="11" rx="2" fill="url(#brandCyanGrad)" opacity="0.9" />
          <rect x="8" y="44" width="7" height="11" rx="2" fill="url(#brandCyanGrad)" opacity="0.9" />
          <rect x="8" y="70" width="7" height="11" rx="2" fill="url(#brandCyanGrad)" opacity="0.9" />

          {/* Right Film Strip Perforations */}
          <rect x="85" y="18" width="7" height="11" rx="2" fill="url(#brandCrimsonGrad)" opacity="0.9" />
          <rect x="85" y="44" width="7" height="11" rx="2" fill="url(#brandCrimsonGrad)" opacity="0.9" />
          <rect x="85" y="70" width="7" height="11" rx="2" fill="url(#brandCrimsonGrad)" opacity="0.9" />

          {/* Outer Orbital Glowing Cinema Ring */}
          <circle
            cx="50"
            cy="50"
            r="32"
            stroke="url(#ringGrad)"
            strokeWidth="3.5"
            strokeDasharray="4 2"
            opacity="0.85"
          />

          {/* Inner Dark Glass Lens */}
          <circle cx="50" cy="50" r="26" fill="#070A12" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />

          {/* Laser Play Arrow */}
          <polygon
            points="44,36 64,50 44,64"
            fill="url(#brandCyanGrad)"
            className="filter drop-shadow-[0_0_8px_rgba(0,242,254,0.9)]"
          />
        </svg>
      </div>
    </div>
  );
}
