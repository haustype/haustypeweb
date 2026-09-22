# Haus Type Website

Astro + Sanity + Fontdue site for the Haus Type foundry. Live at [www.haustype.com](https://www.haustype.com).

## Development

```bash
npm install
npm run dev      # site → http://localhost:4321
npm run studio   # Sanity Studio → http://localhost:3334
```

## Content (Sanity)

Edit at [https://haustypeweb.sanity.studio/](https://haustypeweb.sanity.studio/) or via [sanity.io/manage](https://sanity.io/manage).

- **Homepage Settings** — mosaic, about, fonts in use
- **Site Settings** — identity, SEO defaults, screensaver, nav, custom code
- **Typefaces / Pages / Blog** — catalog and editorial content
- **Footer Settings** — Info + Contact link lists

Publishing in Studio triggers a Netlify rebuild (webhook → build hook). Use **Publish**, not just Save.

After schema changes in this repo: restart local Studio, and run `npx sanity deploy` so the hosted Studio matches.

## Build & deploy

```bash
npm run build
# or push to main — Netlify builds automatically
```

Env (local `.env` + Netlify):

- `PUBLIC_SANITY_PROJECT_ID` / `PUBLIC_SANITY_DATASET`
- `PUBLIC_SITE_URL=https://www.haustype.com` (production)

## Project structure

```
src/
├── components/
├── layouts/        # BaseLayout (SEO, JSON-LD, fonts)
├── lib/
├── pages/          # Routes + robots.txt / sitemap.xml
├── sanity/         # Schemas + clients
└── styles/
```

## Pausing auto-deploys

```bash
SANITY_API_TOKEN="your-token" node scripts/pause-auto-deploys.mjs
```

Also stop builds in Netlify if needed. Re-enable the Sanity webhook when ready again.
