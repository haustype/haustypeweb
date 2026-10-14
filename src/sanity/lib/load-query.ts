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
    // Live API so Studio publishes show on the next request (CDN can lag minutes).
    // Fine for this site’s traffic; revisit CDN only if Sanity API rate limits become an issue.
    useCdn: false,
  });

  return { data: result };
}
