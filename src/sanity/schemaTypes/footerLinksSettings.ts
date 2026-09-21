import { defineField, defineType } from 'sanity';
import { footerLinkItems } from './footerLinkItems';

export const footerLinksSettingsType = defineType({
  name: 'footerLinksSettings',
  title: 'Footer Info',
  type: 'document',
  preview: {
    prepare: () => ({ title: 'Info' }),
  },
  fields: [
    defineField({
      name: 'links',
      type: 'array',
      title: 'Info links',
      description:
        'Links shown in the footer Info column. Pick pages, built-in routes, or add URL / email links. Drag to reorder.',
      of: footerLinkItems,
    }),
  ],
});
