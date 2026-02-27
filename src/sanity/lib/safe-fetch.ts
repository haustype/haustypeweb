import { loadQuery } from './load-query';

const isConfigured = () => {
  const id = import.meta.env.PUBLIC_SANITY_PROJECT_ID ?? 'b5rdpzo3';
  return id && id !== 'placeholder';
};

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
  } catch {
    return { data: null, fromSanity: false };
  }
}
