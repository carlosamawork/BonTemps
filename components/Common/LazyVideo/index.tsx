import type {ModuleVideo} from '@/sanity/types'
import ClientLazyVideo from './ClientLazyVideo'

type Mode = 'hover' | 'in-view' | 'always'

type Props = {
  video: ModuleVideo
  mode?: Mode
  mobileAutoplay?: boolean
  className?: string
  hoverTargetSelector?: string
}

// RSC wrapper. Reads LQIP + intrinsic aspect ratio off the poster's Sanity
// metadata so the client component can reserve layout and paint a blurred
// placeholder before metadata round-trips.
export default function LazyVideo({
  video,
  mode = 'in-view',
  mobileAutoplay = true,
  className,
  hoverTargetSelector,
}: Props) {
  if (!video?.videoUrl) return null
  const lqip = video.poster?.asset?.metadata?.lqip
  const dim = video.poster?.asset?.metadata?.dimensions
  const aspectRatio = dim ? `${dim.width} / ${dim.height}` : undefined

  return (
    <ClientLazyVideo
      videoUrl={video.videoUrl}
      title={video.title}
      mode={mode}
      mobileAutoplay={mobileAutoplay}
      className={className}
      hoverTargetSelector={hoverTargetSelector}
      lqip={lqip}
      aspectRatio={aspectRatio}
    />
  )
}
