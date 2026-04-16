import { TextIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'module.pageTextColumn',
  title: 'Text Column',
  type: 'object',
  icon: TextIcon,
  fields: [
    defineField({
      name: 'bodies',
      title: 'Text columns',
      description: 'Each item is a body column',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'bodyItem',
          title: 'Column',
          fields: [
            defineField({
              name: 'body',
              title: 'Body',
              type: 'bodyBonTemps',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            prepare() {
              return { title: 'Column' }
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      count: 'bodies',
    },
    prepare({ count }) {
      const n = Array.isArray(count) ? count.length : 0
      return {
        title: 'Text Column',
        subtitle: `${n} column(s)`,
      }
    },
  },
})
