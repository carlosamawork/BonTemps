'use client'
import {useEffect, useState} from 'react'
import {hasCookie, setCookie} from 'cookies-next'
import Link from 'next/link'
import styles from './CookieConsent.module.scss'

const POPUP_DELAY = 5000 // ms — give the user time to land before nudging

type Prefs = {analytics: boolean; marketing: boolean}

const CookieConsent = () => {
  const [visible, setVisible] = useState(false)
  const [showManage, setShowManage] = useState(false)
  const [prefs, setPrefs] = useState<Prefs>({analytics: true, marketing: true})

  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID
  const cookieName = `${clientId}_localConsent_25`

  useEffect(() => {
    if (hasCookie(cookieName)) return
    const timer = setTimeout(() => setVisible(true), POPUP_DELAY)
    return () => clearTimeout(timer)
    // cookieName is derived from a static env var — intentionally run once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const saveConsent = (preferences: Prefs) => {
    setCookie(cookieName, JSON.stringify(preferences), {maxAge: 60 * 60 * 24 * 60})
    setVisible(false)
    setShowManage(false)
  }

  const acceptAll = () => saveConsent({analytics: true, marketing: true})
  const denyAll = () => saveConsent({analytics: false, marketing: false})

  if (!visible) return null

  return (
    <div className={styles.banner} role="dialog" aria-modal="false" aria-label="Cookie preferences">
      <div className={styles.card}>
        {!showManage ? (
          <>
            <p className={`t-body ${styles.body}`}>
              We use cookies and similar technologies to enhance your experience, provide
              personalized content, improve site functionality, and analyze traffic. You can
              accept all cookies or customize your preferences. Learn more in our{' '}
              <Link href="/faqs/#general-terms" className={styles.link}>
                Privacy Policy
              </Link>
              .
            </p>

            <div className={styles.actions}>
              <button
                type="button"
                className={`${styles.pill} t-sans-title`}
                onClick={() => setShowManage(true)}
              >
                Manage Preferences
              </button>
              <button
                type="button"
                className={`${styles.pill} ${styles.pillSolid} t-sans-title`}
                onClick={acceptAll}
              >
                Accept All
              </button>
              <button
                type="button"
                className={`${styles.pill} t-sans-title`}
                onClick={denyAll}
              >
                Decline All
              </button>
            </div>
          </>
        ) : (
          <>
            <p className={`t-body ${styles.body}`}>
              Choose which cookies to allow. Required cookies are always on so the site can
              function — you can opt out of marketing and analytics independently.
            </p>

            <div className={styles.actions}>
              <button
                type="button"
                className={`${styles.pill} ${styles.pillSolid} t-sans-title`}
                onClick={acceptAll}
              >
                Accept All
              </button>
              <button
                type="button"
                className={`${styles.pill} t-sans-title`}
                onClick={denyAll}
              >
                Decline All
              </button>
              <button
                type="button"
                className={`${styles.pill} t-sans-title`}
                onClick={() => saveConsent(prefs)}
              >
                Save Preferences
              </button>
            </div>

            <ul className={styles.options}>
              <li>
                <ConsentRow
                  label="Required"
                  description="Necessary for the website to function — these cannot be disabled."
                  checked
                  disabled
                />
              </li>
              <li>
                <ConsentRow
                  label="Marketing"
                  description="Optimise marketing communications and show you relevant ads on other websites."
                  checked={prefs.marketing}
                  onToggle={() =>
                    setPrefs((prev) => ({...prev, marketing: !prev.marketing}))
                  }
                />
              </li>
              <li>
                <ConsentRow
                  label="Analytics"
                  description="Help us understand how users interact with the site so we can improve functionality and content. Data may be anonymised."
                  checked={prefs.analytics}
                  onToggle={() =>
                    setPrefs((prev) => ({...prev, analytics: !prev.analytics}))
                  }
                />
              </li>
            </ul>
          </>
        )}
      </div>
    </div>
  )
}

type RowProps = {
  label: string
  description: string
  checked: boolean
  disabled?: boolean
  onToggle?: () => void
}

function ConsentRow({label, description, checked, disabled, onToggle}: RowProps) {
  return (
    <label className={`${styles.row} ${disabled ? styles.rowDisabled : ''}`}>
      <input
        type="checkbox"
        className={styles.checkbox}
        checked={checked}
        onChange={onToggle}
        disabled={disabled}
        aria-disabled={disabled}
      />
      <span
        className={`${styles.box} ${checked ? styles.boxChecked : ''} ${disabled ? styles.boxDisabled : ''}`}
        aria-hidden
      />
      <span className={styles.rowText}>
        <span className={`${styles.rowLabel} t-sans-title`}>{label}</span>
        <span className={`${styles.rowDescription} t-body`}>{description}</span>
      </span>
    </label>
  )
}

export default CookieConsent
