'use client'
import {AnimatePresence, motion} from 'framer-motion'
import {useState} from 'react'
import styles from './HeaderComponent.module.scss'

type Props = {email: string; className?: string}

// Default behaviour is `mailto:` so the link works without JS, follows
// keyboard focus, and survives clipboard API failures. With JS the click is
// intercepted: we copy the email and swap the label briefly.
//
// `className` lets the parent place this button inside the nav grid so it
// shares horizontal alignment with Work/Information without inheriting the
// bubble layoutId.
export default function ContactButton({email, className}: Props) {
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
      className={`${className ?? ''} ${styles.contact} t-sans-title`}
      aria-label={`Copy email ${email}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? 'copied' : 'contact'}
          initial={{y: 4, opacity: 0}}
          animate={{y: 0, opacity: 1}}
          exit={{y: -4, opacity: 0}}
          transition={{duration: 0.18}}
        >
          {copied ? 'Copied' : 'Contact'}
        </motion.span>
      </AnimatePresence>
    </a>
  )
}
