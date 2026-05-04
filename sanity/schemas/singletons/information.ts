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
      description: 'One client per line. Mark the city/location with the "Color Black" decorator if you want it black against the grey name.',
      type: 'bodyBonTemps',
      group: 'bio',
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
