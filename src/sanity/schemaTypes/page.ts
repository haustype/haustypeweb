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
        'Page content segments. Choose a layout per segment: split (headline cols 3–6, body text cols 7–11, body images cols 7–12) or feature (wide image cols 3–10, body cols 3–8). Segments are separated by a line.',
      of: [{ type: 'contentSegment' }],
    }),
    defineField({
      name: 'pageSections',
      type: 'array',
      title: 'Fontdue sections',
      description: 'Add type testers, character viewers, buy buttons, or custom content. Drag to reorder. Sections appear below the content segments.',
      of: [{ type: 'pagePageSection' }],
    }),
  ],
  preview: {
    select: { title: 'title' },
  },
});
