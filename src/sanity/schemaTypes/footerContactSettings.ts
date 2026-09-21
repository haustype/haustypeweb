import { defineField, defineType } from 'sanity';
import { footerLinkItems } from './footerLinkItems';

export const footerContactSettingsType = defineType({
  name: 'footerContactSettings',
  title: 'Footer Contact',
  type: 'document',
  preview: {
    prepare: () => ({ title: 'Contact' }),
  },
  fields: [
    defineField({
      name: 'links',
      type: 'array',
      title: 'Contact links',
      description:
        'Links shown in the footer Contact column. Pick pages, built-in routes, or add URL / email links. Drag to reorder.',
      of: footerLinkItems,
    }),
  ],
});
