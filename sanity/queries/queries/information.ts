import {groq} from 'next-sanity'
import {client} from '../index'
import {seo} from '../fragments/seo'
import {imageResponsive} from '../fragments/imageResponsive'
import type {MediaImageResponsive} from '@/sanity/types'

export type ClientEntry = {
  _key: string
  name: string
  location?: string
  projectSlug?: string
}

export type InformationData = {
  bio?: any
  services?: any
  industries?: any
  clients?: ClientEntry[]
  press?: any
  process?: any
  strategy?: any
  systems?: any
  design?: any
  campaigns?: any
  coverImage?: MediaImageResponsive
  seo?: any
}

const INFORMATION_QUERY = groq`*[_type == "information"][0]{
  bio,
  services,
  industries,
  clients[]{
    _key,
    name,
    location,
    "projectSlug": projectRef->slug.current
  },
  press,
  process,
  strategy,
  systems,
  design,
  campaigns,
  coverImage{ ${imageResponsive} },
  seo{ ${seo} }
}`

export async function getInformation(): Promise<InformationData | null> {
  return client.fetch<InformationData | null>(
    INFORMATION_QUERY,
    {},
    {next: {tags: ['sanity', 'information'], revalidate: 60}},
  )
}
