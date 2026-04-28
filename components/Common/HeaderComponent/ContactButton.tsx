'use client'
import {AnimatePresence, motion} from 'framer-motion'
import {useState} from 'react'
import styles from './HeaderComponent.module.scss'

type Props = {email: string}

// Default behaviour is `mailto:` so the link works without JS, follows
// keyboard focus, and survives clipboard API failures. With JS the click is
// intercepted: we copy the email and swap the label briefly.
export default function ContactButton({email}: Props) {
  const [copied, setCopied] = useState(false)

  const handle = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return
    e.preventDefault()
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      // Fall back to mailto navigation when the clipboard API rejects.
      window.location.href = `mailto:${email}`
    }
  }

  return (
    <a
      href={`mailto:${email}`}
      onClick={handle}
      className={`${styles.contact} ${styles.navItem} t-sans-title`}
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
