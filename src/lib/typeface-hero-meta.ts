export type TypefaceHeroMetaInput = {
  styles?: number | null;
  releaseYear?: number | null;
  designer?: string | null;
  category?: string | null;
  columnOne?: unknown;
  columnTwo?: unknown;
};

export function hasTypefaceHeroMeta(meta?: TypefaceHeroMetaInput | null): boolean {
  if (!meta) return false;
  if (meta.columnOne || meta.columnTwo) return true;
  if (meta.category?.trim()) return true;
  if (meta.designer?.trim()) return true;
  if (meta.releaseYear != null) return true;
  if (meta.styles != null && meta.styles > 0) return true;
  return false;
}
