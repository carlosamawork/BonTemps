import {DocumentVideoIcon} from '@sanity/icons'
import {defineField} from 'sanity'

export default defineField({
  name: 'module.video',
  title: 'Video',
  type: 'object',
  icon: DocumentVideoIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Internal title',
      type: 'string',
      description: 'For Sanity preview only.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'poster',
      title: 'Poster (still frame)',
      type: 'image',
      options: {hotspot: true},
      description:
        'Shown before the video plays and as a fallback if the HLS source fails to load.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL (HLS .m3u8)',
      type: 'url',
      description:
        'Direct HLS streaming URL from Vimeo Pro (must end in .m3u8). Do not use embed/iframe URLs.',
      validation: (Rule) =>
        Rule.required()
          .uri({scheme: ['https']})
          .custom((value) => {
            if (!value) return true
            return value.includes('.m3u8')
              ? true
              : 'URL should typically end with .m3u8 (HLS manifest).'
          })
          .warning(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'poster',
    },
    prepare({title, media}) {
      return {title, media}
    },
  },
})
