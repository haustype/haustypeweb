import { FONTDUE_STORE_URL } from './fontdue-config';

export type FontdueCollectionOffer = {
  price: string;
  priceCurrency: string;
  url: string;
};

type FontCollectionNode = {
  name?: string | null;
  slug?: { name?: string | null } | null;
  /** Discounted full-family / collection SKU price (what “buy the family” costs). */
  sku?: { price?: { amount?: number | null; currency?: string | null } | null } | null;
  /** Sum of individual style prices — usually higher than the family deal. */
  totalStylesPrice?: { amount?: number | null; currency?: string | null } | null;
  url?: string | null;
};

type OfferCache = {
  fetchedAt: number;
  bySlug: Map<string, FontdueCollectionOffer>;
};

const CACHE_TTL_MS = 10 * 60 * 1000;
let offerCache: OfferCache | null = null;
let offerCachePromise: Promise<OfferCache | null> | null = null;

async function loadOfferCache(): Promise<OfferCache | null> {
  const endpoint = `${FONTDUE_STORE_URL.replace(/\/$/, '')}/graphql`;
  const query = `{
    viewer {
      fontCollections(first: 100) {
        edges {
          node {
            name
            slug { name }
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

    const bySlug = new Map<string, FontdueCollectionOffer>();
    for (const edge of json.data?.viewer?.fontCollections?.edges ?? []) {
      const node = edge.node;
      const slug = node?.slug?.name?.trim();
      // Prefer collection SKU (family discount) over sum-of-styles.
      const money = node?.sku?.price ?? node?.totalStylesPrice;
      const amount = money?.amount;
      const currency = money?.currency?.trim();
      if (!slug || amount == null || !currency || amount < 0) continue;
      bySlug.set(slug, {
        price: (amount / 100).toFixed(2),
        priceCurrency: currency,
        url:
          node?.url?.trim() ||
          `${FONTDUE_STORE_URL.replace(/\/$/, '')}/fonts/${slug}`,
      });
    }

    return { fetchedAt: Date.now(), bySlug };
  } catch {
    return null;
  }
}

/**
 * Fetch the buy-the-family price for a Fontdue collection by slug.
 * Uses collection SKU price (discounted family deal). Amounts are minor units
 * (e.g. 9900 → 99.00 EUR). Falls back to sum-of-styles if SKU price is missing.
 */
export async function fetchFontdueCollectionOffer(
  slug: string,
): Promise<FontdueCollectionOffer | null> {
  const normalized = slug.trim();
  if (!normalized) return null;

  if (offerCache && Date.now() - offerCache.fetchedAt < CACHE_TTL_MS) {
    return offerCache.bySlug.get(normalized) ?? null;
  }

  if (!offerCachePromise) {
    offerCachePromise = loadOfferCache().finally(() => {
      offerCachePromise = null;
    });
  }

  const next = await offerCachePromise;
  if (next) offerCache = next;
  return offerCache?.bySlug.get(normalized) ?? null;
}
