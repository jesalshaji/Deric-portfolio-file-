"use client";

import { useEffect, useState } from "react";
import { navLinks, siteMeta } from "@/data/content";
import { useLenis } from "./SmoothScrollProvider";
import { useContactModal } from "@/components/contact/ContactModal";

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const lenisRef = useLenis();
  const { openContact } = useContactModal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setOpen(false);
    const href = e.currentTarget.getAttribute("href");
    // "Contact" opens the enquiry form instead of scrolling
    if (href === "#contact") {
      openContact();
      return;
    }
    const el = href ? document.querySelector(href) : null;
    if (!el) return;
    const lenis = lenisRef.current;
    if (lenis) lenis.scrollTo(el as HTMLElement, { duration: 1.4 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled ? "bg-void/70 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 sm:px-10 lg:px-14">
        <a
          href="#top"
          onClick={handleNav}
          className="flex items-center gap-2 text-sm font-semibold tracking-tight text-cream"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-cream/25 text-xs">
            R
          </span>
          <span className="hidden sm:inline">{siteMeta.name}</span>
        </a>

        <ul className="hidden items-center gap-9 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={handleNav}
                className="label-text text-cream/70 transition-colors hover:text-crimson"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          onClick={handleNav}
          className="hidden h-10 w-10 items-center justify-center rounded-full border border-cream/25 text-cream transition-colors hover:border-crimson hover:text-crimson md:flex"
          aria-label="Contact"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M1 13L13 1M13 1H4M13 1V10"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/25 text-cream md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span className="relative block h-2.5 w-4">
            <span
              className={`absolute left-0 top-0 h-px w-4 bg-cream transition-transform duration-300 ${
                open ? "translate-y-[5px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute bottom-0 left-0 h-px w-4 bg-cream transition-transform duration-300 ${
                open ? "-translate-y-[5px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </nav>

      <div
        className={`overflow-hidden bg-void/95 backdrop-blur-md transition-[max-height] duration-500 md:hidden ${
          open ? "max-h-72" : "max-h-0"
        }`}
      >
        <ul className="flex flex-col gap-1 px-6 pb-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={handleNav}
                className="block py-3 text-2xl font-semibold tracking-tight text-cream"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
