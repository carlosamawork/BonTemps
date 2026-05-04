import { UsersIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'module.informationClients',
  title: 'Clients list (Information)',
  type: 'object',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Section title',
      type: 'string',
      initialValue: 'Clients',
    }),
    defineField({
      name: 'items',
      title: 'Clients',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'clientEntry',
          fields: [
            defineField({
              name: 'name',
              title: 'Client name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'location',
              title: 'Location',
              type: 'string',
            }),
            defineField({
              name: 'projectRef',
              title: 'Linked project (optional)',
              type: 'reference',
              to: [{ type: 'project' }],
              description: 'When set, the row links to /work/<slug>.',
            }),
          ],
          preview: { select: { title: 'name', subtitle: 'location' } },
        },
      ],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: { title: 'title', count: 'items.length' },
    prepare({ title, count }) {
      return {
        title: title || 'Clients',
        subtitle: `${count || 0} client${count === 1 ? '' : 's'}`,
      }
    },
  },
})
