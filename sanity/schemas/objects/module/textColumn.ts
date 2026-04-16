import { ThListIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'module.textColumn',
  title: 'Text Column',
  type: 'object',
  icon: ThListIcon,
  fields: [
    
    defineField({
      name: 'columns',
      title: 'Grid columns',
      description: 'Total number of columns in the grid',
      type: 'number',
      options: {
        list: [
          { title: '1', value: 1 },
          { title: '2', value: 2 },
          { title: '3', value: 3 },
        ],
        layout: 'radio',
      },
      initialValue: 1,
      validation: (Rule) => Rule.required().min(1).max(3),
    }),
    defineField({
      name: 'span',
      title: 'Column span',
      description: 'How many columns this block occupies',
      type: 'number',
      options: {
        list: [
          { title: '1', value: 1 },
          { title: '2', value: 2 },
          { title: '3', value: 3 },
        ],
        layout: 'radio',
      },
      initialValue: 1,
      validation: (Rule) =>
        Rule.required().custom((span, context) => {
          const columns = (context.parent as { columns?: number })?.columns ?? 1
          if (!span || span > columns) {
            return `Span cannot exceed the number of columns (${columns})`
          }
          return true
        }),
      hidden: ({ parent }) => !parent?.columns,
    }),
    defineField({
      name: 'columnStart',
      title: 'Start at column',
      description: 'Which column this block starts on',
      type: 'number',
      options: {
        list: [
          { title: '1', value: 1 },
          { title: '2', value: 2 },
          { title: '3', value: 3 },
        ],
        layout: 'radio',
      },
      initialValue: 1,
      validation: (Rule) =>
        Rule.custom((columnStart, context) => {
          const parent = context.parent as { columns?: number; span?: number }
          const columns = parent?.columns ?? 1
          const span = parent?.span ?? 1
          if (!columnStart) return true
          if (columnStart + span - 1 > columns) {
            return `Column start (${columnStart}) + span (${span}) exceeds the grid (${columns} columns)`
          }
          return true
        }),
      hidden: ({ parent }) => !parent?.columns || !parent?.span || parent?.span >= parent?.columns,
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'bodyBonTemps',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      columns: 'columns',
      span: 'span',
      columnStart: 'columnStart',
      firstBlock: 'body.0.children.0.text',
    },
    prepare({ columns, span, columnStart, firstBlock }) {
      return {
        title: firstBlock || 'Text Column',
        subtitle: `Grid ${columns} · Span ${span ?? 1} · Start ${columnStart ?? 1}`,
      }
    },
  },
})
