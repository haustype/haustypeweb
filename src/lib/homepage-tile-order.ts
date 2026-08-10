export type HomepageTileImage = {
  _key?: string;
  alt?: string;
  width?: string;
  padding?: {
    top?: number | null;
    right?: number | null;
    bottom?: number | null;
    left?: number | null;
  } | null;
  image?: {
    asset?: { _ref?: string };
    crop?: unknown;
    hotspot?: unknown;
  };
};

export type TypefaceHomepageSource = {
  _id: string;
  name?: string;
  slug?: { current?: string };
  homepageImages?: HomepageTileImage[];
};

export type HomepageTileOrderItem = {
  _key?: string;
  imageKey?: string;
  typeface?: { _ref?: string } | TypefaceHomepageSource | null;
};

export function homepageTileId(typefaceId: string, imageKey: string) {
  return `${typefaceId}:${imageKey}`;
}

export function flattenTypefaceHomepageTiles(typefaces: TypefaceHomepageSource[]): HomepageTileOrderItem[] {
  const tiles: HomepageTileOrderItem[] = [];

  for (const typeface of typefaces) {
    for (const image of typeface.homepageImages ?? []) {
      if (!image._key || !image.image?.asset) continue;
      tiles.push({
        _key: `tile-${image._key}`,
        imageKey: image._key,
        typeface: {
          _id: typeface._id,
          name: typeface.name,
          slug: typeface.slug,
          homepageImages: typeface.homepageImages,
        },
      });
    }
  }

  return tiles;
}

export function mergeHomepageTileOrder(
  saved: HomepageTileOrderItem[] | null | undefined,
  available: HomepageTileOrderItem[],
  options?: { appendMissing?: boolean },
): HomepageTileOrderItem[] {
  const appendMissing = options?.appendMissing ?? true;
  const availableById = new Map(
    available
      .filter((tile) => tile.imageKey && tile.typeface && '_id' in tile.typeface && tile.typeface._id)
      .map((tile) => [
        homepageTileId((tile.typeface as TypefaceHomepageSource)._id, tile.imageKey!),
        tile,
      ]),
  );

  const ordered: HomepageTileOrderItem[] = [];

  for (const item of saved ?? []) {
    const ref =
      item.typeface && '_ref' in item.typeface
        ? item.typeface._ref
        : item.typeface && '_id' in item.typeface
          ? item.typeface._id
          : undefined;
    const imageKey = item.imageKey?.trim();
    if (!ref || !imageKey) continue;

    // Draft refs (`drafts.*`) and published ids should match the same typeface tile.
    const normalizedRef = ref.replace(/^drafts\./, '');
    const tile =
      availableById.get(homepageTileId(ref, imageKey)) ??
      availableById.get(homepageTileId(normalizedRef, imageKey)) ??
      availableById.get(homepageTileId(`drafts.${normalizedRef}`, imageKey));
    if (tile) {
      ordered.push(tile);
      const typeface = tile.typeface as TypefaceHomepageSource;
      availableById.delete(homepageTileId(typeface._id, imageKey));
      availableById.delete(homepageTileId(normalizedRef, imageKey));
      availableById.delete(homepageTileId(`drafts.${normalizedRef}`, imageKey));
    }
  }

  if (appendMissing) {
    for (const tile of available) {
      const typeface = tile.typeface as TypefaceHomepageSource | undefined;
      if (!typeface?._id || !tile.imageKey) continue;
      if (availableById.has(homepageTileId(typeface._id, tile.imageKey))) {
        ordered.push(tile);
      }
    }
  }

  return ordered;
}
