import type {ProjectCardData} from '@/sanity/queries/queries/work'
import ProjectCard from './ProjectCard'
import styles from './WorkGrid.module.scss'

type Props = {
  projects: ProjectCardData[]
  // Long-form claim that sits above the grid. Lives inside the same grid
  // so its width snaps to the same column system as the cards.
  claim?: string
}

export default function WorkGrid({projects, claim}: Props) {
  const hasClaim = !!claim
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
          <p className={`${styles.claimContent} t-about`}>{claim}</p>
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
