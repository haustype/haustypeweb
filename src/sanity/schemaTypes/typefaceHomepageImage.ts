import { defineField, defineType } from 'sanity';
import { TypefaceHomepageImageInput } from '../components/TypefaceHomepageImageInput';
import { createWhiteBgPreviewMedia } from '../components/WhiteBgPreviewMedia';
import { formatInUseImageWidth } from '../../lib/fonts-in-use-mosaic';
import { boxPaddingField } from './boxPadding';

const widthOptions = [
  { title: '25% width', value: '25' },
  { title: '50% width', value: '50' },
  { title: '75% width', value: '75' },
  { title: '100% width', value: '100' },
];

export const typefaceHomepageImageType = defineType({
  name: 'typefaceHomepageImage',
  title: 'Homepage image',
  type: 'object',
  components: {
    input: TypefaceHomepageImageInput,
  },
  fields: [
    defineField({
      name: 'image',
      type: 'image',
      title: 'Image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    boxPaddingField('Padding', 'Inner padding inside the white homepage box.'),
    defineField({
      name: 'alt',
      type: 'string',
      title: 'Alt text',
    }),
    defineField({
      name: 'width',
      type: 'string',
      title: 'Width',
      description: 'How much horizontal space this tile takes in the homepage grid.',
      options: { list: widthOptions, layout: 'radio' },
      initialValue: '25',
    }),
  ],
  preview: {
    select: { alt: 'alt', media: 'image', width: 'width' },
    prepare: ({ alt, media, width }) => ({
      title: alt || 'Homepage image',
      subtitle: formatInUseImageWidth(width),
      media: media ? createWhiteBgPreviewMedia(media) : undefined,
    }),
  },
});
