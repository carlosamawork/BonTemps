import styles from './HomeIntroClaim.module.scss'

type Props = {claim?: string}

// Long-form claim that sits above the work grid on the home page. Sources
// from listWork.claim in Sanity. Renders nothing when the field is empty.
export default function HomeIntroClaim({claim}: Props) {
  if (!claim) return null
  return (
    <section className={styles.intro}>
      <p className="t-about">{claim}</p>
    </section>
  )
}
