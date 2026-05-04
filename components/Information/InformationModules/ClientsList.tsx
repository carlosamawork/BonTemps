'use client'
import Link from 'next/link'
import {useState} from 'react'
import styles from './InformationModules.module.scss'

type Item = {name: string; location?: string; projectSlug?: string}
type Props = {title?: string; items: Item[]}

// Each row swaps the colour of `name` and `location` when hovered: name
// goes from grey → fg, location from fg → grey. Rows that link to a
// project are wrapped in <a>; rows without a slug render as plain text.
export default function ClientsList({title, items}: Props) {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <section className={styles.clients}>
      {title && <h2 className={`${styles.heading} t-sans-small`}>{title}</h2>}
      <ul>
        {items.map((it, i) => {
          const inner = (
            <span
              className={`${styles.row} t-body-large ${
                hovered === i ? styles.rowHover : ''
              }`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
            >
              <span className={styles.name}>{it.name}</span>
              {it.location && <span className={styles.location}>{it.location}</span>}
            </span>
          )
          return (
            <li key={`${it.name}-${i}`}>
              {it.projectSlug ? (
                <Link href={`/work/${it.projectSlug}`} className={styles.link}>
                  {inner}
                </Link>
              ) : (
                inner
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
