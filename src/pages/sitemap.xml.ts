import type { APIRoute } from 'astro';
import { safeLoadQuery } from '../sanity/lib/safe-fetch';
import { typefaceSlug } from '../lib/typeface';
import { absoluteUrl } from '../lib/site-url';

export const prerender = false;

type SitemapEntry = {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
};

function xmlEscape(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toLastmod(value?: string | null) {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
}

function renderUrlset(entries: SitemapEntry[]) {
  const body = entries
    .map((entry) => {
      const parts = [`    <loc>${xmlEscape(entry.loc)}</loc>`];
      if (entry.lastmod) parts.push(`    <lastmod>${xmlEscape(entry.lastmod)}</lastmod>`);
      if (entry.changefreq) parts.push(`    <changefreq>${entry.changefreq}</changefreq>`);
      if (entry.priority != null) {
        parts.push(`    <priority>${entry.priority.toFixed(1)}</priority>`);
      }
      return `  <url>\n${parts.join('\n')}\n  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

export const GET: APIRoute = async () => {
  const { data } = await safeLoadQuery<{
    typefaces?: Array<{
      name?: string;
      slug?: { current?: string };
      _updatedAt?: string;
    }>;
    pages?: Array<{
      slug?: { current?: string };
      _updatedAt?: string;
    }>;
    posts?: Array<{
      slug?: { current?: string };
      publishedAt?: string;
      _updatedAt?: string;
    }>;
  } | null>({
    query: `{
      "typefaces": *[_type == "typeface"] | order(orderRank) {
        name,
        slug,
        _updatedAt
      },
      "pages": *[_type == "page" && defined(slug.current)] | order(title asc) {
        slug,
        _updatedAt
      },
      "posts": *[_type == "post" && defined(slug.current) && !draft] | order(publishedAt desc) {
        slug,
        publishedAt,
        _updatedAt
      }
    }`,
  });

  const entries: SitemapEntry[] = [
    { loc: absoluteUrl('/'), changefreq: 'weekly', priority: 1 },
    { loc: absoluteUrl('/typefaces'), changefreq: 'weekly', priority: 0.9 },
    { loc: absoluteUrl('/blog'), changefreq: 'weekly', priority: 0.7 },
  ];

  for (const typeface of data?.typefaces ?? []) {
    const slug = typefaceSlug(typeface);
    if (!slug) continue;
    entries.push({
      loc: absoluteUrl(`/typefaces/${slug}`),
      lastmod: toLastmod(typeface._updatedAt),
      changefreq: 'monthly',
      priority: 0.8,
    });
  }

  for (const page of data?.pages ?? []) {
    const slug = page.slug?.current?.trim();
    if (!slug) continue;
    entries.push({
      loc: absoluteUrl(`/${slug}`),
      lastmod: toLastmod(page._updatedAt),
      changefreq: 'monthly',
      priority: 0.7,
    });
  }

  for (const post of data?.posts ?? []) {
    const slug = post.slug?.current?.trim();
    if (!slug) continue;
    entries.push({
      loc: absoluteUrl(`/blog/${slug}`),
      lastmod: toLastmod(post.publishedAt ?? post._updatedAt),
      changefreq: 'monthly',
      priority: 0.6,
    });
  }

  return new Response(renderUrlset(entries), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  });
};
