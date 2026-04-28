import type {ProjectCardData} from '@/sanity/queries/queries/work'
import ProjectCard from './ProjectCard'
import styles from './WorkGrid.module.scss'

type Props = {projects: ProjectCardData[]}

export default function WorkGrid({projects}: Props) {
  if (!projects || projects.length === 0) {
    return (
      <section className={styles.empty}>
        <p className="t-body">No projects yet.</p>
      </section>
    )
  }
  return (
    <ul className={styles.grid}>
      {projects.map((p) => (
        <li key={p._id}>
          <ProjectCard project={p} />
        </li>
      ))}
    </ul>
  )
}
