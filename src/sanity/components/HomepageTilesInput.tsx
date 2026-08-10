import { DragHandleIcon } from '@sanity/icons';
import imageUrlBuilder from '@sanity/image-url';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Card, Flex, Spinner, Stack, Text } from '@sanity/ui';
import { set, useClient, useFormValue } from 'sanity';
import type { ArrayOfObjectsInputProps } from 'sanity';
import {
  flattenTypefaceHomepageTiles,
  homepageTileId,
  mergeHomepageTileOrder,
  type HomepageTileOrderItem,
  type TypefaceHomepageSource,
} from '../../lib/homepage-tile-order';
import { formatInUseImageWidth, resolveInUseImageWidth } from '../../lib/fonts-in-use-mosaic';

type StoredTile = {
  _key: string;
  _type: 'homepageTileOrder';
  typeface?: { _ref: string };
  imageKey?: string;
};

type HomepageImage = {
  _key: string;
  alt?: string;
  width?: string;
  image?: {
    asset?: { _ref?: string };
    crop?: unknown;
    hotspot?: unknown;
  };
};

type LegacyGridItem = {
  itemType?: 'about' | 'typefaceImage';
  imageKey?: string;
  typeface?: { _ref?: string };
};

type DisplayTile = {
  id: string;
  typefaceId: string;
  typefaceName: string;
  imageKey: string;
  width: string;
  alt?: string;
  imageIndex: number;
  imageCount: number;
  isNew: boolean;
  image?: HomepageImage['image'];
  orderItem: HomepageTileOrderItem;
};

const TYPEFACES_QUERY = `*[_type == "typeface" && count(homepageImages) > 0] | order(orderRank, name asc) {
  _id,
  name,
  homepageImages[]{
    _key,
    alt,
    width,
    image {
      asset,
      crop,
      hotspot
    }
  }
}`;

function legacyGridToStored(legacy: LegacyGridItem[] | undefined): StoredTile[] {
  return (legacy ?? [])
    .filter((item) => item.itemType === 'typefaceImage' && item.typeface?._ref && item.imageKey)
    .map((item) => ({
      _key: `tile-${item.imageKey}`,
      _type: 'homepageTileOrder' as const,
      typeface: { _type: 'reference' as const, _ref: item.typeface!._ref! },
      imageKey: item.imageKey!,
    }));
}

function toDisplayTiles(
  typefaces: TypefaceHomepageSource[],
  storedIds: Set<string>,
): DisplayTile[] {
  const counts = new Map<string, number>();
  for (const typeface of typefaces) {
    const n = (typeface.homepageImages ?? []).filter((image) => image._key && image.image?.asset).length;
    counts.set(typeface._id, n);
  }

  const indexByTypeface = new Map<string, number>();

  return flattenTypefaceHomepageTiles(typefaces)
    .map((item) => {
      const typeface = item.typeface as TypefaceHomepageSource | undefined;
      const imageKey = item.imageKey?.trim();
      if (!typeface?._id || !imageKey) return null;

      const image = typeface.homepageImages?.find((entry) => entry._key === imageKey);
      if (!image?.image?.asset) return null;

      const imageIndex = (indexByTypeface.get(typeface._id) ?? 0) + 1;
      indexByTypeface.set(typeface._id, imageIndex);

      return {
        id: homepageTileId(typeface._id, imageKey),
        typefaceId: typeface._id,
        typefaceName: typeface.name?.trim() || 'Untitled typeface',
        imageKey,
        width: resolveInUseImageWidth(image.width),
        alt: image.alt,
        imageIndex,
        imageCount: counts.get(typeface._id) ?? 1,
        isNew: !storedIds.has(
          homepageTileId(typeface._id.replace(/^drafts\./, ''), imageKey),
        ),
        image: image.image,
        orderItem: item,
      };
    })
    .filter((tile): tile is DisplayTile => Boolean(tile));
}

function toStoredValue(ordered: DisplayTile[], previous: StoredTile[] = []): StoredTile[] {
  const previousKeys = new Map(
    previous
      .filter((item) => item.typeface?._ref && item.imageKey)
      .map((item) => [homepageTileId(item.typeface!._ref, item.imageKey!), item._key]),
  );

  return ordered.map((tile) => ({
    _key: previousKeys.get(tile.id) ?? `tile-${tile.imageKey}`,
    _type: 'homepageTileOrder',
    typeface: { _type: 'reference', _ref: tile.typefaceId },
    imageKey: tile.imageKey,
  }));
}

export function HomepageTilesInput(props: ArrayOfObjectsInputProps) {
  const client = useClient({ apiVersion: '2024-01-01' });
  const { value = [], onChange, readOnly } = props;
  const legacyGrid = useFormValue(['grid']) as LegacyGridItem[] | undefined;
  const storedValue = value as StoredTile[];
  const effectiveStoredValue = useMemo(
    () => (storedValue.length ? storedValue : legacyGridToStored(legacyGrid)),
    [storedValue, legacyGrid],
  );

  const [typefaces, setTypefaces] = useState<TypefaceHomepageSource[] | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    client.fetch<TypefaceHomepageSource[]>(TYPEFACES_QUERY).then((result) => {
      if (!cancelled) setTypefaces(result);
    });

    return () => {
      cancelled = true;
    };
  }, [client]);

  const storedIds = useMemo(
    () =>
      new Set(
        effectiveStoredValue
          .filter((item) => item.typeface?._ref && item.imageKey)
          .map((item) =>
            homepageTileId(item.typeface!._ref.replace(/^drafts\./, ''), item.imageKey!),
          ),
      ),
    [effectiveStoredValue],
  );

  const availableTiles = useMemo(
    () => toDisplayTiles(typefaces ?? [], storedIds),
    [typefaces, storedIds],
  );
  const orderedTiles = useMemo(() => {
    const merged = mergeHomepageTileOrder(
      effectiveStoredValue,
      availableTiles.map((tile) => tile.orderItem),
      { appendMissing: true },
    );

    const displayById = new Map(availableTiles.map((tile) => [tile.id, tile]));
    return merged
      .map((item) => {
        const typeface = item.typeface as TypefaceHomepageSource | undefined;
        const imageKey = item.imageKey?.trim();
        if (!typeface?._id || !imageKey) return null;
        return (
          displayById.get(homepageTileId(typeface._id, imageKey)) ??
          displayById.get(homepageTileId(typeface._id.replace(/^drafts\./, ''), imageKey)) ??
          null
        );
      })
      .filter((tile): tile is DisplayTile => Boolean(tile));
  }, [availableTiles, effectiveStoredValue]);

  const persistOrder = useCallback(
    (nextOrder: DisplayTile[]) => {
      if (readOnly) return;
      onChange(set(toStoredValue(nextOrder, effectiveStoredValue)));
    },
    [onChange, readOnly, effectiveStoredValue],
  );

  // Write newly uploaded typeface images into the tiles array so publish keeps
  // Studio order and the live homepage in sync (no silent “append at end”).
  useEffect(() => {
    if (readOnly || typefaces === null) return;
    const hasNew = orderedTiles.some((tile) => tile.isNew);
    if (!hasNew) return;
    persistOrder(orderedTiles);
  }, [orderedTiles, persistOrder, readOnly, typefaces]);

  const imageBuilder = useMemo(() => imageUrlBuilder(client), [client]);

  const handleDrop = (targetIndex: number) => {
    if (readOnly || dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }

    const next = [...orderedTiles];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(targetIndex, 0, moved);
    persistOrder(next);
    setDragIndex(null);
    setDragOverIndex(null);
  };

  if (typefaces === null) {
    return (
      <Flex align="center" gap={3} padding={4}>
        <Spinner />
        <Text size={1} muted>
          Loading homepage images…
        </Text>
      </Flex>
    );
  }

  return (
    <Stack space={4}>
      <Card padding={3} radius={2} tone="primary">
        <Text size={1}>
          The yellow about box is always shown first on the homepage. New images from typefaces appear
          at the bottom of this list — drag to place them, then publish. The live homepage only shows
          tiles saved in this order.
        </Text>
      </Card>

      {orderedTiles.length === 0 ? (
        <Card padding={4} radius={2} tone="transparent" border>
          <Text size={1} muted>
            No homepage images yet. Open a typeface and add images under Homepage images.
          </Text>
        </Card>
      ) : (
        <Stack space={2}>
          {orderedTiles.map((tile, index) => {
            const previewUrl = tile.image
              ? imageBuilder.image(tile.image).width(120).height(120).fit('crop').url()
              : undefined;

            return (
              <Card
                key={tile.id}
                padding={3}
                radius={2}
                shadow={dragOverIndex === index ? 2 : 1}
                tone={dragIndex === index ? 'transparent' : 'default'}
                style={{
                  opacity: dragIndex === index ? 0.55 : 1,
                  cursor: readOnly ? 'default' : 'grab',
                }}
                draggable={!readOnly}
                onDragStart={() => setDragIndex(index)}
                onDragEnd={() => {
                  setDragIndex(null);
                  setDragOverIndex(null);
                }}
                onDragOver={(event) => {
                  if (readOnly) return;
                  event.preventDefault();
                  setDragOverIndex(index);
                }}
                onDragLeave={() => {
                  if (dragOverIndex === index) setDragOverIndex(null);
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  handleDrop(index);
                }}
              >
                <Flex align="center" gap={3}>
                  <Box style={{ color: 'var(--card-muted-fg-color)' }}>
                    <DragHandleIcon />
                  </Box>

                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt=""
                      width={56}
                      height={56}
                      style={{
                        borderRadius: 4,
                        objectFit: 'cover',
                        flexShrink: 0,
                        background: '#ffffff',
                      }}
                    />
                  ) : (
                    <Box
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 4,
                        background: '#ffffff',
                        flexShrink: 0,
                      }}
                    />
                  )}

                  <Stack space={2} flex={1}>
                    <Text size={2} weight="semibold">
                      {tile.typefaceName}
                      {tile.imageCount > 1 ? ` · Image ${tile.imageIndex}` : ''}
                      {tile.isNew ? ' · New' : ''}
                    </Text>
                    <Text size={1} muted>
                      {formatInUseImageWidth(tile.width)}
                      {tile.alt ? ` · ${tile.alt}` : ''}
                    </Text>
                  </Stack>
                </Flex>
              </Card>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
}
