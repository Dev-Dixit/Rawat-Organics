'use client'

/**
 * HeroSection — Canvas-Based Image Sequence Scrubbing
 * ─────────────────────────────────────────────────────────────────────────────
 * Video scrubbers are notoriously prone to decoder jank.
 * This architecture uses an Image Sequence (121 frames of high-res .pngs).
 * 
 * 1. Preload 121 `HTMLImageElement`s into memory during mount.
 * 2. Connect Framer Motion's scroll directly to target frame index.
 * 3. Draw `images[currentIndex]` to `<canvas>` synchronously in the RAF loop.
 * 
 * This creates a perfect, zero-lag timeline identical to Apple's implementation.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useRef, useEffect, useCallback, useState } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

// ─── Constants ───────────────────────────────────────────────────────────────
const FRAME_COUNT      = 121
const LERP_FACTOR      = 0.12   // Snappy smoothing curve 
const MIN_DELTA        = 0.001
const ZOOM_START       = 1.0
const ZOOM_END         = 1.10
const BRIGHTNESS_START = 0.88
const BRIGHTNESS_MID   = 0.65
const BRIGHTNESS_END   = 0.52

// ─── Utility helpers ─────────────────────────────────────────────────────────
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi)
const mapRange = (v: number, a: number, b: number, c: number, d: number) =>
  c + ((v - a) / (b - a)) * (d - c)

export default function HeroSection() {
  // ─── DOM refs ──────────────────────────────────────────────────────────────
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const canvasWrapRef = useRef<HTMLDivElement>(null)

  // ─── State & Refs ──────────────────────────────────────────────────────────
  const [imagesLoaded, setImagesLoaded] = useState(0)
  const imagesRef      = useRef<HTMLImageElement[]>([])
  const rafRef         = useRef<number | null>(null)
  const canvasSize     = useRef({ w: 0, h: 0 })
  const targetProgress = useRef(0)
  const smoothProgress = useRef(0)
  const lastDrawnFrame = useRef(-1)

  // ─── Framer Motion scroll ─────────────────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const springProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 25,
    restDelta: 0.001,
  })

  // ─── Framer Motion derived values ─────────────────────────────────────────
  const textOpacity      = useTransform(springProgress, [0, 0.22], [1, 0])
  const textY            = useTransform(springProgress, [0, 0.35], ['0%', '-28%'])
  const fogOpacity       = useTransform(springProgress, [0, 0.7],  [0.25, 0.75])
  const indicatorOpacity = useTransform(springProgress, [0, 0.1],  [1, 0])

  // ─── Draw Frame to Canvas ─────────────────────────────────────────────────
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const imgs = imagesRef.current
    if (!imgs[frameIndex]) return

    const { w, h } = canvasSize.current
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width  = w
      canvas.height = h
    }

    ctx.drawImage(imgs[frameIndex], 0, 0, w, h)
    lastDrawnFrame.current = frameIndex
  }, [])

  // ─── Initialization & Preloading ──────────────────────────────────────────
  useEffect(() => {
    // 1. Preload image sequence
    let loadedCount = 0
    const loadedImages: HTMLImageElement[] = []

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image()
      const paddedIndex = i.toString().padStart(4, '0')
      img.src = `/frames/frame_${paddedIndex}.png`
      
      img.onload = () => {
        loadedCount++
        setImagesLoaded(loadedCount)
        // If it's the very first frame and we haven't drawn yet, draw it immediately
        if (i === 1 && lastDrawnFrame.current === -1) {
          drawFrame(1)
        }
      }
      loadedImages[i] = img
    }
    imagesRef.current = loadedImages

    // 2. Setup Resize Handler
    const canvas = canvasRef.current
    if (!canvas) return

    const updateSize = () => {
      const dpr = window.devicePixelRatio || 1
      const w = window.innerWidth * dpr
      const h = window.innerHeight * dpr
      canvasSize.current = { w, h }
      canvas.width  = w
      canvas.height = h
      canvas.style.width  = '100%'
      canvas.style.height = '100%'
      // Repaint current frame
      if (lastDrawnFrame.current !== -1) {
        drawFrame(lastDrawnFrame.current)
      }
    }
    window.addEventListener('resize', updateSize)
    updateSize()

    // 3. Subscribe to Scroll
    targetProgress.current = scrollYProgress.get()
    smoothProgress.current = targetProgress.current

    const unsubscribe = scrollYProgress.on('change', (v) => {
      targetProgress.current = v
    })

    // 4. Main Animation Loop
    const tick = () => {
      rafRef.current = requestAnimationFrame(tick)

      // Only start animating if we have at least the first few frames loaded
      if (imagesRef.current.length < 2) return

      // Lerp
      const prev = smoothProgress.current
      smoothProgress.current = lerp(prev, targetProgress.current, LERP_FACTOR)
      smoothProgress.current = clamp(smoothProgress.current, 0, 1)

      const delta = Math.abs(smoothProgress.current - prev)

      if (delta > MIN_DELTA) {
        // Map 0..1 to 1..121
        const floatFrame = mapRange(smoothProgress.current, 0, 1, 1, FRAME_COUNT)
        const targetFrame = Math.round(floatFrame)

        // Only draw if the frame actually changed
        if (targetFrame !== lastDrawnFrame.current && imagesRef.current[targetFrame]?.complete) {
          drawFrame(targetFrame)
        }
      }

      // Parallax / Zoom / Brightness (Hardware Accelerated style mutations)
      const zoom = mapRange(smoothProgress.current, 0, 1, ZOOM_START, ZOOM_END)
      if (canvasWrapRef.current) {
        canvasWrapRef.current.style.transform = `scale(${zoom.toFixed(4)})`
      }

      const p = smoothProgress.current
      const brightness = p < 0.5
        ? mapRange(p, 0, 0.5, BRIGHTNESS_START, BRIGHTNESS_MID)
        : mapRange(p, 0.5, 1, BRIGHTNESS_MID, BRIGHTNESS_END)
      
      canvas.style.filter = `brightness(${brightness.toFixed(3)})`
    }

    rafRef.current = requestAnimationFrame(tick)

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateSize)
      unsubscribe()
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [scrollYProgress, drawFrame])

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div ref={containerRef} className="relative" style={{ height: '300vh' }} id="hero">
      
      {/* Loading Overlay (Optional UX improvement for heavy assets) */}
      {imagesLoaded < FRAME_COUNT * 0.1 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background text-primary transition-opacity duration-1000 pointer-events-none">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-sm font-headline tracking-widest uppercase flex flex-col items-center gap-4"
          >
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            Loading Experience...
          </motion.div>
        </div>
      )}

      {/* Viewport-pinned scene */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

        <div
          ref={canvasWrapRef}
          style={{
            position: 'absolute',
            inset: 0,
            transformOrigin: 'center center',
            willChange: 'transform',
          }}
        >
          <canvas
            ref={canvasRef}
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

        {/* ── FOG / DEPTH OVERLAY ──────────────────────────────────────────── */}
        <motion.div
          style={{
            position: 'absolute', inset: 0, zIndex: 10,
            opacity: fogOpacity,
            pointerEvents: 'none',
            background:
              'radial-gradient(ellipse 120% 60% at 50% 100%, rgba(2,28,16,0.85) 0%, transparent 70%)',
          }}
        />

        {/* ── GRADIENT OVERLAY ────────────────────────────────────────────── */}
        <div
          style={{
            position: 'absolute', inset: 0, zIndex: 11, pointerEvents: 'none',
            background:
              'linear-gradient(to bottom, rgba(2,28,16,0.38) 0%, rgba(2,28,16,0.08) 40%, rgba(2,28,16,0.55) 100%)',
          }}
        />

        {/* ── FILM GRAIN ──────────────────────────────────────────────────── */}
        <div className="noise-overlay" style={{ zIndex: 12 }} />

        {/* ── FLOATING ORGANIC ICONS ──────────────────────────────────────── */}
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

        {/* ── HERO TEXT ────────────────────────────────────────────────────── */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
          style={{ opacity: textOpacity, y: textY, zIndex: 20 }}
        >
          <motion.span
            className="text-white/60 font-headline font-semibold tracking-[0.35em] uppercase text-xs md:text-sm mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            The Botanical Atelier
          </motion.span>
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
          <motion.p
            className="text-white/80 text-base md:text-xl font-light mb-12 max-w-2xl leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.75 }}
          >
            Experience the heritage of soil. A botanical atelier dedicated to
            cultivating the essence of nature&apos;s most refined harvests.
          </motion.p>
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

        {/* ── SCROLL INDICATOR ────────────────────────────────────────────── */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ opacity: indicatorOpacity, zIndex: 30 }}
        >
          <span className="text-white/50 font-headline text-xs tracking-[0.3em] uppercase">
            Scroll to explore
          </span>
          <div className="scroll-indicator w-px h-14 bg-gradient-to-b from-white/50 to-transparent" />
        </motion.div>

        {/* ── PROGRESS BAR ────────────────────────────────────────────────── */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] bg-primary-fixed/60"
          style={{ scaleX: springProgress, transformOrigin: 'left', zIndex: 30 }}
        />
      </div>
    </div>
  )
}
