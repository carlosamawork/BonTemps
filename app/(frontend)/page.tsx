import type {Metadata} from 'next'
import WorkGrid from '@/components/Home/WorkGrid'
import {getWork} from '@/sanity/queries/queries/work'
import {getHomeSEO} from '@/sanity/queries/queries/home'
import {getIntroClaim} from '@/sanity/queries/common/intro'
import {
  BASE_URL,
  buildOgImages,
  buildUrl,
  defaultRobots,
  getFavicons,
  siteDescription,
  siteTitle,
} from '@/utils/seoHelper'
import {toPlainText} from '@/utils/toPlainText'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const [home, claim] = await Promise.all([getHomeSEO(), getIntroClaim()])
  const seo = home?.seo
  const title = seo?.title || siteTitle
  const description = seo?.description || claim || siteDescription
  const images = buildOgImages(seo?.image)
  return {
    metadataBase: BASE_URL,
    title,
    description,
    alternates: {canonical: buildUrl('/')},
    openGraph: {
      title,
      description,
      url: buildUrl('/'),
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

export default async function WorkPage() {
  const {listWork, projects} = await getWork()
  const headlineClaim = toPlainText(listWork?.claim) || siteTitle

  return (
    <main id="main">
      <h1 className="visually-hidden">{headlineClaim}</h1>
      <WorkGrid projects={projects ?? []} claim={listWork?.claim} />
    </main>
  )
}
