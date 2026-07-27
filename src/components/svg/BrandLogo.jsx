import React from "react";

export default function BrandLogo({ className = "w-8 h-8", size = 34 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD166" />
          <stop offset="50%" stopColor="#D4A017" />
          <stop offset="100%" stopColor="#B8860B" />
        </linearGradient>
        <linearGradient id="logoBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1C2230" />
          <stop offset="100%" stopColor="#0B0D13" />
        </linearGradient>
        <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Background Box */}
      <rect
        x="16"
        y="16"
        width="480"
        height="480"
        rx="110"
        fill="url(#logoBgGrad)"
        stroke="url(#logoGoldGrad)"
        strokeWidth="14"
      />

      {/* Outer Film Reel Ring */}
      <circle
        cx="256"
        cy="256"
        r="165"
        fill="none"
        stroke="url(#logoGoldGrad)"
        strokeWidth="10"
        strokeDasharray="20 14"
        opacity="0.85"
      />

      {/* Central Play Triangle */}
      <path
        d="M210 160 L350 256 L210 352 Z"
        fill="url(#logoGoldGrad)"
        filter="url(#logoGlow)"
      />

      {/* Corner Accents */}
      <circle cx="256" cy="116" r="14" fill="#FFD166" />
      <circle cx="256" cy="396" r="14" fill="#FFD166" />
      <circle cx="116" cy="256" r="14" fill="#FFD166" />
      <circle cx="396" cy="256" r="14" fill="#FFD166" />
    </svg>
  );
}
