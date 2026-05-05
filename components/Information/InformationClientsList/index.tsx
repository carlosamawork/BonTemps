import Link from 'next/link'
import type {ClientEntry} from '@/sanity/queries/queries/information'
import styles from './InformationClientsList.module.scss'

type Props = {clients?: ClientEntry[]}

// Renders the Information clients column. Each row shows the client name
// in grey and the location in black by default; on hover the colours
// swap (name → black, location → grey) — per spec. Rows with a linked
// project become real `<a>` elements pointing at /work/<slug>; rows
// without a link render as inert spans so the hover is still visible
// without a navigation target.
export default function InformationClientsList({clients}: Props) {
  if (!clients || clients.length === 0) return null
  return (
    <ul className={styles.list}>
      {clients.map((c) => (
        <li key={c._key}>
          {c.projectSlug ? (
            <Link href={`/work/${c.projectSlug}`} className={styles.row}>
              <RowContent name={c.name} location={c.location} />
            </Link>
          ) : (
            <span className={styles.row}>
              <RowContent name={c.name} location={c.location} />
            </span>
          )}
        </li>
      ))}
    </ul>
  )
}

function RowContent({name, location}: {name: string; location?: string}) {
  return (
    <>
      <span className={styles.name}>{name}</span>
      {location && (
        <>
          {' '}
          <span className={styles.location}>({location})</span>
        </>
      )}
    </>
  )
}
