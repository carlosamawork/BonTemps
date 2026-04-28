import {notFound} from 'next/navigation'
import type {Metadata} from 'next'
import BodyBonTempsRenderer from '@/components/PortableText/BodyBonTempsRenderer'
import ProjectHeader from '@/components/Singles/ProjectHeader'
import ProjectFeaturedMedia from '@/components/Singles/ProjectFeaturedMedia'
import ProjectModules from '@/components/Singles/ProjectModules'
import VisitWebsiteBubble from '@/components/Singles/VisitWebsiteBubble'
import BackToWorkBubble from '@/components/Singles/BackToWorkBubble'
import RelatedProjects from '@/components/Singles/RelatedProjects'
import {getAllProjectSlugs, getProject} from '@/sanity/queries/queries/project'
import {BASE_URL, buildUrl, siteTitle} from '@/utils/seoHelper'
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

  // Body sections from the editorial fields, rendered in the order the
  // designer expects. Empty fields are skipped gracefully.
  const sections: Array<{key: string; body: unknown}> = [
    {key: 'projectRecap', body: project.projectRecap},
    {key: 'servicesBody', body: project.servicesBody},
    {key: 'customTypeface', body: project.customTypeface},
    {key: 'bonTempsTeam', body: project.bonTempsTeam},
    {key: 'collaborators', body: project.collaborators},
  ].filter((s) => !!s.body)

  return (
    <main id="main">
      <ProjectHeader title={project.title} subtitle={project.subtitle} />

      <ProjectFeaturedMedia
        type={project.featuredMediaType}
        image={project.featuredImage}
        video={project.featuredVideo}
      />

      <div className={styles.topRow}>
        <VisitWebsiteBubble url={project.websiteUrl} />
        {project.excerpt && (
          <p className={`t-body ${styles.excerpt}`}>{project.excerpt}</p>
        )}
      </div>

      {sections.length > 0 && (
        <div className={styles.sections}>
          {sections.map((s) => (
            <section key={s.key} className={styles.section}>
              <BodyBonTempsRenderer value={s.body} />
            </section>
          ))}
        </div>
      )}

      <ProjectModules modules={project.modules} />

      <RelatedProjects projects={project.relatedProjects} />

      <div className={styles.backRow}>
        <BackToWorkBubble />
      </div>
    </main>
  )
}
