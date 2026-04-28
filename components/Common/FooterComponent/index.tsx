import type {FooterData} from '@/sanity/types'
import BodyBonTempsRenderer from '@/components/PortableText/BodyBonTempsRenderer'
import styles from './FooterComponent.module.scss'

type Props = {data?: FooterData}

export default function FooterComponent({data}: Props) {
  if (!data) return null

  const year = new Date().getFullYear()
  const copyright = data.copyright || `All Rights Reserved © ${year}`
  const hasEmails = data.emails && data.emails.length > 0
  const hasSocials = data.socials && data.socials.length > 0

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        {data.claim && (
          <div className={styles.claim}>
            <BodyBonTempsRenderer value={data.claim} />
          </div>
        )}

        {(hasEmails || hasSocials) && (
          <div className={styles.contacts}>
            {hasEmails &&
              data.emails!.map((entry) => (
                <div key={entry.email} className={styles.contactGroup}>
                  <span className={`${styles.contactLabel} t-sans-small`}>{entry.title}</span>
                  <a href={`mailto:${entry.email}`} className="t-serif-detail">
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
                    className="t-serif-detail"
                  >
                    {social.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className={styles.bottom}>
        <span aria-hidden className={styles.monogram}>
          BTA
        </span>
        <p className={`t-rights-reserved ${styles.copy}`}>{copyright}</p>
      </div>
    </footer>
  )
}
