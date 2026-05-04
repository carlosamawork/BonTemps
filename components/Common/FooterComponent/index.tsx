import type {FooterData} from '@/sanity/types'
import BodyBonTempsRenderer from '@/components/PortableText/BodyBonTempsRenderer'
import MonogramBTA from '@/components/Common/Logo/MonogramBTA'
import styles from './FooterComponent.module.scss'

type Props = {data?: FooterData}

// Footer is a CSS grid using named areas so the four cells (claim,
// contacts, monogram, copy) snap to their column positions per breakpoint.
// Monogram lives at the bottom of column 1 and copy lives at the bottom of
// the contacts column — they share a row visually without needing a flex
// wrapper.
export default function FooterComponent({data}: Props) {
  if (!data) return null

  const year = new Date().getFullYear()
  const copyright = data.copyright || `All Rights Reserved © ${year}`
  const hasEmails = data.emails && data.emails.length > 0
  const hasSocials = data.socials && data.socials.length > 0

  return (
    <footer className={styles.footer}>
      {data.claim && (
        <div className={`${styles.claim} ${styles.areaClaim}`}>
          <BodyBonTempsRenderer value={data.claim} />
        </div>
      )}

      {(hasEmails || hasSocials) && (
        <div className={`${styles.contacts} ${styles.areaContacts}`}>
          {hasEmails &&
            data.emails!.map((entry) => (
              <div key={entry.email} className={styles.contactGroup}>
                <span className={`${styles.contactLabel} t-sans-small`}>{entry.title}</span>
                <a href={`mailto:${entry.email}`} className={`${styles.contactLink} t-serif-detail`}>
                  {entry.email}
                </a>
              </div>
            ))}

          {hasSocials && (
            <div className={styles.contactGroup}>
              <span className={`${styles.contactLabel} t-sans-small`}>Social</span>
              {data.socials!.map((social, i) => (
                <a
                  key={social._key ?? `${social.title}-${i}`}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`${styles.contactLink} t-serif-detail`}
                >
                  {social.title}
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      <MonogramBTA className={`${styles.monogram} ${styles.areaMonogram}`} />
      <p className={`${styles.copy} ${styles.areaCopy} t-rights-reserved`}>{copyright}</p>
    </footer>
  )
}
