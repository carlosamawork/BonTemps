import { TextIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'column.text',
  title: 'Text',
  type: 'object',
  icon: TextIcon,
  fields: [
    defineField({
      name: 'body',
      title: 'Body',
      type: 'bodyBonTemps',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      firstBlock: 'body.0.children.0.text',
    },
    prepare({ firstBlock }) {
      return {
        title: firstBlock || 'Text',
        subtitle: 'Text column',
      }
    },
  },
})
