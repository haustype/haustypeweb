import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list';
import { defineField, defineType } from 'sanity';
import { createLightBgImageInput } from '../components/LightBgImageInput';
import { bottomPaddingField, verticalPaddingField } from './boxPadding';

const headerSvgInput = createLightBgImageInput('#ffcc01');
const specimenSvgInput = createLightBgImageInput('#eeeeee');

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
      components: { input: headerSvgInput },
    }),
    bottomPaddingField(
      'headerSvgPadding',
      'Header SVG bottom padding',
      'Space under the Header SVG in the yellow hero. Default 36px.',
    ),
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
      name: 'homepageImages',
      type: 'array',
      title: 'Homepage images',
      description:
        'Images for the homepage mosaic. Set width and padding per image. Reorder tiles on Homepage Settings.',
      of: [{ type: 'typefaceHomepageImage' }],
    }),
    defineField({
      name: 'specimen',
      type: 'image',
      title: 'Typefaces page specimen',
      description: 'SVG shown in the typefaces list (769px and wider).',
      options: { accept: '.svg' },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alternative Text' })],
      components: { input: specimenSvgInput },
    }),
    verticalPaddingField(
      'listPadding',
      'Typefaces list padding',
      'Top and bottom spacing for this typeface row on the /typefaces page (desktop). Mobile uses 32px.',
    ),
    defineField({
      name: 'specimenMobile',
      type: 'image',
      title: 'Typefaces page specimen (mobile)',
      description: 'Optional SVG for the typefaces list at 768px and below. Falls back to the main specimen when empty.',
      options: { accept: '.svg' },
      fields: [{ name: 'alt', type: 'string', title: 'Alternative Text' }],
      components: { input: specimenSvgInput },
    }),
  ],
  preview: {
    select: { title: 'name', media: 'specimen' },
    prepare: ({ title, media }) => ({ title, media }),
  },
});
