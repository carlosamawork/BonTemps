import { ImagesIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'module.imageVideo',
  title: 'Columns (Image / Video / Text)',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'columns',
      title: 'Number of columns',
      type: 'number',
      options: {
        list: [
          { title: '1 column', value: 1 },
          { title: '2 columns', value: 2 },
          { title: '3 columns', value: 3 },
        ],
        layout: 'radio',
      },
      initialValue: 1,
      validation: (Rule) => Rule.required().min(1).max(3),
    }),

    defineField({
      name: 'items',
      title: 'Items',
      description: 'One item per column. Each item can be an image, a video, or a text block.',
      type: 'array',
      of: [
        { type: 'media.image' },
        { type: 'media.video' },
        { type: 'column.text' },
      ],
      validation: (Rule) =>
        Rule.required().custom((items, context) => {
          const columns = (context.parent as { columns?: number })?.columns ?? 1
          const count = (items as unknown[])?.length ?? 0
          if (count !== columns) {
            return `This layout requires exactly ${columns} item(s). You have ${count}.`
          }
          return true
        }),
    }),
  ],
  preview: {
    select: {
      columns: 'columns',
      item0: 'items.0._type',
      item1: 'items.1._type',
      item2: 'items.2._type',
    },
    prepare({ columns, item0, item1, item2 }) {
      const types = [item0, item1, item2].filter(Boolean).map((t: string) => {
        if (t === 'media.image') return 'img'
        if (t === 'media.video') return 'video'
        if (t === 'column.text') return 'text'
        return t
      })
      return {
        title: 'Columns',
        subtitle: `${columns} col · ${types.join(' · ')}`,
      }
    },
  },
})
