import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'footerSettings',
  title: 'Footer',
  type: 'object',
  options: {
    collapsed: false,
    collapsible: true,
  },
  fields: [
    // Claim
    defineField({
      name: 'claim',
      title: 'Claim',
      type: 'bodyBonTemps',
    }),
    // Emails
    defineField({
      name: 'emails',
      title: 'Emails',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'emailEntry',
          title: 'Email',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'email',
              title: 'Email',
              type: 'string',
              validation: (Rule) => Rule.required().email(),
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'email' },
            prepare({ title, subtitle }) {
              return { title, subtitle }
            },
          },
        },
      ],
    }),
    // Socials
    defineField({
      name: 'socials',
      title: 'Socials',
      type: 'array',
      of: [{ type: 'linkSocial' }],
    }),
    // Copyright
    defineField({
      name: 'copyright',
      title: 'Copyright',
      type: 'string',
    }),
  ],
})
