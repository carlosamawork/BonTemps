import {StructureBuilder, StructureResolver} from 'sanity/structure'

import home from './homeStructure'
import listWork from './listWorkStructure'
import pages from './pageStructure'
import projects from './projectStructure'
import services from './serviceStructure'
import settings from './settingStructure'

const hiddenDocTypes = (listItem: {getId?: () => string | undefined}) => {
  const id = listItem.getId?.()
  if (!id) return false

  return !['home', 'listWork', 'page', 'project', 'service', 'settings', 'media.tag'].includes(id)
}

export const structure: StructureResolver = (S: StructureBuilder, context) =>
  S.list()
    .title('Content')
    .items([
      home(S),
      listWork(S),
      S.divider(),
      projects(S, context),
      services(S),
      S.divider(),
      pages(S),
      S.divider(),
      settings(S),
      S.divider(),
      ...S.documentTypeListItems().filter(hiddenDocTypes),
    ])
