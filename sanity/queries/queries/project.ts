import {groq} from 'next-sanity'
import {client} from '../index'
import {image} from '../fragments/image'
import {video} from '../fragments/video'
import {seo} from '../fragments/seo'
import {projectModules} from '../modules'
import type {MediaImage, MediaVideo} from '@/sanity/types'
import type {ProjectCardData} from './work'

export type ProjectFull = {
  _id: string
  title: string
  slug: string
  subtitle?: string
  excerpt?: string
  websiteUrl?: string
  featuredMediaType: 'image' | 'video'
  featuredImage?: MediaImage
  featuredVideo?: MediaVideo
  services?: Array<{_id: string; title: string}>
  projectRecap?: any
  servicesBody?: any
  customTypeface?: any
  bonTempsTeam?: any
  collaborators?: any
  modules?: any[]
  relatedProjects?: ProjectCardData[]
  seo?: any
}

const PROJECT_QUERY = groq`*[_type == "project" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  subtitle,
  excerpt,
  websiteUrl,
  featuredMediaType,
  featuredImage{ ${image} },
  featuredVideo{ ${video} },
  services[]->{ _id, title },
  projectRecap,
  servicesBody,
  customTypeface,
  bonTempsTeam,
  collaborators,
  ${projectModules},
  "relatedProjects": relatedProjects[]->{
    _id,
    title,
    "slug": slug.current,
    subtitle,
    featuredMediaType,
    featuredImage{ ${image} },
    featuredVideo{ ${video} }
  },
  seo{ ${seo} }
}`

const PROJECT_SLUGS_QUERY = groq`*[_type == "project" && defined(slug.current)][].slug.current`

export async function getProject(slug: string): Promise<ProjectFull | null> {
  return client.fetch<ProjectFull | null>(
    PROJECT_QUERY,
    {slug},
    {next: {tags: ['sanity', `project:${slug}`], revalidate: 60}},
  )
}

export async function getAllProjectSlugs(): Promise<string[]> {
  return client.fetch<string[]>(
    PROJECT_SLUGS_QUERY,
    {},
    {next: {tags: ['sanity', 'project'], revalidate: 60}},
  )
}
