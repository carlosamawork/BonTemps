import { defineField, defineType } from 'sanity'

import { isComingSoon } from '../../../utils/comingSoon'

export default defineType({
  name: 'media.video',
  title: 'Video',
  type: 'object',
  fields: [
    defineField({
      name: 'video',
      title: 'Video',
      type: 'module.video',
      validation: (Rule) =>
        Rule.custom((value, context) =>
          isComingSoon(context) ? true : value ? true : 'Required',
        ),
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
