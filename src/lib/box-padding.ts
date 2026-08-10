export type BoxPaddingValue = {
  top?: number | null;
  right?: number | null;
  bottom?: number | null;
  left?: number | null;
};

export type ResolvedBoxPadding = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export const DEFAULT_BOX_PADDING = 40;
export const DEFAULT_BOX_BOTTOM_PADDING = 44;
export const DEFAULT_ABOUT_BOX_PADDING = 32;
export const DEFAULT_ABOUT_BOX_BOTTOM_PADDING = 36;
export const DEFAULT_VERTICAL_PADDING = 32;
export const DEFAULT_HEADER_SVG_BOTTOM_PADDING = 36;
export const DEFAULT_CONTENT_IMAGE_PADDING = 0;

export type BoxPaddingPreset = 'homepage' | 'about' | 'vertical' | 'hero' | 'content';

export function defaultBoxPaddingSide(
  side: keyof BoxPaddingValue,
  preset: BoxPaddingPreset = 'homepage',
): number {
  if (preset === 'about') {
    return side === 'bottom' ? DEFAULT_ABOUT_BOX_BOTTOM_PADDING : DEFAULT_ABOUT_BOX_PADDING;
  }
  if (preset === 'vertical') {
    return DEFAULT_VERTICAL_PADDING;
  }
  if (preset === 'hero') {
    return DEFAULT_HEADER_SVG_BOTTOM_PADDING;
  }
  if (preset === 'content') {
    return DEFAULT_CONTENT_IMAGE_PADDING;
  }
  return side === 'bottom' ? DEFAULT_BOX_BOTTOM_PADDING : DEFAULT_BOX_PADDING;
}

export function resolveHeaderSvgBottomPadding(
  value?: Pick<BoxPaddingValue, 'bottom'> | null,
): number {
  return value?.bottom ?? DEFAULT_HEADER_SVG_BOTTOM_PADDING;
}

export function resolveBoxPadding(value?: BoxPaddingValue | null): ResolvedBoxPadding {
  return {
    top: value?.top ?? DEFAULT_BOX_PADDING,
    right: value?.right ?? DEFAULT_BOX_PADDING,
    bottom: value?.bottom ?? DEFAULT_BOX_BOTTOM_PADDING,
    left: value?.left ?? DEFAULT_BOX_PADDING,
  };
}

export function resolveAboutBoxPadding(value?: BoxPaddingValue | null): ResolvedBoxPadding {
  return {
    top: value?.top ?? DEFAULT_ABOUT_BOX_PADDING,
    right: value?.right ?? DEFAULT_ABOUT_BOX_PADDING,
    bottom: value?.bottom ?? DEFAULT_ABOUT_BOX_BOTTOM_PADDING,
    left: value?.left ?? DEFAULT_ABOUT_BOX_PADDING,
  };
}

export type VerticalPaddingValue = Pick<BoxPaddingValue, 'top' | 'bottom'>;

export type ResolvedVerticalPadding = {
  top: number;
  bottom: number;
};

export function resolveVerticalPadding(value?: VerticalPaddingValue | null): ResolvedVerticalPadding {
  return {
    top: value?.top ?? DEFAULT_VERTICAL_PADDING,
    bottom: value?.bottom ?? DEFAULT_VERTICAL_PADDING,
  };
}

export function boxPaddingStyle(padding: ResolvedBoxPadding): string {
  return `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`;
}

export function resolveContentImagePadding(
  value?: BoxPaddingValue | null,
): ResolvedBoxPadding | null {
  if (!value) return null;
  const hasAny =
    value.top != null || value.right != null || value.bottom != null || value.left != null;
  if (!hasAny) return null;

  return {
    top: value.top ?? DEFAULT_CONTENT_IMAGE_PADDING,
    right: value.right ?? DEFAULT_CONTENT_IMAGE_PADDING,
    bottom: value.bottom ?? DEFAULT_CONTENT_IMAGE_PADDING,
    left: value.left ?? DEFAULT_CONTENT_IMAGE_PADDING,
  };
}
