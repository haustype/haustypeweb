/**
 * Sanitize CMS HTML before set:html.
 * Keeps Fontdue custom elements; strips scripts, iframes, and inline handlers.
 *
 * Intentionally avoids isomorphic-dompurify / jsdom — those break Netlify’s
 * SSR bundle (ERR_REQUIRE_ESM on html-encoding-sniffer).
 */
export function sanitizeCmsHtml(html: string): string {
  const input = html?.trim() ?? '';
  if (!input) return '';

  return (
    input
      // Remove executable / embeddable blocks
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, '')
      .replace(/<object\b[^>]*>[\s\S]*?<\/object>/gi, '')
      .replace(/<embed\b[^>]*\/?>/gi, '')
      .replace(/<link\b[^>]*>/gi, '')
      .replace(/<meta\b[^>]*>/gi, '')
      // Strip inline event handlers (onclick, onerror, …)
      .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
      // Neutralize javascript: URLs
      .replace(/([?&]|=\s*["']?)\s*javascript:/gi, '$1')
      .replace(/(href|src|xlink:href)\s*=\s*(["'])\s*javascript:[\s\S]*?\2/gi, '$1=$2#$2')
  );
}
