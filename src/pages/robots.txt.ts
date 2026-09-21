import type { APIRoute } from 'astro';
import { absoluteUrl } from '../lib/site-url';

export const prerender = false;

export const GET: APIRoute = () => {
  const body = `User-agent: *
Allow: /

Sitemap: ${absoluteUrl('/sitemap.xml')}
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  });
};
