import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'media.image',
  title: 'Image',
  type: 'object',
  fields: [
    defineField({
      name: 'desktop',
      title: 'Desktop',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'ipad',
      title: 'iPad',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'mobile',
      title: 'Mobile',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      media: 'desktop',
      caption: 'caption',
    },
    prepare({ media, caption }) {
      return {
        title: caption || 'Image',
        media,
      }
    },
  },
})
