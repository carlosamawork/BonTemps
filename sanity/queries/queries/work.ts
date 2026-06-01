import {groq} from 'next-sanity'
import type {PortableTextBlock} from '@portabletext/types'
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
  comingSoon?: boolean
  featuredMediaType: 'image' | 'video'
  featuredImage?: MediaImage
  featuredVideo?: MediaVideo
  hoverMediaType?: 'none' | 'image' | 'video'
  hoverImage?: MediaImage
  hoverVideo?: MediaVideo
}

export type WorkData = {
  listWork: {claim?: PortableTextBlock[]; seo?: any} | null
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
    comingSoon,
    featuredMediaType,
    featuredImage{ ${image} },
    featuredVideo{ ${video} },
    hoverMediaType,
    hoverImage{ ${image} },
    hoverVideo{ ${video} }
  }
}`

export async function getWork(): Promise<WorkData> {
  return client.fetch<WorkData>(WORK_QUERY, {}, {
    next: {tags: ['sanity', 'project', 'listWork'], revalidate: 60},
  })
}
