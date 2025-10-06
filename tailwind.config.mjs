/** @type {import('tailwindcss').Config} */

import defaultTheme from "tailwindcss/defaultTheme";
import { nextui } from "@nextui-org/theme";

export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // --- Screen Sizes: Keeping your original values ---
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
        // Suggestion: Anton for headings, Inter or Roboto for body text (if imported)
        // sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        // --- Custom Modern Dark Theme (Deep Navy Blue & Cyan Accent) ---
        
        // Main Colors
        primaryTeal: "#00BCD4",       // Vibrant Cyan/Teal (Primary Call-to-Action)
        darkTeal: "#0097A7",          // Darker Teal for Hover
        
        // Background Colors
        bgColor: "#101625",                // Main Background: Deep Navy Blue (Sleek Look)
        bgColorSecondary: "#1F2937",       // Secondary Sections/Cards: Dark Slate Blue
        
        // Text Colors
        primaryTextColor: "#FFFFFF",       // White text (High contrast)
        secondaryTextColor: "#9CA3AF",     // Muted/Greyish text
        
        // Button & Accent Colors
        primaryBtn: "#00BCD4",             // Button Background: Vibrant Teal
        primaryBtnHover: "#0097A7",        // Button Hover: Dark Teal
        primaryBtnGlow: "rgba(0, 188, 212, 0.6)", // Teal Glow
        
        // Other Theme Keys
        btnColor: "#101625",               // Button Text Color (Dark Blue/Black for contrast on Teal button)
        btnGlow: "rgba(0, 188, 212, 0.8)",  // Stronger Teal Glow
        otherColor: "#00BCD4",             // General Teal Accent
        accent: "#00BCD4",                 // General Teal Accent
        accentGlow: "rgba(0, 188, 212, 0.7)", 
        glass: "rgba(255, 255, 255, 0.08)", // Light Glass effect
      },
      // --- Box Shadow: ORIGINAL Values Restored ---
      boxShadow: {
        // Keeping your original neon which is similar to the new primaryTeal
        glass: "0 8px 32px 0 rgba(80,105,255,0.15)",
        primary: "0 8px 32px 0 rgba(110,102,255,0.35)",
        neon: "0 0 8px #36FFF7, 0 0 16px #36FFF7, 0 0 32px #36FFF7", 
      },
      // --- End of Box Shadow ---
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
        // ग्रेडिएंट्स को Deep Blue और Cyan के अनुरूप बदला गया
        'gradient-radial': 'radial-gradient(ellipse at center, #00BCD4 0%, #101625 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(0,0,0,0.25))',
        'gradient-animated': 'linear-gradient(270deg, #00BCD4, #0097A7, #101625)',
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
