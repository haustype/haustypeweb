import { defineField, defineType } from 'sanity';

export const homepageTileOrderType = defineType({
  name: 'homepageTileOrder',
  title: 'Homepage tile',
  type: 'object',
  fields: [
    defineField({
      name: 'typeface',
      type: 'reference',
      to: [{ type: 'typeface' }],
      hidden: true,
    }),
    defineField({
      name: 'imageKey',
      type: 'string',
      hidden: true,
    }),
  ],
  preview: {
    select: {
      typefaceName: 'typeface.name',
    },
    prepare: ({ typefaceName }) => ({
      title: typefaceName || 'Homepage tile',
    }),
  },
});
