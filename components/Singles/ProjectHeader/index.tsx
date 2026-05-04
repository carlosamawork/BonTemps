import styles from './ProjectHeader.module.scss'

type Props = {
  title: string
  subtitle?: string
}

// Centered title block at the top of a project page (per Figma). Title on
// the first line; subtitle wraps under it. Padding leaves room for the
// fixed header above.
export default function ProjectHeader({title, subtitle}: Props) {
  return (
    <header className={styles.header}>
      <h1 className={`${styles.title} t-headline-project`}>
        {title}
        {subtitle && (
          <>
            ,<br />
            <span className={styles.subtitle}>{subtitle}</span>
          </>
        )}
      </h1>
    </header>
  )
}
