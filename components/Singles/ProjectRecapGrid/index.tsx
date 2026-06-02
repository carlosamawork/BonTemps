import Link from 'next/link'
import BodyBonTempsRenderer from '@/components/PortableText/BodyBonTempsRenderer'
import type {ProjectCardData} from '@/sanity/queries/queries/work'
import styles from './ProjectRecapGrid.module.scss'

type Props = {
  projectRecap?: unknown
  servicesBody?: unknown
  customTypeface?: unknown
  bonTempsTeam?: unknown
  collaborators?: unknown
  relatedProjects?: ProjectCardData[]
  // Editable section headings. Each falls back to its default when empty.
  projectRecapHeading?: string
  servicesHeading?: string
  customTypefaceHeading?: string
  bonTempsTeamHeading?: string
  collaboratorsHeading?: string
  relatedProjectsHeading?: string
  bottomAction?: React.ReactNode
}

type CellProps = {label: string; children: React.ReactNode}
function Cell({label, children}: CellProps) {
  return (
    <div className={styles.cell}>
      <p className={`${styles.label} t-sans-small`}>{label}</p>
      <div className={`${styles.body} t-body`}>{children}</div>
    </div>
  )
}

// Bottom-of-page editorial recap (per Figma). `bottomAction` (typically
// the Back-To-Work bubble) renders inside col1 anchored to the bottom of
// the grid so its baseline aligns with the bottom of the tallest column.
export default function ProjectRecapGrid({
  projectRecap,
  servicesBody,
  customTypeface,
  bonTempsTeam,
  collaborators,
  relatedProjects,
  projectRecapHeading,
  servicesHeading,
  customTypefaceHeading,
  bonTempsTeamHeading,
  collaboratorsHeading,
  relatedProjectsHeading,
  bottomAction,
}: Props) {
  const hasAny =
    !!projectRecap ||
    !!servicesBody ||
    !!customTypeface ||
    !!bonTempsTeam ||
    !!collaborators ||
    (relatedProjects && relatedProjects.length > 0)
  if (!hasAny) return null

  return (
    <section className={styles.grid}>
      <div className={styles.col1}>
        {!!projectRecap && (
          <Cell label={projectRecapHeading || 'Project Recap'}>
            <BodyBonTempsRenderer value={projectRecap} />
          </Cell>
        )}
        {bottomAction && <div className={styles.col1Bottom}>{bottomAction}</div>}
      </div>

      <div className={styles.colsLeft}>

      {(!!servicesBody || !!customTypeface) && (
        <div className={styles.col2}>
          {!!servicesBody && (
            <Cell label={servicesHeading || 'Services'}>
              <BodyBonTempsRenderer value={servicesBody} />
            </Cell>
          )}
          {!!customTypeface && (
            <Cell label={customTypefaceHeading || 'Custom Typeface'}>
              <BodyBonTempsRenderer value={customTypeface} />
            </Cell>
          )}
        </div>
      )}



      {(!!bonTempsTeam || !!collaborators) && (
        <div className={styles.col3}>
          {!!bonTempsTeam && (
            <Cell label={bonTempsTeamHeading || 'BonTemps Team'}>
              <BodyBonTempsRenderer value={bonTempsTeam} />
            </Cell>
          )}
          {!!collaborators && (
            <Cell label={collaboratorsHeading || 'Collaborators'}>
              <BodyBonTempsRenderer value={collaborators} />
            </Cell>
          )}
        </div>
      )}

      {relatedProjects && relatedProjects.length > 0 && (
        <div className={styles.col4}>
          <Cell label={relatedProjectsHeading || 'Related Projects'}>
            {relatedProjects.map((p) => (
              <p key={p._id}>
                <Link href={`/work/${p.slug}`} className={styles.relatedLink}>
                  {p.title}
                </Link>
              </p>
            ))}
          </Cell>
        </div>
      )}
      {bottomAction && <div className={styles.col1Bottom}>{bottomAction}</div>}
      </div>
    </section>
  )
}
