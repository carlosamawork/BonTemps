import type {Metadata} from 'next'
import InformationBio from '@/components/Information/InformationBio'
import InformationProcess from '@/components/Information/InformationProcess'
import InformationCover from '@/components/Information/InformationCover'
import {getInformation} from '@/sanity/queries/queries/information'
import {BASE_URL, buildUrl, siteTitle} from '@/utils/seoHelper'
import styles from './page.module.scss'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const title = `Information — ${siteTitle}`
  return {
    metadataBase: BASE_URL,
    title,
    alternates: {canonical: buildUrl('/information')},
    openGraph: {
      title,
      url: buildUrl('/information'),
      siteName: siteTitle,
      type: 'website',
    },
  }
}

export default async function InformationPage() {
  const data = await getInformation()
  if (!data) {
    return (
      <main id="main">
        <p className={`${styles.empty} t-body`}>No information yet.</p>
      </main>
    )
  }

  return (
    <main id="main">
      <h1 className="visually-hidden">Information — {siteTitle}</h1>

      <InformationBio
        bio={data.bio}
        services={data.services}
        industries={data.industries}
        clients={data.clients}
        press={data.press}
      />

      <InformationProcess
        process={data.process}
        strategy={data.strategy}
        systems={data.systems}
        design={data.design}
        campaigns={data.campaigns}
      />

      <InformationCover image={data.coverImage} />
    </main>
  )
}
