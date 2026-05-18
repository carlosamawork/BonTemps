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
export default function ProjectCard({project}: Props) {
  const isVideo = project.featuredMediaType === 'video'
  const hasVideo = isVideo && !!project.featuredVideo?.video?.videoUrl
  const staticImage = project.featuredImage?.image
  const staticAlt = project.featuredImage?.alt ?? project.title

  return (
    <Link href={`/work/${project.slug}`} className={styles.card}>
      <h3 className={`${styles.title} t-sans-title`}>{project.title}</h3>
      <div className={styles.media}>
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
      {project.excerpt && (
        <p className={`${styles.excerpt} t-project-desc`}>{project.excerpt}</p>
      )}
    </Link>
  )
}
