// Comprehensive primitive for any image asset.
// Returns dimensions and LQIP so next/image can render with placeholder="blur"
// and zero CLS without a second network round-trip.
export const imageData = `
  asset->{
    _id,
    url,
    metadata {
      lqip,
      dimensions { width, height, aspectRatio }
    }
  },
  hotspot,
  crop
`
