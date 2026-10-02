import { FONTDUE_STORE_URL } from './fontdue-config';

export type FontdueCollectionOffer = {
  price: string;
  priceCurrency: string;
  url: string;
};

export type FontdueCollectionInfo = {
  offer: FontdueCollectionOffer | null;
  totalStyles: number | null;
  designYear: string | null;
  designers: string | null;
};

type FontCollectionNode = {
  name?: string | null;
  slug?: { name?: string | null } | null;
  totalStyles?: number | null;
  designYear?: string | null;
  designers?: Array<{ name?: string | null } | null> | null;
  /** Discounted full-family / collection SKU price (what “buy the family” costs). */
  sku?: { price?: { amount?: number | null; currency?: string | null } | null } | null;
  /** Sum of individual style prices — usually higher than the family deal. */
  totalStylesPrice?: { amount?: number | null; currency?: string | null } | null;
  url?: string | null;
};

type OfferCache = {
  fetchedAt: number;
  bySlug: Map<string, FontdueCollectionInfo>;
};

const CACHE_TTL_MS = 10 * 60 * 1000;
let offerCache: OfferCache | null = null;
let offerCachePromise: Promise<OfferCache | null> | null = null;

function joinDesignerNames(designers: FontCollectionNode['designers']): string | null {
  const names = (designers ?? [])
    .map((d) => d?.name?.trim())
    .filter((name): name is string => Boolean(name));
  return names.length ? names.join(', ') : null;
}

async function loadOfferCache(): Promise<OfferCache | null> {
  const endpoint = `${FONTDUE_STORE_URL.replace(/\/$/, '')}/graphql`;
  const query = `{
    viewer {
      fontCollections(first: 100) {
        edges {
          node {
            name
            slug { name }
            totalStyles
            designYear
            designers { name }
            sku { price { amount currency } }
            totalStylesPrice { amount currency }
            url
          }
        }
      }
    }
  }`;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ query }),
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!res.ok) return null;
    const json = (await res.json()) as {
      data?: {
        viewer?: {
          fontCollections?: { edges?: Array<{ node?: FontCollectionNode | null }> };
        };
      };
    };

    const bySlug = new Map<string, FontdueCollectionInfo>();
    for (const edge of json.data?.viewer?.fontCollections?.edges ?? []) {
      const node = edge.node;
      const slug = node?.slug?.name?.trim();
      if (!slug) continue;

      const totalStyles =
        typeof node?.totalStyles === 'number' && node.totalStyles > 0
          ? node.totalStyles
          : null;
      const designYear = node?.designYear?.trim() || null;
      const designers = joinDesignerNames(node?.designers);

      // Prefer collection SKU (family discount) over sum-of-styles.
      const money = node?.sku?.price ?? node?.totalStylesPrice;
      const amount = money?.amount;
      const currency = money?.currency?.trim();
      const offer =
        amount != null && currency && amount >= 0
          ? {
              price: (amount / 100).toFixed(2),
              priceCurrency: currency,
              url:
                node?.url?.trim() ||
                `${FONTDUE_STORE_URL.replace(/\/$/, '')}/fonts/${slug}`,
            }
          : null;

      bySlug.set(slug, { offer, totalStyles, designYear, designers });
    }

    return { fetchedAt: Date.now(), bySlug };
  } catch {
    return null;
  }
}

async function getOfferCache(): Promise<OfferCache | null> {
  if (offerCache && Date.now() - offerCache.fetchedAt < CACHE_TTL_MS) {
    return offerCache;
  }

  if (!offerCachePromise) {
    offerCachePromise = loadOfferCache().finally(() => {
      offerCachePromise = null;
    });
  }

  const next = await offerCachePromise;
  if (next) offerCache = next;
  return offerCache;
}

/**
 * Fetch Fontdue collection info (offer, style count, design year, designers) by slug.
 */
export async function fetchFontdueCollectionInfo(
  slug: string,
): Promise<FontdueCollectionInfo | null> {
  const normalized = slug.trim();
  if (!normalized) return null;
  const cache = await getOfferCache();
  return cache?.bySlug.get(normalized) ?? null;
}

/**
 * Fetch the buy-the-family price for a Fontdue collection by slug.
 */
export async function fetchFontdueCollectionOffer(
  slug: string,
): Promise<FontdueCollectionOffer | null> {
  const info = await fetchFontdueCollectionInfo(slug);
  return info?.offer ?? null;
}
