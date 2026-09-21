import { defineType, defineArrayMember } from 'sanity';
import { imageDisplayFields } from './imageDisplayFields';

export const blockContentType = defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H1', value: 'h1' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
        ],
        annotations: [
          {
            title: 'Link',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'Link type',
                name: 'linkType',
                type: 'string',
                options: {
                  list: [
                    { title: 'Page', value: 'page' },
                    { title: 'Built-in page', value: 'builtIn' },
                    { title: 'URL', value: 'url' },
                    { title: 'Email', value: 'email' },
                  ],
                  layout: 'radio',
                },
                initialValue: 'page',
              },
              {
                title: 'Page',
                name: 'page',
                type: 'reference',
                to: [{ type: 'page' }, { type: 'typeface' }],
                description: 'CMS page or typeface detail page.',
                hidden: ({ parent }) => parent?.linkType !== 'page',
                validation: (Rule) =>
                  Rule.custom((page, context) => {
                    const linkType = (context.parent as { linkType?: string })?.linkType;
                    if (linkType !== 'page') return true;
                    if (!page) return 'Select a page';
                    return true;
                  }),
              },
              {
                title: 'Built-in page',
                name: 'route',
                type: 'string',
                options: {
                  list: [
                    { title: 'Blog', value: 'blog' },
                    { title: 'Typefaces', value: 'typefaces' },
                    { title: 'In Use', value: 'fonts-in-use' },
                  ],
                  layout: 'dropdown',
                },
                hidden: ({ parent }) => parent?.linkType !== 'builtIn',
                validation: (Rule) =>
                  Rule.custom((route, context) => {
                    const linkType = (context.parent as { linkType?: string })?.linkType;
                    if (linkType !== 'builtIn') return true;
                    if (!route) return 'Select a page';
                    return true;
                  }),
              },
              {
                title: 'URL',
                name: 'href',
                type: 'url',
                hidden: ({ parent }) => parent?.linkType !== 'url',
                validation: (Rule) =>
                  Rule.custom((href, context) => {
                    const linkType = (context.parent as { linkType?: string })?.linkType ?? 'url';
                    if (linkType !== 'url') return true;
                    if (!href) return 'URL is required';
                    return true;
                  }),
              },
              {
                title: 'Email address',
                name: 'email',
                type: 'string',
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
              {
                title: 'Open in',
                name: 'openInNewTab',
                type: 'string',
                options: {
                  list: [
                    { title: 'Same tab', value: 'same' },
                    { title: 'New tab', value: 'new' },
                  ],
                  layout: 'radio',
                },
                initialValue: 'same',
                description: 'Same tab is the default. Choose New tab for external or secondary destinations.',
                hidden: ({ parent }) => parent?.linkType === 'email',
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      options: { hotspot: true },
      fields: imageDisplayFields(),
    }),
  ],
});
