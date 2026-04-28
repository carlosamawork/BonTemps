'use client'
import {AnimatePresence, motion} from 'framer-motion'
import Link from 'next/link'
import {useEffect, useState} from 'react'
import styles from './HeaderComponent.module.scss'

type Item = {href: string; key: string; label: string}
type Props = {items: readonly Item[]; contactEmail: string}

// The menu is rendered via AnimatePresence, so without JS it never appears
// — that's intentional. The desktop <nav> in HeaderClient still renders the
// links in HTML for crawlers; this component only adds the mobile UX.
export default function MobileMenu({items, contactEmail}: Props) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('menu-open', open)
    return () => {
      document.body.classList.remove('menu-open')
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        className={styles.burger}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span aria-hidden>{open ? '×' : '☰'}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.mobilePanel}
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.2}}
          >
            <nav aria-label="Mobile">
              <ul>
                {items.map((it, i) => (
                  <motion.li
                    key={it.key}
                    initial={{y: 14, opacity: 0}}
                    animate={{y: 0, opacity: 1}}
                    transition={{delay: 0.08 + i * 0.06}}
                  >
                    <Link href={it.href} className="t-mobile-menu" onClick={() => setOpen(false)}>
                      {it.label}
                    </Link>
                  </motion.li>
                ))}
                <motion.li
                  initial={{y: 14, opacity: 0}}
                  animate={{y: 0, opacity: 1}}
                  transition={{delay: 0.08 + items.length * 0.06}}
                >
                  <a href={`mailto:${contactEmail}`} className="t-mobile-menu">
                    Contact
                  </a>
                </motion.li>
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
