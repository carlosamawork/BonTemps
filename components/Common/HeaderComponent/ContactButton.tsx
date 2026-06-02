'use client'
import {AnimatePresence, motion} from 'framer-motion'
import {useState} from 'react'
import styles from './HeaderComponent.module.scss'

type Props = {
  email: string
  className?: string
  labelClassName?: string
  // Overlapping cross-fade (default) is great at small sizes. At large sizes
  // the two words share the "Co…" prefix, so the overlapping glyphs double up
  // their ink mid-transition and read as a momentary weight change — pass
  // `crossfade={false}` (used on the big mobile menu item) to fade out then in
  // with no overlap instead.
  crossfade?: boolean
}

// Default behaviour is `mailto:` so the link works without JS, follows
// keyboard focus, and survives clipboard API failures. With JS the click is
// intercepted: we copy the email and swap the label briefly.
//
// `className` lets the parent place this button inside the nav grid so it
// shares horizontal alignment with Work/Information without inheriting the
// bubble layoutId. `labelClassName` sets the typography so the same component
// reads as nav text on desktop and as the large serif menu item on mobile.
export default function ContactButton({
  email,
  className,
  labelClassName = 't-sans-title',
  crossfade = true,
}: Props) {
  const [copied, setCopied] = useState(false)

  const handle = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return
    e.preventDefault()
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      window.location.href = `mailto:${email}`
    }
  }

  return (
    <a
      href={`mailto:${email}`}
      onClick={handle}
      className={`${className ?? ''} ${styles.contact} ${labelClassName}`}
      aria-label={`Copy email ${email}`}
    >
      {/* Cross-fade (overlap) or sequential fade depending on `crossfade`. The
          hidden sizer holds the box at the current word's width while the
          animated copies stack on top. */}
      <span className={styles.contactSwap}>
        <span aria-hidden className={styles.contactSizer}>
          {copied ? 'Copied' : 'Contact'}
        </span>
        <AnimatePresence initial={false} mode={crossfade ? 'sync' : 'wait'}>
          <motion.span
            key={copied ? 'copied' : 'contact'}
            className={styles.contactLabel}
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.26, ease: 'easeInOut'}}
          >
            {copied ? 'Copied' : 'Contact'}
          </motion.span>
        </AnimatePresence>
      </span>
    </a>
  )
}
