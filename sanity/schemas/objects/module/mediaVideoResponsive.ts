import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'media.videoResponsive',
  title: 'Video (responsive)',
  type: 'object',
  description: 'Use only on Information page where breakpoint art-direction is required.',
  fields: [
    defineField({
      name: 'desktop',
      title: 'Desktop video',
      type: 'module.video',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'ipad',
      title: 'iPad video (optional)',
      type: 'module.video',
    }),
    defineField({
      name: 'mobile',
      title: 'Mobile video (optional)',
      type: 'module.video',
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
  ],
  preview: {
    select: { title: 'desktop.title', media: 'desktop.poster' },
    prepare({ title, media }) {
      return { title: title || 'Responsive video', media }
    },
  },
})
