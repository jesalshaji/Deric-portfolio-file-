"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export function HeroPreloader({ progress, done }: { progress: number; done: boolean }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      gsap.to(barRef.current, {
        scaleX: progress / 100,
        duration: 0.4,
        ease: "power2.out",
      });
    },
    { dependencies: [progress], scope: rootRef }
  );

  useGSAP(
    () => {
      if (!done) return;
      gsap.to(rootRef.current, {
        yPercent: -100,
        duration: 0.9,
        ease: "power4.inOut",
        delay: 0.2,
      });
    },
    { dependencies: [done], scope: rootRef }
  );

  return (
    <div
      ref={rootRef}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-void ${
        done ? "pointer-events-none" : ""
      }`}
      aria-hidden={done}
    >
      <div className="flex flex-col items-center gap-6">
        <span className="label-text text-cream/50">Loading Experience</span>
        <div className="h-px w-48 overflow-hidden bg-cream/15 sm:w-64">
          <div
            ref={barRef}
            className="h-full w-full origin-left scale-x-0 bg-crimson"
          />
        </div>
        <span className="font-mono text-xs tabular-nums text-cream/40">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
}
