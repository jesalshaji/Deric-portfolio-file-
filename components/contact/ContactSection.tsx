"use client";

import { REFRESH_PRIORITY } from "@/lib/refreshPriority";
import { socialLinks } from "@/data/content";
import { Footer } from "@/components/layout/Footer";
import { useContactModal } from "@/components/contact/ContactModal";
import { ScrollExpandReveal } from "@/components/ui/scroll-expansion-hero";

function QuoteCard() {
  return (
    <div className="flex h-full w-full flex-col justify-between p-8 sm:p-10">
      <span className="font-serif text-5xl leading-none text-cream/30">&ldquo;</span>

      <div className="font-sans text-[clamp(1.9rem,3.4vw,2.6rem)] font-black uppercase leading-[1.05] tracking-tight text-white/95">
        <p>GOOD</p>
        <p>IDEAS</p>
        <p>DESERVE</p>
        <p className="text-crimson drop-shadow-[0_0_20px_rgba(213,42,47,0.45)]">GREAT</p>
        <p className="text-crimson drop-shadow-[0_0_20px_rgba(213,42,47,0.45)]">EXECUTION.</p>
      </div>

      <div className="border-t border-white/10 pt-4 font-mono text-[10px] uppercase tracking-widest text-cream/40">
        — DERIC ANDREWS
      </div>
    </div>
  );
}

export function ContactSection() {
  const { openContact } = useContactModal();

  return (
    <ScrollExpandReveal
      id="contact"
      className="flex flex-col justify-between bg-void px-6 pt-32 sm:px-10 lg:px-14"
      card={<QuoteCard />}
      refreshPriority={REFRESH_PRIORITY.contact}
      onReveal={(tl, at) => {
        tl.fromTo(
          "[data-contact-glow]",
          { scale: 0.8, opacity: 0 },
          { scale: 1.1, opacity: 0.9, duration: 1.2, ease: "power2.out" },
          at
        );
        tl.fromTo(
          "[data-contact-watermark]",
          { opacity: 0, scale: 0.92 },
          { opacity: 1, scale: 1, duration: 1.1, ease: "power2.out" },
          at
        );
        tl.fromTo(
          ".contact-line",
          { yPercent: 100 },
          { yPercent: 0, duration: 0.7, ease: "power4.out", stagger: 0.08 },
          at + 0.25
        );
        tl.fromTo(
          "[data-contact-fade]",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.08 },
          at + 0.4
        );
      }}
    >
      <div
        data-contact-glow
        aria-hidden
        className="pointer-events-none absolute bottom-[-35vw] left-1/2 h-[70vw] w-[70vw] -translate-x-1/2 rounded-full opacity-60 sm:bottom-[-30vw] sm:h-[55vw] sm:w-[55vw]"
        style={{
          background:
            "radial-gradient(circle at 50% 35%, rgba(213,42,47,0.55), rgba(143,17,24,0.35) 45%, rgba(16,0,0,0.15) 65%, transparent 75%)",
          boxShadow: "0 0 200px 80px rgba(213,42,47,0.15)",
        }}
      />

      {/* Big centered "CONTACT" — faint watermark that doubles as the main CTA */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
        <button
          type="button"
          data-contact-watermark
          onClick={openContact}
          aria-label="Open the contact form"
          className="group pointer-events-auto relative cursor-pointer select-none rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-crimson"
        >
          <span className="block whitespace-nowrap text-[17.5vw] font-black uppercase leading-none tracking-tighter text-white/[0.07] transition-colors duration-500 group-hover:text-white/[0.16] group-focus-visible:text-white/[0.16]">
            Contact
          </span>
          <span className="absolute right-[1.5%] top-full mt-3 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.3em] text-white/35 transition-colors duration-500 group-hover:text-white/80 sm:text-xs">
            Click to get in touch ↗
          </span>
        </button>
      </div>

      {/* pointer-events-none lets clicks fall through the headline to the watermark; the buttons/links below opt back in */}
      <div className="pointer-events-none relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-center">
        <p data-contact-fade className="label-text text-cream/50">
          / Let&rsquo;s Talk
        </p>

        <h2 className="mt-6 text-[clamp(3rem,12vw,9rem)] font-black uppercase leading-[0.85] tracking-tight">
          <span className="block overflow-hidden">
            <span className="contact-line block text-cream">Have An</span>
          </span>
          <span className="block overflow-hidden">
            <span className="contact-line block text-cream">Idea?</span>
          </span>
          <span className="block overflow-hidden">
            <span className="contact-line block text-crimson">Let&rsquo;s Build</span>
          </span>
          <span className="block overflow-hidden">
            <span className="contact-line block text-cream">It Together.</span>
          </span>
        </h2>

        <div data-contact-fade className="pointer-events-auto mt-12 flex w-fit flex-wrap items-center gap-x-10 gap-y-5">
          <button
            type="button"
            onClick={openContact}
            className="group inline-flex items-center gap-3 rounded-full bg-crimson px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-crimson-deep"
          >
            Start a project
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </button>

          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="label-text text-cream/60 transition-colors hover:text-crimson"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <div className="relative z-10" data-contact-fade>
        <Footer />
      </div>
    </ScrollExpandReveal>
  );
}
