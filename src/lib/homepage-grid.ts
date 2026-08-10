import type { InUseImageWidth } from './fonts-in-use-mosaic';
import { inUseImageUrlWidth, resolveInUseImageWidth } from './fonts-in-use-mosaic';
import {
  boxPaddingStyle,
  resolveAboutBoxPadding,
  resolveBoxPadding,
  type BoxPaddingValue,
  type ResolvedBoxPadding,
} from './box-padding';
import {
  flattenTypefaceHomepageTiles,
  mergeHomepageTileOrder,
  type HomepageTileOrderItem,
  type TypefaceHomepageSource,
} from './homepage-tile-order';
import { urlForImage } from '../sanity/lib/url-for-image';

export type HomeMosaicAboutTile = {
  kind: 'about';
  text: string;
  width: InUseImageWidth;
  padding: ResolvedBoxPadding;
  paddingStyle: string;
};

export type HomeMosaicImageTile = {
  kind: 'image';
  url: string;
  alt: string;
  width: InUseImageWidth;
  padding: ResolvedBoxPadding;
  paddingStyle: string;
  typeface: {
    name: string;
    slug: string;
  };
};

export type HomeMosaicTile = HomeMosaicAboutTile | HomeMosaicImageTile;

type RawHomepageImage = {
  _key?: string;
  alt?: string;
  width?: string;
  padding?: BoxPaddingValue | null;
  image?: {
    asset?: { _ref?: string };
    crop?: unknown;
    hotspot?: unknown;
  };
};

type RawTileOrder = HomepageTileOrderItem & {
  typeface?: {
    name?: string;
    slug?: { current?: string };
    homepageImages?: RawHomepageImage[];
  } | null;
};

type LegacyGridItem = RawTileOrder & {
  itemType?: 'about' | 'typefaceImage';
  width?: string;
};

function mapImageTile(item: RawTileOrder): HomeMosaicImageTile | null {
  const slug = item.typeface?.slug?.current?.trim();
  const name = item.typeface?.name?.trim();
  const imageKey = item.imageKey?.trim();
  if (!slug || !name || !imageKey) return null;

  const image = item.typeface?.homepageImages?.find((entry) => entry._key === imageKey);
  if (!image?.image?.asset) return null;

  const width = resolveInUseImageWidth(image.width);
  const padding = resolveBoxPadding(image.padding);

  return {
    kind: 'image',
    url: urlForImage(image.image)
      .width(inUseImageUrlWidth(width))
      .auto('format')
      .quality(90)
      .url(),
    alt: image.alt?.trim() || name,
    width,
    padding,
    paddingStyle: boxPaddingStyle(padding),
    typeface: { name, slug },
  };
}

export function mapHomepageGrid(
  savedOrder: RawTileOrder[] | null | undefined,
  aboutText: string,
  typefaces: TypefaceHomepageSource[] | null | undefined,
  legacyGrid?: LegacyGridItem[] | null,
  aboutPadding?: BoxPaddingValue | null,
): HomeMosaicTile[] {
  const text = aboutText.trim();
  const availableTiles = flattenTypefaceHomepageTiles(typefaces ?? []);
  const savedTiles =
    savedOrder?.length
      ? savedOrder
      : (legacyGrid ?? []).filter((item) => item.itemType !== 'about');

  // Only render tiles that are in the saved Homepage Settings order.
  // New typeface images appear in Studio first; they are not auto-appended on the site
  // (that used to push “missing” tiles to the end and fight the CMS order).
  const orderedItems = mergeHomepageTileOrder(savedTiles, availableTiles, {
    appendMissing: !savedTiles?.length,
  });

  const imageTiles = orderedItems
    .map((item) => mapImageTile(item))
    .filter((tile): tile is HomeMosaicImageTile => Boolean(tile));

  if (text) {
    const padding = resolveAboutBoxPadding(aboutPadding);
    return [
      {
        kind: 'about',
        text,
        width: '25',
        padding,
        paddingStyle: boxPaddingStyle(padding),
      },
      ...imageTiles,
    ];
  }

  return imageTiles;
}

const boxPaddingProjection = `padding {
  top,
  right,
  bottom,
  left
}`;

const typefaceHomepageImagesProjection = `homepageImages[]{
  _key,
  alt,
  width,
  ${boxPaddingProjection},
  image {
    asset,
    crop,
    hotspot
  }
}`;

const homepageSettingsProjection = `{
  aboutText,
  aboutPadding {
    top,
    right,
    bottom,
    left
  },
  fontsInUse,
  grid[]{
    _key,
    itemType,
    width,
    imageKey,
    typeface->{
      _id,
      name,
      slug,
      ${typefaceHomepageImagesProjection}
    }
  },
  tiles[]{
    _key,
    imageKey,
    typeface->{
      _id,
      name,
      slug,
      ${typefaceHomepageImagesProjection}
    }
  }
}`;

export const homepageQuery = `{
  "settings": *[_type == "homepageSettings"][0]${homepageSettingsProjection},
  "typefaces": *[_type == "typeface" && count(homepageImages) > 0] | order(orderRank, name asc) {
    _id,
    name,
    slug,
    ${typefaceHomepageImagesProjection}
  }
}`;

/** @deprecated Use homepageQuery */
export const homepageGridProjection = homepageSettingsProjection;
