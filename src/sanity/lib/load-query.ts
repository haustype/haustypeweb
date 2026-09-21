import type { QueryParams } from 'sanity';
import { sanityClient } from 'sanity:client';

export async function loadQuery<QueryResponse>({
  query,
  params,
}: {
  query: string;
  params?: QueryParams;
}) {
  const { result } = await sanityClient.fetch<QueryResponse>(query, params ?? {}, {
    filterResponse: false,
    // CDN is fast but can lag after Studio publishes (~tens of seconds).
    // Use the API in dev so local edits show immediately.
    useCdn: import.meta.env.PROD,
  });

  return { data: result };
}
