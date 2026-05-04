// GROQ dispatchers for module arrays.
// Each fragment selects fields based on the actual schema shape — keep this
// file in lock-step with sanity/schemas/objects/module/*.ts whenever a field
// is added, removed, or renamed.

import {image} from '../fragments/image'
import {video} from '../fragments/video'

// Modules used inside `project.modules`
export const projectModules = `
  modules[]{
    _type,
    _key,
    _type == "module.centeredText" => { body },
    _type == "module.imageVideo" => {
      columns,
      layout1col,
      layout2col,
      layout3col,
      reverseOrder,
      items[]{
        _type,
        _type == "media.image" => { ${image} },
        _type == "media.video" => { ${video} }
      }
    },
    _type == "module.imageText" => {
      imageSide,
      mediaType,
      image{ ${image} },
      video{ ${video} },
      body
    },
    _type == "module.textColumn" => { body, columns, span, columnStart }
  }
`
