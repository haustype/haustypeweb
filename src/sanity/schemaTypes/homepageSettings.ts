import { defineField, defineType } from 'sanity';
import { AboutBoxPaddingInput } from '../components/BoxPaddingInput';
import { HomepageTilesInput } from '../components/HomepageTilesInput';
import { aboutBoxPaddingInitialValue, boxPaddingFields } from './boxPadding';

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
      description: 'Shown in the yellow about box on the homepage mosaic.',
    }),
    defineField({
      name: 'aboutPadding',
      title: 'About box padding',
      description: 'Inner padding inside the yellow about box.',
      type: 'object',
      fields: boxPaddingFields,
      initialValue: aboutBoxPaddingInitialValue,
      components: {
        input: AboutBoxPaddingInput,
      },
    }),
    defineField({
      name: 'tiles',
      type: 'array',
      title: 'Homepage grid',
      description:
        'Drag to reorder homepage typeface images. New images appear automatically when uploaded on each typeface.',
      of: [{ type: 'homepageTileOrder' }],
      components: {
        input: HomepageTilesInput,
      },
    }),
    defineField({
      name: 'fontsInUse',
      type: 'array',
      title: 'Fonts In Use Carousel',
      description: 'Images for the homepage carousel. For the full gallery, edit the Fonts in use page.',
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
