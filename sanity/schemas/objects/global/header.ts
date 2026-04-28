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
    // Contact email
    defineField({
      name: 'contactEmail',
      title: 'Contact email',
      type: 'string',
      description: 'Single source for the Contact button (header). Tap = copy to clipboard.',
      validation: (Rule) => Rule.required().email(),
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
