// GROQ dispatchers for module arrays.
// Each fragment selects fields based on the actual schema shape — keep this
// file in lock-step with sanity/schemas/objects/module/*.ts whenever a field
// is added, removed, or renamed.

import {image} from '../fragments/image'
import {video} from '../fragments/video'

// Body of a single module array entry. Reused for `modulesMobile[]` and
// `modulesDesktop[]` on the project document. Items[] of module.imageVideo
// is polymorphic: media.image | media.video | column.text.
const moduleBody = `
  _type,
  _key,
  _type == "module.centeredText" => { body },
  _type == "module.imageVideo" => {
    columns,
    items[]{
      _type,
      _type == "media.image" => { ${image} },
      _type == "media.video" => { ${video} },
      _type == "column.text" => { body }
    }
  },
  _type == "module.imageText" => {
    imageSide,
    mediaType,
    image{ ${image} },
    video{ ${video} },
    body
  }
`

export const projectModulesMobile = `
  modulesMobile[]{ ${moduleBody} }
`

export const projectModulesDesktop = `
  modulesDesktop[]{ ${moduleBody} }
`
