'use client'
import {createContext, useCallback, useContext, useEffect, useRef, useState} from 'react'

const KEY = 'bontemps_intro_seen'

type IntroCtx = {
  shouldShow: boolean
  dismiss: () => void
  replay: () => void
}

const IntroContext = createContext<IntroCtx | null>(null)

export function useIntro(): IntroCtx {
  const ctx = useContext(IntroContext)
  if (!ctx) throw new Error('useIntro must be used inside IntroProvider')
  return ctx
}

// The provider decides on mount whether the intro should run, then exposes
// dismiss() and replay(). The decision is gated by sessionStorage and by
// `prefers-reduced-motion`. Controllers (logo click) call replay().
export function IntroProvider({children}: {children: React.ReactNode}) {
  const [decided, setDecided] = useState(false)
  const [shouldShow, setShouldShow] = useState(false)
  const ranOnce = useRef(false)

  useEffect(() => {
    if (ranOnce.current) return
    ranOnce.current = true
    try {
      const seen = sessionStorage.getItem(KEY)
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (!seen && !reduced) {
        setShouldShow(true)
      } else {
        // Either already seen this session or motion-reduced — clear the
        // pending mask the inline gate set.
        document.body.classList.remove('intro-pending')
        document.documentElement.classList.remove('intro-pending')
      }
    } catch {
      // sessionStorage may be blocked (private mode etc.) — fail open: never
      // hide content waiting for an intro that won't arrive.
      document.body.classList.remove('intro-pending')
      document.documentElement.classList.remove('intro-pending')
    } finally {
      setDecided(true)
    }
  }, [])

  const dismiss = useCallback(() => {
    try {
      sessionStorage.setItem(KEY, 'true')
    } catch {
      // ignored
    }
    setShouldShow(false)
    document.body.classList.remove('intro-pending')
    document.documentElement.classList.remove('intro-pending')
  }, [])

  const replay = useCallback(() => {
    try {
      sessionStorage.removeItem(KEY)
    } catch {
      // ignored
    }
    document.body.classList.add('intro-pending')
    document.documentElement.classList.add('intro-pending')
    setShouldShow(true)
  }, [])

  return (
    <IntroContext.Provider value={{shouldShow: decided && shouldShow, dismiss, replay}}>
      {children}
    </IntroContext.Provider>
  )
}
