'use client'

import {useEffect, useRef} from 'react'
import styles from './HeaderComponent.module.scss'

// iOS Safari paints the document canvas behind the status bar (the "bleed")
// but never fixed or sticky layers, so the header's blur stops dead at the
// viewport edge and the strip shows sharp content. This in-flow curtain rides
// exactly above the viewport, following scroll, so the bleed renders it and
// the strip reads as a blurred continuation of the header. It can never enter
// the viewport, so browsers without the bleed simply never show it.
const CURTAIN_HEIGHT = 240

export default function StatusBarBleed() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => {
      el.style.transform = `translate3d(0, ${Math.max(0, window.scrollY) - CURTAIN_HEIGHT}px, 0)`
    }
    window.addEventListener('scroll', update, {passive: true})
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  return <div ref={ref} className={styles.statusBarBleed} aria-hidden="true" />
}
