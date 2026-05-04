import BodyBonTempsRenderer from '@/components/PortableText/BodyBonTempsRenderer'
import styles from './ProjectModules.module.scss'

type Props = {body?: unknown}

// Centered narrow column of body content. Used for short interludes
// between visual modules.
export default function CenteredText({body}: Props) {
  if (!body) return null
  return (
    <section className={styles.centered}>
      <div className={styles.centeredInner}>
        <BodyBonTempsRenderer value={body} />
      </div>
    </section>
  )
}
