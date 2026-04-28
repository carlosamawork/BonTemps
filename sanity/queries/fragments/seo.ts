import {imageData} from '../primitives/imageData'

// Fragment for the `seo` object. The flat `imageUrl`/`metadata` keys mirror
// the legacy shape so older callers (eg. generateMetadata in app/(frontend)/page.tsx)
// keep working. The richer asset projection from imageData is also returned for
// new callers that want LQIP and full dimensions.
export const seo = `
  title,
  description,
  image{
    ${imageData},
    "imageUrl": asset->url,
    "metadata": asset->metadata{dimensions}
  }
`
