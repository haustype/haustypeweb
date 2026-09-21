import { defineField, defineType } from 'sanity';
import { customTypeTesterFields } from './customTypeTesterFields';

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
    defineField({
      name: 'typeface',
      type: 'reference',
      to: [{ type: 'typeface' }],
      title: 'Typeface',
      description:
        'Required for type tester, custom type tester, character viewer, and buy button.',
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
      title: 'typeface.name',
      testerStyleName: 'testerStyleName',
      testerColumns: 'testerColumns',
    },
    prepare({ sectionType, title, testerStyleName, testerColumns }) {
      const labels: Record<string, string> = {
        typeTester: 'Type testers (Fontdue)',
        customTypeTester: 'Custom type tester',
        characterViewer: 'Character viewer',
        buyButton: 'Buy button',
        content: 'Custom content',
      };
      const label = labels[sectionType] ?? sectionType;
      const heading = title ? `${label} (${title})` : label;
      if (sectionType !== 'customTypeTester') return { title: heading };
      const style = testerStyleName?.trim() || 'Style?';
      const cols = testerColumns === '3' ? '3 cols' : '2 cols';
      return { title: heading, subtitle: `${style} · ${cols}` };
    },
  },
});
