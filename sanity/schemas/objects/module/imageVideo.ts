import { ImagesIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'
import { ImageVideoInput } from '../../../components/ImageVideoInput'

export default defineType({
  name: 'module.imageVideo',
  title: 'Image / Video',
  type: 'object',
  icon: ImagesIcon,
  components: { input: ImageVideoInput },
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

    // Layout options for 1 column
    defineField({
      name: 'layout1col',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Option A — Landscape 3×2 (1350×900)', value: 'optionA' },
          { title: 'Option B — Widescreen 16×9 (1920×1080, top aligned)', value: 'optionB' },
        ],
        layout: 'radio',
      },
      initialValue: 'optionA',
      hidden: ({ parent }) => parent?.columns !== 1,
    }),

    // Layout options for 2 columns
    defineField({
      name: 'layout2col',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Option A — Half / half vertical (4×5 · 4×5)', value: 'optionA' },
          { title: 'Option B — Big landscape + small vertical (3×2 · 4×5)', value: 'optionB' },
          { title: 'Option C — Wide top-aligned + vertical (5×4 · 4×5)', value: 'optionC' },
        ],
        layout: 'radio',
      },
      initialValue: 'optionA',
      hidden: ({ parent }) => parent?.columns !== 2,
    }),

    // Layout options for 3 columns (only one option, shown as info)
    defineField({
      name: 'layout3col',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Option A — Triple vertical (4×5 · 4×5 · 4×5)', value: 'optionA' },
        ],
        layout: 'radio',
      },
      initialValue: 'optionA',
      hidden: ({ parent }) => parent?.columns !== 3,
    }),

    // Reverse order — only for 2 columns, Option B
    defineField({
      name: 'reverseOrder',
      title: 'Reverse order (small first, big second)',
      type: 'boolean',
      initialValue: false,
      hidden: ({ parent }) => !(parent?.columns === 2 && parent?.layout2col === 'optionB'),
    }),

    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        { type: 'media.image' },
        { type: 'media.video' },
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
      layout1col: 'layout1col',
      layout2col: 'layout2col',
      layout3col: 'layout3col',
    },
    prepare({ columns, layout1col, layout2col, layout3col }) {
      const layout = columns === 1 ? layout1col : columns === 2 ? layout2col : layout3col
      return {
        title: 'Image / Video',
        subtitle: `${columns} col · ${layout ?? ''}`,
      }
    },
  },
})
