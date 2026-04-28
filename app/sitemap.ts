import type {MetadataRoute} from 'next'
import {BASE_URL} from '@/utils/seoHelper'
import {getAllProjectSlugs} from '@/sanity/queries/queries/project'
import {getAllPageSlugs} from '@/sanity/queries/queries/page'

// Dynamic sitemap derived from Sanity. Crawlers and llms.txt both reach
// here so URLs stay in sync with editorial state. revalidate keeps the
// sitemap fresh without rebuilding.
export const revalidate = 60

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projectSlugs, pageSlugs] = await Promise.all([
    getAllProjectSlugs(),
    getAllPageSlugs(),
  ])
  const now = new Date()
  const base: MetadataRoute.Sitemap = [
    {url: `${BASE_URL.origin}/`, lastModified: now, priority: 1},
    {url: `${BASE_URL.origin}/information`, lastModified: now, priority: 0.8},
  ]
  const projects: MetadataRoute.Sitemap = projectSlugs.map((slug) => ({
    url: `${BASE_URL.origin}/work/${slug}`,
    lastModified: now,
    priority: 0.7,
  }))
  const pages: MetadataRoute.Sitemap = pageSlugs.map((slug) => ({
    url: `${BASE_URL.origin}/${slug}`,
    lastModified: now,
    priority: 0.5,
  }))
  return [...base, ...projects, ...pages]
}
