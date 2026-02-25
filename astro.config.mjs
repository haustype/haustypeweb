// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

import sanity from '@sanity/astro';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://haustypeweb.netlify.app',
  integrations: [
    tailwind(),
    sitemap(),
    sanity({
      projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID ?? 'placeholder',
      dataset: import.meta.env.PUBLIC_SANITY_DATASET ?? 'production',
      useCdn: false,
      apiVersion: '2025-01-28',
    }),
    react(),
  ],
  output: 'static',
});