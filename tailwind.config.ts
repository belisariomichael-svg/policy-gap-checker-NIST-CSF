import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Cyber theme: same token names as before, so existing classes keep working.
        ink: "#E6EDF7",      // main text (light on dark)
        paper: "#0A0F1E",    // page background (also used as dark text on bright buttons)
        surface: "#111A2E",  // panels, inputs, cards (replaces bg-white)
        rule: "#223052",     // borders
        accent: "#22D3EE",   // cyan: primary buttons, score, links
        covered: "#3DDC97",
        partial: "#F5B83D",
        gap: "#FF6B6B",
        na: "#8A94A3",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "Cascadia Code", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
