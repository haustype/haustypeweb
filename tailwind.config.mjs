import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        black: '#000000',
        'haus-black': '#000000',
        'haus-red': '#E31E24',
        'haus-grey': '#eeeeee',
        'haus-yellow': '#ffcc01',
      },
      fontFamily: {
        sans: ['Aros Gothic', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      gridTemplateColumns: {
        '12': 'repeat(12, minmax(0, 1fr))',
      },
      maxWidth: {
        'content': '1512px',
      },
      borderRadius: {
        site: '5px',
      },
      fontSize: {
        base: ['1rem', { lineHeight: '1.5' }],
      },
      lineHeight: {
        normal: '1.5',
      },
    },
  },
  plugins: [
    typography({
      DEFAULT: {
        css: {
          lineHeight: '1.5',
          color: '#000000',
          p: { lineHeight: '1.5', color: '#000000' },
          li: { lineHeight: '1.5', color: '#000000' },
          blockquote: { lineHeight: '1.5', color: '#000000' },
          a: { color: 'rgb(0 0 0 / 0.45)', textDecoration: 'none', fontWeight: '400' },
          'a:hover': { color: '#000000' },
          strong: { color: '#000000' },
          'ul > li::marker': { color: '#000000' },
          'ol > li::marker': { color: '#000000' },
          '--tw-prose-body': '#000000',
          '--tw-prose-bullets': '#000000',
          '--tw-prose-counters': '#000000',
          '--tw-prose-links': 'rgb(0 0 0 / 0.45)',
          'blockquote p:first-of-type::before': { color: '#000000' },
          'blockquote p:last-of-type::after': { color: '#000000' },
          code: { color: '#000000' },
          'h1, h2, h3, h4, h5, h6': {
            fontWeight: '400',
            lineHeight: '1.5',
            color: '#000000',
          },
          h1: { fontSize: '20px', fontWeight: '400' },
          h2: { fontSize: '20px', fontWeight: '400' },
          h3: { fontSize: '18px', fontWeight: '400' },
          h4: { fontSize: '16px', fontWeight: '400' },
          h5: { fontSize: '16px', fontWeight: '400' },
          h6: { fontSize: '16px', fontWeight: '400' },
        },
      },
    }),
  ],
};
