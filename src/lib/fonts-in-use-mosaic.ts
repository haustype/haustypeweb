/** Inner width of the 1512px mosaic grid after horizontal padding (2×32px). */
export const MOSAIC_GRID_INNER_WIDTH = 1448;

/** Largest CSS width a mosaic tile can occupy (full-width on mobile). */
export const MOSAIC_TILE_MAX_CSS_WIDTH = 720;

/** Device pixel ratio used when requesting Sanity CDN widths. */
export const MOSAIC_IMAGE_DPR = 2;

/** Max CSS width of a homepage carousel slide (see FontsInUseGrid.astro). */
export const FONTS_IN_USE_CAROUSEL_MAX_CSS = 300;

export function fontsInUseCarouselUrlWidth(): number {
  return FONTS_IN_USE_CAROUSEL_MAX_CSS * MOSAIC_IMAGE_DPR;
}

export type InUseImageWidth = '25' | '50' | '75' | '100';

export function resolveInUseImageWidth(value?: string | null): InUseImageWidth {
  if (value === '100') return '100';
  if (value === '75') return '75';
  if (value === '50') return '50';
  if (value === '25') return '25';

  // Legacy tile sizes from earlier mosaic recipe
  if (value === 'wide' || value === 'hero' || value === 'medium') return '50';

  return '25';
}

export function formatInUseImageWidth(value?: string | null): string {
  return `${resolveInUseImageWidth(value)}% width`;
}

export function inUseColSpan(width: InUseImageWidth): 3 | 6 | 9 | 12 {
  switch (width) {
    case '100':
      return 12;
    case '75':
      return 9;
    case '50':
      return 6;
    default:
      return 3;
  }
}

export function inUseImageUrlWidth(width: InUseImageWidth): number {
  const colSpan = inUseColSpan(width);
  const desktopCssWidth = (MOSAIC_GRID_INNER_WIDTH * colSpan) / 12;
  const cssWidth = Math.max(desktopCssWidth, MOSAIC_TILE_MAX_CSS_WIDTH);
  return Math.ceil(cssWidth * MOSAIC_IMAGE_DPR);
}
