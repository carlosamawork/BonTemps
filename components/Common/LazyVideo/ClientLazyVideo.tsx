'use client'
import {useCallback, useEffect, useRef} from 'react'
import styles from './LazyVideo.module.scss'

type Mode = 'hover' | 'in-view' | 'always'

type Props = {
  videoUrl: string
  posterUrl: string
  title: string
  mode: Mode
  mobileAutoplay: boolean
  className?: string
}

export default function ClientLazyVideo({
  videoUrl,
  posterUrl,
  title,
  mode,
  mobileAutoplay,
  className,
}: Props) {
  const ref = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<{destroy: () => void} | null>(null)
  const attachedRef = useRef(false)

  // Idempotent: attach once per video element. Safari plays HLS natively,
  // everywhere else we lazy-load hls.js so the bundle stays light when no
  // video ever needs to play (eg. when JS hovers never trigger).
  const attach = useCallback(async () => {
    const video = ref.current
    if (!video || attachedRef.current) return
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoUrl
      attachedRef.current = true
      return
    }
    const Hls = (await import('hls.js')).default
    if (!Hls.isSupported()) return
    const hls = new Hls({enableWorker: true, lowLatencyMode: true})
    hls.loadSource(videoUrl)
    hls.attachMedia(video)
    hlsRef.current = hls
    attachedRef.current = true
  }, [videoUrl])

  // Attempt play but never throw. Most browsers reject autoplay if the video
  // isn't muted, so we always mute upstream — but extensions and corner
  // cases still abort the promise.
  const play = useCallback(() => {
    ref.current?.play().catch(() => {})
  }, [])

  useEffect(() => () => {
    hlsRef.current?.destroy()
    hlsRef.current = null
    attachedRef.current = false
  }, [])

  useEffect(() => {
    if (mode === 'always') {
      attach().then(play)
      return
    }
    const el = ref.current
    if (!el) return
    if (mode === 'in-view') {
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) attach().then(play)
            else ref.current?.pause()
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
            if (e.isIntersecting) attach().then(play)
            else ref.current?.pause()
          }
        },
        {threshold: 0.5},
      )
      io.observe(el)
      return () => io.disconnect()
    }
    // Desktop hover handled by inline handlers below.
  }, [mode, mobileAutoplay, attach, play])

  const onMouseEnter = mode === 'hover' ? () => attach().then(play) : undefined
  const onMouseLeave = mode === 'hover' ? () => ref.current?.pause() : undefined

  return (
    <video
      ref={ref}
      poster={posterUrl}
      muted
      playsInline
      loop
      preload="none"
      aria-label={title}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`${styles.video} ${className ?? ''}`}
    />
  )
}
