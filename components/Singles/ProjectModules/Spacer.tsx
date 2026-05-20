import styles from './ProjectModules.module.scss'

type SpacerSize = 'small' | 'medium' | 'large' | 'xl'

type Props = {
  size?: SpacerSize
}

export default function Spacer({ size = 'medium' }: Props) {
  return <div className={styles.spacer} data-size={size} role="presentation" aria-hidden="true" />
}
