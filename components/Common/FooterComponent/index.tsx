import type {FooterData} from '@/sanity/types'
import BodyBonTempsRenderer from '@/components/PortableText/BodyBonTempsRenderer'
import MonogramBTA from '@/components/Common/Logo/MonogramBTA'
import styles from './FooterComponent.module.scss'

type Variant = 'default' | 'information'

type Props = {data?: FooterData; variant?: Variant}

// Footer is a CSS grid using named areas. The `variant` prop swaps the area
// template: `default` packs emails + social in one contacts column, while
// `information` splits them into two adjacent columns and narrows the claim
// to two columns (matching the Information page Figma).
export default function FooterComponent({data, variant = 'default'}: Props) {
  if (!data) return null

  const year = new Date().getFullYear()
  const copyright = data.copyright || `All Rights Reserved © ${year}`
  const hasEmails = data.emails && data.emails.length > 0
  const hasSocials = data.socials && data.socials.length > 0

  const isInformation = variant === 'information'
  const claim = isInformation ? data.informationClaim ?? data.claim : data.claim

  return (
    <footer className={styles.footer} data-variant={variant}>
      {claim && (
        <div className={`${styles.claim} ${styles.areaClaim}`}>
          <BodyBonTempsRenderer value={claim} />
        </div>
      )}

      {isInformation ? (
        <>
          {hasEmails && (
            <div className={`${styles.contacts} ${styles.areaEmails}`}>
              {data.emails!.map((entry) => (
                <div key={entry.email} className={styles.contactGroup}>
                  <span className={`${styles.contactLabel} t-sans-small`}>{entry.title}</span>
                  <a href={`mailto:${entry.email}`} className={`${styles.contactLink} t-serif-detail`}>
                    {entry.email}
                  </a>
                </div>
              ))}
            </div>
          )}
          {hasSocials && (
            <div className={`${styles.contacts} ${styles.areaSocial}`}>
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
            </div>
          )}
        </>
      ) : (
        (hasEmails || hasSocials) && (
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
        )
      )}

      <MonogramBTA className={`${styles.monogram} ${styles.areaMonogram}`} />
      <p className={`${styles.copy} ${styles.areaCopy} t-rights-reserved`}>{copyright}</p>
    </footer>
  )
}
