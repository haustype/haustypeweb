import { defineField, defineType } from 'sanity';

export const typefaceType = defineType({
  name: 'typeface',
  title: 'Typeface',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', title: 'Name' }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: { source: 'name', maxLength: 96 },
    }),
    defineField({ name: 'category', type: 'string', title: 'Category' }),
    defineField({ name: 'styles', type: 'number', title: 'Styles', initialValue: 0 }),
    defineField({
      name: 'image',
      type: 'image',
      title: 'Card Image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alternative Text' }],
    }),
    defineField({
      name: 'collectionId',
      type: 'string',
      title: 'Fontdue Collection ID',
      description: 'For buy button on font detail page. Leave empty if not for sale.',
    }),
    defineField({
      name: 'order',
      type: 'number',
      title: 'Display Order',
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: 'name', media: 'image' },
  },
});
