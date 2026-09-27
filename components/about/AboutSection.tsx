"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowDown, Play, ArrowUpRight, X } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { REFRESH_PRIORITY } from "@/lib/refreshPriority";
import { IDCardLanyard } from "@/components/ui/id-card-lanyard";

const pillarsCards = [
  {
    num: "01",
    tag: "MY APPROACH",
    title: "Solve real problems.",
    desc: "I focus on building solutions that create actual value for people and businesses.",
    image: "/images/about/midle.png",
    imageAlt: "Martian red terrain approach",
    imagePos: "object-center",
  },
  {
    num: "02",
    tag: "WHAT DRIVES ME",
    title: "Create meaningful products.",
    desc: "I enjoy working on products that combine technology, design and social impact.",
    image: "/images/about/starting.png",
    imageAlt: "Planetary atmosphere drives",
    imagePos: "object-[80%_25%]",
  },
  {
    num: "03",
    tag: "BEYOND CODE",
    title: "Learn. Build. Explore.",
    desc: "I'm always learning, experimenting and exploring new ideas — from AI to creative tech to innovative web experiences.",
    image: "/images/about/end-frame.png",
    imageAlt: "Creative tech exploration",
    imagePos: "object-[center_35%]",
  },
];

export function AboutSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const portraitRef = useRef<HTMLDivElement | null>(null);
  const [showLanyard, setShowLanyard] = useState<boolean>(true);
  const [showVideoModal, setShowVideoModal] = useState<boolean>(false);

  useGSAP(
    () => {
      // Staggered reveal for headline lines
      gsap.fromTo(".about-line", { yPercent: 105, y: 0, opacity: 0 }, {
        yPercent: 0,
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power4.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
          refreshPriority: REFRESH_PRIORITY.about,
        },
      });

      // Fade up elements
      gsap.from("[data-about-fade]", {
        opacity: 0,
        y: 28,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          toggleActions: "play none none reverse",
          refreshPriority: REFRESH_PRIORITY.about,
        },
      });

      // Subtle parallax on the portrait
      if (portraitRef.current) {
        gsap.fromTo(
          portraitRef.current,
          { y: -30, scale: 1.05 },
          {
            y: 40,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
              refreshPriority: REFRESH_PRIORITY.about,
            },
          }
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#050505] text-[#f2f0eb] pt-24 pb-32 sm:pt-32 sm:pb-40"
    >
      {/* Background ambient red planetary glow */}
      <div className="pointer-events-none absolute -top-40 right-1/4 h-[650px] w-[650px] rounded-full bg-[#8f1118]/25 blur-[160px]" />
      <div className="pointer-events-none absolute bottom-10 left-1/3 h-[500px] w-[500px] rounded-full bg-[#240305]/40 blur-[140px]" />

      {/* Main Container */}
      <div className="relative mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-14">
        {/* Top Header Row */}
        <div data-about-fade className="flex flex-wrap items-center justify-between gap-6 border-b border-white/10 pb-8">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold tracking-wider text-crimson">
              [ 06 ]
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.28em] text-cream/80">
              ABOUT ME
            </span>
          </div>

          <div className="flex items-center gap-8 sm:gap-12 font-mono text-[10px] uppercase tracking-widest text-cream/50">
            <div>
              <span className="block text-cream/35 text-[9px]">BASED IN</span>
              <span className="text-cream/90 font-medium">LINZ, AUSTRIA</span>
            </div>
            <div>
              <span className="block text-cream/35 text-[9px]">OPEN TO</span>
              <span className="text-cream/90 font-medium">OPPORTUNITIES</span>
            </div>
          </div>
        </div>

        {/* Hero Section Grid: Left Copy & Right Cinematic Portrait */}
        <div className="relative mt-12 grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Headlines, Bio, Stats, Actions */}
          <div className="z-10 lg:col-span-7">
            <h2 className="text-[clamp(3rem,7.5vw,6.4rem)] font-black uppercase leading-[0.92] tracking-tight text-white">
              <span className="block overflow-hidden">
                <span className="about-line block">MORE THAN</span>
              </span>
              <span className="block overflow-hidden">
                <span className="about-line block text-crimson drop-shadow-[0_0_40px_rgba(213,42,47,0.55)]">
                  JUST CODE.
                </span>
              </span>
            </h2>

            <p
              data-about-fade
              className="mt-8 max-w-xl text-base leading-relaxed text-cream/75 sm:text-lg font-light"
            >
              I&rsquo;m a developer, problem solver and creative thinker. I build
              products that combine technology, design and real-world impact. I love
              turning ideas into experiences that people actually use and enjoy.
            </p>

            {/* Stats Row */}
            <div
              data-about-fade
              className="mt-12 flex flex-wrap items-center gap-8 sm:gap-14 border-y border-white/10 py-7"
            >
              <div>
                <p className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl font-sans">
                  08+
                </p>
                <p className="mt-2 text-[10px] font-mono uppercase tracking-[0.2em] text-cream/50">
                  PROJECTS COMPLETED
                </p>
              </div>

              <div className="hidden h-10 w-px bg-white/10 sm:block" />

              <div>
                <p className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl font-sans">
                  4+
                </p>
                <p className="mt-2 text-[10px] font-mono uppercase tracking-[0.2em] text-cream/50">
                  YEARS EXPERIENCE
                </p>
              </div>

              <div className="hidden h-10 w-px bg-white/10 sm:block" />

              <div>
                <p className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl font-sans">
                  AI
                </p>
                <p className="mt-2 text-[10px] font-mono uppercase tracking-[0.2em] text-cream/50">
                  ENTHUSIAST
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div data-about-fade className="mt-10 flex flex-wrap items-center gap-5 sm:gap-7">
              {/* My Resume Button */}
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-7 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-cream backdrop-blur-md transition-all duration-300 hover:border-crimson hover:bg-crimson/15 hover:text-white"
              >
                <span>MY RESUME</span>
                <ArrowDown className="h-3.5 w-3.5 text-crimson transition-transform duration-300 group-hover:translate-y-0.5" />
              </a>

              {/* Watch My Story Button */}
              <button
                type="button"
                onClick={() => setShowVideoModal(true)}
                className="group inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-cream/80 transition-colors hover:text-white"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 transition-all duration-300 group-hover:border-crimson group-hover:bg-crimson group-hover:text-white">
                  <Play className="h-3.5 w-3.5 translate-x-0.5 fill-current" />
                </span>
                <span>WATCH MY STORY</span>
                <span className="h-px w-10 bg-white/20 transition-all duration-300 group-hover:w-16 group-hover:bg-crimson" />
              </button>

              {/* Interactive ID Card Pass Toggle */}
              <button
                type="button"
                onClick={() => setShowLanyard((prev) => !prev)}
                className="inline-flex items-center gap-2.5 rounded-full border border-crimson/40 bg-[#160305]/70 px-5 py-2.5 text-xs font-mono tracking-wider text-cream/90 backdrop-blur-md transition-all duration-300 hover:border-crimson hover:bg-crimson/20"
              >
                <span
                  className={`h-2 w-2 rounded-full transition-colors ${
                    showLanyard ? "bg-crimson shadow-[0_0_8px_#d52a2f]" : "bg-cream/40"
                  }`}
                />
                <span>{showLanyard ? "HIDE ID PASS" : "SHOW ID PASS"}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Cinematic Portrait of Deric with Martian Backdrop & Floating Badge */}
          <div className="relative lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[540px]">
              {/* Portrait Container */}
              <div
                ref={portraitRef}
                className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.8)]"
              >
                <Image
                  src="/images/about/starting.png"
                  alt="Deric Andrews Portrait"
                  fill
                  priority
                  className="object-cover object-[center_20%] filter contrast-[1.08] brightness-[0.98]"
                  sizes="(max-width: 1024px) 100vw, 540px"
                />

                {/* Cinematic Red Rim-Light & Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-85" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/60 via-transparent to-transparent opacity-70" />
                <div className="absolute -inset-1 rounded-3xl border border-crimson/20 pointer-events-none" />
              </div>

              {/* Floating Glassmorphic Badge: FOCUSED ON BUILDING */}
              <div
                data-about-fade
                className="absolute -bottom-8 -left-4 sm:-left-8 z-20 w-[240px] sm:w-[270px] rounded-2xl border border-white/15 bg-[#0e0204]/80 p-5 sm:p-6 backdrop-blur-xl shadow-[0_25px_50px_rgba(0,0,0,0.85)]"
              >
                <div className="flex items-center justify-between text-[10px] font-mono tracking-wider text-cream/70">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-crimson shadow-[0_0_8px_#d52a2f]" />
                    <span className="font-semibold text-cream/90 tracking-widest text-[9.5px]">
                      FOCUSED ON BUILDING
                    </span>
                  </div>
                  <ArrowUpRight className="h-3.5 w-3.5 text-cream/40" />
                </div>

                <div className="mt-5 space-y-1 font-sans text-lg sm:text-xl font-black uppercase tracking-tight text-white/90">
                  <p className="transition-colors hover:text-crimson">IDEAS</p>
                  <p className="transition-colors hover:text-crimson">PRODUCTS</p>
                  <p className="transition-colors hover:text-crimson">COMMUNITIES</p>
                  <p className="text-crimson drop-shadow-[0_0_15px_rgba(213,42,47,0.4)]">
                    REAL IMPACT
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-4">
                  <div className="flex -space-x-2">
                    <div className="relative h-7 w-7 rounded-full overflow-hidden border border-white/20">
                      <Image
                        src="/images/about/starting.png"
                        alt="Deric"
                        fill
                        sizes="28px"
                        className="object-cover"
                      />
                    </div>
                    <div className="relative h-7 w-7 rounded-full overflow-hidden border border-white/20">
                      <Image
                        src="/images/about/midle.png"
                        alt="Frame"
                        fill
                        sizes="28px"
                        className="object-cover"
                      />
                    </div>
                    <div className="relative h-7 w-7 rounded-full overflow-hidden border border-white/20">
                      <Image
                        src="/images/about/end-frame.png"
                        alt="Frame"
                        fill
                        sizes="28px"
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-cream/60">
                    <b className="block text-xs font-bold text-white">8+</b>
                    <span>PROJECTS COMPLETED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Feature Cards */}
        <div className="mt-28 grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-6">
          {pillarsCards.map((card) => (
            <div
              key={card.num}
              data-about-fade
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#0c0406]/70 p-6 backdrop-blur-md transition-all duration-500 hover:border-crimson/60 hover:bg-[#130508]/85 hover:shadow-[0_12px_40px_rgba(213,42,47,0.2)]"
            >
              <div>
                {/* Header of Card */}
                <div className="flex items-center justify-between text-[11px] font-mono text-cream/50">
                  <span>
                    {card.num} / {card.tag}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-cream/40 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-crimson" />
                </div>

                {/* Visual Thumbnail */}
                <div className="relative mt-5 h-28 w-full overflow-hidden rounded-xl border border-white/10">
                  <Image
                    src={card.image}
                    alt={card.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className={`object-cover ${card.imagePos} transition-transform duration-700 group-hover:scale-110 filter brightness-[0.85] contrast-[1.1]`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0406] via-transparent to-transparent opacity-60" />
                </div>

                {/* Title & Description */}
                <h3 className="mt-5 text-xl font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-crimson">
                  {card.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-cream/65 font-light">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Physics ID Card Lanyard Component (Strictly contained within About Section) */}
      {showLanyard && (
        <IDCardLanyard
          contained={true}
          name="Deric Andrews"
          role="Full-Stack Dev & AI Creator"
          brand="DERIC ANDREWS"
          brandTagline="Creative Technologist"
          pillars={["Creative Code", "AI & Automation", "Real Impact"]}
          location="Linz, Austria"
          idNumber="DA-2026-X08"
          validThru="12/2029"
          site="dericandrews.dev"
          photoUrl="/images/about/starting.png"
          githubUrl="https://github.com"
          linkedinUrl="https://linkedin.com"
          instagramUrl="https://instagram.com"
          anchorX="calc(100% - 140px)"
          anchorY={8}
          zIndex={30}
          showHint={true}
        />
      )}

      {/* Story Video Modal */}
      {showVideoModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-xl"
          onClick={() => setShowVideoModal(false)}
        >
          <div
            className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-crimson/40 bg-[#080203] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-crimson animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-widest text-cream">
                  Deric Andrews — Cinematic Profile
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                className="rounded-full p-1.5 text-cream/60 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black">
              <Image
                src="/images/about/starting.png"
                alt="Story Preview"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-center p-6">
                <p className="font-mono text-xs uppercase tracking-widest text-crimson">
                  Scroll-Driven Digital Creator
                </p>
                <h4 className="mt-2 text-2xl font-black uppercase text-white">
                  Crafting Digital Realities
                </h4>
                <p className="mt-2 max-w-md text-xs text-cream/70">
                  Full experience powered by interactive canvas, scroll scrubbing, and
                  cinematic physics.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default AboutSection;
