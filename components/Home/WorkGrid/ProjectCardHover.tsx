'use client'
import LazyVideo from '@/components/Common/LazyVideo'
import type {ModuleVideo} from '@/sanity/types'
import styles from './WorkGrid.module.scss'

type Props = {video: ModuleVideo}

// Sits as a layer on top of the static poster. Visibility is driven by CSS
// hover on the parent .card on desktop. On mobile, LazyVideo's intersection
// observer triggers playback automatically via mobileAutoplay.
export default function ProjectCardHover({video}: Props) {
  return (
    <div className={styles.hoverLayer} aria-hidden>
      <LazyVideo video={video} mode="hover" mobileAutoplay />
    </div>
  )
}
