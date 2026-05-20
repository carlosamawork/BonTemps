import CenteredText from './CenteredText'
import ImageVideoModule from './ImageVideoModule'
import ImageText from './ImageText'
import styles from './ProjectModules.module.scss'

type ModuleEntry = {
  _key: string
  _type: string
  [k: string]: unknown
}

type Props = {
  modules?: ModuleEntry[]
  // Which breakpoint this modules array is intended for. The wrapper
  // hides itself via CSS when the viewport doesn't match, so both arrays
  // can be rendered side by side and SSR stays crawler-friendly.
  breakpoint: 'mobile' | 'desktop'
}

// Switch over module `_type`. Add new module renderers here when the
// schema grows. Unknown types are silently skipped so editorial drafts
// don't crash the page.
export default function ProjectModules({modules, breakpoint}: Props) {
  if (!modules || modules.length === 0) return null
  const wrapperClass = breakpoint === 'mobile' ? styles.modulesMobile : styles.modulesDesktop
  return (
    <div className={wrapperClass}>
      {modules.map((m) => {
        switch (m._type) {
          case 'module.centeredText':
            return <CenteredText key={m._key} body={m.body as unknown} />
          case 'module.imageVideo':
            return (
              <ImageVideoModule
                key={m._key}
                columns={(m.columns as 1 | 2 | 3) ?? 1}
                items={(m.items as never[]) ?? []}
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
    </div>
  )
}
