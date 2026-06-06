import { defineField, defineType } from 'sanity';

export const contentSegmentType = defineType({
  name: 'contentSegment',
  title: 'Content segment',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      type: 'string',
      title: 'Heading',
      description: 'Shown in the left column.',
    }),
    defineField({
      name: 'body',
      type: 'blockContent',
      title: 'Body',
      description: 'Shown in the right column.',
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || 'Content segment' }),
  },
});
