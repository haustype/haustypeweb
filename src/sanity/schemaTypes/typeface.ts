import { defineField, defineType } from 'sanity';

export const typefaceType = defineType({
  name: 'typeface',
  title: 'Typeface',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', title: 'Name' }),
    defineField({
      name: 'detailPageTitle',
      type: 'string',
      title: 'Detail page title',
      description: 'Optional. Overrides the typeface name as the main heading on the typeface\'s page. Leave empty to use the typeface name.',
    }),
    defineField({
      name: 'body',
      type: 'blockContent',
      title: 'Body',
      description: 'Rich text shown below the title, before Fontdue components.',
    }),
    defineField({
      name: 'pageSections',
      type: 'array',
      title: 'Detail page layout',
      description: 'Order of sections on this typeface\'s page. Add, remove, or reorder: type tester, character viewer, buy button, custom content.',
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
      name: 'image',
      type: 'image',
      title: 'Card Image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alternative Text' }],
    }),
    defineField({
      name: 'order',
      type: 'number',
      title: 'Display Order',
      description: 'Fallback order when "Our Typefaces" in Homepage Settings is empty.',
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: 'name', media: 'image' },
  },
});
