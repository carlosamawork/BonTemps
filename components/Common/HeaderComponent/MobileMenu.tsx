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

// Mobile-only burger + full-screen overlay (58×32 #e6e6e6 pill — sized up
// from the Figma 50×24 per client feedback — with two lines; #f9f7f7 panel,
// centred serif menu and a BTA monogram near the bottom). The panel slides
// DOWN from the top edge (curtain) and the two burger lines morph into an X
// on open. The ±3.9px converge offsets must match the .burgerLines box height
// in HeaderComponent.module.scss (lines sit at top/bottom of a 9px box).
//
// The panel renders through a portal into <body> so its fixed positioning is
// always resolved against the viewport, immune to any ancestor (filter,
// mask, transform) becoming a containing block.
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

  // Two body classes, with deliberately different lifetimes:
  //   • `menu-open`  — added on open, removed in onExitComplete. Lasts through
  //     the whole close fade so the header (logo + burger) stays above the
  //     still-fading panel via z-index, and so the logo keeps its 0.5s
  //     menu-synced transition for the close.
  //   • `menu-shown` — added on open, removed the instant the menu starts
  //     closing. Forces the logo visible only while open, so on close it fades
  //     back to its scrolled state in sync with the panel instead of snapping.
  useEffect(() => {
    if (open) {
      document.body.classList.add('menu-open')
      document.body.classList.add('menu-shown')
    } else {
      document.body.classList.remove('menu-shown')
    }
  }, [open])

  useEffect(() => {
    return () => {
      document.body.classList.remove('menu-open')
      document.body.classList.remove('menu-shown')
    }
  }, [])

  // The panel background fades in with opacity only (no slide). The links
  // still stagger in on top. Reduced-motion just shortens to an instant swap.
  //
  // `hidden` is the entrance-only start (panel uses initial="hidden"). It
  // propagates the "hidden" label down to the items so each one starts lifted
  // + transparent and rises in on the stagger. `closed` is the EXIT label, a
  // plain fade with no lift. Keeping them separate is what lets the open
  // animation regain its bottom-to-top movement while the close stays a clean
  // unison fade.
  const panelVariants = {
    hidden: {
      opacity: 0,
    },
    closed: {
      opacity: 0,
      // Simple fadeout on close: the whole panel (and its items) fades out
      // together as a single block — no per-item stagger or orchestration.
      transition: reduce ? {duration: 0} : {duration: 0.5, ease: EASE},
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
  //
  // Three states on purpose. `hidden` is the entrance-only start (used via
  // initial="hidden" on each item): below + transparent, so items rise into
  // place one by one as the parent staggers them in. `closed` is the EXIT
  // state: a plain unison fade with no lift (y stays 0), keeping the close a
  // simple fade-out in sync with the panel. Splitting the two lets the open
  // animation regain its bottom-to-top movement without the close inheriting
  // a downward drift.
  const itemVariants = {
    hidden: {
      // Short travel (Canyon Coffee-style): the items barely lift — a subtle
      // reveal, not a long glide. Keep this small so the entrance reads as a
      // gentle settle rather than a slide.
      y: 10,
      opacity: 0,
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
    closed: {
      // Simple fadeout on close — no lift, no stagger; items fade straight
      // out in unison with the panel.
      y: 0,
      opacity: 0,
      transition: {duration: reduce ? 0 : 0.5, ease: 'easeOut' as const},
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
    <AnimatePresence
      onExitComplete={() => {
        document.body.classList.remove('menu-open')
        document.body.classList.remove('menu-shown')
      }}
    >
      {open && (
        <motion.div
          className={styles.mobilePanel}
          variants={panelVariants}
          initial="hidden"
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
            animate={open ? {rotate: 45, y: 3.9} : {rotate: 0, y: 0}}
            transition={burgerTransition}
          />
          <motion.span
            className={styles.burgerLine}
            animate={open ? {rotate: -45, y: -3.9} : {rotate: 0, y: 0}}
            transition={burgerTransition}
          />
        </span>
      </button>
      {mounted && createPortal(panel, document.body)}
    </>
  )
}
