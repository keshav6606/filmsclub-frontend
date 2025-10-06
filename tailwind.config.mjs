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
        primaryTextColor: "#F8FAFC",
        secondaryTextColor: "#A9B8D0",
        primaryBtn: "#6E66FF",
        primaryBtnHover: "#324DBC",
        primaryBtnGlow: "#FF3131",      // Neon glow for hover/focus
        bgColor: "##FF3131",
        bgColorSecondary: "#2B2245",
        btnColor: "##FF3131",
        btnGlow: "#FFB974",
        otherColor: "#36FFF7",
        accent: "#FF5CAA",
        accentGlow: "#FF7BCB",
        glass: "rgba(255,255,255,0.08)",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(80,105,255,0.15)",
        primary: "0 8px 32px 0 rgba(110,102,255,0.35)",
        neon: "0 0 8px #36FFF7, 0 0 16px #36FFF7, 0 0 32px #36FFF7",
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
        'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(174,197,255,0.13))',
        'gradient-animated': 'linear-gradient(270deg, #36FFF7, #6E66FF, #FF5CAA)',
      },
      animation: {
        "gradient-shift": "gradientShift 8s ease infinite",
      },
      keyframes: {
        gradientShift: {
          "0%, 100%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
        },
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
        'colors': 'background-color, border-color, color, fill, stroke',
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
