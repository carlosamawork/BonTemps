'use client'
import {usePathname} from 'next/navigation'
import {useLayoutEffect, useState} from 'react'
import styles from './HeaderComponent.module.scss'

type Item = {href: string; key: string; label: string}
type Props = {items: readonly Item[]; children: React.ReactNode}

// The bubble lives behind the active nav item. We measure its position
// synchronously before paint so it appears at its final spot on first
// render with no entrance animation; the only motion is a horizontal
// slide between Work / Information when the active item changes.
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
      <BubbleOverlay activeKey={activeKey} />
      {children}
    </nav>
  )
}

function BubbleOverlay({activeKey}: {activeKey: string | null}) {
  const [rect, setRect] = useState<{
    left: number
    top: number
    width: number
  } | null>(null)

  // useLayoutEffect runs synchronously after DOM mutations and before the
  // browser paints, so the bubble lands at its target rect on first paint
  // without a flash. The dependency on `activeKey` is enough — the nav
  // markup is server-rendered, so the anchor is already in the DOM.
  useLayoutEffect(() => {
    if (!activeKey) {
      setRect(null)
      return
    }
    const el = document.querySelector<HTMLElement>(`a[data-key="${activeKey}"]`)
    if (!el || !el.parentElement) return
    const parent = el.parentElement.getBoundingClientRect()
    const r = el.getBoundingClientRect()
    // Centre the 31px bubble around the nav text vertically so it stays
    // anchored to the text regardless of header alignment.
    const BUBBLE_HEIGHT = 31
    setRect({
      left: r.left - parent.left,
      top: r.top - parent.top + (r.height - BUBBLE_HEIGHT) / 2,
      width: r.width,
    })
  }, [activeKey])

  if (!rect) return null
  return (
    <span
      className={styles.bubble}
      style={{left: rect.left, top: rect.top, width: rect.width}}
      aria-hidden
    />
  )
}
