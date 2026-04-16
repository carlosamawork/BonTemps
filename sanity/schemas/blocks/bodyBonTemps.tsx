import { defineType } from 'sanity'

export default defineType({
  name: 'bodyBonTemps',
  title: 'Body',
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H1', value: 'h1' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'P Big', value: 'pBig' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Italic', value: 'em' },
          { title: 'Strong', value: 'strong' },
          {
            title: 'Color Black',
            value: 'colorBlack',
            icon: () => 'B',
            component: ({ children }: { children: React.ReactNode }) => (
              <span style={{ color: '#000000' }}>{children}</span>
            ),
          },
          {
            title: 'Color Grey',
            value: 'colorGrey',
            icon: () => 'G',
            component: ({ children }: { children: React.ReactNode }) => (
              <span style={{ color: '#888888' }}>{children}</span>
            ),
          },
        ],
        annotations: [
          { name: 'annotationLinkEmail', type: 'annotationLinkEmail' },
          { name: 'annotationLinkInternal', type: 'annotationLinkInternal' },
          { name: 'annotationLinkExternal', type: 'annotationLinkExternal' },
        ],
      },
    },
  ],
})
