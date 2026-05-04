import BodyBonTempsRenderer from '@/components/PortableText/BodyBonTempsRenderer'
import VisitWebsiteClient from './VisitWebsiteClient'
import styles from './VisitWebsiteBubble.module.scss'

type Props = {url?: string, description: Body}

// Hides itself when the project has no public URL. The bubble itself is a
// client component because the expand-on-hover animation requires
// framer-motion `layout`.
export default function VisitWebsiteBubble({url, description}: Props) {
  if (!url) return null
  return (
  <>
    <VisitWebsiteClient url={url} />
    {description && (
      <div className={styles.description}>
        <BodyBonTempsRenderer value={description} />
      </div>
    )}
  </>
  )
}
