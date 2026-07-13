'use client'

import {useEffect, useRef} from 'react'
import styles from './HeaderComponent.module.scss'

// iOS Safari paints the document canvas behind the status bar (the "bleed")
// but never fixed or sticky layers, so the header's blur stops dead at the
// viewport edge and the strip shows sharp content. This in-flow curtain rides
// exactly above the viewport so the bleed renders it and the strip reads as a
// blurred continuation of the header. It can never enter the viewport, so
// browsers without the bleed simply never show it.
//
// Positioning happens on the compositor via a scroll-driven animation (see
// .statusBarBleed in the SCSS) — a JS scroll listener lags behind momentum
// scrolling and briefly exposed an unblurred gap. JS only maintains
// --sb-scroll-range (the keyframes' end point) when content or viewport
// height changes, and falls back to the listener where scroll-driven
// animations are unsupported.
const CURTAIN_HEIGHT = 240
// Bottom edge sits this far inside the viewport, hidden under the header's
// solid blur zone, so rounding errors never expose a seam at the boundary.
const CUSHION = 16

export default function StatusBarBleed() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof CSS !== 'undefined' && CSS.supports('animation-timeline: scroll()')) {
      const root = document.documentElement
      const setRange = () => {
        const se = document.scrollingElement ?? root
        root.style.setProperty('--sb-scroll-range', `${se.scrollHeight - se.clientHeight}px`)
      }
      setRange()
      window.addEventListener('resize', setRange)
      window.visualViewport?.addEventListener('resize', setRange)
      const ro = new ResizeObserver(setRange)
      ro.observe(document.body)
      return () => {
        window.removeEventListener('resize', setRange)
        window.visualViewport?.removeEventListener('resize', setRange)
        ro.disconnect()
      }
    }

    const update = () => {
      el.style.transform = `translate3d(0, ${Math.max(0, window.scrollY) - (CURTAIN_HEIGHT - CUSHION)}px, 0)`
    }
    window.addEventListener('scroll', update, {passive: true})
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  return <div ref={ref} className={styles.statusBarBleed} aria-hidden="true" />
}
