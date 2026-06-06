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
        'Heading + body pairs in the two-column layout. Add as many segments as you need — each is separated by a line, like the homepage typeface list.',
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
