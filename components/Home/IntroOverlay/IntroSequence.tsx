'use client'
import {motion} from 'framer-motion'
import type {ReactNode} from 'react'
import MonogramBTA from '@/components/Common/Logo/MonogramBTA'
import styles from './IntroOverlay.module.scss'

type Props = {claim: string}

// Per-letter opacity reveal tuned to feel continuous, not mechanical. 60ms
// stagger but 1.4s per-letter duration, so ~25 letters are mid-fade at once
// and the line reads as a gradient of light sweeping across.
const LETTER_DURATION = 1.4
const LETTER_STAGGER = 0.06
const BASE_DELAY = 0.2
const SOFT_EASE = [0.65, 0, 0.35, 1] as const

export default function IntroSequence({claim}: Props) {
  // Group letters by word: each word is an inline-block `nowrap` unit, so the
  // line can ONLY break between words. With bare per-letter inline-block spans
  // a constrained width (mobile) would break mid-word — words keep the
  // two-line wrap clean. The running index keeps the stagger continuous and
  // advances over spaces too, so timing matches the original cadence.
  const words = claim.split(' ')
  let charIndex = 0
  const wordNodes: ReactNode[] = []
  words.forEach((word, wi) => {
    const letters = Array.from(word).map((ch) => {
      const i = charIndex++
      return (
        <motion.span
          key={i}
          className={styles.letter}
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{
            delay: BASE_DELAY + i * LETTER_STAGGER,
            duration: LETTER_DURATION,
            ease: SOFT_EASE,
          }}
          aria-hidden
        >
          {ch}
        </motion.span>
      )
    })
    wordNodes.push(
      <span className={styles.word} key={`w${wi}`}>
        {letters}
      </span>
    )
    if (wi < words.length - 1) {
      charIndex++ // the original space keeps following letters' delays aligned
      wordNodes.push(' ')
    }
  })

  // Monogram starts when the last letter starts, same duration/ease, so it
  // reads as one continuous gesture closing the sequence.
  const monogramDelay = BASE_DELAY + Array.from(claim).length * LETTER_STAGGER

  return (
    <div className={styles.stage}>
      <h1 className={styles.claim} aria-label={claim}>
        {wordNodes}
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
