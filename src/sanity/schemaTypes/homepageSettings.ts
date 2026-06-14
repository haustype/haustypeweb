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
      name: 'fontsInUse',
      type: 'array',
      title: 'Fonts In Use Carousel',
      description: 'Images for the homepage carousel only. For the full /in-use gallery, edit the In Use page.',
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
