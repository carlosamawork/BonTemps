import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'media.video',
  title: 'Video',
  type: 'object',
  fields: [
    defineField({
      name: 'video',
      title: 'Video',
      type: 'module.video',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
  ],
  preview: {
    select: { title: 'video.title', caption: 'caption' },
    prepare({ title, caption }) {
      return { title: caption || title || 'Video', subtitle: 'Video' }
    },
  },
})
