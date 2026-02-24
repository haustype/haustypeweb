import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'haus-black': '#0a0a0a',
        'haus-red': '#E31E24',
        'haus-grey': '#f0f0f0',
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      gridTemplateColumns: {
        '6': 'repeat(6, minmax(0, 1fr))',
      },
    },
  },
  plugins: [typography],
};
