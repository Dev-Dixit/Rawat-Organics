"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef, useState } from "react";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { PillLink } from "@/components/ui/PillButton";

gsap.registerPlugin(ScrollTrigger);

const VIDEO_SRC = "/video/landingpage2.mp4";

/**
 * Scroll track height — lower = full video scrubs in fewer pixels (faster frame advance).
 * Increase if it feels too rushed.
 */
const HERO_SCROLL_VH = 200;

export function HeroSection() {
  const scrollTrackRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scaleWrapRef = useRef<HTMLDivElement | null>(null);
  const cinematicOverlayRef = useRef<HTMLDivElement | null>(null);

  const [metaReady, setMetaReady] = useState(false);

  useLayoutEffect(() => {
    if (!metaReady) return;

    const scrollTrack = scrollTrackRef.current;
    const video = videoRef.current;
    const scaleWrap = scaleWrapRef.current;
    const cinematicOverlay = cinematicOverlayRef.current;

    if (!scrollTrack || !video || !scaleWrap || !cinematicOverlay) return;

    const duration = video.duration;
    if (!Number.isFinite(duration) || duration <= 0) return;

    video.pause();
    video.currentTime = 0;

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: scrollTrack,
            start: "top top",
            end: "bottom bottom",
            /** Lower = snappier frame sync to wheel/touch (less “lag” behind scroll) */
            scrub: 0.35,
            invalidateOnRefresh: true,
          },
        })
        .to(video, { currentTime: duration }, 0)
        .fromTo(scaleWrap, { scale: 1.08 }, { scale: 1 }, 0)
        .fromTo(
          cinematicOverlay,
          { opacity: 0.45, filter: "blur(8px) brightness(0.88)" },
          { opacity: 0.06, filter: "blur(0px) brightness(1)" },
          0,
        );
    }, scrollTrack);

    const onRefresh = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onRefresh);

    return () => {
      window.removeEventListener("resize", onRefresh);
      ctx.revert();
    };
  }, [metaReady]);

  return (
    <section
      ref={scrollTrackRef}
      className="relative w-full bg-primary"
      style={{ minHeight: `${HERO_SCROLL_VH}vh` }}
      aria-label="Cinematic introduction"
    >
      {/* Sticky viewport: video + copy stay visually fixed while the page scrolls through the tall track */}
      <div className="sticky top-0 flex h-dvh min-h-screen w-full flex-col overflow-hidden">
        <div
          ref={scaleWrapRef}
          className="absolute inset-0 origin-center will-change-transform transform-[translateZ(0)]"
        >
          <video
            ref={videoRef}
            className="h-full w-full object-cover object-bottom will-change-transform transform-[translateZ(0)]"
            src={VIDEO_SRC}
            muted
            playsInline
            loop={true}
            preload="auto"
            autoPlay
            controls={false}
            onLoadedMetadata={(e) => {
              const el = e.currentTarget;
              el.pause();
              el.currentTime = 0;
              setMetaReady(true);
            }}
          />
        </div>

        {/* Figma 10:285–style gradient: primary wash → clear mid → page background */}
        <div
          ref={cinematicOverlayRef}
          className="pointer-events-none absolute inset-0 bg-linear-to-b from-primary/30 via-[rgba(2,28,16,0)] via-50% to-background will-change-[opacity,filter]"
        />

        <div className="pointer-events-none relative z-20 flex flex-1 flex-col items-center justify-center px-6 pb-12 pt-28 text-center sm:pt-32">
          <div className="pointer-events-auto max-w-4xl">
            <h1 className="font-headline text-4xl font-extrabold leading-[1.1] tracking-tighter text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.35)] sm:text-6xl md:text-7xl lg:text-8xl">
              Pure. Natural. Organic.
            </h1>
            <p className="mx-auto mt-8 max-w-2xl font-body text-lg font-light leading-relaxed text-white/90 drop-shadow-md md:text-xl">
              Experience the heritage of soil. A botanical atelier dedicated to cultivating the essence
              of nature&apos;s most refined harvests.
            </p>
            <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row">
              <PillLink href="#contact" variant="gradient" size="lg" className="w-full sm:w-auto">
                Inquire Now
              </PillLink>
              <PillLink href="#story" variant="glass" size="lg" className="w-full sm:w-auto">
                Our Story
              </PillLink>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute top-1/4 left-8 z-5 opacity-40">
          <MaterialSymbol name="spa" className="text-6xl text-white drop-shadow-sm" aria-hidden />
        </div>
        <div className="pointer-events-none absolute right-12 bottom-1/4 z-5 opacity-30 md:right-20">
          <MaterialSymbol name="eco" className="text-4xl text-white drop-shadow-sm" aria-hidden />
        </div>
      </div>
    </section>
  );
}
