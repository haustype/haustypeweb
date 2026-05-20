import { defineArrayMember, defineField, defineType } from 'sanity';

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
      name: 'cardImages',
      type: 'array',
      title: 'Card images',
      description:
        'Extra images for the homepage card hover slideshow (desktop only). Shown when visitors hover the card — scrub left/right to change image. Needs 2+ images. The Card image (fallback) below is always shown when not hovering.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'cardImageItem',
          title: 'Card image',
          fields: [
            defineField({
              name: 'image',
              type: 'image',
              title: 'Image',
              validation: (rule) => rule.required(),
              options: { hotspot: true },
            }),
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Label',
              description: 'Optional label for Studio (and alt text on the site).',
            }),
          ],
          preview: {
            select: { title: 'alt', media: 'image' },
            prepare: ({ title, media }) => ({
              title: title || 'Card image',
              media,
            }),
          },
        }),
      ],
    }),
    defineField({
      name: 'image',
      type: 'image',
      title: 'Card image (fallback)',
      description: 'Default homepage card image (always visible). Hover slideshow uses Card images when you add 2 or more there.',
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
    select: { title: 'name', media: 'cardImages.0', fallback: 'image' },
    prepare: ({ title, media, fallback }) => ({ title, media: media ?? fallback }),
  },
});
