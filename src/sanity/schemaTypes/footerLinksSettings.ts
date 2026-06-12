import { defineField, defineType } from 'sanity';
import { footerLinkItems } from './footerLinkItems';

export const footerLinksSettingsType = defineType({
  name: 'footerLinksSettings',
  title: 'Footer Links',
  type: 'document',
  preview: {
    prepare: () => ({ title: 'Links' }),
  },
  fields: [
    defineField({
      name: 'links',
      type: 'array',
      title: 'Links',
      description:
        'Links shown in the footer Links column. Pick pages, built-in routes, or add URL / email links. Drag to reorder.',
      of: footerLinkItems,
    }),
  ],
});
