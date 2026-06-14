import { defineField, defineType } from 'sanity';

const widthOptions = [
  { title: '25% width', value: '25' },
  { title: '50% width', value: '50' },
];

export const inUseGalleryItemType = defineType({
  name: 'inUseGalleryItem',
  title: 'Gallery image',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      type: 'image',
      title: 'Image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'alt',
      type: 'string',
      title: 'Alt text',
      description: 'Describe the image for accessibility.',
    }),
    defineField({
      name: 'caption',
      type: 'string',
      title: 'Caption',
      description: 'Optional project or client name shown below the image.',
    }),
    defineField({
      name: 'typeface',
      type: 'reference',
      to: [{ type: 'typeface' }],
      title: 'Typeface',
      description: 'Links to the typeface page below the image.',
    }),
    defineField({
      name: 'width',
      type: 'string',
      title: 'Width',
      description: 'How much horizontal space this image takes in the gallery row.',
      options: { list: widthOptions, layout: 'radio' },
      initialValue: '25',
    }),
  ],
  preview: {
    select: {
      alt: 'alt',
      caption: 'caption',
      media: 'image',
      width: 'width',
      typefaceName: 'typeface.name',
    },
    prepare: ({ alt, caption, media, width, typefaceName }) => ({
      title: caption || alt || 'In use image',
      subtitle: [width === '50' ? '50% width' : '25% width', typefaceName].filter(Boolean).join(' · '),
      media,
    }),
  },
});
