import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        balulu: {
          primary: {
            50: "#eff6ff",
            100: "#dbeafe",
            200: "#bfdbfe",
            300: "#93c5fd",
            400: "#60a5fa",
            500: "#3b82f6",
            600: "#2563eb",
            700: "#1d4ed8",
            800: "#1e40af",
            900: "#1e3a8a",
            950: "#172554",
          },
          secondary: {
            50: "#f0fdfa",
            100: "#ccfbf1",
            200: "#99f6e4",
            300: "#5eead4",
            400: "#2dd4bf",
            500: "#14b8a6",
            600: "#0d9488",
            700: "#0f766e",
            800: "#115e59",
            900: "#134e4a",
            950: "#042f2e",
          },
          accent: {
            50: "#fff7ed",
            100: "#ffedd5",
            200: "#fed7aa",
            300: "#fdba74",
            400: "#fb923c",
            500: "#f97316",
            600: "#ea580c",
            700: "#c2410c",
            800: "#9a3412",
            900: "#7c2d12",
            950: "#431407",
          },
          surface: "#ffffff",
          background: "#fafafa",
          text: "#1f2937",
          muted: "#6b7280",
          border: "#e5e7eb",
        },
      },
      fontFamily: {
        sans: ["Inter", "Geist", "Manrope", "system-ui", "sans-serif"],
      },
      borderRadius: {
        balulu: "1rem",
        "balulu-sm": "0.75rem",
        "balulu-lg": "1.5rem",
      },
      boxShadow: {
        balulu: "0 4px 24px -4px rgba(0, 0, 0, 0.08)",
        "balulu-lg": "0 12px 48px -8px rgba(0, 0, 0, 0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
