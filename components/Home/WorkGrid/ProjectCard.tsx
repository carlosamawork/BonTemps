import Link from 'next/link'
import LazyImage from '@/components/Common/LazyImage'
import LazyVideo from '@/components/Common/LazyVideo'
import type {ProjectCardData} from '@/sanity/queries/queries/work'
import styles from './WorkGrid.module.scss'

type Props = {project: ProjectCardData}

// Title on top, fixed-ratio media block below. Subgrid in the parent aligns
// the two rows across every card so media tops line up even when titles wrap
// to different line counts. When the project has a
// featured video, it plays in-view (autoplay on scroll) and the first
// frame stands in as its own thumbnail — see LazyVideo for the LQIP fade.
// When the editor sets a hover media, it sits absolutely on top of the
// featured one and the two cross-fade via opacity on cursor hover.
//
// Coming-soon projects (case study not published yet) keep their thumbnail but
// are NOT links: hovering reveals "(Coming soon)" in grey next to the title
// instead of swapping to hover media.
export default function ProjectCard({project}: Props) {
  const isComingSoon = !!project.comingSoon
  const isVideo = project.featuredMediaType === 'video'
  const hasVideo = isVideo && !!project.featuredVideo?.video?.videoUrl
  const staticImage = project.featuredImage?.image
  const staticAlt = project.featuredImage?.alt ?? project.title

  const hoverType = project.hoverMediaType ?? 'none'
  const hoverImage = project.hoverImage?.image
  const hoverImageAlt = project.hoverImage?.alt ?? ''
  const hoverVideoUrl = project.hoverVideo?.video?.videoUrl
  // Coming-soon cards never show hover media — the title reveal stands in.
  const hasHoverImage = !isComingSoon && hoverType === 'image' && !!hoverImage
  const hasHoverVideo = !isComingSoon && hoverType === 'video' && !!hoverVideoUrl

  const inner = (
    <>
      <h3 className={`${styles.title} t-serif-detail`}>
        {project.title}
        {isComingSoon && <span className={styles.comingSoon}> (Coming soon)</span>}
      </h3>
      <div className={styles.media} data-has-hover={hasHoverImage || hasHoverVideo ? 'true' : undefined}>
        <div className={styles.mediaStatic}>
          {hasVideo && project.featuredVideo ? (
            <LazyVideo video={project.featuredVideo.video} mode="in-view" contain />
          ) : staticImage ? (
            <LazyImage
              image={staticImage}
              alt={staticAlt}
              contain
              sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, (max-width: 1799px) 25vw, 20vw"
            />
          ) : null}
        </div>
        {hasHoverImage && hoverImage && (
          <div className={styles.mediaHover} aria-hidden>
            <LazyImage
              image={hoverImage}
              alt={hoverImageAlt}
              contain
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
              contain
            />
          </div>
        )}
      </div>
    </>
  )

  // No link until the case study is ready — render a plain (still hoverable)
  // container instead of a navigable <Link>.
  if (isComingSoon) {
    return <div className={styles.card} data-coming-soon="true">{inner}</div>
  }

  return (
    <Link href={`/work/${project.slug}`} className={styles.card}>
      {inner}
    </Link>
  )
}
