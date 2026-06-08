import { DocumentsIcon } from '@sanity/icons'
import { defineField, defineType, Slug } from 'sanity'
import slug from 'slug'

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
      // Required, unless the project is a "Coming soon" placeholder.
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.document?.comingSoon) return true
          return value ? true : 'Required'
        }),
      group: 'editorial',
    }),
    // Slug
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      // Skip slug validation for "Coming soon" placeholders; otherwise apply
      // the shared slug rules (required + format) used across the project.
      // @ts-ignore
      validation: (Rule) =>
        Rule.custom((value: Slug | undefined, context) => {
          if (context.document?.comingSoon) return true

          const currentSlug = value && value.current
          if (!currentSlug) return 'Required'
          if (currentSlug.length >= 96) return 'Must be less than 96 characters'
          if (currentSlug !== slug(currentSlug, { lower: true })) {
            return 'Must be a valid slug'
          }
          return true
        }),
      group: 'editorial',
    }),
    // Subtitle
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      group: 'editorial',
    }),
    // Coming soon — project shows in the /work grid with its thumbnail but is
    // not yet clickable; on hover it reveals "(Coming soon)" in grey next to
    // the title instead of swapping to hover media.
    defineField({
      name: 'comingSoon',
      title: 'Coming soon',
      description:
        'Show in the Work grid as a non-clickable card. On hover it reveals "(Coming soon)" next to the title instead of the hover media. Use until the case study is published.',
      type: 'boolean',
      initialValue: false,
      group: 'editorial',
    }),
    // Project website URL
    defineField({
      name: 'websiteUrl',
      title: 'Project website URL',
      type: 'url',
      description: 'External URL for "+ Visit Website". Leave empty if the project has no public site.',
      validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
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
    // Cover media type selector (used as hero on the single project page)
    defineField({
      name: 'coverMediaType',
      title: 'Cover media type',
      description: 'Hero shown at the top of the single project page.',
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
      name: 'coverImage',
      title: 'Cover Image',
      type: 'media.image',
      hidden: ({ document }) => document?.coverMediaType !== 'image',
      group: 'editorial',
    }),
    defineField({
      name: 'coverVideo',
      title: 'Cover Video',
      type: 'media.video',
      hidden: ({ document }) => document?.coverMediaType !== 'video',
      group: 'editorial',
    }),
    // Cover media — Mobile override (rendered <768px). When left as "None"
    // the desktop cover is shown on mobile too. When set, it replaces the
    // desktop cover on mobile via SSR + CSS visibility swap.
    defineField({
      name: 'coverMediaTypeMobile',
      title: 'Cover media type — Mobile',
      description: 'Optional mobile-only cover. Leave as "None" to reuse the desktop cover on mobile.',
      type: 'string',
      options: {
        list: [
          { title: 'None (use desktop)', value: 'none' },
          { title: 'Image', value: 'image' },
          { title: 'Video', value: 'video' },
        ],
        layout: 'radio',
      },
      initialValue: 'none',
      group: 'editorial',
    }),
    defineField({
      name: 'coverImageMobile',
      title: 'Cover Image — Mobile',
      type: 'media.image',
      hidden: ({ document }) => document?.coverMediaTypeMobile !== 'image',
      group: 'editorial',
    }),
    defineField({
      name: 'coverVideoMobile',
      title: 'Cover Video — Mobile',
      type: 'media.video',
      hidden: ({ document }) => document?.coverMediaTypeMobile !== 'video',
      group: 'editorial',
    }),
    // Featured media type selector (used in listings: /work grid + relatedProjects)
    defineField({
      name: 'featuredMediaType',
      title: 'Featured media type',
      description: 'Thumbnail shown in the /work grid and in related projects.',
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
      // The thumbnail is the only thing shown for a Coming soon card, so it is
      // required when the project is Coming soon and the media type is image.
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const doc = context.document
          if (doc?.comingSoon && doc?.featuredMediaType === 'image' && !value) {
            return 'A featured image is required for Coming soon projects'
          }
          return true
        }),
      group: 'editorial',
    }),
    defineField({
      name: 'featuredVideo',
      title: 'Featured Video',
      type: 'media.video',
      hidden: ({ document }) => document?.featuredMediaType !== 'video',
      // Required when the project is Coming soon and the media type is video.
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const doc = context.document
          if (doc?.comingSoon && doc?.featuredMediaType === 'video' && !value) {
            return 'A featured video is required for Coming soon projects'
          }
          return true
        }),
      group: 'editorial',
    }),
    // Hover media: optional overlay shown on cursor hover in the /work grid
    // (and related projects). Cross-fades with the featured media via opacity.
    defineField({
      name: 'hoverMediaType',
      title: 'Hover media type',
      description: 'Shown on cursor hover over the project card. Leave as "None" to skip.',
      type: 'string',
      options: {
        list: [
          { title: 'None', value: 'none' },
          { title: 'Image', value: 'image' },
          { title: 'Video', value: 'video' },
        ],
        layout: 'radio',
      },
      initialValue: 'none',
      group: 'editorial',
    }),
    defineField({
      name: 'hoverImage',
      title: 'Hover Image',
      type: 'media.image',
      hidden: ({ document }) => document?.hoverMediaType !== 'image',
      group: 'editorial',
    }),
    defineField({
      name: 'hoverVideo',
      title: 'Hover Video',
      type: 'media.video',
      hidden: ({ document }) => document?.hoverMediaType !== 'video',
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
    defineField({
      name: 'description',
      title: 'Description',
      type: 'bodyBonTemps',
      group: 'editorial',
    }),
    // Modules — Mobile layout (rendered <768px)
    defineField({
      name: 'modulesMobile',
      title: 'Modules — Mobile',
      description: 'Layout shown on mobile (<768px). Independent from the desktop/tablet layout.',
      type: 'array',
      of: [
        { type: 'module.centeredText' },
        { type: 'module.imageVideo' },
        { type: 'module.imageText' },
        { type: 'module.spacer' },
      ],
      group: 'editorial',
    }),
    // Modules — Desktop / Tablet layout (rendered ≥768px)
    defineField({
      name: 'modulesDesktop',
      title: 'Modules — Desktop & Tablet',
      description: 'Layout shown on tablet and desktop (≥768px).',
      type: 'array',
      of: [
        { type: 'module.centeredText' },
        { type: 'module.imageVideo' },
        { type: 'module.imageText' },
        { type: 'module.spacer' },
      ],
      group: 'editorial',
    }),
    // Project Recap (heading + body). The heading is editable; if left empty
    // the frontend falls back to the default shown here as initialValue.
    defineField({
      name: 'projectRecapHeading',
      title: 'Project Recap — Heading',
      type: 'string',
      initialValue: 'Project Recap',
      group: 'editorial',
    }),
    defineField({
      name: 'projectRecap',
      title: 'Project Recap',
      type: 'bodyBonTemps',
      group: 'editorial',
    }),
    // Services (heading + body)
    defineField({
      name: 'servicesHeading',
      title: 'Services — Heading',
      type: 'string',
      initialValue: 'Services',
      group: 'editorial',
    }),
    defineField({
      name: 'servicesBody',
      title: 'Services',
      type: 'bodyBonTemps',
      group: 'editorial',
    }),
    // Typeface (heading + body)
    defineField({
      name: 'customTypefaceHeading',
      title: 'Typeface — Heading',
      type: 'string',
      initialValue: 'Custom Typeface',
      group: 'editorial',
    }),
    defineField({
      name: 'customTypeface',
      title: 'Custom Typeface',
      type: 'bodyBonTemps',
      group: 'editorial',
    }),
    // Bon Temps Team (heading + body)
    defineField({
      name: 'bonTempsTeamHeading',
      title: 'BonTemps Team — Heading',
      type: 'string',
      initialValue: 'BonTemps Team',
      group: 'editorial',
    }),
    defineField({
      name: 'bonTempsTeam',
      title: 'Bon Temps Team',
      type: 'bodyBonTemps',
      group: 'editorial',
    }),
    // Collaborators (heading + body)
    defineField({
      name: 'collaboratorsHeading',
      title: 'Collaborators — Heading',
      type: 'string',
      initialValue: 'Collaborators',
      group: 'editorial',
    }),
    defineField({
      name: 'collaborators',
      title: 'Collaborators',
      type: 'bodyBonTemps',
      group: 'editorial',
    }),
    // Related Projects (heading + list)
    defineField({
      name: 'relatedProjectsHeading',
      title: 'Related Projects — Heading',
      type: 'string',
      initialValue: 'Related Projects',
      group: 'editorial',
    }),
    defineField({
      name: 'relatedProjects',
      title: 'Related Projects',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'project' }] }],
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
      media: 'featuredImage.image',
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
