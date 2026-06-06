import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list';
import { defineField, defineType } from 'sanity';

export const typefaceType = defineType({
  name: 'typeface',
  title: 'Typeface',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: 'typeface' }),
    defineField({ name: 'name', type: 'string', title: 'Name' }),
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
      description: 'Order of sections below the content segments. Add, remove, or reorder: type tester, character viewer, buy button, custom content.',
      of: [{ type: 'typefacePageSection' }],
      initialValue: [
        { sectionType: 'typeTester' },
        { sectionType: 'buyButton' },
        { sectionType: 'characterViewer' },
      ],
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: { source: 'name', maxLength: 96 },
    }),
    defineField({
      name: 'collectionId',
      type: 'string',
      title: 'Fontdue Collection ID',
      description: 'For buy button on font detail page. Leave empty if not for sale.',
    }),
    defineField({ name: 'category', type: 'string', title: 'Category' }),
    defineField({ name: 'styles', type: 'number', title: 'Styles', initialValue: 0 }),
    defineField({
      name: 'specimen',
      type: 'image',
      title: 'Homepage specimen',
      description: 'SVG shown in the homepage typeface list. More specimens can be added via Fontdue on the detail page.',
      options: { accept: '.svg' },
      fields: [{ name: 'alt', type: 'string', title: 'Alternative Text' }],
    }),
  ],
  preview: {
    select: { title: 'name', media: 'specimen' },
    prepare: ({ title, media }) => ({ title, media }),
  },
});
