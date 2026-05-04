// Media types — match GROQ output of imageData / image / video / *Responsive fragments.

export type SanityImageAsset = {
  _id: string
  url: string
  metadata?: {
    lqip?: string
    dimensions?: {width: number; height: number; aspectRatio: number}
  }
}

export type SanityImage = {
  asset?: SanityImageAsset
  hotspot?: {x: number; y: number; height: number; width: number}
  crop?: {top: number; bottom: number; left: number; right: number}
}

// media.image (single asset)
export type MediaImage = {
  image: SanityImage
  alt: string
  caption?: string
}

// module.video inner shape
export type ModuleVideo = {
  title: string
  videoUrl: string
  poster: SanityImage
}

// media.video (single asset)
export type MediaVideo = {
  video: ModuleVideo
  caption?: string
}

// media.imageResponsive (Information page only)
export type MediaImageResponsive = {
  desktop: SanityImage
  ipad?: SanityImage
  mobile?: SanityImage
  alt: string
  caption?: string
}

// media.videoResponsive (Information page only)
export type MediaVideoResponsive = {
  desktop: ModuleVideo
  ipad?: ModuleVideo
  mobile?: ModuleVideo
  caption?: string
}
