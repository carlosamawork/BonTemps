import type {PortableTextBlock} from '@portabletext/types'
import BodyBonTempsRenderer from '@/components/PortableText/BodyBonTempsRenderer'
import type {ProjectCardData} from '@/sanity/queries/queries/work'
import ProjectCard from './ProjectCard'
import styles from './WorkGrid.module.scss'

type Props = {
  projects: ProjectCardData[]
  // Long-form claim that sits above the grid. Lives inside the same grid
  // so its width snaps to the same column system as the cards.
  claim?: PortableTextBlock[]
}

export default function WorkGrid({projects, claim}: Props) {
  const hasClaim = Array.isArray(claim) && claim.length > 0
  const hasProjects = projects && projects.length > 0

  if (!hasClaim && !hasProjects) {
    return (
      <section className={styles.empty}>
        <p className="t-body">No projects yet.</p>
      </section>
    )
  }

  return (
    <ul className={styles.grid}>
      {hasClaim && (
        <li className={styles.claimRow}>
          <div className={styles.claimContent}>
            <BodyBonTempsRenderer value={claim} />
          </div>
        </li>
      )}
      {hasProjects &&
        projects.map((p) => (
          <li key={p._id} className={styles.cardItem}>
            <ProjectCard project={p} />
          </li>
        ))}
    </ul>
  )
}
