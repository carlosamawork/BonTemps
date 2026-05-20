import Link from 'next/link'
import LazyImage from '@/components/Common/LazyImage'
import LazyVideo from '@/components/Common/LazyVideo'
import type {ProjectCardData} from '@/sanity/queries/queries/work'
import styles from './WorkGrid.module.scss'

type Props = {project: ProjectCardData}

// Title on top, media in the middle, excerpt at the bottom. Subgrid in the
// parent aligns the three rows across every card. When the project has a
// featured video, it plays in-view (autoplay on scroll) and the first
// frame stands in as its own thumbnail — see LazyVideo for the LQIP fade.
// When the editor sets a hover media, it sits absolutely on top of the
// featured one and the two cross-fade via opacity on cursor hover.
export default function ProjectCard({project}: Props) {
  const isVideo = project.featuredMediaType === 'video'
  const hasVideo = isVideo && !!project.featuredVideo?.video?.videoUrl
  const staticImage = project.featuredImage?.image
  const staticAlt = project.featuredImage?.alt ?? project.title

  const hoverType = project.hoverMediaType ?? 'none'
  const hoverImage = project.hoverImage?.image
  const hoverImageAlt = project.hoverImage?.alt ?? ''
  const hoverVideoUrl = project.hoverVideo?.video?.videoUrl
  const hasHoverImage = hoverType === 'image' && !!hoverImage
  const hasHoverVideo = hoverType === 'video' && !!hoverVideoUrl

  return (
    <Link href={`/work/${project.slug}`} className={styles.card}>
      <h3 className={`${styles.title} t-sans-title`}>{project.title}</h3>
      <div className={styles.media} data-has-hover={hasHoverImage || hasHoverVideo ? 'true' : undefined}>
        <div className={styles.mediaStatic}>
          {hasVideo && project.featuredVideo ? (
            <LazyVideo video={project.featuredVideo.video} mode="in-view" />
          ) : staticImage ? (
            <LazyImage
              image={staticImage}
              alt={staticAlt}
              sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, (max-width: 1799px) 25vw, 20vw"
            />
          ) : null}
        </div>
        {hasHoverImage && hoverImage && (
          <div className={styles.mediaHover} aria-hidden>
            <LazyImage
              image={hoverImage}
              alt={hoverImageAlt}
              sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, (max-width: 1799px) 25vw, 20vw"
            />
          </div>
        )}
        {hasHoverVideo && project.hoverVideo && (
          <div className={styles.mediaHover} aria-hidden>
            <LazyVideo
              video={project.hoverVideo.video}
              mode="hover"
              mobileAutoplay={false}
              hoverTargetSelector={`.${styles.card}`}
            />
          </div>
        )}
      </div>
      {project.excerpt && (
        <p className={`${styles.excerpt} t-project-desc`}>{project.excerpt}</p>
      )}
    </Link>
  )
}
