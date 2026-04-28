import { defineType } from 'sanity'

export default defineType({
  name: 'bodyBonTemps',
  title: 'Body',
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [
        { title: 'Body', value: 'normal' },
        { title: 'Body Large', value: 'bodyLarge' },
        { title: 'Headline', value: 'headline' },
        { title: 'Caption', value: 'caption' },
        { title: 'Sans Small Title', value: 'sansSmall' },
        { title: 'Serif Detail', value: 'serifDetail' },
        { title: 'About', value: 'about' },
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
