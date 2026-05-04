import {notFound} from 'next/navigation'
import type {Metadata} from 'next'
import ProjectHeader from '@/components/Singles/ProjectHeader'
import ProjectServicesInline from '@/components/Singles/ProjectServicesInline'
import ProjectFeaturedMedia from '@/components/Singles/ProjectFeaturedMedia'
import ProjectModules from '@/components/Singles/ProjectModules'
import ProjectRecapGrid from '@/components/Singles/ProjectRecapGrid'
import VisitWebsiteBubble from '@/components/Singles/VisitWebsiteBubble'
import BackToWorkBubble from '@/components/Singles/BackToWorkBubble'
import {getAllProjectSlugs, getProject} from '@/sanity/queries/queries/project'
import {BASE_URL, buildUrl, siteTitle} from '@/utils/seoHelper'
import {safeJsonLd} from '@/utils/safeJsonLd'
import styles from './page.module.scss'

export const revalidate = 60

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs()
  return slugs.map((slug) => ({slug}))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{slug: string}>
}): Promise<Metadata> {
  const {slug} = await params
  const project = await getProject(slug)
  if (!project) return {}
  const title = `${project.title} — ${siteTitle}`
  const description = project.excerpt ?? project.subtitle ?? siteTitle
  return {
    metadataBase: BASE_URL,
    title,
    description,
    alternates: {canonical: buildUrl(`/work/${project.slug}`)},
    openGraph: {
      title,
      description,
      url: buildUrl(`/work/${project.slug}`),
      siteName: siteTitle,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{slug: string}>
}) {
  const {slug} = await params
  const project = await getProject(slug)
  if (!project) notFound()

  const projectUrl = buildUrl(`/work/${project.slug}`)
  const ld = [
    {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: project.title,
      description: project.excerpt ?? project.subtitle,
      url: projectUrl,
      image: project.featuredImage?.image?.asset?.url,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {'@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL.origin + '/'},
        {'@type': 'ListItem', position: 2, name: 'Work', item: BASE_URL.origin + '/'},
        {'@type': 'ListItem', position: 3, name: project.title, item: projectUrl},
      ],
    },
  ]

  return (
    <main id="main">
      <script type="application/ld+json">{safeJsonLd(ld)}</script>
      <ProjectHeader title={project.title} subtitle={project.subtitle} />

      <ProjectServicesInline services={project.services} />

      <ProjectFeaturedMedia
        type={project.coverMediaType}
        image={project.coverImage}
        video={project.coverVideo}
      />

      <div className={styles.topRow}>
        <VisitWebsiteBubble url={project.websiteUrl} description={project.description}/>
      </div>

      <ProjectModules modules={project.modules} />

      <ProjectRecapGrid
        projectRecap={project.projectRecap}
        servicesBody={project.servicesBody}
        customTypeface={project.customTypeface}
        bonTempsTeam={project.bonTempsTeam}
        collaborators={project.collaborators}
        relatedProjects={project.relatedProjects}
      />

      <div className={styles.backRow}>
        <BackToWorkBubble />
      </div>
    </main>
  )
}
