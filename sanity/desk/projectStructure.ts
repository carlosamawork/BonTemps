import { DocumentsIcon } from '@sanity/icons'
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list'
import { StructureBuilder } from 'sanity/structure'

export default function projectStructure(S: StructureBuilder, context: any) {
  return S.listItem()
    .title('Projects')
    .icon(DocumentsIcon)
    .child(() =>
      S.list().title('Projects').items([
        orderableDocumentListDeskItem({ type: 'project', S, context, title: 'Projects' }),
      ])
    )
}
