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
        'Heading + body pairs in the two-column layout. The first segment appears in the yellow hero; additional segments appear below the fold.',
      of: [{ type: 'contentSegment' }],
    }),
    defineField({
      name: 'headerSvg',
      type: 'image',
      title: 'Header SVG',
      description:
        'Large wordmark shown at the bottom of the yellow hero on the typeface page. SVG recommended; fills the width of the viewport.',
      options: { accept: '.svg,image/*' },
      fields: [{ name: 'alt', type: 'string', title: 'Alternative Text' }],
    }),
    defineField({
      name: 'pageSections',
      type: 'array',
      title: 'Fontdue sections',
      description: 'Order of sections below the content segments. Add, remove, or reorder: type tester, character viewer, custom content.',
      of: [{ type: 'typefacePageSection' }],
      initialValue: [
        { sectionType: 'typeTester' },
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
      description: 'For the floating buy button on the font detail page. Leave empty if not for sale.',
    }),
    defineField({ name: 'category', type: 'string', title: 'Category' }),
    defineField({ name: 'styles', type: 'number', title: 'Styles', initialValue: 0 }),
    defineField({
      name: 'specimen',
      type: 'image',
      title: 'Homepage specimen',
      description: 'SVG shown in the homepage typeface list (769px and wider). More specimens can be added via Fontdue on the detail page.',
      options: { accept: '.svg' },
      fields: [{ name: 'alt', type: 'string', title: 'Alternative Text' }],
    }),
    defineField({
      name: 'specimenMobile',
      type: 'image',
      title: 'Homepage specimen (mobile)',
      description: 'Optional SVG for the homepage typeface list at 768px and below. Falls back to the main specimen when empty.',
      options: { accept: '.svg' },
      fields: [{ name: 'alt', type: 'string', title: 'Alternative Text' }],
    }),
  ],
  preview: {
    select: { title: 'name', media: 'specimen' },
    prepare: ({ title, media }) => ({ title, media }),
  },
});
