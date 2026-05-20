'use client'
import {motion} from 'framer-motion'
import MonogramBTA from '@/components/Common/Logo/MonogramBTA'
import styles from './IntroOverlay.module.scss'

type Props = {claim: string}

// Vertical stack per Figma: claim on top, monogram BTA below.
// Per-letter opacity reveal tuned to feel continuous, not mechanical.
// Recipe matches the unstated.co intro: 80ms stagger but 2s per-letter
// duration. At any moment ~25 letters are mid-fade at different opacities,
// so the line reads as a gradient of light sweeping across rather than
// letters popping in. power2.inOut from GSAP ~= cubic-bezier(0.65,0,0.35,1).
const LETTER_DURATION = 1.4
const LETTER_STAGGER = 0.06
const BASE_DELAY = 0.2
const SOFT_EASE = [0.65, 0, 0.35, 1] as const

export default function IntroSequence({claim}: Props) {
  const letters = Array.from(claim)
  // Monogram starts when the last letter starts fading in, with the same
  // duration and ease so it reads as one continuous gesture closing the
  // sequence.
  const monogramDelay = BASE_DELAY + letters.length * LETTER_STAGGER

  return (
    <div className={styles.stage}>
      <h1 className={styles.claim} aria-label={claim}>
        {letters.map((ch, i) => (
          <motion.span
            key={i}
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{
              delay: BASE_DELAY + i * LETTER_STAGGER,
              duration: LETTER_DURATION,
              ease: SOFT_EASE,
            }}
            aria-hidden
          >
            {ch === ' ' ? ' ' : ch}
          </motion.span>
        ))}
      </h1>

      <motion.div
        className={styles.monogramWrap}
        aria-hidden
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{delay: monogramDelay, duration: LETTER_DURATION, ease: SOFT_EASE}}
      >
        <MonogramBTA className={styles.monogram} />
      </motion.div>
    </div>
  )
}
