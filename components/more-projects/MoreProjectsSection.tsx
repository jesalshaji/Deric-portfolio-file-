"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { REFRESH_PRIORITY } from "@/lib/refreshPriority";
import { moreProjects } from "@/data/content";
import { ProjectVisual } from "@/components/projects/ProjectVisual";

export function MoreProjectsSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      gsap.fromTo(".more-heading-line", { yPercent: 100, y: 0 }, {
        yPercent: 0,
        y: 0,
        duration: 0.9,
        ease: "power4.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
          refreshPriority: REFRESH_PRIORITY.moreProjects,
        },
      });

      const rows = gsap.utils.toArray<HTMLElement>("[data-more-row]");
      rows.forEach((row) => {
        const visual = row.querySelector("[data-more-visual]");
        const text = row.querySelector("[data-more-text]");

        gsap.fromTo(
          visual,
          { clipPath: "inset(0% 0% 100% 0% round 28px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 28px)",
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: row,
              start: "top 78%",
              toggleActions: "play none none reverse",
              refreshPriority: REFRESH_PRIORITY.moreProjects,
            },
          }
        );

        gsap.from(text, {
          opacity: 0,
          x: 30,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.15,
          scrollTrigger: {
            trigger: row,
            start: "top 78%",
            toggleActions: "play none none reverse",
            refreshPriority: REFRESH_PRIORITY.moreProjects,
          },
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section id="more-projects" ref={sectionRef} className="relative bg-void px-6 py-32 sm:px-10 sm:py-40 lg:px-14">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-20 overflow-hidden">
          <h2 className="text-[clamp(2.5rem,8vw,6rem)] font-black uppercase leading-[0.9] tracking-tight">
            <span className="block overflow-hidden">
              <span className="more-heading-line block text-cream">More</span>
            </span>
            <span className="block overflow-hidden">
              <span className="more-heading-line block text-crimson">Projects</span>
            </span>
          </h2>
        </div>

        <div className="flex flex-col gap-24 sm:gap-32">
          {moreProjects.map((project, i) => (
            <div
              key={project.slug}
              data-more-row
              className={`flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-16 ${
                i % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div
                data-more-visual
                className="relative h-[22rem] w-full overflow-hidden rounded-[1.75rem] sm:h-[28rem] lg:h-[30rem] lg:w-[58%]"
              >
                <ProjectVisual
                  src={project.image}
                  alt={project.title}
                  slug={project.slug}
                  number={project.number}
                />
              </div>

              <div data-more-text className="lg:w-[42%]">
                <span className="font-mono text-sm text-cream/30">{project.number}</span>
                <h3 className="mt-3 text-4xl font-black uppercase leading-[0.95] tracking-tight text-cream sm:text-5xl">
                  {project.title}
                </h3>
                <p className="label-text mt-3 text-crimson">{project.category}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-cream/15 px-3 py-1 text-[0.65rem] uppercase tracking-wide text-cream/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  href="#"
                  className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-cream transition-colors hover:text-crimson"
                >
                  View Project
                  <span>→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
