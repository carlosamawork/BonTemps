'use client'
import {useEffect, useState} from 'react'
import LazyVideo from '@/components/Common/LazyVideo'
import type {ModuleVideo} from '@/sanity/types'

type Props = {
  desktop: ModuleVideo
  ipad?: ModuleVideo
  mobile?: ModuleVideo
}

// Picks the right ModuleVideo for the current viewport on mount and on
// resize. Server render uses the desktop variant so the SSR poster always
// represents the widest version; the client may swap to a tighter variant
// once it knows the viewport.
export default function ResponsiveVideoClient({desktop, ipad, mobile}: Props) {
  const [active, setActive] = useState<ModuleVideo>(desktop)

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      if (w < 768 && mobile) setActive(mobile)
      else if (w < 1024 && ipad) setActive(ipad)
      else setActive(desktop)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [desktop, ipad, mobile])

  return <LazyVideo video={active} mode="in-view" />
}
