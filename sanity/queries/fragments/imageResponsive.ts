import {imageData} from '../primitives/imageData'

// Fragment for media.imageResponsive (Information page only).
export const imageResponsive = `
  desktop { ${imageData} },
  ipad    { ${imageData} },
  mobile  { ${imageData} },
  alt,
  caption
`
