import {groq} from 'next-sanity'
import {client} from '../index'

export async function getIntroClaim(): Promise<string | null> {
  return client.fetch<string | null>(
    groq`*[_type == "home"][0].claim`,
    {},
    {next: {tags: ['sanity', 'home'], revalidate: 60}},
  )
}
