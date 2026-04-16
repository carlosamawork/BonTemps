'use client'

import React, {useRef} from 'react'
import s from './FooterComponent.module.scss'
import {motion} from 'framer-motion'
import type {FooterData} from '@/sanity/types'

type FooterProps = {
  data?: FooterData
}

export default function FooterComponent({data}: FooterProps) {
  const footerRef = useRef<HTMLElement>(null)

  if (!data) return null

  return (
    <motion.footer
      className={s.footer}
      ref={footerRef}
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{duration: 0.3, delay: 0.5}}
    >
      <h4>MGTZM Footer</h4>
    </motion.footer>
  )
}
