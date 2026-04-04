'use client'

/**
 * HeroSection — Scroll-Driven Cinematic Video
 * ─────────────────────────────────────────────────────────────────────────────
 * HOW THE LERP SMOOTHING WORKS
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Linear Interpolation (lerp):
 *    current += (target - current) * factor
 *
 *  Every animation frame we move `current` a small fraction of the
 *  remaining distance toward `target`. With factor = 0.075:
 *
 *    Frame 1:  current = 0 + (1 - 0)   * 0.075 = 0.075
 *    Frame 2:  current = 0.075 + (1 - 0.075) * 0.075 ≈ 0.144
 *    Frame 3:  …keeps decelerating as gap shrinks → easeOut feel
 *
 *  The result is a natural "rubber-band" catch-up:
 *    • Fast at first (when lag is large)
 *    • Decelerates as it converges → cinematic inertia
 *    • Fully independent of React re-renders (all values in useRef)
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useRef, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

// ─── Constants ───────────────────────────────────────────────────────────────
const LERP_FACTOR       = 0.075  // smoothing strength (lower = more lag)
const MIN_DELTA         = 0.001  // skip tiny updates below this threshold
const ZOOM_START        = 1.0    // video scale at scroll = 0
const ZOOM_END          = 1.10   // video scale at scroll = 1
const BRIGHTNESS_START  = 0.88
const BRIGHTNESS_MID    = 0.65
const BRIGHTNESS_END    = 0.52

// ─── Utility helpers ─────────────────────────────────────────────────────────

/** Linear interpolation: moves `a` toward `b` by `t` each frame */
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** Clamp a value between min and max */
const clamp = (val: number, min: number, max: number) =>
  Math.min(Math.max(val, min), max)

/** Map a value from one range to another */
const mapRange = (
  val: number,
  inMin: number, inMax: number,
  outMin: number, outMax: number
) => outMin + ((val - inMin) / (inMax - inMin)) * (outMax - outMin)


export default function HeroSection() {
  // ─── DOM refs ──────────────────────────────────────────────────────────────
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef     = useRef<HTMLVideoElement>(null)
  const videoWrapRef = useRef<HTMLDivElement>(null)

  // ─── RAF handle ────────────────────────────────────────────────────────────
  const rafRef = useRef<number | null>(null)

  // ─── All animation state lives in refs (zero re-renders during scroll) ─────
  const videoDuration  = useRef(0)       // set once on loadedmetadata
  const isReady        = useRef(false)   // true after metadata loads
  const targetProgress = useRef(0)       // raw scroll progress 0..1
  const smoothProgress = useRef(0)       // lerp-smoothed progress 0..1

  // ─── Framer Motion scroll tracking ─────────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Spring-smoothed progress FOR TEXT / UI ANIMATIONS only
  // (video scrubbing uses its own lerp loop for tighter control)
  const springProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 25,
    restDelta: 0.001,
  })

  // ─── Framer Motion derived animation values (text / overlay) ───────────────
  const textOpacity     = useTransform(springProgress, [0, 0.22], [1, 0])
  const textY           = useTransform(springProgress, [0, 0.35], ['0%', '-28%'])
  const fogOpacity      = useTransform(springProgress, [0, 0.7],  [0.25, 0.75])
  const indicatorOpacity = useTransform(springProgress, [0, 0.1], [1, 0])

  // ─── Main animation loop ───────────────────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // ── Configure video element ──────────────────────────────────────────────
    video.pause()
    video.muted      = true
    video.playsInline = true
    video.preload    = 'auto'

    // ── Wait for metadata so we know duration ────────────────────────────────
    const onMetadata = () => {
      videoDuration.current = video.duration
      isReady.current       = true
      // Snap video to current scroll position immediately (no lerp on first frame)
      const initialProgress = scrollYProgress.get()
      smoothProgress.current  = initialProgress
      targetProgress.current  = initialProgress
      video.currentTime       = initialProgress * videoDuration.current
    }

    video.addEventListener('loadedmetadata', onMetadata)
    if (video.readyState >= 1) onMetadata()                // already loaded

    // ── Subscribe to raw scroll progress (no spring, just raw value) ─────────
    // We read scrollYProgress directly in the RAF loop for zero latency
    const unsubscribe = scrollYProgress.on('change', (v) => {
      targetProgress.current = v
    })

    // ─── The animation loop ──────────────────────────────────────────────────
    const tick = () => {
      rafRef.current = requestAnimationFrame(tick)

      if (!isReady.current || !video) return

      // ── Step 1: Lerp smooth progress toward target ───────────────────────
      const prevSmooth = smoothProgress.current
      smoothProgress.current = lerp(
        prevSmooth,
        targetProgress.current,
        LERP_FACTOR
      )
      smoothProgress.current = clamp(smoothProgress.current, 0, 1)

      const delta = Math.abs(smoothProgress.current - prevSmooth)

      // ── Step 2: Drive video currentTime ─────────────────────────────────
      // Skip if change is below perceptible threshold (saves browser seeks)
      if (delta > MIN_DELTA) {
        const targetTime = clamp(
          smoothProgress.current * videoDuration.current,
          0,
          videoDuration.current
        )
        video.currentTime = targetTime
      }

      // ── Step 3: Drive video zoom imperatively ───────────────────────────
      // Avoids React re-renders — we mutate the DOM directly in the RAF loop
      const zoom = mapRange(smoothProgress.current, 0, 1, ZOOM_START, ZOOM_END)
      if (videoWrapRef.current) {
        videoWrapRef.current.style.transform = `scale(${zoom.toFixed(4)})`
      }

      // ── Step 4: Drive video brightness imperatively ──────────────────────
      const p = smoothProgress.current
      let brightness: number
      if (p < 0.5) {
        brightness = mapRange(p, 0, 0.5, BRIGHTNESS_START, BRIGHTNESS_MID)
      } else {
        brightness = mapRange(p, 0.5, 1, BRIGHTNESS_MID, BRIGHTNESS_END)
      }
      if (video) {
        video.style.filter = `brightness(${brightness.toFixed(3)})`
      }
    }

    rafRef.current = requestAnimationFrame(tick)

    // ── Cleanup ──────────────────────────────────────────────────────────────
    return () => {
      video.removeEventListener('loadedmetadata', onMetadata)
      unsubscribe()
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [scrollYProgress])


  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    // 300vh = gives ~10-15 seconds of scrollable video timeline
    <div ref={containerRef} style={{ height: '300vh', position: 'relative' }} id="hero">

      {/* Viewport-pinned scene — stays fixed while container scrolls */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

        {/* ── VIDEO WRAPPER (zoom applied imperatively in RAF) ───────────── */}
        <div
          ref={videoWrapRef}
          style={{
            position: 'absolute',
            inset: 0,
            transformOrigin: 'center center',
            willChange: 'transform',
          }}
        >
          <video
            ref={videoRef}
            src="/farm.mp4"
            muted
            playsInline
            preload="auto"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              willChange: 'filter',
            }}
          />
        </div>

        {/* ── FOG / DEPTH OVERLAY (Framer Motion spring) ────────────────── */}
        <motion.div
          style={{
            position: 'absolute', inset: 0, zIndex: 10,
            opacity: fogOpacity,
            pointerEvents: 'none',
            background:
              'radial-gradient(ellipse 120% 60% at 50% 100%, rgba(2,28,16,0.85) 0%, transparent 70%)',
          }}
        />

        {/* ── GRADIENT OVERLAY (static, readability) ────────────────────── */}
        <div
          style={{
            position: 'absolute', inset: 0, zIndex: 11, pointerEvents: 'none',
            background:
              'linear-gradient(to bottom, rgba(2,28,16,0.38) 0%, rgba(2,28,16,0.08) 40%, rgba(2,28,16,0.55) 100%)',
          }}
        />

        {/* ── FILM GRAIN noise texture ───────────────────────────────────── */}
        <div className="noise-overlay" style={{ zIndex: 12 }} />

        {/* ── FLOATING ORGANIC ICONS ────────────────────────────────────── */}
        <motion.div
          className="absolute top-1/4 left-10 pointer-events-none"
          style={{ opacity: textOpacity, zIndex: 20 }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span
            className="material-symbols-outlined text-white/30"
            style={{ fontSize: '64px', fontVariationSettings: "'FILL' 0, 'wght' 100" }}
          >
            spa
          </span>
        </motion.div>
        <motion.div
          className="absolute bottom-1/3 right-16 pointer-events-none"
          style={{ opacity: textOpacity, zIndex: 20 }}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <span
            className="material-symbols-outlined text-white/20"
            style={{ fontSize: '40px', fontVariationSettings: "'FILL' 0, 'wght' 100" }}
          >
            eco
          </span>
        </motion.div>

        {/* ── HERO TEXT ─────────────────────────────────────────────────── */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
          style={{ opacity: textOpacity, y: textY, zIndex: 20 }}
        >
          {/* Eyebrow */}
          <motion.span
            className="text-white/60 font-headline font-semibold tracking-[0.35em] uppercase text-xs md:text-sm mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            The Botanical Atelier
          </motion.span>

          {/* H1 */}
          <motion.h1
            className="text-white font-headline font-extrabold text-5xl md:text-8xl tracking-tighter mb-8 leading-[1.05]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Pure.{' '}
            <span className="italic font-light text-primary-fixed/90">Natural.</span>{' '}
            Organic.
          </motion.h1>

          {/* Sub */}
          <motion.p
            className="text-white/80 text-base md:text-xl font-light mb-12 max-w-2xl leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.75 }}
          >
            Experience the heritage of soil. A botanical atelier dedicated to
            cultivating the essence of nature&apos;s most refined harvests.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1 }}
          >
            <a
              href="#collection"
              className="w-full sm:w-auto px-10 py-4 bg-gradient-to-br from-primary-fixed to-primary-fixed-dim text-primary font-headline font-bold text-base rounded-full hover:scale-105 active:scale-95 transition-all duration-300 shadow-2xl"
            >
              Inquire Now
            </a>
            <a
              href="#story"
              className="w-full sm:w-auto px-10 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full font-headline font-bold text-base hover:bg-white/20 transition-all duration-300"
            >
              Our Story
            </a>
          </motion.div>
        </motion.div>

        {/* ── SCROLL INDICATOR ──────────────────────────────────────────── */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ opacity: indicatorOpacity, zIndex: 30 }}
        >
          <span className="text-white/50 font-headline text-xs tracking-[0.3em] uppercase">
            Scroll to explore
          </span>
          <div className="scroll-indicator w-px h-14 bg-gradient-to-b from-white/50 to-transparent" />
        </motion.div>

        {/* ── PROGRESS BAR (bottom edge) ────────────────────────────────── */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] bg-primary-fixed/60"
          style={{ scaleX: springProgress, transformOrigin: 'left', zIndex: 30 }}
        />

      </div>
    </div>
  )
}
