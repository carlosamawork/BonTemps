import LazyImage from '@/components/Common/LazyImage'
import LazyVideo from '@/components/Common/LazyVideo'
import BodyBonTempsRenderer from '@/components/PortableText/BodyBonTempsRenderer'
import type {MediaImage, MediaVideo} from '@/sanity/types'
import styles from './ProjectModules.module.scss'

type Props = {
  imageSide: 'left' | 'right'
  mediaType: 'image' | 'video'
  image?: MediaImage
  video?: MediaVideo
  body?: unknown
}

// Two-column module: media on one side (chosen by the editor) and a body
// block on the other. CSS uses `data-side` to flip the order on desktop
// while keeping a stack order that puts the image first on mobile.
export default function ImageText({imageSide, mediaType, image, video, body}: Props) {
  return (
    <section className={styles.imageText} data-side={imageSide}>
      <div className={styles.imageTextMedia}>
        {mediaType === 'image' && image?.image && (
          <LazyImage image={image.image} alt={image.alt} sizes="50vw" />
        )}
        {mediaType === 'video' && video?.video && (
          <LazyVideo video={video.video} mode="in-view" />
        )}
      </div>
      <div className={styles.imageTextBody}>
        <BodyBonTempsRenderer value={body} />
      </div>
    </section>
  )
}
