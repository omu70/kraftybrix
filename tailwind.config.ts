import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        // Dark luxury surface scale (ink = surfaces, darkest → lighter)
        ink: {
          DEFAULT: "#0A0A0A",
          900: "#0A0A0A", // page background
          800: "#141414", // cards / elevated
          700: "#1A1A1A",
          600: "#242424",
          500: "#2E2E2E",
        },
        brand: {
          red: "#FF2D20",
          blue: "#0066FF",
          gold: "#F5A623",
          white: "#FFFFFF",
        },
        cream: "#F0EDE6", // warm off-white primary text
        border: "rgba(255,255,255,0.10)",
        muted: "rgba(240,237,230,0.55)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Space Grotesk", "sans-serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 10px 50px -10px rgba(245,166,35,0.45)",
        "glow-blue": "0 10px 40px -10px rgba(0,102,255,0.4)",
        card: "0 24px 60px -24px rgba(0,0,0,0.8)",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
        "radial-spot":
          "radial-gradient(ellipse 60% 50% at 60% 55%, rgba(245,166,35,0.14) 0%, transparent 70%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both",
        marquee: "marquee 30s linear infinite",
        shimmer: "shimmer 2.5s linear infinite",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
