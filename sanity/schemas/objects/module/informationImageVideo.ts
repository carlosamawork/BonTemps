import { ImagesIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'module.informationImageVideo',
  title: 'Image / Video (Information, responsive)',
  type: 'object',
  icon: ImagesIcon,
  description: 'Variant of pageImageVideo with desktop/ipad/mobile art-direction. Information page only.',
  fields: [
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'number',
      options: { list: [1, 2, 3] },
      validation: (Rule) => Rule.required().min(1).max(3),
      initialValue: 1,
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        { type: 'media.imageResponsive' },
        { type: 'media.videoResponsive' },
      ],
      validation: (Rule) => Rule.min(1).max(3),
    }),
    defineField({
      name: 'reverseOrderOnMobile',
      title: 'Reverse order on mobile',
      type: 'boolean',
      initialValue: false,
      hidden: ({ parent }) => !parent?.items || parent.items.length < 2,
    }),
  ],
  preview: {
    select: { columns: 'columns', count: 'items.length' },
    prepare({ columns, count }) {
      return {
        title: 'Image / Video (Info)',
        subtitle: `${count} item(s) in ${columns} column(s)`,
      }
    },
  },
})
