// sanity/types/objects/global/footer.ts

import type {PortableTextBlock} from '@portabletext/types'

export type FooterEmail = {title: string; email: string}
export type FooterSocial = {_key?: string; title: string; url: string}

export type FooterData = {
  claim?: PortableTextBlock[]
  emails?: FooterEmail[]
  socials?: FooterSocial[]
  copyright?: string
}
