import styles from './ProjectServicesInline.module.scss'

type Service = {_id: string; title: string}

type Props = {services?: Service[]}

// Inline services row right under the project title (per Figma): a small
// "(Services)" label in grey followed by the service names. Hidden when
// the project has no services attached.
export default function ProjectServicesInline({services}: Props) {
  if (!services || services.length === 0) return null
  return (
    <p className={`${styles.row} t-body`}>
      <span className={styles.label}>(Services)</span>
      {services.map((s) => (
        <span key={s._id} className={styles.item}>
          {s.title}
        </span>
      ))}
    </p>
  )
}
