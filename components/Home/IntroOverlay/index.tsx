'use client'
import {AnimatePresence, motion} from 'framer-motion'
import {useEffect} from 'react'
import {useIntro} from './IntroProvider'
import IntroSequence from './IntroSequence'
import styles from './IntroOverlay.module.scss'

type Props = {claim: string}

// Total visible time is the stagger length plus a hold. We derive it from
// the claim length so longer claims stay on screen long enough to read.
const PER_LETTER_MS = 40
const HOLD_MS = 1200
const BASE_DELAY_MS = 400

export default function IntroOverlay({claim}: Props) {
  const {shouldShow, dismiss} = useIntro()

  useEffect(() => {
    if (!shouldShow) return
    const total = BASE_DELAY_MS + claim.length * PER_LETTER_MS + HOLD_MS
    const t = window.setTimeout(dismiss, total)
    return () => window.clearTimeout(t)
  }, [shouldShow, dismiss, claim.length])

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          className={styles.overlay}
          initial={{opacity: 1}}
          exit={{opacity: 0, filter: 'blur(8px)'}}
          transition={{duration: 0.6, ease: 'easeOut'}}
          onClick={dismiss}
          role="dialog"
          aria-modal="true"
          aria-label="Intro"
        >
          <IntroSequence claim={claim} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
