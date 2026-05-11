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
// the grid so its baseline aligns with the last metadata row.
export default function ProjectRecapGrid({
  projectRecap,
  servicesBody,
  customTypeface,
  bonTempsTeam,
  collaborators,
  relatedProjects,
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
          <Cell label="Project Recap">
            <BodyBonTempsRenderer value={projectRecap} />
          </Cell>
        )}
        {bottomAction && <div className={styles.col1Bottom}>{bottomAction}</div>}
      </div>

      {(!!servicesBody || !!customTypeface) && (
        <div className={styles.col2}>
          {!!servicesBody && (
            <Cell label="Services">
              <BodyBonTempsRenderer value={servicesBody} />
            </Cell>
          )}
          {!!customTypeface && (
            <Cell label="Custom Typeface">
              <BodyBonTempsRenderer value={customTypeface} />
            </Cell>
          )}
        </div>
      )}

      {(!!bonTempsTeam || !!collaborators) && (
        <div className={styles.col3}>
          {!!bonTempsTeam && (
            <Cell label="BonTemps Team">
              <BodyBonTempsRenderer value={bonTempsTeam} />
            </Cell>
          )}
          {!!collaborators && (
            <Cell label="Collaborators">
              <BodyBonTempsRenderer value={collaborators} />
            </Cell>
          )}
        </div>
      )}

      {relatedProjects && relatedProjects.length > 0 && (
        <div className={styles.col4}>
          <Cell label="Related Projects">
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
    </section>
  )
}
