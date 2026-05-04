'use client'
import Image from 'next/image'
import {useState} from 'react'
import styles from './LazyImage.module.scss'

type Props = {
  src: string
  alt: string
  width: number
  height: number
  sizes: string
  priority?: boolean
  className?: string
  lqip?: string
}

export default function ClientLazyImage({
  src,
  alt,
  width,
  height,
  sizes,
  priority,
  className,
  lqip,
}: Props) {
  const [loaded, setLoaded] = useState(false)
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      placeholder={lqip ? 'blur' : 'empty'}
      blurDataURL={lqip}
      className={`${styles.img} ${className ?? ''} ${loaded ? styles.isLoaded : ''}`}
      onLoad={() => setLoaded(true)}
    />
  )
}
