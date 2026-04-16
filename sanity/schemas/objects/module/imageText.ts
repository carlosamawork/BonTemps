import { InlineElementIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'module.imageText',
  title: 'Image + Text',
  type: 'object',
  icon: InlineElementIcon,
  fields: [
    defineField({
      name: 'imageSide',
      title: 'Image side',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Right', value: 'right' },
        ],
        layout: 'radio',
      },
      initialValue: 'left',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mediaType',
      title: 'Media type',
      type: 'string',
      options: {
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Video', value: 'video' },
        ],
        layout: 'radio',
      },
      initialValue: 'image',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'media.image',
      hidden: ({ parent }) => parent?.mediaType !== 'image',
    }),
    defineField({
      name: 'video',
      title: 'Video',
      type: 'media.video',
      hidden: ({ parent }) => parent?.mediaType !== 'video',
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
      imageSide: 'imageSide',
      mediaType: 'mediaType',
    },
    prepare({ imageSide, mediaType }) {
      return {
        title: 'Image + Text',
        subtitle: `${mediaType ?? 'image'} · ${imageSide ?? 'left'}`,
      }
    },
  },
})
