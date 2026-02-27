import { defineField, defineType } from 'sanity';

export const pagePageSectionType = defineType({
  name: 'pagePageSection',
  title: 'Page section',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionType',
      type: 'string',
      title: 'Section type',
      options: {
        list: [
          { title: 'Type tester', value: 'typeTester' },
          { title: 'Character viewer', value: 'characterViewer' },
          { title: 'Buy button', value: 'buyButton' },
          { title: 'Custom content', value: 'content' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'typeface',
      type: 'reference',
      to: [{ type: 'typeface' }],
      title: 'Typeface',
      description: 'Required for Type tester, Character viewer, and Buy button. Select which typeface to display.',
      hidden: ({ parent }) => parent?.sectionType === 'content',
      validation: (Rule) =>
        Rule.custom((typeface, context) => {
          const parent = context?.parent as { sectionType?: string };
          if (parent?.sectionType !== 'content' && !typeface) {
            return 'Select a typeface for this section';
          }
          return true;
        }),
    }),
    defineField({
      name: 'content',
      type: 'blockContent',
      title: 'Content',
      description: 'Rich text and images. Only used when section type is "Custom content".',
      hidden: ({ parent }) => parent?.sectionType !== 'content',
    }),
  ],
  preview: {
    select: { sectionType: 'sectionType', title: 'typeface.name' },
    prepare({ sectionType, title }) {
      const labels: Record<string, string> = {
        typeTester: 'Type tester',
        characterViewer: 'Character viewer',
        buyButton: 'Buy button',
        content: 'Custom content',
      };
      const label = labels[sectionType] ?? sectionType;
      return { title: title ? `${label} (${title})` : label };
    },
  },
});
