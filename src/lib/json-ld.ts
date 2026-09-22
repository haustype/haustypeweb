export type JsonLd = Record<string, unknown> | Array<Record<string, unknown>>;

export function organizationJsonLd(opts: {
  name: string;
  url: string;
  description?: string;
  logoUrl?: string | null;
}): Record<string, unknown> {
  const org: Record<string, unknown> = {
    '@type': 'Organization',
    '@id': `${opts.url}#organization`,
    name: opts.name,
    url: opts.url,
  };
  if (opts.description) org.description = opts.description;
  if (opts.logoUrl) {
    org.logo = {
      '@type': 'ImageObject',
      url: opts.logoUrl,
    };
  }
  return org;
}

export function webSiteJsonLd(opts: {
  name: string;
  url: string;
  description?: string;
}): Record<string, unknown> {
  return {
    '@type': 'WebSite',
    '@id': `${opts.url}#website`,
    name: opts.name,
    url: opts.url,
    ...(opts.description ? { description: opts.description } : {}),
    publisher: { '@id': `${opts.url}#organization` },
  };
}

export function typefaceJsonLd(opts: {
  name: string;
  description: string;
  url: string;
  imageUrl?: string | null;
  siteUrl: string;
}): Record<string, unknown> {
  return {
    '@type': 'Product',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    ...(opts.imageUrl ? { image: opts.imageUrl } : {}),
    brand: {
      '@type': 'Brand',
      name: 'Haus Type',
    },
    category: 'Fonts',
    isPartOf: { '@id': `${opts.siteUrl}#website` },
  };
}

/** Build a JSON-LD graph for <script type="application/ld+json">. */
export function jsonLdScript(nodes: Array<Record<string, unknown>>): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': nodes,
  });
}
