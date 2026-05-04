'use client'
import {motion, LayoutGroup} from 'framer-motion'
import {usePathname} from 'next/navigation'
import {useEffect, useState} from 'react'
import styles from './HeaderComponent.module.scss'

type Item = {href: string; key: string; label: string}
type Props = {items: readonly Item[]; children: React.ReactNode}

// The bubble lives behind the active nav item. We measure its position
// after every route change and animate via layoutId — a real DOM element
// keeps the bubble visible to crawlers and accessible without JS.
export default function HeaderClient({items, children}: Props) {
  const pathname = usePathname()
  const activeKey =
    pathname === '/' || pathname.startsWith('/work')
      ? 'work'
      : pathname.startsWith('/information')
      ? 'information'
      : null

  return (
    <nav className={styles.nav} aria-label="Primary">
      <LayoutGroup id="nav">
        <BubbleOverlay activeKey={activeKey} />
        {children}
      </LayoutGroup>
    </nav>
  )
}

function BubbleOverlay({activeKey}: {activeKey: string | null}) {
  const [rect, setRect] = useState<{
    left: number
    top: number
    width: number
    height: number
  } | null>(null)

  useEffect(() => {
    if (!activeKey) {
      setRect(null)
      return
    }
    // Re-measure on every paint after route change. The nav siblings render
    // server-side, so the anchor is in the DOM before this effect runs.
    const el = document.querySelector<HTMLElement>(`a[data-key="${activeKey}"]`)
    if (!el || !el.parentElement) return
    const parent = el.parentElement.getBoundingClientRect()
    const r = el.getBoundingClientRect()
    setRect({
      left: r.left - parent.left,
      top: r.top - parent.top,
      width: r.width,
      height: r.height,
    })
  }, [activeKey])

  if (!rect) return null
  return (
    <motion.span
      layoutId="nav-bubble"
      className={styles.bubble}
      style={{left: rect.left, top: rect.top, width: rect.width, height: rect.height}}
      transition={{type: 'spring', stiffness: 400, damping: 36}}
      aria-hidden
    />
  )
}
