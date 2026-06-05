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
  // Renders the "Sound On" / "Sound Off" pill (already gated upstream by the
  // editor's `soundEnabled` flag + the call-site opt-in). The video still
  // autoplays muted; unmuting is always a user gesture, which keeps mobile
  // autoplay policies happy.
  soundControl?: boolean
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
  soundControl,
}: Props) {
  const ref = useRef<HTMLVideoElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const attachedRef = useRef(false)
  const hideTimerRef = useRef<number | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [soundOn, setSoundOn] = useState(false)
  const [controlVisible, setControlVisible] = useState(false)

  // Drive `muted` through the DOM property (not the React attribute): React
  // doesn't update `muted` after mount, and the element must stay muted until
  // the user explicitly asks for sound.
  const toggleSound = useCallback(() => {
    const video = ref.current
    if (!video) return
    const nextMuted = !video.muted
    video.muted = nextMuted
    setSoundOn(!nextMuted)
    // Unmuting counts as a user gesture — also resume playback in case the
    // video was paused (e.g. re-entering the viewport edge case).
    if (!nextMuted) video.play().catch(() => {})
  }, [])

  // "Poke" the control: show it and restart the idle countdown. Any user
  // activity (mouse movement on desktop, scrolling on mobile) calls this;
  // after IDLE_MS without activity the pill fades away.
  const IDLE_MS = 2000
  const poke = useCallback(() => {
    setControlVisible(true)
    if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current)
    hideTimerRef.current = window.setTimeout(() => setControlVisible(false), IDLE_MS)
  }, [])

  const hideControl = useCallback(() => {
    if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current)
    setControlVisible(false)
  }, [])

  // Sound pill visibility.
  // Desktop: only while the cursor is over the video, fading out if the
  //   mouse rests for IDLE_MS (mousemove re-shows it).
  // Mobile: while the video is in view AND the page is actively scrolling;
  //   once the scroll settles for IDLE_MS it fades away.
  useEffect(() => {
    if (!soundControl) return
    const wrap = wrapRef.current
    if (!wrap) return

    const isCoarsePointer = window.matchMedia('(hover: none)').matches

    if (!isCoarsePointer) {
      const onMove = () => poke()
      wrap.addEventListener('mousemove', onMove)
      wrap.addEventListener('mouseleave', hideControl)
      return () => {
        wrap.removeEventListener('mousemove', onMove)
        wrap.removeEventListener('mouseleave', hideControl)
        if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current)
      }
    }

    let inView = false
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          inView = e.isIntersecting
          if (inView) poke()
          else hideControl()
        }
      },
      {threshold: 0.25},
    )
    io.observe(wrap)
    const onScroll = () => {
      if (inView) poke()
    }
    window.addEventListener('scroll', onScroll, {passive: true})
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current)
    }
  }, [soundControl, poke, hideControl])

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
      ref={wrapRef}
      className={styles.wrap}
      // Keep the natural aspect-ratio for CLS/mobile (natural height). In the
      // fixed work-grid block (tablet+), the parent CSS sets the wrap height to
      // 100% so it fills the block and the video/placeholder are contained.
      style={aspectRatio ? {aspectRatio} : undefined}
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
      {soundControl && (
        <button
          type="button"
          className={`${styles.soundButton} ${controlVisible ? styles.isVisible : ''}`}
          onClick={() => {
            toggleSound()
            // Interacting counts as activity — keep the pill up a bit longer.
            poke()
          }}
          aria-pressed={soundOn}
        >
          {/* Label reads as the action: "Sound On" activates, "Sound Off" mutes. */}
          {soundOn ? 'Sound Off' : 'Sound On'}
        </button>
      )}
    </div>
  )
}
