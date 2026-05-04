import BodyBonTempsRenderer from '@/components/PortableText/BodyBonTempsRenderer'
import styles from './InformationProcess.module.scss'

type Props = {
  process?: unknown
  strategy?: unknown
  systems?: unknown
  design?: unknown
  campaigns?: unknown
}

type CellProps = {label: string; tone?: 'black' | 'grey'; children: React.ReactNode}
function Cell({label, tone = 'black', children}: CellProps) {
  return (
    <div className={styles.cell}>
      <p className={`${styles.label} ${tone === 'grey' ? styles.labelGrey : ''} t-sans-small`}>
        {label}
      </p>
      <div className={styles.body}>{children}</div>
    </div>
  )
}

// Process block (per Figma): mirrors the Bio block shape — process body
// in cols 1-2, then Strategy / Systems stacked in col 3 and Design /
// Campaigns stacked in col 4.
export default function InformationProcess({process, strategy, systems, design, campaigns}: Props) {
  return (
    <section className={styles.grid}>
      <div className={styles.processCol}>
        <Cell label="Process" tone="grey">
          {!!process && <BodyBonTempsRenderer value={process} />}
        </Cell>
      </div>

      <div className={styles.col3}>
        {!!strategy && (
          <Cell label="Strategy">
            <BodyBonTempsRenderer value={strategy} />
          </Cell>
        )}
        {!!systems && (
          <Cell label="Systems">
            <BodyBonTempsRenderer value={systems} />
          </Cell>
        )}
      </div>

      <div className={styles.col4}>
        {!!design && (
          <Cell label="Design">
            <BodyBonTempsRenderer value={design} />
          </Cell>
        )}
        {!!campaigns && (
          <Cell label="Campaigns">
            <BodyBonTempsRenderer value={campaigns} />
          </Cell>
        )}
      </div>
    </section>
  )
}
