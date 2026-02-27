import { defineField, defineType } from 'sanity';

export const homepageSettingsType = defineType({
  name: 'homepageSettings',
  title: 'Homepage Settings',
  type: 'document',
  preview: {
    prepare: () => ({ title: 'Homepage Settings' }),
  },
  fields: [
    defineField({
      name: 'aboutText',
      type: 'text',
      title: 'About Text',
      description: 'Foundry description shown on homepage',
    }),
    defineField({
      name: 'heroItems',
      type: 'array',
      title: 'Hero Slideshow',
      description: 'Images or videos for the hero section',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'type', type: 'string', options: { list: ['image', 'video'] }, initialValue: 'image' },
            { name: 'image', type: 'image', title: 'Image', options: { hotspot: true }, hidden: ({ parent }) => parent?.type === 'video' },
            { name: 'videoUrl', type: 'url', title: 'Video URL', hidden: ({ parent }) => parent?.type !== 'video' },
            { name: 'alt', type: 'string', title: 'Alt Text' },
          ],
          preview: {
            select: { alt: 'alt', media: 'image', type: 'type' },
            prepare: ({ alt, media, type }) => ({
              title: alt || (type === 'video' ? 'Video' : 'Hero item'),
              media,
            }),
          },
        },
      ],
    }),
    defineField({
      name: 'typefaceOrder',
      type: 'array',
      title: 'Our Typefaces',
      description: 'Select and order typefaces for the homepage grid. Drag to reorder. Shown between the hero and Fonts in Use carousel.',
      of: [
        {
          type: 'reference',
          to: [{ type: 'typeface' }],
          options: { disableNew: true },
        },
      ],
    }),
    defineField({
      name: 'fontsInUse',
      type: 'array',
      title: 'Fonts In Use Carousel',
      description: 'Images for the "Fonts in use" section',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'image', type: 'image', options: { hotspot: true } },
            { name: 'alt', type: 'string', title: 'Alt Text' },
          ],
          preview: {
            select: { alt: 'alt', media: 'image' },
            prepare: ({ alt, media }) => ({
              title: alt || 'Font in use',
              media,
            }),
          },
        },
      ],
    }),
  ],
});
