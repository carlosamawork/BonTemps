import Link from 'next/link'
import type {HeaderData} from '@/sanity/types'
import LogoBonTemps from '@/components/Common/Logo/LogoBonTemps'
import HeaderClient from './HeaderClient'
import ContactButton from './ContactButton'
import DateBlock from './DateBlock'
import MobileMenu from './MobileMenu'
import styles from './HeaderComponent.module.scss'

type Props = {data?: HeaderData}

// Bubble keys are limited to actual routes; Contact triggers a copy action
// rather than a navigation, so it lives inside the nav visually but never
// becomes the bubble target.
const NAV_ROUTES = [
  {href: '/', label: 'Work', key: 'work'},
  {href: '/information', label: 'Information', key: 'information'},
] as const

export default function HeaderComponent({data}: Props) {
  const contactEmail = data?.contactEmail ?? 'info@bontemps.agency'
  const instagramUrl = data?.instagramUrl

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} aria-label="Bon Temps — home">
          <LogoBonTemps className={styles.logoSvg} />
        </Link>

        <HeaderClient items={NAV_ROUTES}>
          {NAV_ROUTES.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`${styles.navItem} t-sans-title`}
              data-key={item.key}
            >
              <span>{item.label}</span>
            </Link>
          ))}
          <ContactButton email={contactEmail} className={styles.navItem} />
        </HeaderClient>

        <div className={styles.meta}>
          <DateBlock className="t-serif-detail" />
          {instagramUrl && (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="t-serif-detail"
            >
              Instagram
            </a>
          )}
        </div>

        <MobileMenu items={NAV_ROUTES} contactEmail={contactEmail} />
      </div>
    </header>
  )
}
