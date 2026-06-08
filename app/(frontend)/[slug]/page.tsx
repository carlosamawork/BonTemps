import {cache} from 'react'
import {notFound} from 'next/navigation'
import type {Metadata} from 'next'
import BodySimpleRenderer from '@/components/PortableText/BodySimpleRenderer'
import {getAllPageSlugs, getPage} from '@/sanity/queries/queries/page'
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
const getPageCached = cache(getPage)

export async function generateStaticParams() {
  const slugs = await getAllPageSlugs()
  return slugs.map((slug) => ({slug}))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{slug: string}>
}): Promise<Metadata> {
  const {slug} = await params
  const page = await getPageCached(slug)
  if (!page) return {}
  const seo = page.seo
  const title = seo?.title || `${page.title} — ${siteTitle}`
  const description = seo?.description || siteDescription
  const images = buildOgImages(seo?.image)
  return {
    metadataBase: BASE_URL,
    title,
    description,
    alternates: {canonical: buildUrl(`/${page.slug}`)},
    openGraph: {
      title,
      description,
      url: buildUrl(`/${page.slug}`),
      siteName: siteTitle,
      images,
      type: 'article',
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

export default async function GenericPage({
  params,
}: {
  params: Promise<{slug: string}>
}) {
  const {slug} = await params
  const page = await getPageCached(slug)
  if (!page) notFound()

  return (
    <main id="main">
      <article className={styles.article}>
        <h1 className={`${styles.title} t-headline-project`}>{page.title}</h1>
        {page.body && (
          <div className={styles.body}>
            <BodySimpleRenderer value={page.body} />
          </div>
        )}
      </article>
    </main>
  )
}
