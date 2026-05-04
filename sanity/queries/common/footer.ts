import {groq} from 'next-sanity'
import {client} from '../index'
import type {FooterData} from '@/sanity/types'

const FOOTER_QUERY = groq`*[_type == "settings"][0].footer{
  claim,
  emails[]{title, email},
  socials[]{
    _key,
    title,
    url
  },
  copyright
}`

export async function getFooter(): Promise<FooterData | undefined> {
  return client.fetch<FooterData | undefined>(
    FOOTER_QUERY,
    {},
    {next: {tags: ['sanity', 'settings'], revalidate: 60}},
  )
}
