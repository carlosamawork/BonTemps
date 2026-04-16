import { defineField } from 'sanity'

export default defineField({
  name: 'headerSettings',
  title: 'Header',
  type: 'object',
  options: {
    collapsed: false,
    collapsible: true,
  },
  fields: [
    // Links
    defineField({
      name: 'headerMenu',
      title: 'Header Links',
      type: 'menuLinks',
    }),
    // Instagram
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
      validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
    }),
  ],
})
