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
      name: 'siteIdentity',
      type: 'object',
      title: 'Site identity & SEO',
      description: 'Favicon, default meta tags, social sharing, and analytics.',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: 'siteName',
          type: 'string',
          title: 'Site name',
          description: 'Used for Open Graph site name and title fallbacks.',
          initialValue: 'Haus Type®',
        }),
        defineField({
          name: 'titleSuffix',
          type: 'string',
          title: 'Title suffix',
          description: 'Appended to page titles in the browser tab, e.g. " | Haus Type®".',
          initialValue: ' | Haus Type®',
        }),
        defineField({
          name: 'homeTitle',
          type: 'string',
          title: 'Homepage title',
          description: 'Full <title> for the homepage (suffix is not added).',
          initialValue: 'Haus Type | Type Foundry',
        }),
        defineField({
          name: 'defaultDescription',
          type: 'text',
          title: 'Default meta description',
          rows: 3,
          description: 'Fallback when a page does not set its own description.',
          initialValue:
            'Haus Type is a type foundry creating versatile Latin type for text and display. Retail and custom typefaces for global businesses.',
        }),
        defineField({
          name: 'homeDescription',
          type: 'text',
          title: 'Homepage meta description',
          rows: 3,
          description: 'Optional. When empty, the homepage uses the about text.',
        }),
        defineField({
          name: 'favicon',
          type: 'image',
          title: 'Favicon',
          description: 'SVG or square PNG. Shown in browser tabs.',
          options: { accept: '.svg,image/png,image/webp,image/x-icon' },
        }),
        defineField({
          name: 'appleTouchIcon',
          type: 'image',
          title: 'Apple touch icon',
          description: 'Optional. 180×180 PNG recommended for iOS home screen.',
          options: { accept: 'image/png,image/webp' },
        }),
        defineField({
          name: 'defaultShareImage',
          type: 'image',
          title: 'Default share image',
          description: 'Open Graph / social preview fallback. 1200×630 recommended.',
          options: { hotspot: true },
        }),
        defineField({
          name: 'themeColor',
          type: 'string',
          title: 'Browser theme color',
          description: 'Mobile browser chrome. Hex value, e.g. #eeeeee or #ffcc01.',
          initialValue: '#eeeeee',
          validation: (Rule) =>
            Rule.regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, {
              name: 'hex color',
              invert: false,
            }).warning('Use a hex color like #eeeeee'),
        }),
        defineField({
          name: 'twitterHandle',
          type: 'string',
          title: 'Twitter / X handle',
          description: 'Without @, e.g. haustype',
        }),
        defineField({
          name: 'googleAnalyticsId',
          type: 'string',
          title: 'Google Analytics ID',
          description: 'GA4 measurement ID, e.g. G-XXXXXXXXXX',
          validation: (Rule) =>
            Rule.custom((value) => {
              const id = typeof value === 'string' ? value.trim() : '';
              if (!id) return true;
              return /^G-[A-Z0-9]+$/.test(id) ? true : 'Use a GA4 measurement ID like G-XXXXXXXXXX';
            }),
        }),
      ],
    }),
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
