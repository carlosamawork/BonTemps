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
  // Passed straight to next/image's `style`. next/image reads objectFit /
  // objectPosition from here to size BOTH the image and the blur placeholder,
  // so a `contain` image gets a `contain` blur (not a cover one that fills the
  // whole box). Setting it only via CSS would leave the blur as cover.
  imgStyle?: React.CSSProperties
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
  imgStyle,
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
      style={imgStyle}
      className={`${styles.img} ${className ?? ''} ${loaded ? styles.isLoaded : ''}`}
      onLoad={() => setLoaded(true)}
    />
  )
}
