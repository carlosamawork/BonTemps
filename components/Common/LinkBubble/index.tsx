'use client'
import {AnimatePresence, motion, useReducedMotion} from 'framer-motion'
import {useEffect, useState} from 'react'
import styles from './LinkBubble.module.scss'

type Props = {
  url: string
  label: string
  newTab?: boolean
}

// Reference label reveal: width transitions over 0.35s with easeOutExpo (fast
// start, long smooth settle, no overshoot). Width clips via overflow:hidden;
// the label also fades in/out on open/close.
const EASE = [0.23, 1, 0.32, 1] as const
const DURATION = 0.35

// Defense-in-depth: the URL comes from Sanity (editor content, schema-validated
// to http/https) but render-time validation guards against a `javascript:` /
// `data:` href slipping through if data is ever set outside the Studio.
function safeHref(url: string): string {
  try {
    const {protocol} = new URL(url)
    if (protocol === 'https:' || protocol === 'http:') return url
  } catch {
    // Relative URLs: allow only same-origin paths, never protocol-relative.
    if (url.startsWith('/') && !url.startsWith('//')) return url
  }
  return '#'
}

// Pill that reveals its label before the fixed "+" on hover/focus. Two layers,
// matching the reference: an outer span clips the reveal by animating its real
// width (0 → auto), and an inner span fades + slides in from the right (lagging
// 0.1s on open). The "+" sits in its own static span — it never participates in
// the animation, so it never scales or deforms. Shared by the "Visit Website"
// button and the body `linkButton` block.
export default function LinkBubble({url, label, newTab = true}: Props) {
  const [hover, setHover] = useState(false)
  // On touch devices (no hover) the label can never be revealed, so open it by
  // default there. The expand animates in once after hydration.
  const [alwaysOpen, setAlwaysOpen] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    const mq = window.matchMedia('(hover: none)')
    setAlwaysOpen(mq.matches)
    const handle = (e: MediaQueryListEvent) => setAlwaysOpen(e.matches)
    mq.addEventListener('change', handle)
    return () => mq.removeEventListener('change', handle)
  }, [])

  const open = hover || alwaysOpen

  return (
    <a
      href={safeHref(url)}
      target={newTab ? '_blank' : undefined}
      rel={newTab ? 'noreferrer' : undefined}
      className={`${styles.bubble} t-sans-title`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      <AnimatePresence initial={false}>
        {open && (
          <motion.span
            key="label"
            className={styles.label}
            initial={{width: 0, marginRight: 0}}
            animate={{width: 'auto', marginRight: '0.4em'}}
            exit={{width: 0, marginRight: 0}}
            transition={
              reduce
                ? {duration: 0}
                : {
                    width: {duration: DURATION, ease: EASE},
                    marginRight: {duration: DURATION, ease: EASE},
                  }
            }
            aria-hidden
          >
            {/* Inner layer fades + slides in from the right, lagging the width
                reveal by 0.1s on open (no delay on close) — matches reference. */}
            <motion.span
              className={styles.labelInner}
              initial={{opacity: 0, x: '0.5em'}}
              animate={{
                opacity: 1,
                x: 0,
                transition: reduce
                  ? {duration: 0}
                  : {
                      opacity: {duration: DURATION, delay: 0.1},
                      x: {duration: DURATION, ease: EASE, delay: 0.1},
                    },
              }}
              exit={{
                opacity: 0,
                x: '0.5em',
                transition: reduce
                  ? {duration: 0}
                  : {opacity: {duration: DURATION}, x: {duration: DURATION, ease: EASE}},
              }}
            >
              {label}
            </motion.span>
          </motion.span>
        )}
      </AnimatePresence>
      <span className={styles.symbol}>+</span>
      <span className="visually-hidden">{label}</span>
    </a>
  )
}
