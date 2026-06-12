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
      name: 'instagramUrl',
      type: 'url',
      title: 'Instagram URL',
      description: 'Shown in the footer Contact column.',
    }),
    defineField({
      name: 'contactEmail',
      type: 'string',
      title: 'Contact email',
      description: 'Shown in the footer Contact column.',
    }),
    defineField({
      name: 'contactLinks',
      type: 'array',
      title: 'Additional contact links',
      description: 'Optional extra links below Instagram and email in the Contact column.',
      of: footerLinkItems,
    }),
  ],
});
