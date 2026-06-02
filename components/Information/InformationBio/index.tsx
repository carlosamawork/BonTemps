import BodyBonTempsRenderer from '@/components/PortableText/BodyBonTempsRenderer'
import InformationClientsList from '@/components/Information/InformationClientsList'
import type {ClientEntry} from '@/sanity/queries/queries/information'
import styles from './InformationBio.module.scss'

type Props = {
  bio?: unknown
  services?: unknown
  industries?: unknown
  clients?: ClientEntry[]
  press?: unknown
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

// Bio block (per Figma). Three different layouts driven entirely by
// grid-template-areas in SCSS:
//
//   Mobile: bio full-width, then `services | industries` and
//           `clients | press` as 2-col rows.
//   iPad:   bio in col 1 spanning four rows, services / industries /
//           clients / press stacked in col 2.
//   Desktop: bio spans cols 1-2, services+clients stack in col 3,
//           industries+press stack in col 4.
export default function InformationBio({bio, services, industries, clients, press}: Props) {
  return (
    <section className={styles.grid}>
      <div className={styles.areaBio}>
        <Cell label="About" tone="grey" bodyTone="black">
          {!!bio && <BodyBonTempsRenderer value={bio} />}
        </Cell>
      </div>

      {!!services && (
        <div className={styles.areaServices}>
          <Cell label="Services">
            <BodyBonTempsRenderer value={services} />
          </Cell>
        </div>
      )}

      {!!industries && (
        <div className={styles.areaIndustries}>
          <Cell label="Industries">
            <BodyBonTempsRenderer value={industries} />
          </Cell>
        </div>
      )}

      {!!clients && clients.length > 0 && (
        <div className={styles.areaClients}>
          <Cell label="Clients">
            <InformationClientsList clients={clients} />
          </Cell>
        </div>
      )}

      {!!press && (
        <div className={styles.areaPress}>
          <Cell label="Press">
            <BodyBonTempsRenderer value={press} />
          </Cell>
        </div>
      )}
    </section>
  )
}
