'use client'
import {motion} from 'framer-motion'
import {useState} from 'react'
import styles from './VisitWebsiteBubble.module.scss'

type Props = {url: string}

// "+" pill that expands to "+ Visit Website" on hover/focus. layout
// animation lets framer-motion smoothly resize the pill when its label
// changes width.
export default function VisitWebsiteClient({url}: Props) {
  const [hover, setHover] = useState(false)
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noreferrer"
      className={`${styles.bubble} t-sans-title`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      layout
      transition={{type: 'spring', stiffness: 320, damping: 32}}
    >
      <motion.span layout>{hover ? '+ Visit Website' : '+'}</motion.span>
    </motion.a>
  )
}
