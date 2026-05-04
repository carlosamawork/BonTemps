import CenteredText from './CenteredText'
import ImageVideoModule from './ImageVideoModule'
import TextColumn from './TextColumn'
import ImageText from './ImageText'

type ModuleEntry = {
  _key: string
  _type: string
  [k: string]: unknown
}

type Props = {modules?: ModuleEntry[]}

// Switch over module `_type`. Add new module renderers here when the
// schema grows. Unknown types are silently skipped so editorial drafts
// don't crash the page.
export default function ProjectModules({modules}: Props) {
  if (!modules || modules.length === 0) return null
  return (
    <>
      {modules.map((m) => {
        switch (m._type) {
          case 'module.centeredText':
            return <CenteredText key={m._key} body={m.body as unknown} />
          case 'module.imageVideo':
            return (
              <ImageVideoModule
                key={m._key}
                columns={(m.columns as 1 | 2 | 3) ?? 1}
                reverseOrder={Boolean(m.reverseOrder)}
                items={(m.items as never[]) ?? []}
                layout1col={m.layout1col as string | undefined}
                layout2col={m.layout2col as string | undefined}
                layout3col={m.layout3col as string | undefined}
              />
            )
          case 'module.textColumn':
            return (
              <TextColumn
                key={m._key}
                body={m.body as unknown}
                columns={(m.columns as 1 | 2 | 3) ?? 1}
                span={m.span as 1 | 2 | 3 | undefined}
                columnStart={m.columnStart as 1 | 2 | 3 | undefined}
              />
            )
          case 'module.imageText':
            return (
              <ImageText
                key={m._key}
                imageSide={(m.imageSide as 'left' | 'right') ?? 'left'}
                mediaType={(m.mediaType as 'image' | 'video') ?? 'image'}
                image={m.image as never}
                video={m.video as never}
                body={m.body as unknown}
              />
            )
          default:
            return null
        }
      })}
    </>
  )
}
