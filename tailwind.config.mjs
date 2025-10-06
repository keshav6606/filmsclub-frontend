/** @type {import('tailwindcss').Config} */

import { nextui } from "@nextui-org/theme";

export default {
  // Content paths are kept, including the necessary path for NextUI
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // screens: (Default Tailwind screens are used, custom ones removed)
    // colors: (Default Tailwind colors are used, custom ones removed)
    extend: {
      // All custom extensions (fontFamily, colors, boxShadow, aspectRatio, fontSize, backgroundImage) are removed,
      // relying purely on Tailwind's sensible defaults.
    },
  },
  darkMode: "class",
  // NextUI plugin is kept as it is essential for NextUI components to function
  plugins: [nextui()],
};
