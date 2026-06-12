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
      name: 'screensaver',
      type: 'object',
      title: 'Screensaver',
      description: 'Fullscreen slideshow after inactivity on all pages except the blog.',
      fields: [
        defineField({
          name: 'enabled',
          type: 'boolean',
          title: 'Enabled',
          initialValue: true,
        }),
        defineField({
          name: 'idleSeconds',
          type: 'number',
          title: 'Idle time (seconds)',
          description: 'How long to wait without activity before the screensaver starts.',
          initialValue: 10,
          validation: (Rule) => Rule.required().min(1).max(300),
        }),
        defineField({
          name: 'slideSeconds',
          type: 'number',
          title: 'Seconds per image',
          description: 'How long each image is shown before fading to the next.',
          initialValue: 5,
          validation: (Rule) => Rule.required().min(1).max(120),
        }),
        defineField({
          name: 'fadeSeconds',
          type: 'number',
          title: 'Crossfade duration (seconds)',
          description: 'Length of the fade transition between images.',
          initialValue: 1,
          validation: (Rule) => Rule.required().min(0).max(10),
        }),
        defineField({
          name: 'slides',
          type: 'array',
          title: 'Images',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'image',
                  type: 'image',
                  title: 'Image',
                  options: { hotspot: true },
                  validation: (Rule) => Rule.required(),
                },
                { name: 'alt', type: 'string', title: 'Alt Text' },
              ],
              preview: {
                select: { alt: 'alt', media: 'image' },
                prepare: ({ alt, media }) => ({
                  title: alt || 'Screensaver slide',
                  media,
                }),
              },
            },
          ],
        }),
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
