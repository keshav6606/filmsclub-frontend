import React from "react";

export default function BrandLogo({ className = "w-10 h-10" }) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className} group`}>
      {/* Ambient Outer Glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-cyan-500 blur-md opacity-60 group-hover:opacity-100 transition-opacity" />

      {/* Main Logo Container */}
      <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-black p-2 border border-amber-400/50 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.5)] group-hover:scale-105 transition-transform">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full text-amber-400 fill-current drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]"
        >
          {/* Film Strip Holes Left */}
          <rect x="8" y="15" width="8" height="12" rx="2" fill="#F59E0B" />
          <rect x="8" y="44" width="8" height="12" rx="2" fill="#F59E0B" />
          <rect x="8" y="73" width="8" height="12" rx="2" fill="#F59E0B" />

          {/* Film Strip Holes Right */}
          <rect x="84" y="15" width="8" height="12" rx="2" fill="#F59E0B" />
          <rect x="84" y="44" width="8" height="12" rx="2" fill="#F59E0B" />
          <rect x="84" y="73" width="8" height="12" rx="2" fill="#F59E0B" />

          {/* Center Play Circle with Gradient Fill */}
          <circle cx="50" cy="50" r="32" fill="url(#logoGrad)" stroke="#06B6D4" strokeWidth="4" />

          {/* Play Triangle */}
          <polygon points="43,36 65,50 43,64" fill="#06080D" />

          <defs>
            <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
