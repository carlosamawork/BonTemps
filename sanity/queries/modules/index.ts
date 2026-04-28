// GROQ dispatchers for module arrays.
// Each fragment selects fields based on the actual schema shape — keep this
// file in lock-step with sanity/schemas/objects/module/*.ts whenever a field
// is added, removed, or renamed.

import {image} from '../fragments/image'
import {video} from '../fragments/video'
import {imageResponsive} from '../fragments/imageResponsive'
import {videoResponsive} from '../fragments/videoResponsive'

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

// Modules used inside `page.modules` (when the generic Page document gets
// converted to use modules; current `page` schema has `body: bodySimple` only,
// so this fragment is reserved for future use.)
export const pageModules = `
  modules[]{
    _type,
    _key,
    _type == "module.pageTextColumn" => {
      bodies[]{ body }
    },
    _type == "module.pageImageVideo" => {
      mediaType,
      image{ ${image} },
      video{ ${video} }
    }
  }
`

// Modules used inside `information.modules`
export const informationModules = `
  modules[]{
    _type,
    _key,
    _type == "module.informationClients" => {
      title,
      items[]{
        name,
        location,
        "projectSlug": projectRef->slug.current
      }
    },
    _type == "module.pageTextColumn" => {
      bodies[]{ body }
    },
    _type == "module.informationImageVideo" => {
      columns,
      reverseOrderOnMobile,
      items[]{
        _type,
        _type == "media.imageResponsive" => { ${imageResponsive} },
        _type == "media.videoResponsive" => { ${videoResponsive} }
      }
    }
  }
`
