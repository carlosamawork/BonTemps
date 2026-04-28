import LazyImage from '@/components/Common/LazyImage'
import LazyVideo from '@/components/Common/LazyVideo'
import type {MediaImage, MediaVideo} from '@/sanity/types'
import styles from './ProjectModules.module.scss'

// Schema discriminates by `_type` per item and by the four `layoutXcol`
// shape variants. Right now we render a uniform grid that matches the
// `columns` count; the named layouts (optionA / B / C) only affect the
// expected aspect ratio of each asset and the editor uploads media of the
// right ratio. Honouring layout-specific ratios precisely can be added
// later by reading `layout1col` / `layout2col` etc.
type Item =
  | ({_type: 'media.image'} & MediaImage)
  | ({_type: 'media.video'} & MediaVideo)

type Props = {
  columns: 1 | 2 | 3
  reverseOrder?: boolean
  items: Item[]
  // The layout selectors are accepted but not yet applied to styling.
  layout1col?: string
  layout2col?: string
  layout3col?: string
}

export default function ImageVideoModule({columns, reverseOrder, items}: Props) {
  return (
    <section
      className={styles.imageVideo}
      data-columns={columns}
      data-reverse={reverseOrder ? 'true' : undefined}
    >
      {items.map((item, i) => (
        <figure key={i} className={styles.imageVideoItem}>
          {item._type === 'media.image' && item.image && (
            <LazyImage image={item.image} alt={item.alt} sizes="50vw" />
          )}
          {item._type === 'media.video' && item.video && (
            <LazyVideo video={item.video} mode="in-view" />
          )}
          {item.caption && <figcaption className="t-caption">{item.caption}</figcaption>}
        </figure>
      ))}
    </section>
  )
}
