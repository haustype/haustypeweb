import { defineField, defineType } from 'sanity';

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  description: 'Global settings (navigation, etc.) that apply across the site.',
  preview: {
    prepare: () => ({ title: 'Site Settings' }),
  },
  fields: [
    defineField({
      name: 'blogPageTitle',
      type: 'string',
      title: 'Blog page title',
      description: 'Optional. Overrides "Blog" as the heading on the blog index page. Leave empty to use "Blog".',
    }),
    defineField({
      name: 'navigation',
      type: 'array',
      title: 'Navigation',
      description: 'Links shown in the header. Pick pages or add external links. Drag to reorder.',
      of: [
        {
          type: 'object',
          name: 'internalLink',
          title: 'Page',
          fields: [
            {
              name: 'page',
              type: 'reference',
              to: [{ type: 'page' }],
              title: 'Page',
              description: 'Select an existing page',
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: { title: 'page.title' },
            prepare: ({ title }) => ({ title: title || 'Select page' }),
          },
        },
        {
          type: 'object',
          name: 'builtInPage',
          title: 'Built-in page',
          fields: [
            {
              name: 'route',
              type: 'string',
              title: 'Page',
              options: {
                list: [
                  { title: 'Blog', value: 'blog' },
                  { title: 'Typefaces', value: 'typefaces' },
                  { title: 'In Use', value: 'in-use' },
                ],
                layout: 'dropdown',
              },
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: { route: 'route' },
            prepare: ({ route }) => ({
              title: route === 'blog' ? 'Blog' : route === 'typefaces' ? 'Typefaces' : route === 'in-use' ? 'In Use' : route || 'Select',
            }),
          },
        },
        {
          type: 'object',
          name: 'externalLink',
          title: 'External link',
          fields: [
            { name: 'label', type: 'string', title: 'Label', validation: (Rule) => Rule.required() },
            { name: 'url', type: 'url', title: 'URL', validation: (Rule) => Rule.required() },
          ],
          preview: {
            select: { label: 'label' },
            prepare: ({ label }) => ({ title: label || 'External link' }),
          },
        },
      ],
    }),
  ],
});
