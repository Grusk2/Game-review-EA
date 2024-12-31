import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#1E1E2F',
        primary: '#4CAF50',
        secondary: '#FF5722',
        accent: '#9E9E9E',
      },
    },
  },
  plugins: [],
} satisfies Config;
