"use client";

import { siteMeta } from "@/data/content";
import { useLenis } from "./SmoothScrollProvider";

export function Footer() {
  const lenisRef = useLenis();

  const backToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.querySelector("#top");
    if (!el) return;
    const lenis = lenisRef.current;
    if (lenis) lenis.scrollTo(el as HTMLElement, { duration: 1.6 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative mx-auto flex w-full max-w-[1600px] items-center justify-between border-t border-cream/10 py-8 text-xs text-cream/40">
      <span>
        © {siteMeta.year} Designed &amp; Developed by {siteMeta.name}
      </span>
      <a href="#top" onClick={backToTop} className="flex items-center gap-2 transition-colors hover:text-crimson">
        Back to Top
        <span>↑</span>
      </a>
    </div>
  );
}
