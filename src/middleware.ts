import { defineMiddleware } from 'astro:middleware';

/**
 * Netlify [[headers]] in netlify.toml only apply to static files.
 * Astro SSR responses come from a function, so set security headers here.
 */
const SECURITY_HEADERS: Record<string, string> = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  // Report-only until CMS embeds / third-party scripts are fully inventoried.
  'Content-Security-Policy-Report-Only':
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.fontdue.com https://www.googletagmanager.com https://js.stripe.com; style-src 'self' 'unsafe-inline' https://js.fontdue.com https://fonts.fontdue.com; font-src 'self' https://fonts.fontdue.com data:; img-src 'self' data: blob: https:; connect-src 'self' https://*.api.sanity.io https://*.sanity.io https://store.haustype.com https://js.fontdue.com https://api.stripe.com https://www.google-analytics.com https://www.googletagmanager.com; frame-src https://js.stripe.com https://hooks.stripe.com; object-src 'none'; base-uri 'self'",
};

export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
  return response;
});
