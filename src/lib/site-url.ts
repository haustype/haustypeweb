/**
 * Canonical public site origin (no trailing slash).
 * Prefer PUBLIC_SITE_URL; apex haustype.com redirects to www.
 */
export function getSiteOrigin(): string {
  const fromEnv = import.meta.env.PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, '');

  const fromAstro = import.meta.env.SITE?.trim();
  if (fromAstro) return fromAstro.replace(/\/$/, '');

  return 'https://www.haustype.com';
}

export function absoluteUrl(path: string): string {
  const origin = getSiteOrigin();
  if (!path || path === '/') return `${origin}/`;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${origin}${normalized}`;
}
