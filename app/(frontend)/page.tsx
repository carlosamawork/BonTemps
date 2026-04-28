import type {Metadata} from 'next'
import WorkGrid from '@/components/Home/WorkGrid'
import HomeIntroClaim from '@/components/Home/HomeIntroClaim'
import {getWork} from '@/sanity/queries/queries/work'
import {getIntroClaim} from '@/sanity/queries/common/intro'
import {BASE_URL, buildUrl, getFavicons, siteDescription, siteTitle} from '@/utils/seoHelper'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const claim = await getIntroClaim()
  const description = claim ?? siteDescription
  return {
    metadataBase: BASE_URL,
    title: siteTitle,
    description,
    alternates: {canonical: buildUrl('/')},
    openGraph: {
      title: siteTitle,
      description,
      url: buildUrl('/'),
      siteName: siteTitle,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: siteTitle,
      description,
    },
    icons: getFavicons(),
  }
}

export default async function WorkPage() {
  const {listWork, projects} = await getWork()
  const headlineClaim = listWork?.claim || siteTitle

  return (
    <main id="main">
      <h1 className="visually-hidden">{headlineClaim}</h1>
      <HomeIntroClaim claim={listWork?.claim} />
      <WorkGrid projects={projects ?? []} />
    </main>
  )
}
