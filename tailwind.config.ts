import { nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ["DM Sans Variable", "sans-serif"],
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            primary: {
              50: "#d8f9ff",
              100: "#abe7ff",
              200: "#7bd5ff",
              300: "#49c4ff",
              400: "#1ab3ff",
              500: "#0099e6",
              600: "#0077b4",
              700: "#005582",
              800: "#003451",
              900: "#001221",
              foreground: "#FFFFFF",
              DEFAULT: "#009FEE",
            },
            secondary: {
              50: "#dcfcff",
              100: "#b7eff4",
              200: "#8fe4eb",
              300: "#67d7e3",
              400: "#3fccd9",
              500: "#26b2c0",
              600: "#158b96",
              700: "#06646c",
              800: "#003c42",
              900: "#001618",
              foreground: "#FFFFFF",
              DEFAULT: "#27B9C7",
            },
          },
        },
        dark: {
          colors: {
            primary: {
              900: "#d8f9ff",
              800: "#abe7ff",
              700: "#7bd5ff",
              600: "#49c4ff",
              500: "#1ab3ff",
              400: "#0099e6",
              300: "#0077b4",
              200: "#005582",
              100: "#003451",
              50: "#001221",
              foreground: "#FFFFFF",
              DEFAULT: "#009FEE",
            },
            secondary: {
              900: "#dcfcff",
              800: "#b7eff4",
              700: "#8fe4eb",
              600: "#67d7e3",
              500: "#3fccd9",
              400: "#26b2c0",
              300: "#158b96",
              200: "#06646c",
              100: "#003c42",
              50: "#001618",
              foreground: "#FFFFFF",
              DEFAULT: "#27B9C7",
            },
          },
        },
      },
    }),
  ],
} satisfies Config;
