import {groq} from 'next-sanity'
import {client} from '../index'
import {image} from '../fragments/image'
import {video} from '../fragments/video'
import {seo} from '../fragments/seo'
import type {MediaImage, MediaVideo} from '@/sanity/types'

export type ProjectCardData = {
  _id: string
  title: string
  slug: string
  subtitle?: string
  excerpt?: string
  featuredMediaType: 'image' | 'video'
  featuredImage?: MediaImage
  featuredVideo?: MediaVideo
}

export type WorkData = {
  listWork: {claim?: string; seo?: any} | null
  projects: ProjectCardData[]
}

const WORK_QUERY = groq`{
  "listWork": *[_type == "listWork"][0]{
    claim,
    seo{ ${seo} }
  },
  "projects": *[_type == "project"] | order(orderRank asc){
    _id,
    title,
    "slug": slug.current,
    subtitle,
    excerpt,
    featuredMediaType,
    featuredImage{ ${image} },
    featuredVideo{ ${video} }
  }
}`

export async function getWork(): Promise<WorkData> {
  return client.fetch<WorkData>(WORK_QUERY, {}, {
    next: {tags: ['sanity', 'project', 'listWork'], revalidate: 60},
  })
}
