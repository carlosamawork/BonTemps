import {StructureBuilder, StructureResolver} from 'sanity/structure'

import category from './categoryStructure'
import home from './homeStructure'
import pages from './pageStructure'
import settings from './settingStructure'

const hiddenDocTypes = (listItem: {getId?: () => string | undefined}) => {
  const id = listItem.getId?.()
  if (!id) return false

  return !['home', 'page', 'settings', 'category', 'media.tag'].includes(id)
}

export const structure: StructureResolver = (S: StructureBuilder, context) =>
  S.list()
    .title('Content')
    .items([
      home(S),
      S.divider(),
      pages(S),
      S.divider(),
      category(S, context),
      S.divider(),
      settings(S),
      S.divider(),
      ...S.documentTypeListItems().filter(hiddenDocTypes),
    ])
