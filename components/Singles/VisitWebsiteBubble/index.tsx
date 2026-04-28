import VisitWebsiteClient from './VisitWebsiteClient'

type Props = {url?: string}

// Hides itself when the project has no public URL. The bubble itself is a
// client component because the expand-on-hover animation requires
// framer-motion `layout`.
export default function VisitWebsiteBubble({url}: Props) {
  if (!url) return null
  return <VisitWebsiteClient url={url} />
}
