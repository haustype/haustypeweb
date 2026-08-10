import type { FontsInUseMosaicItem } from '../components/FontsInUseMosaic.astro';
import { inUseImageUrlWidth, resolveInUseImageWidth } from './fonts-in-use-mosaic';
import { urlForImage } from '../sanity/lib/url-for-image';

export const galleryItemProjection = `{
  mediaType,
  alt,
  caption,
  width,
  typeface->{
    name,
    slug
  },
  designerLink {
    label,
    url
  },
  image {
    asset,
    crop,
    hotspot
  },
  video {
    asset->{
      url,
      mimeType
    }
  },
  poster {
    asset,
    crop,
    hotspot
  }
}`;

type RawGalleryItem = {
  mediaType?: 'image' | 'video';
  alt?: string;
  caption?: string;
  width?: string;
  typeface?: {
    name?: string;
    slug?: { current?: string };
  } | null;
  designerLink?: {
    label?: string;
    url?: string;
  } | null;
  image?: {
    asset?: { _ref?: string };
    crop?: unknown;
    hotspot?: unknown;
  };
  video?: {
    asset?: {
      url?: string;
      mimeType?: string;
    } | null;
  } | null;
  poster?: {
    asset?: { _ref?: string };
    crop?: unknown;
    hotspot?: unknown;
  } | null;
};

function resolveGalleryAlt(item: RawGalleryItem): string {
  return item.alt?.trim() || item.caption?.trim() || item.typeface?.name?.trim() || 'Gallery media';
}

function resolveTypeface(item: RawGalleryItem): FontsInUseMosaicItem['typeface'] {
  const typefaceSlug = item.typeface?.slug?.current?.trim();
  if (!typefaceSlug || !item.typeface?.name) return undefined;
  return { name: item.typeface.name, slug: typefaceSlug };
}

function resolveDesignerLink(item: RawGalleryItem): FontsInUseMosaicItem['designerLink'] {
  const url = item.designerLink?.url?.trim();
  if (!url) return undefined;
  return {
    label: item.designerLink?.label?.trim() || 'Source',
    url,
  };
}

export function mapGalleryItems(rawItems: RawGalleryItem[] = []): FontsInUseMosaicItem[] {
  return rawItems
    .map((item) => {
      const imageWidth = resolveInUseImageWidth(item.width);
      const typeface = resolveTypeface(item);
      const designerLink = resolveDesignerLink(item);
      const alt = resolveGalleryAlt(item);
      const caption = item.caption?.trim() || undefined;
      const mediaType = item.mediaType === 'video' ? 'video' : 'image';

      if (mediaType === 'video') {
        const videoUrl = item.video?.asset?.url?.trim();
        if (!videoUrl) return null;

        const posterUrl = item.poster?.asset
          ? urlForImage(item.poster)
              .width(inUseImageUrlWidth(imageWidth))
              .auto('format')
              .quality(90)
              .url()
          : undefined;

        return {
          mediaType: 'video',
          url: videoUrl,
          alt,
          caption,
          posterUrl,
          width: imageWidth,
          typeface,
          designerLink,
        };
      }

      if (!item.image?.asset) return null;

      return {
        mediaType: 'image',
        url: urlForImage(item.image)
          .width(inUseImageUrlWidth(imageWidth))
          .auto('format')
          .quality(90)
          .url(),
        alt,
        caption,
        width: imageWidth,
        typeface,
        designerLink,
      };
    })
    .filter((item): item is FontsInUseMosaicItem => Boolean(item));
}
