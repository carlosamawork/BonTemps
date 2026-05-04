import BodyBonTempsRenderer from '@/components/PortableText/BodyBonTempsRenderer'
import styles from './InformationBio.module.scss'

type Props = {
  bio?: unknown
  services?: unknown
  industries?: unknown
  clients?: unknown
  press?: unknown
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

// Bio block (per Figma): a long body in cols 1-2, then two stacked cells
// per right column (Services + Clients in col 3, Industries + Press in
// col 4). Mobile collapses to two columns where the bio occupies a full
// row above the metadata stack.
export default function InformationBio({bio, services, industries, clients, press}: Props) {
  return (
    <section className={styles.grid}>
      <div className={styles.bioCol}>
        <Cell label="Bio" tone="grey">
          {!!bio && <BodyBonTempsRenderer value={bio} />}
        </Cell>
      </div>

      <div className={styles.col3}>
        {!!services && (
          <Cell label="Services">
            <BodyBonTempsRenderer value={services} />
          </Cell>
        )}
        {!!clients && (
          <Cell label="Clients">
            <BodyBonTempsRenderer value={clients} />
          </Cell>
        )}
      </div>

      <div className={styles.col4}>
        {!!industries && (
          <Cell label="Industries">
            <BodyBonTempsRenderer value={industries} />
          </Cell>
        )}
        {!!press && (
          <Cell label="Press">
            <BodyBonTempsRenderer value={press} />
          </Cell>
        )}
      </div>
    </section>
  )
}
