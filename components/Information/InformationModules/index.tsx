import ClientsList from './ClientsList'
import PageTextColumn from './PageTextColumn'
import InformationImageVideo from './InformationImageVideo'

type ModuleEntry = {
  _key: string
  _type: string
  [k: string]: unknown
}

type Props = {modules?: ModuleEntry[]}

// Switch over the Information singleton's module array. Unknown types are
// silently skipped so future schema additions don't break drafts.
export default function InformationModules({modules}: Props) {
  if (!modules || modules.length === 0) return null
  return (
    <>
      {modules.map((m) => {
        switch (m._type) {
          case 'module.informationClients':
            return (
              <ClientsList
                key={m._key}
                title={m.title as string | undefined}
                items={(m.items as never[]) ?? []}
              />
            )
          case 'module.pageTextColumn':
            return <PageTextColumn key={m._key} bodies={(m.bodies as never[]) ?? []} />
          case 'module.informationImageVideo':
            return (
              <InformationImageVideo
                key={m._key}
                columns={(m.columns as 1 | 2 | 3) ?? 1}
                reverseOrderOnMobile={Boolean(m.reverseOrderOnMobile)}
                items={(m.items as never[]) ?? []}
              />
            )
          default:
            return null
        }
      })}
    </>
  )
}
