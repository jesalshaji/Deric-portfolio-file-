"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { REFRESH_PRIORITY } from "@/lib/refreshPriority";
import { projects } from "@/data/content";
import { ProjectCard } from "./ProjectCard";

export function ProjectsSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const outerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const hintRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const headingLineRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useGSAP(
    () => {
      gsap.fromTo(headingLineRefs.current, { yPercent: 100, y: 0 }, {
        yPercent: 0,
        y: 0,
        duration: 0.9,
        ease: "power4.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
          refreshPriority: REFRESH_PRIORITY.projects,
        },
      });

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const track = trackRef.current;
        if (!track) return;

        const getDistance = () => track.scrollWidth - window.innerWidth;
        const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
        const scaleSetters = cards.map((el) => gsap.quickTo(el, "scale", { duration: 0.4, ease: "power2.out" }));

        const tween = gsap.to(track, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: outerRef.current,
            start: "top top",
            end: () => `+=${getDistance() + window.innerHeight * 0.4}`,
            scrub: 0.5,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            refreshPriority: REFRESH_PRIORITY.projects,
            onUpdate: (self) => {
              gsap.to(hintRef.current, { opacity: self.progress > 0.03 ? 0 : 1, duration: 0.3, overwrite: true });

              const centerX = window.innerWidth / 2;
              const trackX = gsap.getProperty(track, "x") as number;
              let closest = 0;
              let closestDist = Infinity;
              cards.forEach((card, i) => {
                const cardCenter = card.offsetLeft + card.offsetWidth / 2 + trackX;
                const dist = Math.abs(cardCenter - centerX);
                if (dist < closestDist) {
                  closestDist = dist;
                  closest = i;
                }
              });
              cards.forEach((_, i) => scaleSetters[i](i === closest ? 1.04 : 1));
            },
          },
        });

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section id="projects" ref={sectionRef} className="relative bg-void">
      <div
        ref={outerRef}
        className="relative h-[80vh] overflow-x-auto overflow-y-hidden sm:h-screen md:overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between px-6 pt-10 sm:px-10 sm:pt-14 lg:px-14">
          <div>
            <p className="label-text overflow-hidden text-cream/50">
              <span
                ref={(el) => {
                  headingLineRefs.current[0] = el;
                }}
                className="block"
              >
                / Selected Work
              </span>
            </p>
            <h2 className="mt-2 text-[clamp(2.5rem,7vw,5rem)] font-black uppercase leading-[0.9] tracking-tight">
              <span className="block overflow-hidden">
                <span
                  ref={(el) => {
                    headingLineRefs.current[1] = el;
                  }}
                  className="block text-cream"
                >
                  Featured
                </span>
              </span>
              <span className="block overflow-hidden">
                <span
                  ref={(el) => {
                    headingLineRefs.current[2] = el;
                  }}
                  className="block text-crimson"
                >
                  Projects
                </span>
              </span>
            </h2>
          </div>
        </div>

        <div
          ref={trackRef}
          // top padding reserves the heading's height so the cards start below it instead of running underneath
          style={{
            paddingTop: "calc(clamp(2.5rem, 7vw, 5rem) * 1.8 + 7.5rem)",
            paddingBottom: "4rem",
          }}
          className="flex h-full w-max snap-x snap-mandatory items-stretch gap-6 px-6 will-change-transform sm:gap-8 sm:px-10 md:snap-none lg:px-14"
        >
          {projects.map((project, i) => (
            <div
              key={project.slug}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="h-full snap-center"
            >
              <ProjectCard project={project} />
            </div>
          ))}
          <div className="w-[4vw] shrink-0 md:w-[6vw]" aria-hidden />
        </div>

        <div
          ref={hintRef}
          className="pointer-events-none absolute bottom-8 right-6 hidden items-center gap-2 text-cream/40 sm:right-10 md:flex lg:right-14"
        >
          <span className="label-text">Scroll / Drag</span>
          <span>→</span>
        </div>
      </div>
    </section>
  );
}
