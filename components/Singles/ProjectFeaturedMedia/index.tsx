import LazyImage from '@/components/Common/LazyImage'
import LazyVideo from '@/components/Common/LazyVideo'
import type {MediaImage, MediaVideo} from '@/sanity/types'
import styles from './ProjectFeaturedMedia.module.scss'

type MediaType = 'image' | 'video'

type Props = {
  type: MediaType
  image?: MediaImage
  video?: MediaVideo
  mobileType?: 'none' | MediaType
  mobileImage?: MediaImage
  mobileVideo?: MediaVideo
}

function FigureContent({
  type,
  image,
  video,
  priority = false,
}: {
  type: MediaType
  image?: MediaImage
  video?: MediaVideo
  priority?: boolean
}) {
  if (type === 'image' && image?.image) {
    return (
      <>
        <LazyImage image={image.image} alt={image.alt} sizes="100vw" priority={priority} />
        {image.caption && <figcaption className="t-caption">{image.caption}</figcaption>}
      </>
    )
  }
  if (type === 'video' && video?.video) {
    return (
      <>
        <LazyVideo video={video.video} mode="in-view" soundControl />
        {video.caption && <figcaption className="t-caption">{video.caption}</figcaption>}
      </>
    )
  }
  return null
}

// When `mobileType !== 'none'`, both figures render server-side and CSS
// hides whichever doesn't match the viewport — same pattern used for
// modulesMobile / modulesDesktop. With no override, only the desktop
// figure renders and shows on every breakpoint.
export default function ProjectFeaturedMedia({
  type,
  image,
  video,
  mobileType,
  mobileImage,
  mobileVideo,
}: Props) {
  const hasMobileOverride = mobileType === 'image' || mobileType === 'video'

  const desktopContent = (
    <FigureContent type={type} image={image} video={video} priority />
  )

  if (!hasMobileOverride) {
    return <figure className={styles.figure}>{desktopContent}</figure>
  }

  return (
    <>
      <figure className={`${styles.figure} ${styles.figureMobile}`}>
        <FigureContent
          type={mobileType as MediaType}
          image={mobileImage}
          video={mobileVideo}
          priority
        />
      </figure>
      <figure className={`${styles.figure} ${styles.figureDesktop}`}>
        {desktopContent}
      </figure>
    </>
  )
}
