import { urlForImage } from '../sanity/lib/url-for-image';
import type { SanityImageValue } from './sanity-image';

export function isSvgImage(image?: SanityImageValue | null): boolean {
  const mime = image?.asset?.mimeType?.toLowerCase();
  if (mime === 'image/svg+xml') return true;

  const extension = image?.asset?.extension?.toLowerCase();
  if (extension === 'svg') return true;

  const ref = image?.asset?._ref?.toLowerCase() ?? '';
  if (ref.endsWith('-svg') || ref.includes('-svg')) return true;

  const url = image?.asset?.url?.toLowerCase() ?? '';
  return url.endsWith('.svg') || url.includes('.svg?');
}

export function getSvgAssetUrl(image: SanityImageValue): string | null {
  if (image.asset?.url) return image.asset.url;
  if (!image.asset?._ref) return null;
  return urlForImage(image).url();
}

export function sanitizeInlineSvg(svg: string): string {
  return svg
    .replace(/<\?xml[\s\S]*?\?>/gi, '')
    .replace(/<!DOCTYPE[\s\S]*?>/gi, '')
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/href\s*=\s*(["'])javascript:[^"']*\1/gi, '');
}

export async function fetchSvgMarkup(image: SanityImageValue): Promise<string> {
  const url = getSvgAssetUrl(image);
  if (!url) return '';

  try {
    const response = await fetch(url);
    if (!response.ok) return '';
    const text = sanitizeInlineSvg(await response.text());
    if (!/<svg[\s>]/i.test(text)) return '';
    return text;
  } catch {
    return '';
  }
}
