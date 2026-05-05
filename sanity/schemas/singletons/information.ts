import {InfoOutlineIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

const TITLE = 'Information'

// Fixed-shape singleton matching the Figma layout: a Bio block with four
// list cells (Services / Industries / Clients / Press), a Process block
// with four short descriptions (Strategy / Systems / Design / Campaigns),
// and a full-width responsive cover image. All bodies use bodyBonTemps so
// editors can apply the colorBlack/colorGrey marks and link annotations.
export default defineType({
  name: 'information',
  title: TITLE,
  type: 'document',
  icon: InfoOutlineIcon,
  groups: [
    {default: true, name: 'bio', title: 'Bio block'},
    {name: 'process', title: 'Process block'},
    {name: 'cover', title: 'Cover'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    // Bio block ---------------------------------------------------------
    defineField({
      name: 'bio',
      title: 'Bio body',
      description: 'Long left-hand body. Use the "Body Large" style for the 26px copy.',
      type: 'bodyBonTemps',
      group: 'bio',
    }),
    defineField({
      name: 'services',
      title: 'Services list',
      type: 'bodyBonTemps',
      group: 'bio',
    }),
    defineField({
      name: 'industries',
      title: 'Industries list',
      type: 'bodyBonTemps',
      group: 'bio',
    }),
    defineField({
      name: 'clients',
      title: 'Clients list',
      description: 'One client per row with optional location and a project link. On the site the row swaps grey/black colours on hover and links to the project page if set.',
      type: 'array',
      group: 'bio',
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
              to: [{type: 'project'}],
              description: 'When set, the row links to /work/<slug>.',
            }),
          ],
          preview: {select: {title: 'name', subtitle: 'location'}},
        },
      ],
    }),
    defineField({
      name: 'press',
      title: 'Press list',
      description: 'One press item per line. Use link annotations to point at internal projects or external articles.',
      type: 'bodyBonTemps',
      group: 'bio',
    }),

    // Process block -----------------------------------------------------
    defineField({
      name: 'process',
      title: 'Process body',
      description: 'Long left-hand body for the Process section. Use "Body Large" for 26px.',
      type: 'bodyBonTemps',
      group: 'process',
    }),
    defineField({
      name: 'strategy',
      title: 'Strategy',
      type: 'bodyBonTemps',
      group: 'process',
    }),
    defineField({
      name: 'systems',
      title: 'Systems',
      type: 'bodyBonTemps',
      group: 'process',
    }),
    defineField({
      name: 'design',
      title: 'Design',
      type: 'bodyBonTemps',
      group: 'process',
    }),
    defineField({
      name: 'campaigns',
      title: 'Campaigns',
      type: 'bodyBonTemps',
      group: 'process',
    }),

    // Cover -------------------------------------------------------------
    defineField({
      name: 'coverImage',
      title: 'Cover image (responsive)',
      description: 'Full-width image with optional desktop / iPad / mobile art-direction.',
      type: 'media.imageResponsive',
      group: 'cover',
    }),

    // SEO ---------------------------------------------------------------
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo.page',
      group: 'seo',
    }),
  ],
  preview: {prepare: () => ({title: TITLE, subtitle: 'Singleton'})},
})
