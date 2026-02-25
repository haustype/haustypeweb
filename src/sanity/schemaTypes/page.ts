import { defineField, defineType } from 'sanity';

export const pageType = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', title: 'Title' }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: { source: 'title', maxLength: 96 },
    }),
    defineField({ name: 'description', type: 'string', title: 'Description' }),
    defineField({
      name: 'order',
      type: 'number',
      title: 'Order',
      initialValue: 0,
    }),
    defineField({
      name: 'body',
      type: 'blockContent',
      title: 'Body',
    }),
  ],
  preview: {
    select: { title: 'title' },
  },
});
