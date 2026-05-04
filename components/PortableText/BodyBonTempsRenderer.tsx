import {PortableText, type PortableTextComponents} from '@portabletext/react'

// Maps each `bodyBonTemps` block style to a typography token class. The set
// here must stay in sync with sanity/schemas/blocks/bodyBonTemps.tsx.
const components: PortableTextComponents = {
  block: {
    normal: ({children}) => <p className="t-body">{children}</p>,
    bodyLarge: ({children}) => <p className="t-body-large">{children}</p>,
    headline: ({children}) => <h2 className="t-headline-project">{children}</h2>,
    caption: ({children}) => <p className="t-caption">{children}</p>,
    sansSmall: ({children}) => <p className="t-sans-small">{children}</p>,
    serifDetail: ({children}) => <p className="t-serif-detail">{children}</p>,
    about: ({children}) => <p className="t-about">{children}</p>,
  },
  marks: {
    annotationLinkExternal: ({children, value}) => (
      <a
        href={value?.url}
        target={value?.newWindow ? '_blank' : undefined}
        rel={value?.newWindow ? 'noreferrer' : undefined}
      >
        {children}
      </a>
    ),
    annotationLinkInternal: ({children, value}) => (
      <a href={value?.slug ? `/${value.slug}` : '#'}>{children}</a>
    ),
    annotationLinkEmail: ({children, value}) => <a href={`mailto:${value?.email}`}>{children}</a>,
    colorBlack: ({children}) => <span style={{color: 'var(--color-fg)'}}>{children}</span>,
    colorGrey: ({children}) => <span style={{color: 'var(--color-grey)'}}>{children}</span>,
  },
}

export default function BodyBonTempsRenderer({value}: {value: unknown}) {
  if (!value) return null
  return <PortableText value={value as any} components={components} />
}
