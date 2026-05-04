import { InfoOutlineIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

const TITLE = 'Information'

export default defineType({
  name: 'information',
  title: TITLE,
  type: 'document',
  icon: InfoOutlineIcon,
  groups: [
    { default: true, name: 'editorial', title: 'Editorial' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'intro',
      title: 'Intro copy',
      type: 'bodyBonTemps',
      group: 'editorial',
    }),
    defineField({
      name: 'modules',
      title: 'Modules',
      type: 'array',
      of: [
        { type: 'module.informationClients' },
        { type: 'module.pageTextColumn' },
        { type: 'module.informationImageVideo' },
      ],
      group: 'editorial',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo.page',
      group: 'seo',
    }),
  ],
  preview: { prepare: () => ({ title: TITLE, subtitle: 'Singleton' }) },
})
