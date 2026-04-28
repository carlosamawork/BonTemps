import {imageData} from '../primitives/imageData'

// Fragment for module.video (the inner shape used by media.video and *Responsive).
export const moduleVideo = `
  title,
  videoUrl,
  poster { ${imageData} }
`

// Fragment for media.video (single asset variant).
export const video = `
  video { ${moduleVideo} },
  caption
`
