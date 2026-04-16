'use client'

import React, {useState} from 'react'
import s from './Newsletter.module.scss'
import {PortableText} from '@portabletext/react'
import {portableBlockComponentsAbout} from '@/utils/portableText/portableTextAbout'
import Link from 'next/link'

type NewsletterResult = {
  ok: boolean
  message: string
}

export default function NewsletterComponent({data, type = 'banner'}: {data: any; type: string}) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [errors] = useState<{email?: string; consent?: string}>({})
  const [result, setResult] = useState<NewsletterResult | null>(null)

  const subscribeUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const res = await fetch('/api/subscribeUser', {
      body: JSON.stringify({
        email: email || '',
        firstName: firstName || '',
        lastName: lastName || '',
      }),
      headers: {'Content-Type': 'application/json'},
      method: 'POST',
    })

    if (res.ok) {
      setResult({ok: true, message: 'You are subscribed, thank you!'})
    } else {
      setResult({ok: false, message: 'Subscription could not be completed'})
    }

    return res
  }

  return (
    <section className={`${s.newsletter} ${s[type] || ''}`}>
      <div className={s.newsletterContent}>
        <h3>{data.title}</h3>
        {data.content &&
          data.content.map((block: any, index: number) => (
            <PortableText key={index} value={block} components={portableBlockComponentsAbout} />
          ))}
      </div>
      <div className={s.newsletterFormContainer}>
        <form className={s.newsletterForm} onSubmit={subscribeUser}>
          <input
            type="text"
            name="firstName"
            placeholder="NAME"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            name="lastName"
            placeholder="SURNAME"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            type="email"
            name="email"
            placeholder="EMAIL"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className={s.consent}>
            <div className={s.checkboxWrp}>
              <input
                type="checkbox"
                id="consent"
                name="consent"
                required
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
              />
            </div>
            <label htmlFor="consent">
              By accepting, I confirm that I am over 18 years old and that I accept the{' '}
              <Link href="/legal/#terms-conditions">Terms and Conditions</Link>*.
            </label>
          </div>
          <button type="submit">Subscribe</button>
          <div className={s.answer}>
            {result ? (
              <p className={result.ok ? s.success : s.error}>{result.message}</p>
            ) : errors.email || errors.consent ? (
              <p className={s.error} data-text={errors.email || errors.consent}>
                {errors.email || errors.consent}
              </p>
            ) : undefined}
          </div>
        </form>
        <p>
          *Around the World Art S.L. is responsible for the processing of your personal data, which
          will be handled for the purpose of sending you our newsletter and communications about our
          activity/project. You can exercise your data protection rights by emailing info@the99.art.
        </p>
      </div>
    </section>
  )
}
