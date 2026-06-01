'use client'
import {AnimatePresence, motion, useReducedMotion} from 'framer-motion'
import Link from 'next/link'
import {useEffect, useState} from 'react'
import {createPortal} from 'react-dom'
import MonogramBTA from '@/components/Common/Logo/MonogramBTA'
import ContactButton from './ContactButton'
import styles from './HeaderComponent.module.scss'

type Item = {href: string; key: string; label: string}
type Props = {
  items: readonly Item[]
  contactEmail: string
  instagramUrl?: string
}

// Shared easing — matches the nav bubble's curve for a consistent feel.
const EASE = [0.4, 0, 0.2, 1] as const
// Gentle settle (easeOutExpo-ish) for the menu items — long tail, no overshoot,
// so they glide in like the Canyon Coffee menu rather than popping.
const SOFT_EASE = [0.22, 1, 0.36, 1] as const

// Mobile-only burger + full-screen overlay (per Figma: 50×24 #e6e6e6 pill with
// two lines; #f9f7f7 panel, centred serif menu and a BTA monogram near the
// bottom). The panel slides DOWN from the top edge (curtain) and the two
// burger lines morph into an X on open.
//
// The panel renders through a portal into <body> because the parent <header>
// uses `backdrop-filter`, which creates a containing block that would
// otherwise size the fixed-positioned panel to the header's tiny bounds.
export default function MobileMenu({items, contactEmail, instagramUrl}: Props) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Close the menu when the viewport grows past the mobile breakpoint: the
  // burger hides at `tablet-up` (≥768px, see HeaderComponent.module.scss), so a
  // panel left open would otherwise stay full-screen with no way to dismiss it.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false)
    }
    mq.addEventListener('change', handleChange)
    return () => mq.removeEventListener('change', handleChange)
  }, [])

  // Add `menu-open` as soon as the menu opens (keeps the header — logo +
  // burger — above the panel via z-index). We do NOT remove it on close here:
  // the panel keeps fading for ~0.3s after `open` flips false, and dropping the
  // class early would let the still-fading panel cover the logo/burger and make
  // them flicker. It's removed in AnimatePresence's onExitComplete instead.
  useEffect(() => {
    if (open) document.body.classList.add('menu-open')
  }, [open])

  useEffect(() => {
    return () => {
      document.body.classList.remove('menu-open')
    }
  }, [])

  // The panel background fades in with opacity only (no slide). The links
  // still stagger in on top. Reduced-motion just shortens to an instant swap.
  const panelVariants = {
    closed: {
      opacity: 0,
      transition: reduce
        ? {duration: 0}
        : {duration: 0.3, ease: EASE, when: 'afterChildren' as const},
    },
    open: {
      opacity: 1,
      transition: reduce
        ? {duration: 0}
        : {
            duration: 0.3,
            ease: EASE,
            when: 'beforeChildren' as const,
            staggerChildren: 0.09,
            delayChildren: 0.15,
          },
    },
  }

  // Fade-dominant entrance: opacity runs longer than the small lift, so the
  // items glide in smoothly instead of snapping into place.
  const itemVariants = {
    closed: {
      y: reduce ? 0 : 8,
      opacity: 0,
      transition: {duration: reduce ? 0 : 0.35, ease: 'easeOut' as const},
    },
    open: {
      y: 0,
      opacity: 1,
      transition: reduce
        ? {duration: 0}
        : {
            opacity: {duration: 0.7, ease: 'easeOut' as const},
            y: {duration: 0.7, ease: SOFT_EASE},
          },
    },
  }

  const burgerTransition = reduce ? {duration: 0} : {duration: 0.3, ease: EASE}

  const menuItems = [
    ...items.map((it) => ({...it, external: false})),
    {href: `mailto:${contactEmail}`, key: 'contact', label: 'Contact', external: false},
    ...(instagramUrl
      ? [{href: instagramUrl, key: 'instagram', label: 'Instagram', external: true}]
      : []),
  ]

  const panel = (
    <AnimatePresence onExitComplete={() => document.body.classList.remove('menu-open')}>
      {open && (
        <motion.div
          className={styles.mobilePanel}
          variants={panelVariants}
          initial="closed"
          animate="open"
          exit="closed"
        >
          <nav aria-label="Mobile" className={styles.mobileNav}>
            <ul>
              {menuItems.map((it) =>
                it.key === 'contact' ? (
                  <motion.li key={it.key} variants={itemVariants}>
                    {/* Same copy-to-clipboard + "Copied" cross-fade as desktop,
                        styled as the large serif menu item. */}
                    <ContactButton
                      email={contactEmail}
                      labelClassName="t-mobile-menu"
                      crossfade={false}
                    />
                  </motion.li>
                ) : (
                  <motion.li key={it.key} variants={itemVariants}>
                    {it.external ? (
                      <a
                        href={it.href}
                        target="_blank"
                        rel="noreferrer"
                        className="t-mobile-menu"
                        onClick={() => setOpen(false)}
                      >
                        {it.label}
                      </a>
                    ) : (
                      <Link href={it.href} className="t-mobile-menu" onClick={() => setOpen(false)}>
                        {it.label}
                      </Link>
                    )}
                  </motion.li>
                )
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
        <span className={styles.burgerLines} aria-hidden>
          {/* Two lines that converge + rotate into an X when open. */}
          <motion.span
            className={styles.burgerLine}
            animate={open ? {rotate: 45, y: 2.4} : {rotate: 0, y: 0}}
            transition={burgerTransition}
          />
          <motion.span
            className={styles.burgerLine}
            animate={open ? {rotate: -45, y: -2.4} : {rotate: 0, y: 0}}
            transition={burgerTransition}
          />
        </span>
      </button>
      {mounted && createPortal(panel, document.body)}
    </>
  )
}
