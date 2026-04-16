import { DocumentsIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

import { validateSlug } from '../../utils/validateSlug'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: DocumentsIcon,
  groups: [
    { default: true, name: 'editorial', title: 'Editorial' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // Title
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'editorial',
    }),
    // Slug
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      // @ts-ignore
      validation: validateSlug,
      group: 'editorial',
    }),
    // Subtitle
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      group: 'editorial',
    }),
    // Excerpt
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      group: 'editorial',
    }),
    // Featured media type selector
    defineField({
      name: 'featuredMediaType',
      title: 'Featured media type',
      type: 'string',
      options: {
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Video', value: 'video' },
        ],
        layout: 'radio',
      },
      initialValue: 'image',
      group: 'editorial',
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'media.image',
      hidden: ({ document }) => document?.featuredMediaType !== 'image',
      group: 'editorial',
    }),
    defineField({
      name: 'featuredVideo',
      title: 'Featured Video',
      type: 'media.video',
      hidden: ({ document }) => document?.featuredMediaType !== 'video',
      group: 'editorial',
    }),
    // Services references
    defineField({
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'service' }] }],
      group: 'editorial',
    }),
    // Project Recap (body)
    defineField({
      name: 'projectRecap',
      title: 'Project Recap',
      type: 'bodyBonTemps',
      group: 'editorial',
    }),
    // Services body
    defineField({
      name: 'servicesBody',
      title: 'Services',
      type: 'bodyBonTemps',
      group: 'editorial',
    }),
    // Custom Typeface body
    defineField({
      name: 'customTypeface',
      title: 'Custom Typeface',
      type: 'bodyBonTemps',
      group: 'editorial',
    }),
    // Bon Temps Team body
    defineField({
      name: 'bonTempsTeam',
      title: 'Bon Temps Team',
      type: 'bodyBonTemps',
      group: 'editorial',
    }),
    // Collaborators body
    defineField({
      name: 'collaborators',
      title: 'Collaborators',
      type: 'bodyBonTemps',
      group: 'editorial',
    }),
    // Related Projects
    defineField({
      name: 'relatedProjects',
      title: 'Related Projects',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'project' }] }],
      group: 'editorial',
    }),
    // Modules
    defineField({
      name: 'modules',
      title: 'Modules',
      type: 'array',
      of: [
        { type: 'module.centeredText' },
        { type: 'module.imageVideo' },
        { type: 'module.textColumn' },
        { type: 'module.imageText' },
      ],
      group: 'editorial',
    }),
    // Order rank (for orderable document list)
    defineField({
      name: 'orderRank',
      title: 'Order',
      type: 'string',
      hidden: true,
    }),
    // SEO
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo.page',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      media: 'featuredImage.desktop',
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Manual order',
      name: 'orderRankAsc',
      by: [{ field: 'orderRank', direction: 'asc' }],
    },
  ],
})
