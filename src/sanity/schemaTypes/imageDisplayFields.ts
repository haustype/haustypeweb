import { defineField } from 'sanity';

export function imageDisplayFields(options?: {
  aspectDefault?: 'auto' | '2/1' | '4/3' | '16/9' | '4/5';
  fitDefault?: 'contain' | 'cover';
}) {
  const aspectDefault = options?.aspectDefault ?? 'auto';
  const fitDefault = options?.fitDefault ?? 'contain';

  return [
    defineField({
      name: 'alt',
      type: 'string',
      title: 'Alternative text',
    }),
    defineField({
      name: 'columnSpan',
      type: 'string',
      title: 'Width on page',
      description:
        'How many grid columns the image spans from column 4. Text stays 5 columns; images can extend to 6 or 9.',
      options: {
        list: [
          { title: '6 columns', value: '6' },
          { title: '9 columns (full bleed)', value: '9' },
        ],
        layout: 'radio',
      },
      initialValue: '6',
    }),
    defineField({
      name: 'aspectRatio',
      type: 'string',
      title: 'Frame ratio',
      description: 'Constrains the image frame on the site. “Fit” shows the full image inside the frame without stretching.',
      options: {
        list: [
          { title: 'Natural (image height)', value: 'auto' },
          { title: '2:1 wide', value: '2/1' },
          { title: '4:3', value: '4/3' },
          { title: '16:9', value: '16/9' },
          { title: '4:5 portrait', value: '4/5' },
        ],
        layout: 'radio',
      },
      initialValue: aspectDefault,
    }),
    defineField({
      name: 'fit',
      type: 'string',
      title: 'Fit mode',
      description: 'Fit: letterbox inside the frame (no stretch). Fill: crop to fill the frame (uses hotspot focal point).',
      options: {
        list: [
          { title: 'Fit (no stretch)', value: 'contain' },
          { title: 'Fill (crop to ratio)', value: 'cover' },
        ],
        layout: 'radio',
      },
      initialValue: fitDefault,
    }),
  ];
}
