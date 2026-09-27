"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { HERO_FRAME_COUNT } from "@/lib/heroFrames";
import { REFRESH_PRIORITY } from "@/lib/refreshPriority";
import { HeroFrameCanvas, type HeroFrameCanvasHandle } from "./HeroFrameCanvas";
import { HeroPreloader } from "./HeroPreloader";
import { FloatingCard } from "./FloatingCard";
import { useLenis } from "@/components/layout/SmoothScrollProvider";

export function Hero() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const canvasWrapRef = useRef<HTMLDivElement | null>(null);
  const canvasApiRef = useRef<HeroFrameCanvasHandle | null>(null);

  const stateARef = useRef<HTMLDivElement | null>(null);
  const stateBRef = useRef<HTMLDivElement | null>(null);
  const stateCRef = useRef<HTMLDivElement | null>(null);
  const scrollHintRef = useRef<HTMLDivElement | null>(null);

  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  const lenisRef = useLenis();

  const handleProgress = useCallback((loaded: number, total: number) => {
    setProgress((loaded / total) * 100);
  }, []);

  const handleReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (ready) {
      lenis?.start();
      document.documentElement.style.overflow = "";
    } else {
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
    }
  }, [ready, lenisRef]);

  useGSAP(
    () => {
      if (!ready) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          isMobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isMobile, reduced } = context.conditions as {
            isDesktop: boolean;
            isMobile: boolean;
            reduced: boolean;
          };

          if (reduced) {
            canvasApiRef.current?.drawFrame(HERO_FRAME_COUNT * 0.55);
            gsap.set([stateBRef.current, stateCRef.current], { opacity: 0 });
            gsap.set(stateARef.current, { opacity: 1 });
            return;
          }

          const scrollDistance = isMobile ? "+=220%" : "+=320%";
          const frameState = { frame: 0 };

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: scrollDistance,
              scrub: 0.4,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              refreshPriority: REFRESH_PRIORITY.hero,
            },
          });

          tl.to(
            frameState,
            {
              frame: HERO_FRAME_COUNT - 1,
              ease: "none",
              duration: 1,
              onUpdate: () => canvasApiRef.current?.drawFrame(frameState.frame),
            },
            0
          );

          tl.fromTo(
            canvasWrapRef.current,
            { scale: 1.12 },
            { scale: 1, ease: "none", duration: 1 },
            0
          );

          tl.to(scrollHintRef.current, { opacity: 0, ease: "none", duration: 0.05 }, 0.03);

          tl.to(
            stateARef.current,
            { opacity: 0, yPercent: -6, ease: "none", duration: 0.15 },
            0.16
          );

          tl.fromTo(
            stateBRef.current,
            { opacity: 0, yPercent: 6 },
            { opacity: 1, yPercent: 0, ease: "none", duration: 0.14 },
            0.2
          );
          tl.to(
            stateBRef.current,
            { opacity: 0, yPercent: -6, ease: "none", duration: 0.1 },
            0.48
          );

          tl.fromTo(
            stateCRef.current,
            { opacity: 0, yPercent: 8 },
            { opacity: 1, yPercent: 0, ease: "none", duration: 0.16 },
            0.6
          );
        }
      );

      // Pinning here inserts a large spacer after every other section's
      // ScrollTrigger has already been created (they mount before this
      // preload-gated effect runs), which leaves their cached start/end
      // positions stale. The global ScrollTrigger.refresh() does not
      // recompute already-created instances in this scenario, so refresh
      // each instance directly once the new layout has painted.
      requestAnimationFrame(() => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.refresh());
      });

      return () => mm.revert();
    },
    { dependencies: [ready], scope: sectionRef }
  );

  return (
    <section id="top" ref={sectionRef} className="relative h-screen w-full overflow-hidden bg-void">
      <HeroPreloader progress={progress} done={ready} />

      <div ref={canvasWrapRef} className="absolute inset-0">
        <HeroFrameCanvas ref={canvasApiRef} onProgress={handleProgress} onReady={handleReady} />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-void/10 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-void/60 to-transparent" />

      {/* STATE A — initial hero */}
      <div ref={stateARef} className="absolute inset-0 flex flex-col justify-between px-6 pt-28 pb-10 sm:px-10 sm:pb-14 lg:px-14">
        <div className="flex items-start justify-between">
          <div className="max-w-[11rem] sm:max-w-[14rem]">
            <p className="label-text text-cream/70">Full-Stack Developer</p>
            <p className="label-text text-cream/70">AI Creator</p>
          </div>

          <FloatingCard className="hidden flex-col items-start gap-2 sm:flex">
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-cream">08+</span>
              <span className="mb-0.5 flex items-end gap-0.5">
                {[5, 9, 6, 12].map((h, i) => (
                  <span
                    key={i}
                    className="w-1 rounded-sm bg-crimson"
                    style={{ height: `${h}px` }}
                  />
                ))}
              </span>
            </div>
            <span className="label-text text-cream/50">Projects Completed</span>
          </FloatingCard>
        </div>

        <div className="flex flex-col gap-6">
          <FloatingCard className="w-fit flex-row items-center gap-2 py-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-crimson" />
            <span className="label-text text-cream/80">Available for Work</span>
          </FloatingCard>

          <div>
            <h1 className="text-[clamp(3rem,12vw,9rem)] font-black uppercase leading-[0.85] tracking-tight">
              <span className="block text-cream">Digital</span>
              <span className="block text-crimson">Creator</span>
            </h1>
            <p className="mt-5 max-w-md text-sm uppercase tracking-wide text-cream/60 sm:text-base">
              I build digital experiences with code, AI and creativity.
            </p>
          </div>

          <div ref={scrollHintRef} className="flex items-center gap-2 text-cream/50">
            <span className="label-text">Scroll to Explore</span>
            <span className="animate-bounce text-lg leading-none">↓</span>
          </div>
        </div>
      </div>

      {/* STATE B — transition */}
      <div
        ref={stateBRef}
        className="pointer-events-none absolute inset-y-0 right-6 flex flex-col items-end justify-center gap-2 opacity-0 sm:right-14"
      >
        {["Ideas", "Code", "Design", "Real Impact"].map((word) => (
          <span key={word} className="label-text text-cream/70">
            {word}
          </span>
        ))}
      </div>

      {/* STATE C — hero end */}
      <div
        ref={stateCRef}
        className="pointer-events-none absolute inset-x-0 bottom-14 flex flex-col gap-6 px-6 opacity-0 sm:px-10 lg:px-14"
      >
        <h2 className="text-[clamp(2.5rem,9vw,6.5rem)] font-black uppercase leading-[0.9] tracking-tight text-cream">
          Let&rsquo;s Build
          <br />
          Something <span className="text-crimson">Real.</span>
        </h2>
        <div className="flex items-center gap-2 text-cream/50">
          <span className="label-text">Scroll</span>
          <span className="text-lg leading-none">↓</span>
        </div>
      </div>
    </section>
  );
}
