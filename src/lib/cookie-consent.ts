/** localStorage key for analytics cookie consent. */
export const COOKIE_CONSENT_KEY = 'cookie-consent';

export type CookieConsentValue = 'accepted' | 'rejected';

export function isCookieConsentValue(value: unknown): value is CookieConsentValue {
  return value === 'accepted' || value === 'rejected';
}
