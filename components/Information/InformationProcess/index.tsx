import BodyBonTempsRenderer from '@/components/PortableText/BodyBonTempsRenderer'
import styles from './InformationProcess.module.scss'

type Props = {
  process?: unknown
  strategy?: unknown
  systems?: unknown
  design?: unknown
  campaigns?: unknown
}

type CellProps = {
  label: string
  tone?: 'black' | 'grey'
  bodyTone?: 'black' | 'grey'
  children: React.ReactNode
}
function Cell({label, tone = 'black', bodyTone = 'grey', children}: CellProps) {
  return (
    <div className={styles.cell}>
      <p className={`${styles.label} ${tone === 'grey' ? styles.labelGrey : ''} t-sans-small`}>
        {label}
      </p>
      <div className={`${styles.body} ${bodyTone === 'black' ? styles.bodyBlack : ''}`}>
        {children}
      </div>
    </div>
  )
}

// Process block — mirrors InformationBio's layout exactly:
//
//   Mobile: process body full-width, then `strategy | design` and
//           `systems | campaigns` as 2-col rows.
//   iPad:   process body col 1 spanning four rows, strategy / design /
//           systems / campaigns stacked in col 2.
//   Desktop: process body cols 1-2, strategy+systems stack col 3,
//           design+campaigns stack col 4.
export default function InformationProcess({process, strategy, systems, design, campaigns}: Props) {
  return (
    <section className={styles.grid}>
      <div className={styles.areaProcess}>
        <Cell label="Process" tone="grey" bodyTone="black">
          {!!process && <BodyBonTempsRenderer value={process} />}
        </Cell>
      </div>

      {!!strategy && (
        <div className={styles.areaStrategy}>
          <Cell label="Strategy">
            <BodyBonTempsRenderer value={strategy} />
          </Cell>
        </div>
      )}

      {!!design && (
        <div className={styles.areaDesign}>
          <Cell label="Design">
            <BodyBonTempsRenderer value={design} />
          </Cell>
        </div>
      )}

      {!!systems && (
        <div className={styles.areaSystems}>
          <Cell label="Systems">
            <BodyBonTempsRenderer value={systems} />
          </Cell>
        </div>
      )}

      {!!campaigns && (
        <div className={styles.areaCampaigns}>
          <Cell label="Campaigns">
            <BodyBonTempsRenderer value={campaigns} />
          </Cell>
        </div>
      )}
    </section>
  )
}
