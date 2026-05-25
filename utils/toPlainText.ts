import type {PortableTextBlock} from '@portabletext/types'

export function toPlainText(blocks?: PortableTextBlock[] | null): string {
  if (!blocks?.length) return ''
  return blocks
    .filter((block) => block._type === 'block')
    .map((block) =>
      (block.children ?? [])
        .filter((child: any) => child._type === 'span')
        .map((child: any) => child.text)
        .join(''),
    )
    .join(' ')
    .trim()
}
