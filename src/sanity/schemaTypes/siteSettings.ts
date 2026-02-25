import { defineField, defineType } from 'sanity';

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
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
      title: 'Hero Items',
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
            select: { alt: 'alt' },
            prepare: ({ alt }) => ({ title: alt || 'Hero item' }),
          },
        },
      ],
    }),
    defineField({
      name: 'fontsInUse',
      type: 'array',
      title: 'Fonts In Use',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'image', type: 'image', options: { hotspot: true } },
            { name: 'alt', type: 'string', title: 'Alt Text' },
          ],
          preview: {
            select: { alt: 'alt' },
            prepare: ({ alt }) => ({ title: alt || 'Font in use' }),
          },
        },
      ],
    }),
  ],
});
