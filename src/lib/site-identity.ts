import { urlForImage } from '../sanity/lib/url-for-image';
import { safeLoadQuery } from '../sanity/lib/safe-fetch';

export type SiteIdentity = {
  siteName: string;
  titleSuffix: string;
  defaultDescription: string;
  homeTitle: string;
  homeDescription: string;
  faviconUrl: string | null;
  appleTouchIconUrl: string | null;
  defaultShareImageUrl: string | null;
  themeColor: string;
  twitterHandle: string | null;
  googleAnalyticsId: string | null;
};

const DEFAULTS: SiteIdentity = {
  siteName: '',
  titleSuffix: '',
  defaultDescription: '',
  homeTitle: '',
  homeDescription: '',
  faviconUrl: null,
  appleTouchIconUrl: null,
  defaultShareImageUrl: null,
  themeColor: '#eeeeee',
  twitterHandle: null,
  googleAnalyticsId: null,
};

type SiteIdentitySource = {
  siteIdentity?: {
    siteName?: string | null;
    titleSuffix?: string | null;
    defaultDescription?: string | null;
    homeTitle?: string | null;
    homeDescription?: string | null;
    favicon?: unknown;
    appleTouchIcon?: unknown;
    defaultShareImage?: unknown;
    faviconUrl?: string | null;
    appleTouchIconUrl?: string | null;
    defaultShareImageUrl?: string | null;
    themeColor?: string | null;
    twitterHandle?: string | null;
    googleAnalyticsId?: string | null;
  } | null;
  customCode?: { headEnd?: string | null; bodyEnd?: string | null } | null;
};

const siteIdentityQuery = `*[_type == "siteSettings"][0]{
  siteIdentity {
    siteName,
    titleSuffix,
    defaultDescription,
    homeTitle,
    homeDescription,
    themeColor,
    twitterHandle,
    googleAnalyticsId,
    favicon,
    appleTouchIcon,
    defaultShareImage,
    "faviconUrl": favicon.asset->url,
    "appleTouchIconUrl": appleTouchIcon.asset->url,
    "defaultShareImageUrl": defaultShareImage.asset->url
  },
  customCode { headEnd, bodyEnd }
}`;

function imageUrl(source: unknown, width?: number) {
  if (!source) return null;
  try {
    let builder = urlForImage(source as Parameters<typeof urlForImage>[0]);
    if (width) builder = builder.width(width);
    return builder.url();
  } catch {
    return null;
  }
}

function trim(value: string | null | undefined) {
  return value?.trim() ?? '';
}

export async function loadSiteSettings() {
  const { data } = await safeLoadQuery<SiteIdentitySource | null>({
    query: siteIdentityQuery,
  });

  const identity = data?.siteIdentity;
  const shareImage =
    identity?.defaultShareImageUrl ??
    imageUrl(identity?.defaultShareImage as unknown, 1200);

  const siteIdentity: SiteIdentity = {
    siteName: trim(identity?.siteName) || DEFAULTS.siteName,
    titleSuffix: identity?.titleSuffix != null && trim(identity.titleSuffix) !== ''
      ? trim(identity.titleSuffix)
      : DEFAULTS.titleSuffix,
    defaultDescription: trim(identity?.defaultDescription) || DEFAULTS.defaultDescription,
    homeTitle: trim(identity?.homeTitle) || DEFAULTS.homeTitle,
    homeDescription: trim(identity?.homeDescription),
    faviconUrl: identity?.faviconUrl ?? imageUrl(identity?.favicon as unknown),
    appleTouchIconUrl:
      identity?.appleTouchIconUrl ?? imageUrl(identity?.appleTouchIcon as unknown, 180),
    defaultShareImageUrl: shareImage,
    themeColor: trim(identity?.themeColor) || DEFAULTS.themeColor,
    twitterHandle: trim(identity?.twitterHandle) || null,
    googleAnalyticsId: trim(identity?.googleAnalyticsId) || null,
  };

  return {
    siteIdentity,
    customCode: {
      headEnd: data?.customCode?.headEnd?.trim() ?? '',
      bodyEnd: data?.customCode?.bodyEnd?.trim() ?? '',
    },
  };
}

export function buildDocumentTitle(pageTitle: string, identity: SiteIdentity) {
  const suffix = identity.titleSuffix;
  if (suffix && pageTitle.endsWith(suffix.trim())) return pageTitle;
  return `${pageTitle}${suffix}`;
}

export function faviconMimeType(url: string) {
  const path = url.split('?')[0].toLowerCase();
  if (path.endsWith('.svg')) return 'image/svg+xml';
  if (path.endsWith('.png')) return 'image/png';
  if (path.endsWith('.webp')) return 'image/webp';
  if (path.endsWith('.ico')) return 'image/x-icon';
  return undefined;
}
