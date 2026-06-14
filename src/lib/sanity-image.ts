export type SanityImageFit = 'contain' | 'cover';
export type SanityImageAspect = 'auto' | '2/1' | '4/3' | '16/9' | '4/5';

export type SanityImageColumnSpan = '6' | '9';

export interface SanityImageValue {
  asset?: { _ref?: string; _type?: string };
  crop?: { top?: number; bottom?: number; left?: number; right?: number };
  hotspot?: { x?: number; y?: number; width?: number; height?: number };
  alt?: string;
  aspectRatio?: SanityImageAspect | string;
  fit?: SanityImageFit | string;
  columnSpan?: SanityImageColumnSpan | string;
}

/** GROQ projection — include crop + hotspot so Studio cropping is applied. */
export const sanityImageProjection = `{
  alt,
  asset,
  crop,
  hotspot,
  aspectRatio,
  fit,
  columnSpan
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
  return span === '9' ? 'sanity-image--span-9' : 'sanity-image--span-6';
}

export function parseAspectRatio(ratio?: string | null): number | null {
  if (!ratio || ratio === 'auto') return null;
  const [w, h] = ratio.split('/').map(Number);
  if (!w || !h) return null;
  return w / h;
}
