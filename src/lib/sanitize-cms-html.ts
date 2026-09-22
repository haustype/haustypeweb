/**
 * Sanitize CMS HTML before set:html.
 * Allows Fontdue custom elements used in page embeds; strips scripts and handlers.
 */
import DOMPurify from 'isomorphic-dompurify';

const FONTDUE_TAGS = [
  'fontdue-buy-button',
  'fontdue-character-viewer',
  'fontdue-customer-login-form',
  'fontdue-store-modal',
  'fontdue-test-fonts-form',
  'fontdue-type-tester',
  'fontdue-type-testers',
];

const FONTDUE_ATTRS = [
  'collection',
  'collection-id',
  'collection-slug',
  'family-name',
  'font-name',
  'fontdue-click',
  'fontdue-store-route',
];

export function sanitizeCmsHtml(html: string): string {
  const input = html?.trim() ?? '';
  if (!input) return '';
  return DOMPurify.sanitize(input, {
    USE_PROFILES: { html: true },
    ADD_TAGS: FONTDUE_TAGS,
    ADD_ATTR: FONTDUE_ATTRS,
  });
}
