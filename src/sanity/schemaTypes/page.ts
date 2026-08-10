import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list';
import { defineField, defineType } from 'sanity';

export const pageType = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: 'page' }),
    defineField({ name: 'title', type: 'string', title: 'Title' }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: { source: 'title', maxLength: 96 },
    }),
    defineField({ name: 'description', type: 'string', title: 'Description' }),
    defineField({
      name: 'pageLayout',
      type: 'string',
      title: 'Page layout',
      description:
        'Gallery mosaic: intro content segments plus a draggable image grid below (Fonts in use, Commissions, etc.). Standard: content segments and optional Fontdue sections.',
      options: {
        list: [
          { title: 'Standard', value: 'standard' },
          { title: 'Gallery mosaic', value: 'gallery' },
        ],
        layout: 'radio',
      },
      initialValue: 'standard',
    }),
    defineField({
      name: 'contentSegments',
      type: 'array',
      title: 'Content',
      description:
        'Page content segments. Choose a layout per segment: split (headline cols 1–3, body text cols 4–8, images 6 or 9 cols from col 4) or feature (wide image cols 4–11, body cols 4–8). Segments are separated by a line.',
      of: [{ type: 'contentSegment' }],
    }),
    defineField({
      name: 'pageSections',
      type: 'array',
      title: 'Fontdue sections',
      description: 'Add type testers, character viewers, buy buttons, or custom content. Drag to reorder. Sections appear below the content segments.',
      of: [{ type: 'pagePageSection' }],
      hidden: ({ document }) => document?.pageLayout === 'gallery',
    }),
    defineField({
      name: 'inUseGallery',
      type: 'array',
      title: 'Gallery items',
      description:
        'Mosaic grid shown below the page content. Add images or videos; choose 25%, 50%, 75%, or 100% width per item. Drag rows to reorder.',
      of: [{ type: 'inUseGalleryItem' }],
      hidden: ({ document }) => document?.pageLayout !== 'gallery',
    }),
    defineField({
      name: 'customEmbed',
      type: 'text',
      title: 'Custom embed code',
      rows: 8,
      description:
        'Optional HTML shown below page content — e.g. Fontdue web components such as <fontdue-customer-login-form></fontdue-customer-login-form>.',
    }),
    defineField({
      name: 'ordersIllustration',
      type: 'image',
      title: 'Orders illustration',
      description:
        'Decorative character shown in the bottom-right corner of the Orders page. Use a transparent PNG.',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          description: 'Leave empty for decorative images (hidden from screen readers).',
        }),
      ],
      hidden: ({ document }) => document?.slug?.current !== 'orders',
    }),
  ],
  preview: {
    select: { title: 'title' },
  },
});
