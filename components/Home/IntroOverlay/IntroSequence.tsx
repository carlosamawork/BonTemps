'use client'
import {motion} from 'framer-motion'
import MonogramBTA from '@/components/Common/Logo/MonogramBTA'
import styles from './IntroOverlay.module.scss'

type Props = {claim: string}

// Vertical stack per Figma: claim with a red accent square inline next to
// the period, monogram BTA below. Letters animate in sequence; the monogram
// fades in once the claim is settled. The visible <h1> exposes the claim
// to assistive tech via aria-label so the per-letter spans can stay
// aria-hidden.
export default function IntroSequence({claim}: Props) {
  const letters = Array.from(claim)
  const monogramDelay = 0.4 + letters.length * 0.04 + 0.1

  return (
    <div className={styles.stage}>
      <h1 className={`${styles.claim} t-intro`} aria-label={claim}>
        {letters.map((ch, i) => (
          <motion.span
            key={i}
            initial={{y: 18, opacity: 0}}
            animate={{y: 0, opacity: 1}}
            transition={{delay: 0.2 + i * 0.04, duration: 0.35, ease: 'easeOut'}}
            aria-hidden
          >
            {ch === ' ' ? ' ' : ch}
          </motion.span>
        ))}
        <motion.span
          className={styles.dot}
          aria-hidden
          initial={{opacity: 0, scale: 0}}
          animate={{opacity: 1, scale: 1}}
          transition={{delay: 0.2 + letters.length * 0.04, duration: 0.25, ease: 'easeOut'}}
        />
      </h1>

      <motion.div
        className={styles.monogramWrap}
        aria-hidden
        initial={{y: 12, opacity: 0}}
        animate={{y: 0, opacity: 1}}
        transition={{delay: monogramDelay, duration: 0.45, ease: 'easeOut'}}
      >
        <MonogramBTA className={styles.monogram} />
      </motion.div>
    </div>
  )
}
