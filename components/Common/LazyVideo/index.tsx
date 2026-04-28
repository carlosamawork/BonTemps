import {urlFor} from '@/sanity/queries'
import type {ModuleVideo} from '@/sanity/types'
import ClientLazyVideo from './ClientLazyVideo'

type Mode = 'hover' | 'in-view' | 'always'

type Props = {
  video: ModuleVideo
  mode?: Mode
  mobileAutoplay?: boolean
  className?: string
}

// RSC wrapper. The poster image is resolved on the server so the <video>
// renders an intrinsic poster on first paint even if JavaScript never runs.
// HLS attachment, IntersectionObserver, and hover handlers live in the
// client child.
export default function LazyVideo({
  video,
  mode = 'in-view',
  mobileAutoplay = true,
  className,
}: Props) {
  if (!video?.poster?.asset || !video.videoUrl) return null
  const posterUrl = urlFor(video.poster).auto('format').width(1600).quality(85).url()

  return (
    <ClientLazyVideo
      videoUrl={video.videoUrl}
      posterUrl={posterUrl}
      title={video.title}
      mode={mode}
      mobileAutoplay={mobileAutoplay}
      className={className}
    />
  )
}
