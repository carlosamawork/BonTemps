import {moduleVideo} from './video'

// Fragment for media.videoResponsive (Information page only).
export const videoResponsive = `
  desktop { ${moduleVideo} },
  ipad    { ${moduleVideo} },
  mobile  { ${moduleVideo} },
  caption
`
