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
        background: "#0f172a", // slate-900
        panel: "rgba(30, 41, 59, 0.5)", // slate-800 com opacidade
        accent: "#22d3ee", // cyan-400
      },
    },
  },
  plugins: [],
};
export default config;
