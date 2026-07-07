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
        // Warm cream premium surface scale (Motoblox-style editorial light)
        ink: {
          DEFAULT: "#FFFFFF",
          900: "#F4EEE4", // warm cream page background
          800: "#FFFFFF", // cards / elevated
          700: "#EFE8DC",
          600: "#E4DCCD",
          500: "#D8CFBD",
        },
        charcoal: {
          DEFAULT: "#15120E", // dark hero / "inside the kit" bands
          800: "#1E1A15",
          700: "#2A251E",
        },
        brand: {
          red: "#FF2D20",
          blue: "#0066FF",
          gold: "#F5A623",
          orange: "#E8662A",
          white: "#FFFFFF",
        },
        cream: "#1A1611", // warm near-black primary text on cream
        border: "rgba(26,22,17,0.12)",
        muted: "rgba(26,22,17,0.55)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Space Grotesk", "sans-serif"],
        archivo: ["var(--font-archivo)", "Archivo", "sans-serif"],
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
