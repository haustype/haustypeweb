import { safeLoadQuery } from '../sanity/lib/safe-fetch';
import { urlForImage } from '../sanity/lib/url-for-image';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

export type ScreensaverSlide = { url: string; alt: string };

export type ScreensaverOptions = {
  slides: ScreensaverSlide[];
  idleSeconds: number;
  slideSeconds: number;
  fadeSeconds: number;
};

type ScreensaverConfig =
  | {
      enabled?: boolean;
      idleSeconds?: number;
      slideSeconds?: number;
      fadeSeconds?: number;
      slides?: Array<{ image?: SanityImageSource; alt?: string }>;
    }
  | Array<{ image?: SanityImageSource; alt?: string }>;

export async function loadScreensaverOptions(): Promise<ScreensaverOptions | null> {
  const { data } = await safeLoadQuery<{
    siteSettings?: { screensaver?: ScreensaverConfig } | null;
    homepageSettings?: { screensaver?: ScreensaverConfig } | null;
  } | null>({
    query: `{
      "siteSettings": *[_type == "siteSettings"][0]{
        screensaver{
          enabled,
          idleSeconds,
          slideSeconds,
          fadeSeconds,
          slides
        }
      },
      "homepageSettings": *[_type == "homepageSettings"][0]{
        screensaver{
          enabled,
          idleSeconds,
          slideSeconds,
          fadeSeconds,
          slides
        }
      }
    }`,
  });

  const rawScreensaver =
    data?.siteSettings?.screensaver ?? data?.homepageSettings?.screensaver;
  const screensaverIsLegacyArray = Array.isArray(rawScreensaver);
  const screensaverConfig = screensaverIsLegacyArray
    ? { enabled: true, idleSeconds: 10, slideSeconds: 5, fadeSeconds: 1, slides: rawScreensaver }
    : rawScreensaver;

  if (screensaverConfig?.enabled === false) return null;

  const slides = (screensaverConfig?.slides ?? [])
    .map((item) => {
      if (!item.image) return null;
      return {
        url: urlForImage(item.image).width(2400).quality(85).url(),
        alt: item.alt?.trim() || '',
      };
    })
    .filter((slide): slide is ScreensaverSlide => Boolean(slide));

  if (!slides.length) return null;

  return {
    slides,
    idleSeconds: screensaverConfig?.idleSeconds ?? 10,
    slideSeconds: screensaverConfig?.slideSeconds ?? 5,
    fadeSeconds: screensaverConfig?.fadeSeconds ?? 1,
  };
}
