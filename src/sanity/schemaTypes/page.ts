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
    defineField({
      name: 'pageSections',
      type: 'array',
      title: 'Fontdue sections',
      description: 'Add type testers, character viewers, buy buttons, or custom content. Drag to reorder. Sections appear below the title and body.',
      of: [{ type: 'pagePageSection' }],
    }),
  ],
  preview: {
    select: { title: 'title' },
  },
});
