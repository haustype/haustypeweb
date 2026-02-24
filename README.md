# Haus Type Website

A modern, responsive website for the Haus Type foundry. Built with Astro for speed and SEO, with Decap CMS for content management.

## Features

- **6-column grid layout** – Clean, typography-focused design
- **Hero display** – Showcase images/videos of your fonts
- **Fonts In Use carousel** – Client work with arrow navigation
- **Blog & pages** – Managed via Decap CMS
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

## Netlify Deployment

1. Push to GitHub and connect the repo to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Update `site` in `astro.config.mjs` with your Netlify URL (e.g. `https://haustype.netlify.app`)
5. Update `robots.txt` sitemap URL to match
6. Enable **Identity** and **Git Gateway** in Netlify for CMS access
7. Add fontdue.js for font sales (integrate after deployment)

## CMS

Visit `/admin` to manage blog posts and pages. Requires Netlify Identity (Git Gateway) when deployed.

## Project Structure

```
src/
├── components/     # Header, Hero, Footer, Carousel, etc.
├── content/       # Blog and pages (CMS-editable)
├── layouts/       # Base layout with SEO
├── pages/         # Routes
└── styles/        # Global CSS
public/
├── admin/         # Decap CMS
└── uploads/       # CMS media uploads
```
