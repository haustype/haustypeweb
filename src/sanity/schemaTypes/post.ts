import { defineField, defineType } from 'sanity';

export const postType = defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', title: 'Title' }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: { source: 'title', maxLength: 96 },
    }),
    defineField({ name: 'description', type: 'string', title: 'Description' }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      title: 'Published Date',
    }),
    defineField({
      name: 'updatedAt',
      type: 'datetime',
      title: 'Updated Date',
    }),
    defineField({ name: 'author', type: 'string', title: 'Author' }),
    defineField({
      name: 'mainImage',
      type: 'image',
      title: 'Featured Image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alternative Text' }],
    }),
    defineField({
      name: 'draft',
      type: 'boolean',
      title: 'Draft',
      initialValue: false,
    }),
    defineField({
      name: 'body',
      type: 'blockContent',
      title: 'Body',
    }),
  ],
  preview: {
    select: { title: 'title', media: 'mainImage' },
  },
});
