import Link from 'next/link'
import LazyImage from '@/components/Common/LazyImage'
import ProjectCardHover from './ProjectCardHover'
import type {ProjectCardData} from '@/sanity/queries/queries/work'
import styles from './WorkGrid.module.scss'

type Props = {project: ProjectCardData}

// Card composition per Figma: title (small) on top, image (with hover-video
// overlay) in the middle, excerpt at the bottom. Image keeps intrinsic ratio
// — sizing is governed by the parent subgrid so the three rows align across
// every card in the same visual row.
export default function ProjectCard({project}: Props) {
  const isVideo = project.featuredMediaType === 'video'
  const hasVideo = isVideo && !!project.featuredVideo?.video?.videoUrl

  // Static image: prefer the explicitly uploaded featured image; fall back
  // to the video poster so video-only projects still render an SSR image.
  const staticImage =
    project.featuredImage?.image ?? project.featuredVideo?.video?.poster
  const staticAlt = project.featuredImage?.alt ?? project.title

  return (
    <Link href={`/work/${project.slug}`} className={styles.card}>
      <h3 className={`${styles.title} t-sans-title`}>{project.title}</h3>
      <div className={styles.media}>
        {staticImage && (
          <LazyImage
            image={staticImage}
            alt={staticAlt}
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, (max-width: 1799px) 25vw, 20vw"
          />
        )}
        {hasVideo && project.featuredVideo && (
          <ProjectCardHover video={project.featuredVideo.video} />
        )}
      </div>
      {project.excerpt && (
        <p className={`${styles.excerpt} t-project-desc`}>{project.excerpt}</p>
      )}
    </Link>
  )
}
