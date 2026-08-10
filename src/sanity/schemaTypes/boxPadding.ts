import { defineField, defineType } from 'sanity';
import { BoxPaddingInput, createBoxPaddingInput } from '../components/BoxPaddingInput';

export const boxPaddingInitialValue = {
  top: 40,
  right: 40,
  bottom: 44,
  left: 40,
};

export const aboutBoxPaddingInitialValue = {
  top: 32,
  right: 32,
  bottom: 36,
  left: 32,
};

export const verticalPaddingInitialValue = {
  top: 32,
  bottom: 32,
};

export const contentImagePaddingInitialValue = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

export const contentImagePaddingFields = [
  defineField({ name: 'top', type: 'number', title: 'Top', initialValue: 0 }),
  defineField({ name: 'right', type: 'number', title: 'Right', initialValue: 0 }),
  defineField({ name: 'bottom', type: 'number', title: 'Bottom', initialValue: 0 }),
  defineField({ name: 'left', type: 'number', title: 'Left', initialValue: 0 }),
];

export const boxPaddingFields = [
  defineField({ name: 'top', type: 'number', title: 'Top', initialValue: 40 }),
  defineField({ name: 'right', type: 'number', title: 'Right', initialValue: 40 }),
  defineField({ name: 'bottom', type: 'number', title: 'Bottom', initialValue: 44 }),
  defineField({ name: 'left', type: 'number', title: 'Left', initialValue: 40 }),
];

export const verticalPaddingFields = [
  defineField({ name: 'top', type: 'number', title: 'Top', initialValue: 32 }),
  defineField({ name: 'bottom', type: 'number', title: 'Bottom', initialValue: 32 }),
];

export const boxPaddingType = defineType({
  name: 'boxPadding',
  title: 'Padding',
  type: 'object',
  fields: boxPaddingFields,
});

export const boxPaddingField = (title = 'Padding', description?: string) =>
  defineField({
    name: 'padding',
    type: 'object',
    title,
    description,
    fields: boxPaddingFields,
    initialValue: boxPaddingInitialValue,
    components: {
      input: BoxPaddingInput,
    },
  });

export const verticalPaddingField = (
  name: string,
  title = 'Padding',
  description?: string,
) =>
  defineField({
    name,
    type: 'object',
    title,
    description,
    fields: verticalPaddingFields,
    initialValue: verticalPaddingInitialValue,
    components: {
      input: createBoxPaddingInput(['top', 'bottom'], {
        title,
        preset: 'vertical',
      }),
    },
  });

export const bottomPaddingField = (
  name: string,
  title = 'Bottom padding',
  description?: string,
  initialBottom = 36,
) =>
  defineField({
    name,
    type: 'object',
    title,
    description,
    fields: [
      defineField({
        name: 'bottom',
        type: 'number',
        title: 'Bottom',
        initialValue: initialBottom,
      }),
    ],
    initialValue: { bottom: initialBottom },
    components: {
      input: createBoxPaddingInput(['bottom'], {
        title,
        preset: 'hero',
      }),
    },
  });

export const contentImagePaddingField = (
  title = 'Padding',
  description = 'Space around this image. Leave empty for none.',
) =>
  defineField({
    name: 'padding',
    type: 'object',
    title,
    description,
    fields: contentImagePaddingFields,
    initialValue: contentImagePaddingInitialValue,
    components: {
      input: createBoxPaddingInput(undefined, {
        title,
        preset: 'content',
      }),
    },
  });
