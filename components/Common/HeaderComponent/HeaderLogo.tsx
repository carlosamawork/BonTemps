'use client'
import Link from 'next/link'
import {useEffect, useState} from 'react'
import LogoBonTemps from '@/components/Common/Logo/LogoBonTemps'
import styles from './HeaderComponent.module.scss'

const FADE_START = 8 // px scrolled before the fade starts
const FADE_DISTANCE = 120 // px window over which it goes 1 → 0

// Linear scroll-driven opacity for the mobile logo. Listens to a single
// passive scroll handler (rAF-throttled) and sets opacity inline so the
// fade is smooth even on low-power devices. Tablet+ ignore the value so
// the desktop logo stays solid.
export default function HeaderLogo() {
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    let ticking = false
    const update = () => {
      const y = window.scrollY
      const o = Math.max(0, Math.min(1, 1 - (y - FADE_START) / FADE_DISTANCE))
      setOpacity(o)
      ticking = false
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, {passive: true})
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <Link
      href="/"
      className={styles.logo}
      aria-label="Bon Temps — home"
      style={{'--logo-opacity': opacity} as React.CSSProperties}
    >
      <LogoBonTemps className={styles.logoSvg} />
    </Link>
  )
}
