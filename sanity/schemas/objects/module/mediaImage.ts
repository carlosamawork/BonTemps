import { defineField, defineType } from 'sanity'

import { isComingSoon } from '../../../utils/comingSoon'

export default defineType({
  name: 'media.image',
  title: 'Image',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) =>
        Rule.custom((value, context) =>
          isComingSoon(context) ? true : value ? true : 'Required',
        ),
    }),
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description: 'Alt description for screen readers and SEO. Required.',
      validation: (Rule) =>
        Rule.max(200).custom((value, context) =>
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
    select: { title: 'alt', media: 'image' },
    prepare({ title, media }) {
      return { title: title || 'Image', media }
    },
  },
})
