import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'media.video',
  title: 'Video',
  type: 'object',
  fields: [
    defineField({
      name: 'desktop',
      title: 'Desktop',
      type: 'module.video',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'ipad',
      title: 'iPad',
      type: 'module.video',
    }),
    defineField({
      name: 'mobile',
      title: 'Mobile',
      type: 'module.video',
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'desktop.title',
      caption: 'caption',
    },
    prepare({ title, caption }) {
      return {
        title: caption || title || 'Video',
        subtitle: 'Video',
      }
    },
  },
})
