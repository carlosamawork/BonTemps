import {DocumentsIcon} from '@sanity/icons'
import {StructureBuilder} from 'sanity/structure'

export default function pageStructure(S: StructureBuilder) {
  return S.listItem().title('Pages').icon(DocumentsIcon).schemaType('page').child(S.documentTypeList('page'))
}
