# Haus Type Website

A modern, responsive website for the Haus Type foundry. Built with Astro for speed and SEO, with Sanity.io for content management.

## Features

- **6-column grid layout** – Clean, typography-focused design
- **Hero display** – Showcase images/videos of your fonts
- **Fonts In Use carousel** – Client work with arrow navigation
- **Blog & pages** – Managed via Sanity CMS
- **SEO** – Sitemap, meta tags, semantic HTML
- **No smooth scrolling** – Instant scroll behavior
- **fontdue.js** – Ready for integration after Netlify deployment

## Development

```bash
npm install
npm run dev
```

Visit `http://localhost:4321`

## Build

```bash
npm run build
```

Output in `dist/`

## Sanity CMS Setup

1. **Create a Sanity project** (one-time setup):

   ```bash
   npx sanity@latest init --env
   ```

   Follow the prompts to create a project. This writes `PUBLIC_SANITY_PROJECT_ID` and `PUBLIC_SANITY_DATASET` to `.env`.

2. **Edit content** at [sanity.io/manage](https://sanity.io/manage) → select your project. Or run `npm run studio` to open the studio locally.

3. **Add CORS origins** in [sanity.io/manage](https://sanity.io/manage) → your project → API → CORS origins:
   - `http://localhost:4321` (development)
   - `https://haustypeweb.netlify.app` (production)

4. **Netlify env vars**: Add `PUBLIC_SANITY_PROJECT_ID` and `PUBLIC_SANITY_DATASET` to your Netlify site settings.

5. **Webhook for live updates** – when you publish in Sanity, trigger a Netlify rebuild:

   **Create the Netlify build hook:**
   1. Go to [app.netlify.com](https://app.netlify.com) and sign in
   2. Click your site (e.g. haustypeweb)
   3. Left sidebar → **Site configuration** → **Build & deploy**
   4. Scroll down to the **Build hooks** section
   5. Click **Add build hook** / **Create build hook**
   7. **Name:** e.g. `Sanity`
   8. **Branch to build:** `main` (or your production branch)
   9. Click **Save**
   10. Copy the generated URL (looks like `https://api.netlify.com/build_hooks/abc123...`)

   *If you don’t see Build hooks:* Use the search bar at the top of Netlify and search for “build hooks”, or check under **Continuous deployment** within Build & deploy.

   **Run the setup script:**
   ```bash
   NETLIFY_BUILD_HOOK_URL="https://api.netlify.com/build_hooks/YOUR_ID" \
   SANITY_API_TOKEN="your-sanity-token" \
   node scripts/setup-sanity-webhook.mjs
   ```
   (Create the Sanity token at [sanity.io/manage](https://sanity.io/manage) → your project → **API** → **Tokens** → **Add API token**)

**Localhost**: Run `npm run dev` (not `npm run preview`). The dev server fetches from Sanity on each request, so changes appear after a refresh. Use **Publish** in Sanity, not just Save—drafts don’t appear on the site.

## Netlify Deployment

1. Push to GitHub and connect the repo to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add env vars: `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`
5. Add fontdue.js for font sales (integrate after deployment)

## CMS

Edit content at [sanity.io/manage](https://sanity.io/manage) or run `npx sanity dev` locally. Content types: **Blog posts**, **Pages**, **Typefaces**, **Site Settings** (hero, about text, fonts in use). Until you run `npx sanity init --env` and add content, the site uses fallback data from the codebase.

## Project Structure

```
src/
├── components/     # Header, Hero, Footer, Carousel, etc.
├── content/        # Fallback blog/pages (Astro content, used when Sanity empty)
├── layouts/        # Base layout with SEO
├── pages/          # Routes
├── sanity/         # Sanity schemas and lib
└── styles/         # Global CSS
public/
└── uploads/        # CMS media uploads (legacy)
```
