'use client'

import s from './HeaderComponent.module.scss'
import {useRef} from 'react'
import {motion} from 'framer-motion'
import type {HeaderData} from '@/sanity/types'

type HeaderProps = {
  data?: HeaderData
}

export default function HeaderComponent({data}: HeaderProps) {
  const headerRef = useRef<HTMLElement>(null)

  if (!data) return null

  return (
    <motion.header
      className={s.header}
      ref={headerRef}
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{duration: 0.3, delay: 0.5}}
    >
      <h4>MGTZM Header</h4>
    </motion.header>
  )
}
