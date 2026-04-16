import { TagIcon } from '@sanity/icons'
import { StructureBuilder } from 'sanity/structure'

export default function serviceStructure(S: StructureBuilder) {
  return S.listItem()
    .title('Services')
    .icon(TagIcon)
    .schemaType('service')
    .child(S.documentTypeList('service').title('Services'))
}
