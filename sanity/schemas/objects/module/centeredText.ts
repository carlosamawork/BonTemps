import { TextIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'module.centeredText',
  title: 'Centered Text',
  type: 'object',
  icon: TextIcon,
  fields: [
    defineField({
      name: 'body',
      title: 'Body',
      type: 'bodyBonTemps',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Centered Text' }
    },
  },
})
