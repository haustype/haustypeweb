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
    defineField({
      name: 'screensaver',
      type: 'object',
      title: 'Screensaver',
      description: 'Fullscreen homepage slideshow after a period of inactivity.',
      fields: [
        defineField({
          name: 'enabled',
          type: 'boolean',
          title: 'Enabled',
          initialValue: true,
        }),
        defineField({
          name: 'idleSeconds',
          type: 'number',
          title: 'Idle time (seconds)',
          description: 'How long to wait without activity before the screensaver starts.',
          initialValue: 10,
          validation: (Rule) => Rule.required().min(1).max(300),
        }),
        defineField({
          name: 'slideSeconds',
          type: 'number',
          title: 'Seconds per image',
          description: 'How long each image is shown before fading to the next.',
          initialValue: 5,
          validation: (Rule) => Rule.required().min(1).max(120),
        }),
        defineField({
          name: 'fadeSeconds',
          type: 'number',
          title: 'Crossfade duration (seconds)',
          description: 'Length of the fade transition between images.',
          initialValue: 1,
          validation: (Rule) => Rule.required().min(0).max(10),
        }),
        defineField({
          name: 'slides',
          type: 'array',
          title: 'Images',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'image',
                  type: 'image',
                  title: 'Image',
                  options: { hotspot: true },
                  validation: (Rule) => Rule.required(),
                },
                { name: 'alt', type: 'string', title: 'Alt Text' },
              ],
              preview: {
                select: { alt: 'alt', media: 'image' },
                prepare: ({ alt, media }) => ({
                  title: alt || 'Screensaver slide',
                  media,
                }),
              },
            },
          ],
        }),
      ],
    }),
  ],
});
