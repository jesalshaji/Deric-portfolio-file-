"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { REFRESH_PRIORITY } from "@/lib/refreshPriority";
import { caseStudy } from "@/data/content";
import { ProjectVisual } from "@/components/projects/ProjectVisual";

const pillars = [caseStudy.problem, caseStudy.process, caseStudy.result];

export function CaseStudySection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const imageWrapRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      gsap.from("[data-cs-fade]", {
        opacity: 0,
        y: 30,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
          toggleActions: "play none none reverse",
          refreshPriority: REFRESH_PRIORITY.caseStudy,
        },
      });

      gsap.from("[data-cs-card]", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: "[data-cs-cards]",
          start: "top 78%",
          toggleActions: "play none none reverse",
          refreshPriority: REFRESH_PRIORITY.caseStudy,
        },
      });

      gsap.fromTo(
        imageWrapRef.current,
        { clipPath: "inset(12% 12% 12% 12% round 24px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 24px)",
          ease: "none",
          scrollTrigger: {
            trigger: imageWrapRef.current,
            start: "top 90%",
            end: "top 30%",
            scrub: true,
            refreshPriority: REFRESH_PRIORITY.caseStudy,
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative bg-cream px-6 py-32 text-maroon sm:px-10 sm:py-40 lg:px-14">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex items-start justify-between">
          <p data-cs-fade className="label-text text-maroon/50">
            Case Study
          </p>
          <p data-cs-fade className="font-mono text-sm text-maroon/40">
            01
          </p>
        </div>

        <h2
          data-cs-fade
          className="mt-6 max-w-3xl text-[clamp(2.25rem,6vw,4.5rem)] font-black uppercase leading-[0.95] tracking-tight"
        >
          From Idea To
          <br />
          <span className="text-crimson">Real Impact.</span>
        </h2>

        <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div
            ref={imageWrapRef}
            className="relative h-[26rem] overflow-hidden rounded-3xl bg-void sm:h-[32rem]"
          >
            <ProjectVisual src={undefined} alt="EMMA AI voice agent" slug="emma" number="01" />
          </div>

          <div>
            <p data-cs-fade className="label-text text-crimson">
              {caseStudy.subtitle}
            </p>
            <h3 data-cs-fade className="mt-2 text-5xl font-black uppercase tracking-tight sm:text-6xl">
              {caseStudy.title}
            </h3>
            <p data-cs-fade className="mt-5 max-w-md text-base leading-relaxed text-maroon/70">
              {caseStudy.description}
            </p>

            <div data-cs-fade className="mt-8 flex flex-wrap gap-2">
              {caseStudy.tech.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-maroon/20 px-3 py-1 text-[0.7rem] uppercase tracking-wide text-maroon/60"
                >
                  {tech}
                </span>
              ))}
            </div>

            <a
              data-cs-fade
              href="#"
              className="mt-9 inline-flex items-center gap-2 rounded-full bg-maroon px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-crimson"
            >
              View Case Study
              <span>→</span>
            </a>
          </div>
        </div>

        <div data-cs-cards className="mt-20 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              data-cs-card
              className="rounded-2xl border border-maroon/12 bg-maroon/[0.03] p-7"
            >
              <p className="label-text text-crimson">{pillar.title}</p>
              <p className="mt-3 text-sm leading-relaxed text-maroon/70">{pillar.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 border-t border-maroon/12 pt-10 sm:grid-cols-3">
          {caseStudy.stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl font-black tracking-tight text-crimson sm:text-5xl">
                {stat.value}
              </p>
              <p className="label-text mt-2 text-maroon/50">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
