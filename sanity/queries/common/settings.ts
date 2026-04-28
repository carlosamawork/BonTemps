// sanity/queries/common/settings.ts
import {groq} from 'next-sanity'
import {client} from '../index'
import {seo} from '../fragments/seo'
import type {SettingsData} from '@/sanity/types'

const SETTINGS_QUERY = groq`*[_type == "settings"][0]{
  header,
  footer,
  seo{ ${seo} }
}`

export async function getSettings(): Promise<SettingsData | null> {
  return client.fetch<SettingsData | null>(
    SETTINGS_QUERY,
    {},
    {next: {tags: ['sanity', 'settings'], revalidate: 60}},
  )
}
