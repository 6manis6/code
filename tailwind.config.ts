import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Legacy — kept so existing classes like bg-background still work
        background: "var(--color-bg)",
        foreground: "var(--color-text)",

        // Semantic tokens — use these for new/updated code
        surface: "var(--color-card)",
        "surface-secondary": "var(--color-bg-secondary)",
        border: "var(--color-border)",
        "input-bg": "var(--color-input-bg)",
        "input-border": "var(--color-input-border)",
        "text-primary": "var(--color-text)",
        "text-secondary": "var(--color-text-secondary)",
        "text-muted": "var(--color-text-muted)",

        // Brand
        primary: {
          DEFAULT: "#FF6B35",
          dark: "#E85D2E",
        },

        // Kurama theme aliases (used by .btn-primary, .card-anime)
        kurama: {
          orange: "#FF6B35",
          dark: "#0a0a0a",
          gray: "#1a1a1a",
        },

        // Dark-mode bg helpers — backward-compat with dark:bg-dark-card etc.
        dark: {
          bg: "#0a0a0a",
          card: "#1a1a1a",
        },
      },
      fontFamily: {
        sans: ["Inter", "Arial", "Helvetica", "sans-serif"],
        display: ["Bangers", "cursive"],
      },
    },
  },
  plugins: [],
};
export default config;
