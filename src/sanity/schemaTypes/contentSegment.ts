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
        'Split: headline and body in separate columns. Feature: wide image (or heading) across cols 4–11, with body text in cols 4–8 below.',
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
      name: 'heading',
      type: 'string',
      title: 'Heading',
      description: 'Split: columns 1–3. Feature: shown above the image in columns 4–11.',
    }),
    defineField({
      name: 'media',
      type: 'image',
      title: 'Image',
      description: 'Feature layout only. Spans columns 4–11 by default; choose 6 or 9 columns per image in the image settings.',
      options: { hotspot: true },
      fields: imageDisplayFields({ aspectDefault: '2/1', fitDefault: 'contain' }),
      hidden: ({ parent }) => parent?.layout !== 'feature',
    }),
    defineField({
      name: 'body',
      type: 'blockContent',
      title: 'Body',
      description: 'Split: text in columns 4–8; images span 6 or 9 columns from column 4 (set per image). Feature: columns 4–8 below the image.',
    }),
    defineField({
      name: 'aside',
      type: 'blockContent',
      title: 'Aside',
      description: 'Optional notes or CTA in column 10 (split layout only).',
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
