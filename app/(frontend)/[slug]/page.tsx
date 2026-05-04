import {notFound} from 'next/navigation'
import type {Metadata} from 'next'
import BodySimpleRenderer from '@/components/PortableText/BodySimpleRenderer'
import {getAllPageSlugs, getPage} from '@/sanity/queries/queries/page'
import {BASE_URL, buildUrl, siteTitle} from '@/utils/seoHelper'
import styles from './page.module.scss'

export const revalidate = 60

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
  const page = await getPage(slug)
  if (!page) return {}
  const title = `${page.title} — ${siteTitle}`
  return {
    metadataBase: BASE_URL,
    title,
    alternates: {canonical: buildUrl(`/${page.slug}`)},
    openGraph: {
      title,
      url: buildUrl(`/${page.slug}`),
      siteName: siteTitle,
      type: 'article',
    },
  }
}

export default async function GenericPage({
  params,
}: {
  params: Promise<{slug: string}>
}) {
  const {slug} = await params
  const page = await getPage(slug)
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
