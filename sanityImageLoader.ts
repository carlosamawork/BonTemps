'use client'

// Custom next/image loader for Sanity assets.
//
// With this configured (images.loader = 'custom' in next.config.js), Next.js
// stops running its OWN optimizer over our images. That matters: previously
// every image was encoded twice — once by Sanity's CDN (quality 100) and then
// AGAIN by next/image at its default quality of 75 + WebP. That second lossy
// pass is what made assets look heavily compressed vs. the old site.
//
// Now Sanity's CDN does the resize/encode exactly once. `src` is a fully built
// Sanity URL (crop + quality + auto=format already baked in by LazyImage); the
// only thing that must vary per srcset candidate is the width, so we just swap
// (or append) the `w=` param. Everything else — the crop `rect`, quality,
// format negotiation — is preserved untouched.
export default function sanityImageLoader({
  src,
  width,
}: {
  src: string
  width: number
  quality?: number
}): string {
  // Only Sanity URLs carry a `w=` we should drive. Leave anything else as-is
  // (a global loader also intercepts non-Sanity <Image> instances).
  if (!src.includes('cdn.sanity.io')) return src

  if (/[?&]w=\d+/.test(src)) {
    return src.replace(/([?&])w=\d+/, `$1w=${width}`)
  }
  return `${src}${src.includes('?') ? '&' : '?'}w=${width}`
}
