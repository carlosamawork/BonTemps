import { ThListIcon } from '@sanity/icons'
import { StructureBuilder } from 'sanity/structure'

export default function listWorkStructure(S: StructureBuilder) {
  return S.listItem()
    .title('Work List')
    .icon(ThListIcon)
    .schemaType('listWork')
    .child(
      S.editor().title('Work List').schemaType('listWork').documentId('listWork'),
    )
}
