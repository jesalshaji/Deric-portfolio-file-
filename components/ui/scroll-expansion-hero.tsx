"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

interface ScrollExpandRevealProps {
  /** Content shown inside the centered card that expands on scroll. */
  card: ReactNode;
  /** Content revealed underneath once the card has expanded and faded away. */
  children: ReactNode;
  id?: string;
  className?: string;
  /** Resting (pre-expansion) card size in px. Width is capped to 86vw. */
  cardWidth?: number;
  cardHeight?: number;
  /** Scroll distance the pinned expansion lasts, as a % of viewport height. */
  scrollLength?: number;
  refreshPriority?: number;
  /**
   * Add the reveal animation of the underlying content to the shared
   * scrubbed timeline. `at` is the timeline position where the card starts
   * fading out.
   */
  onReveal?: (tl: gsap.core.Timeline, at: number) => void;
}

/**
 * Pinned scroll-expansion: a card sits centered, grows on scroll until it
 * fills the viewport, then dissolves to reveal the content beneath.
 * Scroll-scrubbed with ScrollTrigger so it cooperates with Lenis (no
 * wheel/touch hijacking).
 */
export function ScrollExpandReveal({
  card,
  children,
  id,
  className = "",
  cardWidth = 386,
  cardHeight = 456,
  scrollLength = 260,
  refreshPriority,
  onReveal,
}: ScrollExpandRevealProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const stage = stageRef.current;
      const cardEl = cardRef.current;
      const inner = innerRef.current;
      if (!section || !stage || !cardEl || !inner) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: `+=${scrollLength}%`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            refreshPriority,
          },
        });

        // 0 → 1: card grows from its resting size to the full viewport
        tl.fromTo(
          cardEl,
          { borderRadius: 28 },
          {
            width: () => stage.clientWidth,
            height: () => stage.clientHeight,
            borderRadius: 0,
            ease: "power2.inOut",
            duration: 1,
          },
          0
        );
        tl.fromTo(
          inner,
          { scale: 1 },
          { scale: 1.9, ease: "power2.inOut", duration: 1 },
          0
        );

        // 1.25 → 2.05: card dissolves, revealing the content underneath
        const fadeAt = 1.25;
        tl.to(stage, { opacity: 0, duration: 0.8, ease: "power1.inOut" }, fadeAt);
        tl.to(inner, { scale: 2.4, duration: 0.8, ease: "power1.in" }, fadeAt);

        onReveal?.(tl, fadeAt + 0.2);

        // pad the end so the revealed content rests for a beat before unpin
        tl.to({}, { duration: 0.35 });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(stage, { display: "none" });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`relative h-screen overflow-hidden ${className}`}
    >
      {children}

      <div
        ref={stageRef}
        className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-void"
      >
        <div
          ref={cardRef}
          className="relative flex items-center justify-center overflow-hidden rounded-[28px] border border-white/10 bg-[#0a0506]"
          style={{
            width: `min(86vw, ${cardWidth}px)`,
            height: `min(80vh, ${cardHeight}px)`,
          }}
        >
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 30% 70%, rgba(213,42,47,0.22), transparent 60%)",
            }}
          />
          {/* fixed at the resting card size so the content scales from the centre instead of stretching with the growing card */}
          <div
            ref={innerRef}
            className="relative shrink-0 will-change-transform"
            style={{
              width: `min(86vw, ${cardWidth}px)`,
              height: `min(80vh, ${cardHeight}px)`,
            }}
          >
            {card}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ScrollExpandReveal;
