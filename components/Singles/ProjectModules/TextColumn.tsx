import BodyBonTempsRenderer from '@/components/PortableText/BodyBonTempsRenderer'
import styles from './ProjectModules.module.scss'

type Props = {
  body?: unknown
  columns: 1 | 2 | 3
  span?: 1 | 2 | 3
  columnStart?: 1 | 2 | 3
}

// A body block that can occupy a fraction of the page-width grid. The
// editor controls the total column count, the span of this block, and
// optionally where it starts. CSS variables drive the placement.
export default function TextColumn({body, columns, span, columnStart}: Props) {
  if (!body) return null
  return (
    <section
      className={styles.textColumn}
      data-columns={columns}
      style={{
        ['--span' as string]: span ?? columns,
        ['--col-start' as string]: columnStart ?? 1,
      }}
    >
      <div className={styles.textColumnInner}>
        <BodyBonTempsRenderer value={body} />
      </div>
    </section>
  )
}
