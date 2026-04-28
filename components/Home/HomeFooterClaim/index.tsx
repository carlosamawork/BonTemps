import styles from './HomeFooterClaim.module.scss'

type Props = {claim?: string}

export default function HomeFooterClaim({claim}: Props) {
  if (!claim) return null
  return (
    <aside className={styles.aside}>
      <p className="t-about">{claim}</p>
    </aside>
  )
}
