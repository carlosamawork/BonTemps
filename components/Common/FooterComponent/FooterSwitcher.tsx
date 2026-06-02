'use client'
import {usePathname} from 'next/navigation'
import type {ReactNode} from 'react'

type Props = {
  defaultFooter: ReactNode
  informationFooter: ReactNode
  projectFooter: ReactNode
}

// Picks which pre-rendered footer to show based on the current route. All
// children are server-rendered upstream so the right one is correct on first
// paint and the switch happens reactively on client navigation.
export default function FooterSwitcher({
  defaultFooter,
  informationFooter,
  projectFooter,
}: Props) {
  const path = usePathname()
  const isInformation = path === '/information' || path?.startsWith('/information/')
  const isProject = !!path?.startsWith('/work/')
  if (isInformation) return <>{informationFooter}</>
  if (isProject) return <>{projectFooter}</>
  return <>{defaultFooter}</>
}
