import type { projects } from "@/data/content";
import { ProjectVisual } from "./ProjectVisual";

type Project = (typeof projects)[number];

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group relative flex h-full w-[85vw] shrink-0 flex-col overflow-hidden rounded-[2rem] border border-cream/10 bg-maroon transition-transform duration-500 sm:w-[60vw] lg:w-[42vw]">
      <div className="relative flex-1 overflow-hidden">
        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
          <ProjectVisual
            src={project.image}
            alt={project.title}
            slug={project.slug}
            number={project.number}
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-void/10 to-transparent" />
      </div>

      <div className="relative flex items-end justify-between gap-4 p-6 sm:p-8">
        <div>
          <p className="label-text text-crimson">{project.category}</p>
          <h3 className="mt-2 text-3xl font-black uppercase leading-none tracking-tight text-cream sm:text-4xl">
            {project.title}
          </h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-cream/15 px-3 py-1 text-[0.65rem] uppercase tracking-wide text-cream/50"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-cream/25 text-cream transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:border-crimson group-hover:text-crimson">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 13L13 3M13 3H5M13 3V11"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </article>
  );
}
