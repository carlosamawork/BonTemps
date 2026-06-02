import { AddCircleIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

// Inline pill button ("+") inserted inside a Body (bodyBonTemps) editor. It
// sits in the flow wherever the editor places it. Renders via the shared
// LinkBubble component (see components/Common/LinkBubble). Links to an external
// URL — use it for "Read more", "Visit Website", or any outbound link.
export default defineType({
  name: 'linkButton',
  title: 'Link Button',
  type: 'object',
  icon: AddCircleIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'Button text, e.g. "Read more" or "Visit Website".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      description: 'External destination.',
      validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in new tab',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: { label: 'label', url: 'url' },
    prepare({ label, url }) {
      return { title: label || 'Link Button', subtitle: url }
    },
  },
})
