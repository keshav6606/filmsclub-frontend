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
        outfit: ["Outfit", ...defaultTheme.fontFamily.sans],
        mono: ["'JetBrains Mono'", ...defaultTheme.fontFamily.mono],
      },
      colors: {
        // ── Cinema Obsidian & Photonic Neon Theme ────────────────────────────
        
        // Canvas & Surface Hierarchy
        void: "#05070B",                 // Pure OLED void black
        obsidian: "#080B11",             // Foundational cinema backdrop
        surface: "#0E131F",              // Elevated panels, headers, bottom bars
        surfaceElevated: "#141A29",      // Cards, menus, modals
        surfaceHighlight: "#1C2438",     // Active states, hover cards
        
        // Photonic Neon & VIP Accents
        cyanNeon: "#00F2FE",             // Laser Electric Cyan
        cyanGlow: "#00D2FF",             // Luminous Cyan
        crimsonNeon: "#FF2A55",          // Cinema Scarlet VIP
        crimsonDark: "#E50914",          // Flagship Cinema Red
        violetNeon: "#8B5CF6",           // Royal Amethyst
        violetDeep: "#7928CA",           // Deep Electric Violet
        goldRef: "#FFD166",              // Dolby / IMDb Reference Gold
        amberRef: "#F59E0B",             // Precision Amber
        emeraldStudio: "#00F5A0",        // Lossless Studio Emerald
        emeraldDark: "#10B981",          // Active Node Emerald
        
        // Legacy Backwards Compatibility Mappings
        bgColor: "#05070B",
        bgColorSecondary: "#0E131F",
        bgColorTertiary: "#141A29",
        bgGlass: "rgba(14, 19, 31, 0.78)",
        
        primaryBtn: "#00F2FE",
        primaryBtnHover: "#00D2FF",
        primaryBtnGlow: "rgba(0, 242, 254, 0.5)",
        otherColor: "#FF2A55",
        accent: "#00F2FE",
        accentSoft: "#38BDF8",
        goldLight: "#FFD166",
        goldDark: "#D97706",
        
        // Typography Contrast
        primaryTextColor: "#F8FAFC",
        secondaryTextColor: "#94A3B8",
        mutedText: "#64748B",
        
        // Glass & Borders
        btnColor: "#0E131F",
        border: "rgba(255, 255, 255, 0.08)",
        borderStrong: "rgba(0, 242, 254, 0.35)",
        glass: "rgba(255, 255, 255, 0.04)",
        
        // Badges & Telemetry
        ripBadge: "#101626",
        skeleton: "#0E131F",
      },
      boxShadow: {
        cyan: "0 0 25px rgba(0, 242, 254, 0.4)",
        cyanStrong: "0 0 45px rgba(0, 242, 254, 0.65)",
        crimson: "0 0 25px rgba(255, 42, 85, 0.45)",
        crimsonStrong: "0 0 45px rgba(255, 42, 85, 0.7)",
        violet: "0 0 25px rgba(139, 92, 246, 0.4)",
        gold: "0 0 25px rgba(255, 209, 102, 0.4)",
        card: "0 10px 35px rgba(0, 0, 0, 0.8)",
        cardHover: "0 16px 50px rgba(0, 0, 0, 0.9), 0 0 30px rgba(0, 242, 254, 0.3)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.6)",
        specular: "inset 0 1px 0 rgba(255, 255, 255, 0.15)",
        nav: "0 8px 32px rgba(0, 0, 0, 0.8)",
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
        "gradient-cyan": "linear-gradient(135deg, #00F2FE 0%, #00C6FF 100%)",
        "gradient-crimson": "linear-gradient(135deg, #FF2A55 0%, #E50914 100%)",
        "gradient-vip": "linear-gradient(135deg, #FF2A55 0%, #7928CA 100%)",
        "gradient-cinema": "linear-gradient(135deg, #00F2FE 0%, #7928CA 100%)",
        "gradient-dark": "linear-gradient(180deg, transparent 0%, #05070B 100%)",
        "gradient-card": "linear-gradient(180deg, transparent 35%, rgba(5, 7, 11, 0.96) 100%)",
        "gradient-hero": "linear-gradient(to right, rgba(5, 7, 11, 0.95) 0%, rgba(5, 7, 11, 0.65) 50%, transparent 100%)",
        "gradient-glass": "linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(0, 0, 0, 0.3))",
      },
      animation: {
        "aurora": "auroraDrift 18s ease infinite",
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.35s ease-out",
        "pulse-cyan": "pulseCyan 2.5s infinite ease-in-out",
        "pulse-beacon": "pulseBeacon 2s infinite ease-in-out",
        "shimmer": "shimmer 2.2s infinite",
        "scale-in": "scaleIn 0.25s ease-out",
      },
      keyframes: {
        auroraDrift: {
          "0%, 100%": { "transform": "scale(1) translate(0px, 0px)" },
          "50%": { "transform": "scale(1.08) translate(20px, -15px)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseCyan: {
          "0%, 100%": { opacity: "0.7", transform: "scale(0.98)" },
          "50%": { opacity: "1", transform: "scale(1.02)" },
        },
        pulseBeacon: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.4", transform: "scale(0.85)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
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
