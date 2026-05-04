import LazyImage from '@/components/Common/LazyImage'
import LazyVideo from '@/components/Common/LazyVideo'
import type {MediaImage, MediaVideo} from '@/sanity/types'
import styles from './ProjectModules.module.scss'

// Schema discriminates by `_type` per item plus the editor-selected
// `layoutXcol` shape variant. The CSS reads `data-columns` and
// `data-layout` to set grid template + per-item aspect ratio so editor
// uploads of the suggested dimensions render exactly as designed (and
// off-spec uploads still hold the layout via object-fit: cover).
type Item =
  | ({_type: 'media.image'} & MediaImage)
  | ({_type: 'media.video'} & MediaVideo)

type Props = {
  columns: 1 | 2 | 3
  reverseOrder?: boolean
  items: Item[]
  layout1col?: string
  layout2col?: string
  layout3col?: string
}

export default function ImageVideoModule({
  columns,
  reverseOrder,
  items,
  layout1col,
  layout2col,
  layout3col,
}: Props) {
  const layout =
    columns === 1
      ? layout1col ?? 'optionA'
      : columns === 2
        ? layout2col ?? 'optionA'
        : layout3col ?? 'optionA'

  return (
    <section
      className={styles.imageVideo}
      data-columns={columns}
      data-layout={layout}
      data-reverse={reverseOrder ? 'true' : undefined}
    >
      {items.map((item, i) => (
        <figure key={i} className={styles.imageVideoItem}>
          <div className={styles.imageVideoMedia}>
            {item._type === 'media.image' && item.image && (
              <LazyImage
                image={item.image}
                alt={item.alt}
                sizes={columns === 1 ? '100vw' : columns === 2 ? '50vw' : '33vw'}
              />
            )}
            {item._type === 'media.video' && item.video && (
              <LazyVideo video={item.video} mode="in-view" />
            )}
          </div>
          {item.caption && <figcaption className="t-caption">{item.caption}</figcaption>}
        </figure>
      ))}
    </section>
  )
}
