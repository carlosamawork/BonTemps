import type {ProjectCardData} from '@/sanity/queries/queries/work'
import RelatedCard from './RelatedCard'
import styles from './RelatedProjects.module.scss'

type Props = {projects?: ProjectCardData[]}

// Compact projects grid shown at the bottom of a project page. Hidden when
// the editor leaves `relatedProjects` empty.
export default function RelatedProjects({projects}: Props) {
  if (!projects || projects.length === 0) return null
  return (
    <section className={styles.section}>
      <h2 className={`${styles.heading} t-sans-small`}>Related Projects</h2>
      <ul className={styles.grid}>
        {projects.map((p) => (
          <li key={p._id}>
            <RelatedCard project={p} />
          </li>
        ))}
      </ul>
    </section>
  )
}
