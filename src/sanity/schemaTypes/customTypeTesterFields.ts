import { defineField } from 'sanity';

/** Fields only for custom (standalone) type testers — not the default Fontdue collection list. */
export const customTypeTesterFields = [
  defineField({
    name: 'testerStyleName',
    title: 'Style / weight',
    type: 'string',
    description:
      'Exact Fontdue style name for this family (e.g. Regular, Bold, Medium Italic). Must match the name in Fontdue admin.',
    hidden: ({ parent }) => parent?.sectionType !== 'customTypeTester',
    validation: (Rule) =>
      Rule.custom((value, context) => {
        const parent = context.parent as { sectionType?: string };
        if (parent?.sectionType !== 'customTypeTester') return true;
        if (!value?.trim()) return 'Enter a style name';
        return true;
      }),
  }),
  defineField({
    name: 'testerContent',
    title: 'Sample text',
    type: 'text',
    rows: 6,
    description: 'Text shown in the custom type tester.',
    hidden: ({ parent }) => parent?.sectionType !== 'customTypeTester',
    validation: (Rule) =>
      Rule.custom((value, context) => {
        const parent = context.parent as { sectionType?: string };
        if (parent?.sectionType !== 'customTypeTester') return true;
        if (!value?.trim()) return 'Add sample text';
        return true;
      }),
  }),
  defineField({
    name: 'testerColumns',
    title: 'Columns',
    type: 'string',
    description: 'Split the sample text across columns that fill the full content width.',
    options: {
      list: [
        { title: '2 columns', value: '2' },
        { title: '3 columns', value: '3' },
      ],
      layout: 'radio',
    },
    initialValue: '2',
    hidden: ({ parent }) => parent?.sectionType !== 'customTypeTester',
    validation: (Rule) =>
      Rule.custom((value, context) => {
        const parent = context.parent as { sectionType?: string };
        if (parent?.sectionType !== 'customTypeTester') return true;
        if (value !== '2' && value !== '3') return 'Choose 2 or 3 columns';
        return true;
      }),
  }),
  defineField({
    name: 'testerColumnGap',
    title: 'Column gap',
    type: 'string',
    description: 'Gap between columns — e.g. 1em, 1.5rem, 24px. Default 1em.',
    initialValue: '1em',
    hidden: ({ parent }) => parent?.sectionType !== 'customTypeTester',
    validation: (Rule) =>
      Rule.custom((value, context) => {
        const parent = context.parent as { sectionType?: string };
        if (parent?.sectionType !== 'customTypeTester') return true;
        const gap = value?.trim();
        if (!gap) return 'Enter a gap (e.g. 1em)';
        if (!/^-?[\d.]+(?:em|rem|px|%|ch|ex|vw|vh)$/i.test(gap)) {
          return 'Use a CSS length like 1em, 1.5rem, or 24px';
        }
        return true;
      }),
  }),
  defineField({
    name: 'testerFontSize',
    title: 'Font size (px)',
    type: 'number',
    description: 'Optional initial size in pixels. Leave empty for Fontdue’s default.',
    hidden: ({ parent }) => parent?.sectionType !== 'customTypeTester',
    validation: (Rule) => Rule.min(8).max(512).integer(),
  }),
  defineField({
    name: 'testerLineHeight',
    title: 'Line height',
    type: 'number',
    description: 'Unitless line height for the sample text. Default 1.5.',
    initialValue: 1.5,
    hidden: ({ parent }) => parent?.sectionType !== 'customTypeTester',
    validation: (Rule) => Rule.min(0.8).max(3).precision(2),
  }),
];
