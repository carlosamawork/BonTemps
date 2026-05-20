import { StretchIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

const SIZE_TITLES: Record<string, string> = {
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
  xl: 'XL',
}

export default defineType({
  name: 'module.spacer',
  title: 'Spacer',
  type: 'object',
  icon: StretchIcon,
  description: 'Vertical spacing between modules.',
  fields: [
    defineField({
      name: 'size',
      title: 'Size',
      type: 'string',
      options: {
        list: [
          { title: 'Small', value: 'small' },
          { title: 'Medium', value: 'medium' },
          { title: 'Large', value: 'large' },
          { title: 'XL', value: 'xl' },
        ],
        layout: 'radio',
      },
      initialValue: 'medium',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { size: 'size' },
    prepare({ size }) {
      return {
        title: 'Spacer',
        subtitle: SIZE_TITLES[size as string] ?? '—',
      }
    },
  },
})
