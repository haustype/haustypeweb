import { defineField, defineType } from 'sanity';
import { customTypeTesterFields } from './customTypeTesterFields';

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
          { title: 'Type testers (from Fontdue)', value: 'typeTester' },
          { title: 'Custom type tester', value: 'customTypeTester' },
          { title: 'Character viewer', value: 'characterViewer' },
          { title: 'Buy button', value: 'buyButton' },
          { title: 'Custom content', value: 'content' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    ...customTypeTesterFields,
    defineField({
      name: 'content',
      type: 'blockContent',
      title: 'Content',
      description: 'Rich text and images. Only used when section type is "Custom content".',
      hidden: ({ parent }) => parent?.sectionType !== 'content',
    }),
  ],
  preview: {
    select: {
      sectionType: 'sectionType',
      testerStyleName: 'testerStyleName',
      testerColumns: 'testerColumns',
    },
    prepare({ sectionType, testerStyleName, testerColumns }) {
      const labels: Record<string, string> = {
        typeTester: 'Type testers (Fontdue)',
        customTypeTester: 'Custom type tester',
        characterViewer: 'Character viewer',
        buyButton: 'Buy button',
        content: 'Custom content',
      };
      const title = labels[sectionType] ?? sectionType;
      if (sectionType !== 'customTypeTester') return { title };
      const style = testerStyleName?.trim() || 'Style?';
      const cols = testerColumns === '3' ? '3 cols' : '2 cols';
      return { title, subtitle: `${style} · ${cols}` };
    },
  },
});
