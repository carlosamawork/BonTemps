import {PortableText, type PortableTextComponents} from '@portabletext/react'

// Renderer for the legacy `bodySimple` block content. Maps the four
// styles (normal/h1/h2/h3) to the spec's typography tokens — close
// enough for static pages like privacy / terms. When the page document
// migrates to `modules`, this renderer can be deleted alongside the
// `bodySimple` schema.
const components: PortableTextComponents = {
  block: {
    normal: ({children}) => <p className="t-body">{children}</p>,
    h1: ({children}) => <h1 className="t-headline-project">{children}</h1>,
    h2: ({children}) => <h2 className="t-body-large">{children}</h2>,
    h3: ({children}) => <h3 className="t-sans-title">{children}</h3>,
  },
  list: {
    bullet: ({children}) => <ul>{children}</ul>,
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
    annotationLinkEmail: ({children, value}) => <a href={`mailto:${value?.email}`}>{children}</a>,
  },
}

export default function BodySimpleRenderer({value}: {value: unknown}) {
  if (!value) return null
  return <PortableText value={value as never} components={components} />
}
