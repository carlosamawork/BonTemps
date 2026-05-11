'use client'
import {AnimatePresence, motion} from 'framer-motion'
import Link from 'next/link'
import {useEffect, useState} from 'react'
import {createPortal} from 'react-dom'
import MonogramBTA from '@/components/Common/Logo/MonogramBTA'
import styles from './HeaderComponent.module.scss'

type Item = {href: string; key: string; label: string}
type Props = {
  items: readonly Item[]
  contactEmail: string
  instagramUrl?: string
}

// Mobile-only burger + full-screen overlay (per Figma): #f9f7f7 panel,
// centred serif menu (Work / Information / Contact / Instagram) and a
// small BTA monogram pinned near the bottom.
//
// The panel renders through a portal into <body> because the parent
// <header> uses `backdrop-filter`, which creates a containing block that
// would otherwise size the fixed-positioned panel to the header's tiny
// bounds instead of the viewport.
export default function MobileMenu({items, contactEmail, instagramUrl}: Props) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('menu-open', open)
    return () => {
      document.body.classList.remove('menu-open')
    }
  }, [open])

  const panel = (
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.mobilePanel}
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          transition={{duration: 0.2}}
        >
          <nav aria-label="Mobile" className={styles.mobileNav}>
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
              {instagramUrl && (
                <motion.li
                  initial={{y: 14, opacity: 0}}
                  animate={{y: 0, opacity: 1}}
                  transition={{delay: 0.08 + (items.length + 1) * 0.06}}
                >
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="t-mobile-menu"
                    onClick={() => setOpen(false)}
                  >
                    Instagram
                  </a>
                </motion.li>
              )}
            </ul>
          </nav>
          <MonogramBTA className={styles.mobileMonogram} />
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <>
      <button
        type="button"
        className={styles.burger}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          <span className={styles.burgerClose} aria-hidden>×</span>
        ) : (
          <span className={styles.burgerLines} aria-hidden>
            <span />
            <span />
            <span />
          </span>
        )}
      </button>
      {mounted && createPortal(panel, document.body)}
    </>
  )
}
