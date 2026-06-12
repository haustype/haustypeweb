export function typefaceSlug(typeface: { name?: string; slug?: { current?: string } }) {
  const fromCms = typeface.slug?.current?.trim();
  if (fromCms) return fromCms;
  const name = typeface.name?.trim();
  if (!name) return null;
  return name.toLowerCase().replace(/\s+/g, '-');
}
