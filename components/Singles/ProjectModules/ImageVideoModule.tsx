import LazyImage from '@/components/Common/LazyImage'
import LazyVideo from '@/components/Common/LazyVideo'
import BodyBonTempsRenderer from '@/components/PortableText/BodyBonTempsRenderer'
import type {MediaImage, MediaVideo} from '@/sanity/types'
import styles from './ProjectModules.module.scss'

type ImageItem = {_type: 'media.image'} & MediaImage
type VideoItem = {_type: 'media.video'} & MediaVideo
type TextItem = {_type: 'column.text'; body?: unknown}
type Item = ImageItem | VideoItem | TextItem

type Props = {
  columns: 1 | 2 | 3
  items: Item[]
}

export default function ImageVideoModule({columns, items}: Props) {
  return (
    <section className={styles.imageVideo} data-columns={columns}>
      {items.map((item, i) => {
        if (item._type === 'column.text') {
          return (
            <div key={i} className={styles.imageVideoText}>
              <BodyBonTempsRenderer value={item.body} />
            </div>
          )
        }

        return (
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
                <LazyVideo video={item.video} mode="in-view" soundControl />
              )}
            </div>
            {item.caption && <figcaption className="t-caption">{item.caption}</figcaption>}
          </figure>
        )
      })}
    </section>
  )
}
