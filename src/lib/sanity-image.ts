import type { BoxPaddingValue } from './box-padding';

export type SanityImageFit = 'contain' | 'cover';
export type SanityImageAspect = 'auto' | '2/1' | '4/3' | '16/9' | '4/5';

export type SanityImageColumnSpan = '6' | '7' | '8' | '9';

export interface SanityImageValue {
  asset?: {
    _ref?: string;
    _type?: string;
    mimeType?: string;
    extension?: string;
    url?: string;
  };
  crop?: { top?: number; bottom?: number; left?: number; right?: number };
  hotspot?: { x?: number; y?: number; width?: number; height?: number };
  alt?: string;
  aspectRatio?: SanityImageAspect | string;
  fit?: SanityImageFit | string;
  columnSpan?: SanityImageColumnSpan | string;
  padding?: BoxPaddingValue | null;
  roundedCorners?: boolean | null;
  followSiteColor?: boolean | null;
}

/** GROQ projection — include crop + hotspot so Studio cropping is applied. */
export const sanityImageProjection = `{
  alt,
  asset {
    _ref,
    _type,
    "mimeType": asset->mimeType,
    "extension": asset->extension,
    "url": asset->url
  },
  crop,
  hotspot,
  aspectRatio,
  fit,
  columnSpan,
  padding {
    top,
    right,
    bottom,
    left
  },
  roundedCorners,
  followSiteColor
}`;

const ASPECT_CLASS: Record<string, string> = {
  auto: '',
  '2/1': 'aspect-[2/1]',
  '4/3': 'aspect-[4/3]',
  '16/9': 'aspect-video',
  '4/5': 'aspect-[4/5]',
};

export function aspectClass(ratio?: string | null) {
  if (!ratio || ratio === 'auto') return '';
  return ASPECT_CLASS[ratio] ?? '';
}

export function hotspotObjectPosition(hotspot?: SanityImageValue['hotspot']) {
  if (hotspot?.x == null || hotspot?.y == null) return 'center';
  return `${hotspot.x * 100}% ${hotspot.y * 100}%`;
}

export function imageColumnSpanClass(span?: string | null) {
  if (span === '9') return 'sanity-image--span-9';
  if (span === '8') return 'sanity-image--span-8';
  if (span === '7') return 'sanity-image--span-7';
  return 'sanity-image--span-6';
}

export function parseAspectRatio(ratio?: string | null): number | null {
  if (!ratio || ratio === 'auto') return null;
  const [w, h] = ratio.split('/').map(Number);
  if (!w || !h) return null;
  return w / h;
}

/** Parse pixel dimensions from Sanity asset refs or CDN URLs (`…-600x750.webp`). */
export function sanityAssetDimensions(
  asset?: { _ref?: string; url?: string } | null,
): { width: number; height: number } | null {
  const ref = asset?._ref;
  if (ref) {
    const match = ref.match(/-(\d+)x(\d+)-\w+$/);
    if (match) return { width: Number(match[1]), height: Number(match[2]) };
  }
  const url = asset?.url;
  if (url) {
    const match = url.match(/-(\d+)x(\d+)\.\w+(?:\?|$)/);
    if (match) return { width: Number(match[1]), height: Number(match[2]) };
  }
  return null;
}

/** Never request a CDN width above the cropped source — upscaling looks soft. */
export function cappedSanityImageWidth(
  image: Pick<SanityImageValue, 'asset' | 'crop'> | null | undefined,
  desiredWidth: number,
): number {
  const dims = sanityAssetDimensions(image?.asset);
  if (!dims) return desiredWidth;

  let nativeWidth = dims.width;
  const crop = image?.crop;
  if (crop) {
    const left = crop.left ?? 0;
    const right = crop.right ?? 0;
    nativeWidth = Math.round(nativeWidth * (1 - left - right));
  }

  return Math.min(desiredWidth, nativeWidth);
}
