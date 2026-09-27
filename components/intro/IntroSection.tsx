"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { REFRESH_PRIORITY } from "@/lib/refreshPriority";

const lines = ["I Design &", "Build Digital", "Experiences"];

export function IntroSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const lineRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useGSAP(
    () => {
      gsap.fromTo(lineRefs.current, { yPercent: 100, y: 0 }, {
        yPercent: 0,
        y: 0,
        duration: 0.9,
        ease: "power4.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
          refreshPriority: REFRESH_PRIORITY.intro,
        },
      });

      gsap.from("[data-intro-fade]", {
        opacity: 0,
        y: 24,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 55%",
          toggleActions: "play none none reverse",
          refreshPriority: REFRESH_PRIORITY.intro,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative bg-cream px-6 py-32 text-maroon sm:px-10 sm:py-40 lg:px-14"
    >
      <div className="mx-auto flex max-w-[1600px] flex-col gap-16 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p data-intro-fade className="label-text mb-8 text-maroon/50">
            01 / About the Work
          </p>
          <h2 className="max-w-3xl text-[clamp(2.5rem,7vw,5.5rem)] font-black uppercase leading-[0.95] tracking-tight">
            {lines.map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <span
                  ref={(el) => {
                    lineRefs.current[i] = el;
                  }}
                  className="block"
                >
                  {line}
                </span>
              </span>
            ))}
            <span className="block overflow-hidden">
              <span
                ref={(el) => {
                  lineRefs.current[lines.length] = el;
                }}
                className="block"
              >
                That Feel <span className="text-crimson">Alive.</span>
              </span>
            </span>
          </h2>
        </div>

        <p data-intro-fade className="max-w-sm text-base leading-relaxed text-maroon/70 sm:text-lg lg:mb-3">
          I&rsquo;m a full-stack developer and AI enthusiast building modern web
          experiences, intelligent products and creative solutions that make
          an impact.
        </p>
      </div>
    </section>
  );
}
