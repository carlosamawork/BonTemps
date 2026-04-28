import {urlFor} from '@/sanity/queries'
import type {
  MediaImageResponsive,
  MediaVideoResponsive,
} from '@/sanity/types'
import ResponsiveVideoClient from './ResponsiveVideoClient'
import styles from './InformationModules.module.scss'

type ImageItem = MediaImageResponsive & {_type: 'media.imageResponsive'}
type VideoItem = MediaVideoResponsive & {_type: 'media.videoResponsive'}
type Item = ImageItem | VideoItem

type Props = {
  columns: 1 | 2 | 3
  reverseOrderOnMobile?: boolean
  items: Item[]
}

// Information-only module that supports breakpoint-specific media. Images
// use a server-rendered <picture> with `<source media>` so the right URL
// is picked at first paint. Videos defer to a client island that watches
// matchMedia, since HLS sources can't be expressed via <source>.
export default function InformationImageVideo({
  columns,
  reverseOrderOnMobile,
  items,
}: Props) {
  return (
    <section
      className={styles.imgVid}
      data-columns={columns}
      data-reverse={reverseOrderOnMobile ? 'true' : undefined}
    >
      {items.map((item, i) => {
        if (item._type === 'media.imageResponsive') {
          const dim = item.desktop?.asset?.metadata?.dimensions
          if (!item.desktop?.asset || !dim) return null
          const dSrc = urlFor(item.desktop).auto('format').width(2000).quality(85).url()
          const tSrc = item.ipad
            ? urlFor(item.ipad).auto('format').width(1200).quality(85).url()
            : null
          const mSrc = item.mobile
            ? urlFor(item.mobile).auto('format').width(800).quality(85).url()
            : null
          return (
            <figure key={i} className={styles.imgVidItem}>
              <picture>
                {mSrc && <source media="(max-width: 767px)" srcSet={mSrc} />}
                {tSrc && <source media="(max-width: 1023px)" srcSet={tSrc} />}
                <img
                  src={dSrc}
                  alt={item.alt}
                  width={dim.width}
                  height={dim.height}
                  loading="lazy"
                />
              </picture>
              {item.caption && <figcaption className="t-caption">{item.caption}</figcaption>}
            </figure>
          )
        }
        return (
          <figure key={i} className={styles.imgVidItem}>
            <ResponsiveVideoClient
              desktop={item.desktop}
              ipad={item.ipad}
              mobile={item.mobile}
            />
            {item.caption && <figcaption className="t-caption">{item.caption}</figcaption>}
          </figure>
        )
      })}
    </section>
  )
}
