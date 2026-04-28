import type {FooterData} from '@/sanity/types'
import BodyBonTempsRenderer from '@/components/PortableText/BodyBonTempsRenderer'
import styles from './FooterComponent.module.scss'

type Props = {data?: FooterData}

export default function FooterComponent({data}: Props) {
  if (!data) return null

  const copyright =
    data.copyright || `© ${new Date().getFullYear()} Bon Temps. All rights reserved.`

  return (
    <footer className={styles.footer}>
      {data.claim && (
        <div className={styles.claim}>
          <BodyBonTempsRenderer value={data.claim} />
        </div>
      )}

      <div className={styles.bottom}>
        {data.emails && data.emails.length > 0 && (
          <ul className={styles.emails}>
            {data.emails.map((entry) => (
              <li key={entry.email}>
                <span className={`${styles.emailTitle} t-sans-small`}>{entry.title}</span>
                <a href={`mailto:${entry.email}`} className="t-serif-detail">
                  {entry.email}
                </a>
              </li>
            ))}
          </ul>
        )}

        {data.socials && data.socials.length > 0 && (
          <ul className={styles.socials}>
            {data.socials.map((social, i) => (
              <li key={social._key ?? `${social.title}-${i}`}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="t-serif-detail"
                >
                  {social.title}
                </a>
              </li>
            ))}
          </ul>
        )}

        <p className={`t-rights-reserved ${styles.copy}`}>{copyright}</p>
      </div>
    </footer>
  )
}
