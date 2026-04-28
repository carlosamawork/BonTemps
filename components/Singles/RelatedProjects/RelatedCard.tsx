'use client'
import Link from 'next/link'
import {useState} from 'react'
import LazyImage from '@/components/Common/LazyImage'
import type {ProjectCardData} from '@/sanity/queries/queries/work'
import styles from './RelatedProjects.module.scss'

type Props = {project: ProjectCardData}

// Black-on-white default; the whole card flips to white-on-black while
// hovered. We track hover in state because the crossover affects more than
// one element (background, image overlay, text colour).
export default function RelatedCard({project}: Props) {
  const [hovered, setHovered] = useState(false)

  const staticImage =
    project.featuredImage?.image ?? project.featuredVideo?.video?.poster
  const staticAlt = project.featuredImage?.alt ?? project.title

  return (
    <Link
      href={`/work/${project.slug}`}
      className={`${styles.card} ${hovered ? styles.hovered : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      {staticImage && (
        <div className={styles.media}>
          <LazyImage
            image={staticImage}
            alt={staticAlt}
            sizes="(max-width: 767px) 100vw, 50vw"
          />
        </div>
      )}
      <div className={styles.text}>
        <h3 className={`${styles.title} t-sans-title`}>{project.title}</h3>
        {project.subtitle && (
          <p className={`${styles.subtitle} t-project-desc`}>{project.subtitle}</p>
        )}
      </div>
    </Link>
  )
}
