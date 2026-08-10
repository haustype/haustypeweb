import { defineField, defineType } from 'sanity';

const widthOptions = [
  { title: '25% width', value: '25' },
  { title: '50% width', value: '50' },
  { title: '75% width', value: '75' },
  { title: '100% width', value: '100' },
];

type GalleryItemParent = {
  mediaType?: 'image' | 'video';
};

export const inUseGalleryItemType = defineType({
  name: 'inUseGalleryItem',
  title: 'Gallery item',
  type: 'object',
  fields: [
    defineField({
      name: 'mediaType',
      type: 'string',
      title: 'Media type',
      options: {
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Video', value: 'video' },
        ],
        layout: 'radio',
      },
      initialValue: 'image',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      type: 'image',
      title: 'Image',
      options: { hotspot: true },
      hidden: ({ parent }) => (parent as GalleryItemParent)?.mediaType === 'video',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as GalleryItemParent;
          if (parent?.mediaType === 'video') return true;
          return value?.asset ? true : 'Image is required';
        }),
    }),
    defineField({
      name: 'video',
      type: 'file',
      title: 'Video',
      description: 'MP4 or WebM recommended. Plays automatically, muted, and looped in the gallery.',
      options: { accept: 'video/*' },
      hidden: ({ parent }) => (parent as GalleryItemParent)?.mediaType !== 'video',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as GalleryItemParent;
          if (parent?.mediaType !== 'video') return true;
          return value?.asset ? true : 'Video is required';
        }),
    }),
    defineField({
      name: 'poster',
      type: 'image',
      title: 'Poster frame',
      description: 'Optional still shown before the video loads.',
      options: { hotspot: true },
      hidden: ({ parent }) => (parent as GalleryItemParent)?.mediaType !== 'video',
    }),
    defineField({
      name: 'alt',
      type: 'string',
      title: 'Alt text',
      description: 'Describe the image or video for accessibility.',
    }),
    defineField({
      name: 'caption',
      type: 'string',
      title: 'Caption',
      description: 'Optional project or client name shown below the media.',
    }),
    defineField({
      name: 'typeface',
      type: 'reference',
      to: [{ type: 'typeface' }],
      title: 'Typeface',
      description: 'Links to the typeface page below the media.',
    }),
    defineField({
      name: 'designerLink',
      type: 'object',
      title: 'Designer link',
      description: 'Optional link to the designer or project source. Appears bottom-right when hovering the card.',
      fields: [
        defineField({
          name: 'label',
          type: 'string',
          title: 'Label',
          initialValue: 'Source',
        }),
        defineField({
          name: 'url',
          type: 'url',
          title: 'URL',
          validation: (Rule) =>
            Rule.uri({
              allowRelative: false,
              scheme: ['http', 'https'],
            }),
        }),
      ],
    }),
    defineField({
      name: 'width',
      type: 'string',
      title: 'Width',
      description: 'How much horizontal space this item takes in the gallery row.',
      options: { list: widthOptions, layout: 'radio' },
      initialValue: '25',
    }),
  ],
  preview: {
    select: {
      alt: 'alt',
      caption: 'caption',
      image: 'image',
      poster: 'poster',
      mediaType: 'mediaType',
      width: 'width',
      typefaceName: 'typeface.name',
    },
    prepare: ({ alt, caption, image, poster, mediaType, width, typefaceName }) => ({
      title: caption || alt || (mediaType === 'video' ? 'Gallery video' : 'Gallery image'),
      subtitle: [
        mediaType === 'video' ? 'Video' : 'Image',
        width === '100'
          ? '100% width'
          : width === '75'
            ? '75% width'
            : width === '50'
              ? '50% width'
              : '25% width',
        typefaceName,
      ]
        .filter(Boolean)
        .join(' · '),
      media: mediaType === 'video' ? poster ?? image : image,
    }),
  },
});
