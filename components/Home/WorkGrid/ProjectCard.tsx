import Link from 'next/link'
import LazyImage from '@/components/Common/LazyImage'
import type {ProjectCardData} from '@/sanity/queries/queries/work'
import ProjectCardHover from './ProjectCardHover'
import styles from './WorkGrid.module.scss'

type Props = {project: ProjectCardData}

// The card is a single <a> wrapping poster + title so keyboard focus,
// crawlers, and the mobile tap target all align with the same element.
export default function ProjectCard({project}: Props) {
  const hasVideo =
    project.featuredMediaType === 'video' &&
    !!project.featuredVideo?.video?.videoUrl &&
    !!project.featuredVideo?.video?.poster?.asset

  // Always render the static poster for crawlers + no-JS users. The video
  // overlay is mounted on top by the client island when the project ships
  // a video.
  const posterMedia = project.featuredImage ?? null

  return (
    <Link href={`/work/${project.slug}`} className={styles.card}>
      <div className={styles.media}>
        {posterMedia && posterMedia.image && (
          <LazyImage
            image={posterMedia.image}
            alt={posterMedia.alt}
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
          />
        )}
        {hasVideo && project.featuredVideo && (
          <ProjectCardHover video={project.featuredVideo.video} />
        )}
      </div>
      <h3 className={`${styles.title} t-sans-title`}>{project.title}</h3>
      {project.subtitle && (
        <p className={`${styles.desc} t-project-desc`}>{project.subtitle}</p>
      )}
    </Link>
  )
}
