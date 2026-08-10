export const GALLERY_PAGE_SLUGS = ['fonts-in-use', 'commissions'] as const;

export type GalleryPageSlug = (typeof GALLERY_PAGE_SLUGS)[number];

export function isGalleryPageSlug(slug: string): slug is GalleryPageSlug {
  return (GALLERY_PAGE_SLUGS as readonly string[]).includes(slug);
}

export function resolvePageLayout(
  pageLayout: 'standard' | 'gallery' | null | undefined,
  slug: string,
): 'standard' | 'gallery' {
  if (pageLayout === 'gallery') return 'gallery';
  if (pageLayout === 'standard') return 'standard';
  return isGalleryPageSlug(slug) ? 'gallery' : 'standard';
}
