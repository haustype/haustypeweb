// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import tailwind from '@astrojs/tailwind';

import sanity from '@sanity/astro';
import react from '@astrojs/react';

// Canonical host for absolute URLs. Override with PUBLIC_SITE_URL.
// Apex haustype.com redirects to www — keep them aligned.
const site = process.env.PUBLIC_SITE_URL ?? 'https://www.haustype.com';

// https://astro.build/config
export default defineConfig({
  site,
  server: { port: 4321 },
  devToolbar: { enabled: false },
  integrations: [
    tailwind(),
    sanity({
      projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID ?? 'b5rdpzo3',
      dataset: import.meta.env.PUBLIC_SANITY_DATASET ?? 'production',
      useCdn: false,
      apiVersion: '2025-01-28',
    }),
    react(),
  ],
  output: 'static',
  adapter: netlify(),
});
