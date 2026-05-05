'use client'
import {AnimatePresence, motion} from 'framer-motion'
import {useState} from 'react'
import styles from './VisitWebsiteBubble.module.scss'

type Props = {url: string}

// Pill that reveals "Visit Website" before the fixed "+" symbol on hover
// or focus. The "+" sits in its own static span — it never participates
// in the layout animation, so it never gets scaled or deformed when the
// label expands or collapses. The label itself animates its width and
// opacity via AnimatePresence for a smooth slide-in.
export default function VisitWebsiteClient({url}: Props) {
  const [hover, setHover] = useState(false)
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className={`${styles.bubble} t-sans-title`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      <AnimatePresence initial={false}>
        {hover && (
          <motion.span
            key="label"
            className={styles.label}
            initial={{maxWidth: 0, opacity: 0, marginRight: 0}}
            animate={{maxWidth: '12em', opacity: 1, marginRight: '0.4em'}}
            exit={{maxWidth: 0, opacity: 0, marginRight: 0}}
            transition={{
              maxWidth: {type: 'spring', stiffness: 360, damping: 28, mass: 0.9},
              marginRight: {type: 'spring', stiffness: 360, damping: 28, mass: 0.9},
              opacity: {duration: 0.22, ease: 'easeOut'},
            }}
            aria-hidden
          >
            Visit Website
          </motion.span>
        )}
      </AnimatePresence>
      <span className={styles.symbol}>+</span>
      <span className="visually-hidden">Visit Website</span>
    </a>
  )
}
