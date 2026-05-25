import type {PortableTextBlock} from '@portabletext/types'

export function toPlainText(blocks?: PortableTextBlock[] | null): string {
  // Guard against non-array input (e.g. a legacy plain-string `claim` that
  // predates the bodyBonTemps migration). A string has `.length` too, so the
  // old `!blocks?.length` check let it through and `.filter` threw at build.
  if (!Array.isArray(blocks) || blocks.length === 0) return ''
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
