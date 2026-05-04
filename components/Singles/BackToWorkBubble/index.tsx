import Link from 'next/link'
import styles from './BackToWorkBubble.module.scss'

// Static return-to-grid pill. No layout animation, just colour fade on
// hover (matches the menu items' grey-out treatment).
export default function BackToWorkBubble() {
  return (
    <Link href="/" className={`${styles.bubble} t-sans-title`}>
      + Back To Work
    </Link>
  )
}
