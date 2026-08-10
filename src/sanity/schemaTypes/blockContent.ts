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
                    { title: 'URL', value: 'url' },
                    { title: 'Email', value: 'email' },
                  ],
                  layout: 'radio',
                },
                initialValue: 'url',
              },
              {
                title: 'URL',
                name: 'href',
                type: 'url',
                hidden: ({ parent }) => parent?.linkType === 'email',
                validation: (Rule) =>
                  Rule.custom((href, context) => {
                    const linkType = (context.parent as { linkType?: string })?.linkType ?? 'url';
                    if (linkType === 'email') return true;
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
