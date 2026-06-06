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
    defineField({
      name: 'instagramUrl',
      type: 'url',
      title: 'Instagram URL',
      description: 'Shown in the site footer under Contact.',
    }),
    defineField({
      name: 'contactEmail',
      type: 'string',
      title: 'Contact email',
      description: 'Shown in the site footer under Contact.',
    }),
    defineField({
      name: 'footerNavigation',
      type: 'array',
      title: 'Footer navigation',
      description: 'Links shown in the footer Contact column. Pick pages, built-in routes, or add URL / email links. Drag to reorder.',
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
          title: 'Link',
          fields: [
            { name: 'label', type: 'string', title: 'Label', validation: (Rule) => Rule.required() },
            {
              name: 'linkType',
              type: 'string',
              title: 'Link type',
              options: {
                list: [
                  { title: 'URL', value: 'url' },
                  { title: 'Email', value: 'email' },
                ],
                layout: 'radio',
              },
              initialValue: 'url',
            },
            {
              name: 'url',
              type: 'url',
              title: 'URL',
              hidden: ({ parent }) => parent?.linkType === 'email',
              validation: (Rule) =>
                Rule.custom((url, context) => {
                  const linkType = (context.parent as { linkType?: string })?.linkType ?? 'url';
                  if (linkType === 'email') return true;
                  if (!url) return 'URL is required';
                  return true;
                }),
            },
            {
              name: 'email',
              type: 'string',
              title: 'Email address',
              hidden: ({ parent }) => parent?.linkType !== 'email',
              validation: (Rule) =>
                Rule.custom((email, context) => {
                  const linkType = (context.parent as { linkType?: string })?.linkType;
                  if (linkType !== 'email') return true;
                  if (!email?.trim()) return 'Email address is required';
                  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
                    return 'Enter a valid email address';
                  }
                  return true;
                }),
            },
          ],
          preview: {
            select: { label: 'label', linkType: 'linkType', email: 'email' },
            prepare: ({ label, linkType, email }) => ({
              title: label || (linkType === 'email' ? email : 'Link'),
            }),
          },
        },
      ],
    }),
    defineField({
      name: 'customCode',
      type: 'object',
      title: 'Custom Code',
      description: 'Inject custom HTML on every page — useful for overriding Fontdue plugin styles.',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: 'headEnd',
          type: 'text',
          title: 'End of <head>',
          rows: 14,
          description: 'Paste HTML such as <style> or <link> tags. Rendered at the end of <head>, after Fontdue assets.',
        }),
        defineField({
          name: 'bodyEnd',
          type: 'text',
          title: 'End of <body>',
          rows: 14,
          description: 'Paste HTML such as <style> or <script> tags. Rendered at the end of <body> on every page.',
        }),
      ],
    }),
  ],
});
