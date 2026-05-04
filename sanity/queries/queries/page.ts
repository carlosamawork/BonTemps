import {groq} from 'next-sanity'
import {client} from '../index'
import {seo} from '../fragments/seo'

// The current `page` document still uses `body: bodySimple` (legacy).
// When the schema migrates to a `modules[]` array, swap this query to
// import `pageModules` from '../modules' and project `${pageModules}` instead.
export type PageData = {
  _id: string
  title: string
  slug: string
  body?: any
  seo?: any
}

const PAGE_QUERY = groq`*[_type == "page" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  body,
  seo{ ${seo} }
}`

const PAGE_SLUGS_QUERY = groq`*[_type == "page" && defined(slug.current)][].slug.current`

export async function getPage(slug: string): Promise<PageData | null> {
  return client.fetch<PageData | null>(
    PAGE_QUERY,
    {slug},
    {next: {tags: ['sanity', `page:${slug}`], revalidate: 60}},
  )
}

export async function getAllPageSlugs(): Promise<string[]> {
  return client.fetch<string[]>(
    PAGE_SLUGS_QUERY,
    {},
    {next: {tags: ['sanity', 'page'], revalidate: 60}},
  )
}
