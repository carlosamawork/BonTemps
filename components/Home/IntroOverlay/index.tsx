'use client'
import {AnimatePresence, motion} from 'framer-motion'
import {useEffect} from 'react'
import {useIntro} from './IntroProvider'
import IntroSequence from './IntroSequence'
import styles from './IntroOverlay.module.scss'

type Props = {claim: string}

// Total visible time = base delay + stagger window + monogram duration + hold.
// The monogram starts when the last letter starts and runs for the same
// duration, so it's the monogram (not the letters) that bounds the reveal.
// Mirrors the constants in IntroSequence.
const BASE_DELAY_MS = 200
const PER_LETTER_MS = 60
const LETTER_DURATION_MS = 1400
const HOLD_MS = 600

export default function IntroOverlay({claim}: Props) {
  const {shouldShow, dismiss} = useIntro()

  useEffect(() => {
    if (!shouldShow) return
    const total = BASE_DELAY_MS + claim.length * PER_LETTER_MS + LETTER_DURATION_MS + HOLD_MS
    const t = window.setTimeout(dismiss, total)
    return () => window.clearTimeout(t)
  }, [shouldShow, dismiss, claim.length])

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          className={styles.overlay}
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0, filter: 'blur(8px)'}}
          transition={{duration: 0.4, ease: 'easeOut'}}
          onClick={dismiss}
          role="dialog"
          aria-modal="true"
          aria-label="Intro"
        >
          <div className={styles.overlayBg} aria-hidden />
          <IntroSequence claim={claim} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
