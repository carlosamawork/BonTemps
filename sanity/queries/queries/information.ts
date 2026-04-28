import {groq} from 'next-sanity'
import {client} from '../index'
import {seo} from '../fragments/seo'
import {informationModules} from '../modules'

export type InformationData = {
  intro?: any
  modules?: any[]
  seo?: any
}

const INFORMATION_QUERY = groq`*[_type == "information"][0]{
  intro,
  ${informationModules},
  seo{ ${seo} }
}`

export async function getInformation(): Promise<InformationData | null> {
  return client.fetch<InformationData | null>(
    INFORMATION_QUERY,
    {},
    {next: {tags: ['sanity', 'information'], revalidate: 60}},
  )
}
