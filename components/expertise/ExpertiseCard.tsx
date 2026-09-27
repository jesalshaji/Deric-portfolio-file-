import type { expertise } from "@/data/content";

type Item = (typeof expertise)[number];

export function ExpertiseCard({ item }: { item: Item }) {
  return (
    <div className="group relative flex min-h-[22rem] flex-col justify-between overflow-hidden rounded-3xl border border-cream/12 bg-gradient-to-b from-white/[0.04] to-white/0 p-8 transition-all duration-500 hover:border-crimson/60 hover:bg-crimson/[0.06] sm:p-10">
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-crimson/0 blur-3xl transition-all duration-700 group-hover:bg-crimson/25"
        aria-hidden
      />

      <div className="relative flex items-start justify-between">
        <span className="font-mono text-sm text-cream/40">{item.number}</span>
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 text-cream transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:border-crimson group-hover:text-crimson">
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

      <div className="relative">
        <h3 className="text-3xl font-black uppercase leading-[0.95] tracking-tight text-cream sm:text-4xl">
          {item.title.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h3>
        <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/55">
          {item.description}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-cream/15 px-3 py-1 text-[0.65rem] uppercase tracking-wide text-cream/50"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
