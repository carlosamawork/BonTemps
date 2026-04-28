import type {SanityImage} from '@/sanity/types'
import {urlFor} from '@/sanity/queries'
import ClientLazyImage from './ClientLazyImage'

type Props = {
  image: SanityImage
  alt: string
  sizes: string
  priority?: boolean
  className?: string
  width?: number
}

// RSC wrapper. Resolves URLs and dimensions on the server so the HTML payload
// arrives with intrinsic sizes (zero CLS) and the LQIP blurDataURL is inline
// — no second round-trip needed before painting the placeholder.
export default function LazyImage({
  image,
  alt,
  sizes,
  priority,
  className,
  width = 1600,
}: Props) {
  const dim = image?.asset?.metadata?.dimensions
  if (!image?.asset || !dim) return null

  const src = urlFor(image).auto('format').width(width).quality(85).url()
  const lqip = image.asset.metadata?.lqip

  return (
    <ClientLazyImage
      src={src}
      alt={alt}
      width={dim.width}
      height={dim.height}
      sizes={sizes}
      priority={priority}
      className={className}
      lqip={lqip}
    />
  )
}
