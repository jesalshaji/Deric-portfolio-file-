"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { REFRESH_PRIORITY } from "@/lib/refreshPriority";
import { expertise } from "@/data/content";
import { ExpertiseCard } from "./ExpertiseCard";

export function ExpertiseSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      gsap.from("[data-expertise-heading]", {
        opacity: 0,
        yPercent: 100,
        duration: 0.9,
        ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
          refreshPriority: REFRESH_PRIORITY.expertise,
        },
      });

      gsap.from("[data-expertise-card]", {
        opacity: 0,
        y: 60,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: "[data-expertise-grid]",
          start: "top 80%",
          toggleActions: "play none none reverse",
          refreshPriority: REFRESH_PRIORITY.expertise,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="expertise"
      ref={sectionRef}
      className="relative bg-void px-6 py-32 sm:px-10 sm:py-40 lg:px-14"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(213,42,47,0.08),_transparent_55%)]" />

      <div className="relative mx-auto max-w-[1600px]">
        <div className="mb-16 flex items-end justify-between gap-6 sm:mb-20">
          <div className="overflow-hidden">
            <h2
              data-expertise-heading
              className="text-[clamp(3rem,10vw,7rem)] font-black uppercase leading-[0.85] tracking-tight text-cream"
            >
              What
              <br />
              I Do
            </h2>
          </div>
          <p className="label-text hidden max-w-[12rem] text-right text-cream/40 sm:block">
            Combining development, design and AI to create powerful digital
            products.
          </p>
        </div>

        <div
          data-expertise-grid
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          {expertise.map((item) => (
            <div data-expertise-card key={item.number}>
              <ExpertiseCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
