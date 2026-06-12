import { defineField, defineType } from 'sanity';
import { imageDisplayFields } from './imageDisplayFields';

export const contentSegmentType = defineType({
  name: 'contentSegment',
  title: 'Content segment',
  type: 'object',
  fields: [
    defineField({
      name: 'layout',
      type: 'string',
      title: 'Layout',
      description:
        'Split: headline and body in separate columns. Feature: wide image (or heading) across cols 3–10, with body text in cols 3–8 below.',
      options: {
        list: [
          { title: 'Split (headline + body columns)', value: 'split' },
          { title: 'Feature (wide image + text below)', value: 'feature' },
        ],
        layout: 'radio',
      },
      initialValue: 'split',
    }),
    defineField({
      name: 'preHeader',
      type: 'string',
      title: 'Pre-header',
      description: 'Optional small label in column 1 (split layout only). Body copy size.',
      hidden: ({ parent }) => parent?.layout === 'feature',
    }),
    defineField({
      name: 'heading',
      type: 'string',
      title: 'Heading',
      description: 'Split: columns 3–6. Feature: shown above the image in columns 3–10.',
    }),
    defineField({
      name: 'media',
      type: 'image',
      title: 'Image',
      description: 'Feature layout only. Spans columns 3–10.',
      options: { hotspot: true },
      fields: imageDisplayFields({ aspectDefault: '2/1', fitDefault: 'contain' }),
      hidden: ({ parent }) => parent?.layout !== 'feature',
    }),
    defineField({
      name: 'body',
      type: 'blockContent',
      title: 'Body',
      description: 'Split: text in columns 7–11; images in body span columns 7–12. Feature: columns 3–8 below the image.',
    }),
    defineField({
      name: 'aside',
      type: 'blockContent',
      title: 'Aside',
      description: 'Optional notes or CTA in column 12 (split layout only).',
      hidden: ({ parent }) => parent?.layout === 'feature',
    }),
  ],
  preview: {
    select: { title: 'heading', layout: 'layout' },
    prepare: ({ title, layout }) => ({
      title: title || 'Content segment',
      subtitle: layout === 'feature' ? 'Feature layout' : 'Split layout',
    }),
  },
});
