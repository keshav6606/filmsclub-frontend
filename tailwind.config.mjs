/** @type {import('tailwindcss').Config} */

import defaultTheme from "tailwindcss/defaultTheme";
import { nextui } from "@nextui-org/theme";

export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      xs: "400px",
      sm: "480px",
      bsmmd: "750px",
      bsmmdTwo: "500px",
      md: "700px",
      lg: "1024px",
      blgxllg: "920px",
      blgxl: "1224px",
      xl: "1440px",
      xxl: "1600px",
    },
    extend: {
      fontFamily: {
        Anton: ["Anton", ...defaultTheme.fontFamily.sans],
        jakarta: ["'Plus Jakarta Sans'", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        // ── Dark Gold/Amber Cinema Theme ──────────────────────────────────────
        
        // Backgrounds — ultra deep black
        bgColor: "#07080B",              // Main background — near pitch black
        bgColorSecondary: "#0F1117",     // Cards, panels — dark charcoal
        bgColorTertiary: "#13151D",      // Nav, footer, modals
        bgGlass: "rgba(15,17,23,0.85)", // Glass overlay
        
        // Gold / Amber Accent
        primaryBtn: "#D4A017",           // Rich gold CTA button
        primaryBtnHover: "#B8860B",      // Darker gold on hover
        primaryBtnGlow: "rgba(212,160,23,0.5)", // Gold glow
        otherColor: "#D4A017",           // General gold accent
        accent: "#F0B429",               // Bright amber accent
        accentSoft: "#E6A817",           // Soft amber
        goldLight: "#FFD166",            // Light gold for highlights
        goldDark: "#B8860B",             // Dark gold for shadows
        
        // Text
        primaryTextColor: "#F5F5F5",     // Warm white
        secondaryTextColor: "#8899AA",   // Muted blue-grey
        mutedText: "#5A6A7A",            // Very muted text
        
        // UI Elements
        btnColor: "#0F1117",             // Button bg (dark)
        border: "rgba(212,160,23,0.25)", // Gold tinted border
        borderStrong: "rgba(212,160,23,0.5)", // Strong gold border
        glass: "rgba(255,255,255,0.04)", // Glass card bg
        
        // Semantic
        ripBadge: "#1A2033",             // Badge backgrounds
        skeleton: "#141820",             // Skeleton loading
      },
      boxShadow: {
        gold: "0 0 20px rgba(212,160,23,0.35)",
        goldStrong: "0 0 40px rgba(212,160,23,0.55)",
        card: "0 8px 40px rgba(0,0,0,0.6)",
        cardHover: "0 12px 60px rgba(0,0,0,0.8), 0 0 24px rgba(212,160,23,0.25)",
        glass: "0 8px 32px 0 rgba(0,0,0,0.5)",
        insetGold: "inset 0 1px 0 rgba(212,160,23,0.2)",
        nav: "0 4px 30px rgba(0,0,0,0.6)",
      },
      aspectRatio: {
        "9/13": "9/13",
        "2/3": "2/3",
        "16/9": "16/9",
      },
      fontSize: {
        xs: "0.72rem",
        sm: "0.82rem",
        base: "1rem",
        md: "1.07rem",
        lg: "1.18rem",
        xl: "1.25rem",
        "2xl": "1.48rem",
        "3xl": "2rem",
        "4xl": "2.5rem",
        "5xl": "3.4rem",
        "6xl": "4.2rem",
        "7xl": "6.3rem",
      },
      backgroundImage: {
        "gradient-gold": "linear-gradient(135deg, #D4A017 0%, #F0B429 50%, #B8860B 100%)",
        "gradient-gold-radial": "radial-gradient(ellipse at top, rgba(212,160,23,0.15) 0%, transparent 60%)",
        "gradient-dark": "linear-gradient(180deg, transparent 0%, #07080B 100%)",
        "gradient-card": "linear-gradient(180deg, transparent 40%, rgba(7,8,11,0.95) 100%)",
        "gradient-hero": "linear-gradient(to right, rgba(7,8,11,0.9) 0%, rgba(7,8,11,0.6) 50%, transparent 100%)",
        "gradient-glass": "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(0,0,0,0.2))",
        "gradient-animated": "linear-gradient(270deg, #D4A017, #F0B429, #B8860B, #07080B)",
      },
      animation: {
        "gradient-shift": "gradientShift 8s ease infinite",
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "pulse-gold": "pulseGold 2s infinite ease-in-out",
        "shimmer": "shimmer 2s infinite",
        "scale-in": "scaleIn 0.3s ease-out",
      },
      keyframes: {
        gradientShift: {
          "0%, 100%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGold: {
          "0%, 100%": { opacity: "0.7", transform: "scale(0.97)" },
          "50%": { opacity: "1", transform: "scale(1.03)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.92)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
        colors: "background-color, border-color, color, fill, stroke",
      },
      backdropBlur: {
        xs: "2px",
        "4xl": "64px",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
