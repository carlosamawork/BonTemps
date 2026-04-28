'use client'
import {motion} from 'framer-motion'
import styles from './IntroOverlay.module.scss'

type Props = {claim: string}

// Letter-by-letter stagger over the BTA mark. The visible <h1> exposes the
// claim to assistive tech via aria-label; the per-letter spans are
// aria-hidden because they're a visual flourish.
export default function IntroSequence({claim}: Props) {
  const letters = Array.from(claim)
  return (
    <div className={styles.stage}>
      <motion.div
        className={styles.bta}
        aria-hidden
        initial={{y: 20, opacity: 0}}
        animate={{y: 0, opacity: 1}}
        transition={{duration: 0.5, ease: 'easeOut'}}
      >
        BTA
      </motion.div>

      <h1 className={`${styles.claim} t-intro`} aria-label={claim}>
        {letters.map((ch, i) => (
          <motion.span
            key={i}
            initial={{y: 18, opacity: 0}}
            animate={{y: 0, opacity: 1}}
            transition={{delay: 0.4 + i * 0.04, duration: 0.35, ease: 'easeOut'}}
            aria-hidden
          >
            {ch === ' ' ? ' ' : ch}
          </motion.span>
        ))}
      </h1>
    </div>
  )
}
