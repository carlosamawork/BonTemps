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
        'Shown before the video plays and as a fallback if the source fails to load.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description:
        'Direct video URL (e.g. .mp4 or HLS .m3u8). Do not use embed/iframe URLs.',
      validation: (Rule) => Rule.required().uri({scheme: ['https']}),
    }),
    defineField({
      name: 'soundEnabled',
      title: 'Enable sound control',
      type: 'boolean',
      description:
        'Show a "Sound On / Sound Off" button over the video (single projects only). Enable it just for videos that actually have audio. Videos always start muted.',
      initialValue: false,
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
