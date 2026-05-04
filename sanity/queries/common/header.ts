import {groq} from 'next-sanity'
import {client} from '../index'
import type {HeaderData} from '@/sanity/types'

const HEADER_QUERY = groq`*[_type == "settings"][0].header{
  contactEmail,
  instagramUrl,
  headerMenu{
    items[]{
      _key,
      _type,
      _type == "linkInternal" => {
        title,
        "slug": reference->slug.current,
        "type": reference->_type
      },
      _type == "linkExternal" => {
        title,
        url,
        newWindow
      }
    }
  }
}`

export async function getHeader(): Promise<HeaderData | undefined> {
  return client.fetch<HeaderData | undefined>(
    HEADER_QUERY,
    {},
    {next: {tags: ['sanity', 'settings'], revalidate: 60}},
  )
}
