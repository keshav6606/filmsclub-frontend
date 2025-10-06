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
      },
      colors: {
        primaryTextColor: "#F8FAFC",            // Ultra-light text
        secondaryTextColor: "#A9B8D0",          // Muted blue-gray text
        primaryBtn: "#6E66FF",                  // Vivid indigo (button primary)
        primaryBtnHower: "#324DBC",             // Rich blue (button hover)
        bgColor: "#28243D",                     // Lush indigo/dark violet background
        bgColorSecondary: "#38304B",            // Slightly lighter indigo for cards
        btnColor: "#FFAC5F",                    // Modern orange (for ghost/secondary btn)
        otherColor: "#36FFF7",                  // Aqua accent (active, highlights)
        accent: "#FF5CAA",                      // Pink accent (alerts, links)
        glass: "rgba(255,255,255,0.08)",        // For glass effect overlays
      },
      boxShadow: {
        glass: "0 4px 24px 0 rgba(80,105,255,0.11)",
        primary: "0 8px 24px 0 rgba(110,102,255,0.32)",
      },
      aspectRatio: {
        "9/13": "9/13",
      },
      fontSize: {
        sm: "0.82rem",
        base: "1rem",
        md: "1.07rem",
        xl: "1.25rem",
        "2xl": "1.48rem",
        "3xl": "2rem",
        "4xl": "2.5rem",
        "5xl": "3.4rem",
        "6xl": "4.2rem",
        "7xl": "6.3rem",
        "8xl": "8.5rem",
        "9xl": "12rem",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(ellipse at center, #36FFF7 0%, #6E66FF 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(174,197,255,0.13))'
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
