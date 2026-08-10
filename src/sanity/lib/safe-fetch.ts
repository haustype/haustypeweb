import { loadQuery } from './load-query';

/** Match astro.config.mjs Sanity defaults so production works even if env vars are missing. */
const FALLBACK_PROJECT_ID = 'b5rdpzo3';

const isConfigured = () =>
  Boolean((import.meta.env.PUBLIC_SANITY_PROJECT_ID ?? FALLBACK_PROJECT_ID).trim());

export async function safeLoadQuery<QueryResponse>(args: {
  query: string;
  params?: Record<string, unknown>;
}): Promise<{ data: QueryResponse | null; fromSanity: boolean }> {
  if (!isConfigured()) {
    return { data: null, fromSanity: false };
  }
  try {
    const { data } = await loadQuery<QueryResponse>(args);
    return { data, fromSanity: true };
  } catch (error) {
    console.error('[sanity] query failed', error);
    return { data: null, fromSanity: false };
  }
}
