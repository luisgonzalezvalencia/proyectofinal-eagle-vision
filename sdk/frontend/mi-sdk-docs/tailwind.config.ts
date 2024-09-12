import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f9fafb", // Reemplaza var(--background)
        foreground: "#1f2937", // Reemplaza var(--foreground)
        primary: {
          DEFAULT: "#000", // Reemplaza var(--primary)
          foreground: "#ffffff", // Reemplaza var(--primary-foreground)
        },
        secondary: {
          DEFAULT: "#64748b", // Reemplaza var(--secondary)
          foreground: "#ffffff", // Reemplaza var(--secondary-foreground)
        },
        destructive: {
          DEFAULT: "#ef4444", // Reemplaza var(--destructive)
          foreground: "#ffffff", // Reemplaza var(--destructive-foreground)
        },
        muted: {
          DEFAULT: "#d1d5db", // Reemplaza var(--muted)
          foreground: "#1f2937", // Reemplaza var(--muted-foreground)
        },
        accent: {
          DEFAULT: "#8b5cf6", // Reemplaza var(--accent)
          foreground: "#ffffff", // Reemplaza var(--accent-foreground)
        },
        popover: {
          DEFAULT: "#ffffff", // Reemplaza var(--popover)
          foreground: "#1f2937", // Reemplaza var(--popover-foreground)
        },
        card: {
          DEFAULT: "#ffffff", // Reemplaza var(--card)
          foreground: "#1f2937", // Reemplaza var(--card-foreground)
        },
      },
      borderRadius: {
        lg: "0.5rem", // Reemplaza var(--radius)
        md: "0.375rem", // Reemplaza calc(var(--radius) - 2px)
        sm: "0.25rem", // Reemplaza calc(var(--radius) - 4px)
      },
    },
  },
  plugins: [],
};

export default config;
