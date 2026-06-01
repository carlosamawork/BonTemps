'use client'
import {useCallback, useEffect, useRef, useState} from 'react'
import styles from './LazyVideo.module.scss'

type Mode = 'hover' | 'in-view' | 'always'

type Props = {
  videoUrl: string
  title: string
  mode: Mode
  mobileAutoplay: boolean
  className?: string
  // When set in `mode='hover'`, the video reacts to enter/leave on the
  // closest ancestor matching the selector instead of the <video> itself.
  // Needed when the video sits inside an overlay with `pointer-events: none`
  // where the element never receives mouse events.
  hoverTargetSelector?: string
  // Tiny base64 image used as a blurred placeholder while the video fetches
  // metadata. Sourced from the poster's Sanity LQIP.
  lqip?: string
  // CSS `aspect-ratio` value (eg. `"16 / 9"`) — reserves intrinsic layout
  // before metadata loads to avoid CLS.
  aspectRatio?: string
  // Fit the video AND its blur placeholder inside the box with `contain`,
  // top-aligned (used by the fixed-ratio work-grid thumbnails). Otherwise the
  // placeholder defaults to `cover` and would fill the whole block.
  contain?: boolean
}

export default function ClientLazyVideo({
  videoUrl,
  title,
  mode,
  mobileAutoplay,
  className,
  hoverTargetSelector,
  lqip,
  aspectRatio,
  contain,
}: Props) {
  const ref = useRef<HTMLVideoElement>(null)
  const attachedRef = useRef(false)
  const [loaded, setLoaded] = useState(false)

  // MP4 is supported natively everywhere; setting `src` is enough. With
  // `preload="metadata"` the browser fetches just enough to paint the first
  // frame without buffering the full file.
  const attach = useCallback(() => {
    const video = ref.current
    if (!video || attachedRef.current) return
    video.src = videoUrl
    attachedRef.current = true
  }, [videoUrl])

  const play = useCallback(() => {
    ref.current?.play().catch(() => {})
  }, [])

  useEffect(() => {
    if (mode === 'always') {
      attach()
      play()
      return
    }
    const el = ref.current
    if (!el) return

    if (mode === 'in-view') {
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              attach()
              play()
            } else {
              ref.current?.pause()
            }
          }
        },
        {threshold: 0.25},
      )
      io.observe(el)
      return () => io.disconnect()
    }

    // mode === 'hover'
    const isCoarsePointer = window.matchMedia('(hover: none)').matches
    if (isCoarsePointer && mobileAutoplay) {
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              attach()
              play()
            } else {
              ref.current?.pause()
            }
          }
        },
        {threshold: 0.5},
      )
      io.observe(el)
      return () => io.disconnect()
    }

    // Desktop hover: pre-load metadata once the video scrolls into view so
    // the first frame is painted by the time the user hovers. Playback is
    // driven by mouse events on the chosen ancestor (or the video itself).
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) attach()
        }
      },
      {threshold: 0.1},
    )
    io.observe(el)

    if (hoverTargetSelector) {
      const target = el.closest(hoverTargetSelector)
      if (target) {
        const onEnter = () => {
          attach()
          play()
        }
        const onLeave = () => ref.current?.pause()
        target.addEventListener('mouseenter', onEnter)
        target.addEventListener('mouseleave', onLeave)
        return () => {
          io.disconnect()
          target.removeEventListener('mouseenter', onEnter)
          target.removeEventListener('mouseleave', onLeave)
        }
      }
    }
    return () => io.disconnect()
  }, [mode, mobileAutoplay, attach, play, hoverTargetSelector])

  const useInlineHover = mode === 'hover' && !hoverTargetSelector
  const onMouseEnter = useInlineHover
    ? () => {
        attach()
        play()
      }
    : undefined
  const onMouseLeave = useInlineHover ? () => ref.current?.pause() : undefined

  return (
    <div
      className={styles.wrap}
      // In `contain` mode the parent box already defines the ratio (the fixed
      // work-grid block), so the wrap must fill it instead of taking the
      // video's natural aspect-ratio — otherwise the placeholder sizes to that
      // natural box and the blur covers the whole block.
      style={contain ? {width: '100%', height: '100%'} : aspectRatio ? {aspectRatio} : undefined}
    >
      {lqip && (
        // Real <img>, not a CSS background, so the poster keeps its own aspect
        // ratio and lands exactly where the <video> will (both object-fit).
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={`${styles.placeholder} ${loaded ? styles.isHidden : ''}`}
          src={lqip}
          alt=""
          aria-hidden
          style={contain ? {objectFit: 'contain', objectPosition: 'top'} : undefined}
        />
      )}
      <video
        ref={ref}
        muted
        playsInline
        loop
        preload="metadata"
        aria-label={title}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onLoadedData={() => setLoaded(true)}
        style={contain ? {objectFit: 'contain', objectPosition: 'top'} : undefined}
        className={`${styles.video} ${loaded ? styles.isLoaded : ''} ${className ?? ''}`}
      />
    </div>
  )
}
