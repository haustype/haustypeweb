import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list';
import { defineField, defineType } from 'sanity';

export const pageType = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: 'page' }),
    defineField({ name: 'title', type: 'string', title: 'Title' }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: { source: 'title', maxLength: 96 },
    }),
    defineField({ name: 'description', type: 'string', title: 'Description' }),
    defineField({
      name: 'contentSegments',
      type: 'array',
      title: 'Content',
      description:
        'Page content segments. Choose a layout per segment: split (headline cols 1–3, body text cols 4–8, images 6 or 9 cols from col 4) or feature (wide image cols 4–11, body cols 4–8). Segments are separated by a line.',
      of: [{ type: 'contentSegment' }],
    }),
    defineField({
      name: 'pageSections',
      type: 'array',
      title: 'Fontdue sections',
      description: 'Add type testers, character viewers, buy buttons, or custom content. Drag to reorder. Sections appear below the content segments.',
      of: [{ type: 'pagePageSection' }],
    }),
    defineField({
      name: 'inUseGallery',
      type: 'array',
      title: 'Gallery images',
      description:
        'Mosaic grid shown below the page content. Choose 25% or 50% width per image. Drag rows to reorder.',
      of: [{ type: 'inUseGalleryItem' }],
      hidden: ({ document }) => document?.slug?.current !== 'in-use',
    }),
  ],
  preview: {
    select: { title: 'title' },
  },
});
