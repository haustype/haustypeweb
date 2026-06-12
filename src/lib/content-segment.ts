import type { SanityImageValue } from './sanity-image';

export type ContentSegmentLayout = 'split' | 'feature';

export interface ContentSegment {
  layout?: ContentSegmentLayout;
  preHeader?: string;
  heading?: string;
  media?: SanityImageValue | null;
  body?: unknown;
  aside?: unknown;
}

export function isContentSegmentVisible(segment: ContentSegment) {
  return Boolean(
    segment.heading?.trim() ||
      segment.body ||
      segment.preHeader?.trim() ||
      segment.aside ||
      segment.media?.asset
  );
}
