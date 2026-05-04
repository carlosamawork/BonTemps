import {urlFor} from '@/sanity/queries'
import type {MediaImageResponsive} from '@/sanity/types'
import styles from './InformationCover.module.scss'

type Props = {image?: MediaImageResponsive}

// Full-width responsive image. Uses native <picture> + <source media> so
// the right asset is resolved server-side and the browser picks before
// the first paint — no client JS needed.
export default function InformationCover({image}: Props) {
  if (!image?.desktop?.asset) return null
  const dim = image.desktop.asset.metadata?.dimensions
  if (!dim) return null

  const dSrc = urlFor(image.desktop).auto('format').width(2400).quality(85).url()
  const tSrc = image.ipad
    ? urlFor(image.ipad).auto('format').width(1400).quality(85).url()
    : null
  const mSrc = image.mobile
    ? urlFor(image.mobile).auto('format').width(900).quality(85).url()
    : null

  return (
    <figure className={styles.figure}>
      <picture>
        {mSrc && <source media="(max-width: 767px)" srcSet={mSrc} />}
        {tSrc && <source media="(max-width: 1023px)" srcSet={tSrc} />}
        <img
          src={dSrc}
          alt={image.alt}
          width={dim.width}
          height={dim.height}
          loading="lazy"
        />
      </picture>
      {image.caption && <figcaption className="t-caption">{image.caption}</figcaption>}
    </figure>
  )
}
