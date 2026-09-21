/** GROQ projection for portable text — expands page/typeface refs on link marks. */
export const portableTextProjection = `[]{
  ...,
  markDefs[]{
    ...,
    "pageSlug": page->slug.current,
    "pageType": page->_type
  }
}`;
