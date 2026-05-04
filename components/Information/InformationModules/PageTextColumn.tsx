import BodyBonTempsRenderer from '@/components/PortableText/BodyBonTempsRenderer'
import styles from './InformationModules.module.scss'

type Body = {body?: unknown}
type Props = {bodies?: Body[]}

// Renders an array of body blocks side-by-side as text columns. Stacks on
// mobile. Used in both the Information singleton and the generic Page
// document where editors want multi-column copy.
export default function PageTextColumn({bodies}: Props) {
  if (!bodies || bodies.length === 0) return null
  return (
    <section
      className={styles.textColumn}
      data-columns={Math.min(bodies.length, 3)}
    >
      {bodies.map((b, i) => (
        <div key={i} className={styles.textColumnItem}>
          <BodyBonTempsRenderer value={b.body} />
        </div>
      ))}
    </section>
  )
}
