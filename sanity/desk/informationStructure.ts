import {StructureBuilder} from 'sanity/structure'

export default function informationStructure(S: StructureBuilder) {
  return S.listItem()
    .title('Information')
    .schemaType('information')
    .child(S.editor().title('Information').schemaType('information').documentId('information'))
}
