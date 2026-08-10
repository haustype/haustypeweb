export const footerLinkItems = [
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
            { title: 'In Use', value: 'fonts-in-use' },
          ],
          layout: 'dropdown',
        },
        validation: (Rule) => Rule.required(),
      },
    ],
    preview: {
      select: { route: 'route' },
      prepare: ({ route }) => ({
        title:
          route === 'blog'
            ? 'Blog'
            : route === 'typefaces'
              ? 'Typefaces'
              : route === 'fonts-in-use' || route === 'in-use'
                ? 'In Use'
                : route || 'Select',
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
];
