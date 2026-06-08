import {cache} from 'react'
import type {Metadata} from 'next'
import InformationBio from '@/components/Information/InformationBio'
import InformationProcess from '@/components/Information/InformationProcess'
import InformationCover from '@/components/Information/InformationCover'
import {getInformation} from '@/sanity/queries/queries/information'
import {
  BASE_URL,
  buildOgImages,
  buildUrl,
  defaultRobots,
  getFavicons,
  siteDescription,
  siteTitle,
} from '@/utils/seoHelper'
import styles from './page.module.scss'

export const revalidate = 60

// Dedupes the fetch shared by generateMetadata and the page render.
const getInformationCached = cache(getInformation)

export async function generateMetadata(): Promise<Metadata> {
  const data = await getInformationCached()
  const seo = data?.seo
  const title = seo?.title || `Information — ${siteTitle}`
  const description = seo?.description || siteDescription
  const images = buildOgImages(seo?.image)
  return {
    metadataBase: BASE_URL,
    title,
    description,
    alternates: {canonical: buildUrl('/information')},
    openGraph: {
      title,
      description,
      url: buildUrl('/information'),
      siteName: siteTitle,
      images,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: images.map((image) => image.url),
    },
    robots: defaultRobots,
    icons: getFavicons(),
  }
}

export default async function InformationPage() {
  const data = await getInformationCached()
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
