/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--color-background) / <alpha-value>)",
        foreground: "rgb(var(--color-foreground) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        panel: "rgb(var(--color-panel) / <alpha-value>)",
        line: "rgb(var(--color-line) / <alpha-value>)",
        brand: {
          DEFAULT: "rgb(var(--color-brand) / <alpha-value>)",
          strong: "rgb(var(--color-brand-strong) / <alpha-value>)",
          soft: "rgb(var(--color-brand-soft) / <alpha-value>)"
        },
        accent: {
          coral: "rgb(var(--color-accent-coral) / <alpha-value>)",
          mint: "rgb(var(--color-accent-mint) / <alpha-value>)",
          gold: "rgb(var(--color-accent-gold) / <alpha-value>)"
        },
        success: "rgb(var(--color-success) / <alpha-value>)",
        warning: "rgb(var(--color-warning) / <alpha-value>)"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Segoe UI", "PingFang SC", "sans-serif"],
        display: ["var(--font-display)", "Trebuchet MS", "PingFang SC", "sans-serif"]
      },
      borderRadius: {
        xl: "1.25rem",
        "2xl": "1.75rem",
        "3xl": "2rem"
      },
      boxShadow: {
        glow: "0 24px 60px rgba(12, 22, 68, 0.16)",
        soft: "0 12px 32px rgba(19, 27, 46, 0.08)"
      },
      backgroundImage: {
        "hero-grid":
          "linear-gradient(rgba(10, 16, 36, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(10, 16, 36, 0.06) 1px, transparent 1px)"
      },
      keyframes: {
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" }
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "pulse-ring": {
          "0%": { boxShadow: "0 0 0 0 rgba(58, 110, 255, 0.18)" },
          "100%": { boxShadow: "0 0 0 16px rgba(58, 110, 255, 0)" }
        }
      },
      animation: {
        "float-slow": "float-slow 7s ease-in-out infinite",
        "fade-up": "fade-up 0.7s ease forwards",
        "pulse-ring": "pulse-ring 2.4s ease-out infinite"
      }
    }
  },
  plugins: []
};

