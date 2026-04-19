import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        bone: '#F5F1EA',
        ink: '#1A1814',
        rust: '#D4502A',
        rust_hover: '#B8421F',
        paper: '#EDE7DC',
        paper_border: '#D9D0C0',
        muted: '#6B6359',
        success: '#4A6B3E',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-up-2': 'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.08s both',
        'fade-up-3': 'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.16s both',
        'fade-up-4': 'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.24s both',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
