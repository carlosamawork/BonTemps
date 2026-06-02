import type {SanityImage} from '@/sanity/types'
import {urlFor} from '@/sanity/queries'
import ClientLazyImage from './ClientLazyImage'

type Props = {
  image: SanityImage
  alt: string
  sizes: string
  priority?: boolean
  className?: string
  /** Max source width to request from Sanity. Defaults to the largest
   *  deviceSize (2560); the custom loader downscales per srcset candidate. */
  width?: number
  /** Fit the image (and its blur placeholder) inside the box with `contain`,
   *  top-aligned, instead of the default natural flow. Used by the fixed-ratio
   *  work-grid thumbnails so the LQIP blur is contained too. */
  contain?: boolean
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
  width = 2560,
  contain,
}: Props) {
  const dim = image?.asset?.metadata?.dimensions
  if (!image?.asset || !dim) return null

  // Build the high-res base URL ONCE. The crop rect (when an editor cropped
  // the image) is baked in here via .width(); the custom Sanity loader only
  // swaps `w=` per srcset candidate. quality 100 = single lossless pass —
  // Sanity will never upscale past the source, so smaller assets are unaffected.
  const src = urlFor(image).auto('format').width(width).quality(100).url()
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
      imgStyle={contain ? {objectFit: 'contain', objectPosition: 'top'} : undefined}
    />
  )
}
