import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        muted: "#7b8498",
        canvas: "#f5f6fa",
        primary: "#6466e9",
      },
      boxShadow: {
        card: "0 12px 36px rgba(31, 39, 73, 0.07)",
      },
    },
  },
  plugins: [],
} satisfies Config;
