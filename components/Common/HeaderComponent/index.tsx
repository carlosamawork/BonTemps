import Link from 'next/link'
import type {HeaderData} from '@/sanity/types'
import HeaderClient from './HeaderClient'
import ContactButton from './ContactButton'
import MobileMenu from './MobileMenu'
import styles from './HeaderComponent.module.scss'

type Props = {data?: HeaderData}

// The nav items are not editorial copy — they're tied to specific routes
// and the bubble layoutId, so they live in code rather than Sanity.
const NAV_ITEMS = [
  {href: '/', label: 'Work', key: 'work'},
  {href: '/information', label: 'Information', key: 'information'},
] as const

export default function HeaderComponent({data}: Props) {
  const contactEmail = data?.contactEmail ?? 'info@bontemps.agency'

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={`${styles.logo} t-sans-title`} aria-label="Bon Temps — home">
          BTA
        </Link>

        <HeaderClient items={NAV_ITEMS}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`${styles.navItem} t-sans-title`}
              data-key={item.key}
            >
              <span>{item.label}</span>
            </Link>
          ))}
        </HeaderClient>

        <ContactButton email={contactEmail} />
        <MobileMenu items={NAV_ITEMS} contactEmail={contactEmail} />
      </div>
    </header>
  )
}
