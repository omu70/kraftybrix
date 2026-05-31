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
        // Light premium surface scale (ink = surfaces, light → slightly deeper)
        ink: {
          DEFAULT: "#FFFFFF",
          900: "#F6F7F9", // page background
          800: "#FFFFFF", // cards / elevated
          700: "#EEF1F4",
          600: "#E4E7EC",
          500: "#D7DBE2",
        },
        brand: {
          red: "#FF2D20",
          blue: "#0066FF",
          gold: "#F5A623",
          white: "#FFFFFF",
        },
        cream: "#15171A", // primary text (named cream for compat; now near-black)
        border: "rgba(15,18,25,0.10)",
        muted: "rgba(15,18,25,0.55)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Space Grotesk", "sans-serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 10px 40px -10px rgba(255,45,32,0.45)",
        "glow-blue": "0 10px 40px -10px rgba(0,102,255,0.4)",
        card: "0 18px 50px -24px rgba(15,18,25,0.30)",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, rgba(15,18,25,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,18,25,0.05) 1px, transparent 1px)",
        "radial-spot":
          "radial-gradient(60% 60% at 50% 30%, rgba(255,45,32,0.10) 0%, transparent 70%)",
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
