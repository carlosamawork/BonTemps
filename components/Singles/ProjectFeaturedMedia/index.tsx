import LazyImage from '@/components/Common/LazyImage'
import LazyVideo from '@/components/Common/LazyVideo'
import type {MediaImage, MediaVideo} from '@/sanity/types'
import styles from './ProjectFeaturedMedia.module.scss'

type Props = {
  type: 'image' | 'video'
  image?: MediaImage
  video?: MediaVideo
}

// Wide-screen featured media at the top of the project page. Switches on
// the editorial-selected media type. Video uses `in-view` so it doesn't
// drain bandwidth before the user scrolls to it.
export default function ProjectFeaturedMedia({type, image, video}: Props) {
  if (type === 'image' && image?.image) {
    return (
      <figure className={styles.figure}>
        <LazyImage image={image.image} alt={image.alt} sizes="100vw" priority />
        {image.caption && <figcaption className="t-caption">{image.caption}</figcaption>}
      </figure>
    )
  }
  if (type === 'video' && video?.video) {
    return (
      <figure className={styles.figure}>
        <LazyVideo video={video.video} mode="in-view" />
        {video.caption && <figcaption className="t-caption">{video.caption}</figcaption>}
      </figure>
    )
  }
  return null
}
