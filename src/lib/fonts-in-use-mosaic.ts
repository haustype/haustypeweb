export type InUseImageWidth = '25' | '50';

export function resolveInUseImageWidth(value?: string | null): InUseImageWidth {
  if (value === '50') return '50';
  if (value === '25') return '25';

  // Legacy tile sizes from earlier mosaic recipe
  if (value === 'wide' || value === 'hero' || value === 'medium') return '50';

  return '25';
}

export function inUseColSpan(width: InUseImageWidth): 3 | 6 {
  return width === '50' ? 6 : 3;
}

export function inUseImageUrlWidth(width: InUseImageWidth): number {
  return width === '50' ? 1000 : 600;
}
