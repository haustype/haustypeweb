import { defineField, defineType } from 'sanity';

export const typefacePageSectionType = defineType({
  name: 'typefacePageSection',
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
      name: 'content',
      type: 'blockContent',
      title: 'Content',
      description: 'Rich text and images. Only used when section type is "Custom content".',
      hidden: ({ parent }) => parent?.sectionType !== 'content',
    }),
  ],
  preview: {
    select: { sectionType: 'sectionType' },
    prepare({ sectionType }) {
      const labels: Record<string, string> = {
        typeTester: 'Type tester',
        characterViewer: 'Character viewer',
        buyButton: 'Buy button',
        content: 'Custom content',
      };
      return { title: labels[sectionType] ?? sectionType };
    },
  },
});
