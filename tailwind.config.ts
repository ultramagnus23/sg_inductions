import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1c1917",
        paper: "#faf9f7",
      },
    },
  },
  plugins: [],
};
export default config;
