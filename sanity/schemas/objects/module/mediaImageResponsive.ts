import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'media.imageResponsive',
  title: 'Image (responsive)',
  type: 'object',
  description: 'Use only on Information page where breakpoint art-direction is required.',
  fields: [
    defineField({
      name: 'desktop',
      title: 'Desktop image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'ipad',
      title: 'iPad image (optional)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'mobile',
      title: 'Mobile image (optional)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      validation: (Rule) => Rule.required().min(1).max(200),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
  ],
  preview: {
    select: { title: 'alt', media: 'desktop' },
    prepare({ title, media }) {
      return { title: title || 'Responsive image', media }
    },
  },
})
