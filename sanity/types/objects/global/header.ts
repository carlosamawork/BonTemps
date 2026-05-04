// sanity/types/objects/global/header.ts

export type HeaderMenuItem =
  | {_key: string; _type: 'linkInternal'; title?: string; slug?: string; type?: string}
  | {_key: string; _type: 'linkExternal'; title?: string; url?: string; newWindow?: boolean}

export type HeaderData = {
  contactEmail?: string
  instagramUrl?: string
  headerMenu?: {items?: HeaderMenuItem[]}
}
