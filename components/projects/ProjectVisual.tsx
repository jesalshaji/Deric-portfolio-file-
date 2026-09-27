"use client";

import { useState } from "react";
import Image from "next/image";
import { Lock, Sparkles, Globe, Terminal, ShoppingBag, Leaf, ExternalLink } from "lucide-react";

interface ProjectMockupConfig {
  domain: string;
  badge: string;
  headline: string;
  metric1: { label: string; value: string };
  metric2: { label: string; value: string };
  gradient: string;
  icon: React.ReactNode;
}

const mockupData: Record<string, ProjectMockupConfig> = {
  emma: {
    domain: "emma-agent.ai/live",
    badge: "AI Voice Pipeline",
    headline: "Autonomous Business Receptionist",
    metric1: { label: "Voice Latency", value: "280ms" },
    metric2: { label: "Availability", value: "24/7 Live" },
    gradient: "from-[#240305] via-[#120204] to-[#050505]",
    icon: <Sparkles className="h-4 w-4 text-crimson" />,
  },
  "cruzz-nexus": {
    domain: "cruzz-nexus.app/cluster",
    badge: "Discord Automation",
    headline: "Enterprise Community Automation Bot",
    metric1: { label: "Guild Members", value: "14,800+" },
    metric2: { label: "Uptime SLA", value: "99.98%" },
    gradient: "from-[#1a0826] via-[#100318] to-[#050505]",
    icon: <Terminal className="h-4 w-4 text-[#a855f7]" />,
  },
  findflex: {
    domain: "findflex-shopping.store",
    badge: "E-Commerce System",
    headline: "High-Conversion Modular Storefront",
    metric1: { label: "Conversion Lift", value: "+34.2%" },
    metric2: { label: "AOV Growth", value: "$84.50" },
    gradient: "from-[#081e18] via-[#05130f] to-[#050505]",
    icon: <ShoppingBag className="h-4 w-4 text-[#10b981]" />,
  },
  ecolearn: {
    domain: "ecolearn.earth/modules",
    badge: "AI Climate EdTech",
    headline: "Interactive Environmental Curriculum",
    metric1: { label: "Active Students", value: "8,200+" },
    metric2: { label: "AI Scenarios", value: "48 Topics" },
    gradient: "from-[#061a24] via-[#030e16] to-[#050505]",
    icon: <Leaf className="h-4 w-4 text-[#06b6d4]" />,
  },
};

export function ProjectVisual({
  src,
  alt,
  slug,
  number,
}: {
  src?: string;
  alt: string;
  slug: string;
  number: string;
}) {
  const [errored, setErrored] = useState(false);
  const mockup = mockupData[slug] ?? mockupData.emma;

  if (src && !errored) {
    return (
      <div className="relative h-full w-full overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 42vw, 85vw"
          className="object-cover object-center filter contrast-[1.05]"
          onError={() => setErrored(true)}
        />
        {/* Subtle browser mockup top-overlay */}
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between border-b border-white/10 bg-black/40 px-4 py-2.5 backdrop-blur-md">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#ff5f56]/80" />
            <span className="h-2 w-2 rounded-full bg-[#ffbd2e]/80" />
            <span className="h-2 w-2 rounded-full bg-[#27c93f]/80" />
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-0.5 font-mono text-[9px] text-cream/70">
            <Lock className="h-2.5 w-2.5 text-crimson" />
            <span>{mockup.domain}</span>
          </div>
          <span className="font-mono text-[9px] text-cream/40">{number}</span>
        </div>
      </div>
    );
  }

  // High-fidelity Browser-Frame Device Mockup Placeholder
  return (
    <div className={`relative flex h-full w-full flex-col justify-between overflow-hidden bg-gradient-to-br ${mockup.gradient} p-5 sm:p-7`}>
      {/* Background radial atmosphere */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, rgba(213,42,47,0.3), transparent 45%), radial-gradient(circle at 85% 80%, rgba(143,17,24,0.35), transparent 50%)",
        }}
      />

      {/* Grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(#f2f0eb 1px, transparent 1px), linear-gradient(90deg, #f2f0eb 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Browser Chrome Window Header */}
      <div className="relative z-10 flex items-center justify-between rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 backdrop-blur-md shadow-lg">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
        </div>

        <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-0.5 font-mono text-[10px] text-cream/80">
          <Lock className="h-2.5 w-2.5 text-crimson" />
          <span>https://{mockup.domain}</span>
        </div>

        <span className="font-mono text-[10px] font-semibold text-cream/40">{number}</span>
      </div>

      {/* Center Simulated App UI Mockup */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center">
        {/* Project Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 backdrop-blur-md">
          {mockup.icon}
          <span className="font-mono text-[10px] uppercase tracking-widest text-cream/90 font-medium">
            {mockup.badge}
          </span>
        </div>

        <h4 className="mt-4 max-w-sm text-lg sm:text-2xl font-black uppercase tracking-tight text-white">
          {mockup.headline}
        </h4>

        {/* Live Metrics Cards inside mockup */}
        <div className="mt-6 grid w-full max-w-xs grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-left backdrop-blur-sm">
            <span className="block text-[9px] font-mono uppercase tracking-wider text-cream/40">
              {mockup.metric1.label}
            </span>
            <span className="mt-1 block text-base font-extrabold text-white">
              {mockup.metric1.value}
            </span>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-left backdrop-blur-sm">
            <span className="block text-[9px] font-mono uppercase tracking-wider text-cream/40">
              {mockup.metric2.label}
            </span>
            <span className="mt-1 block text-base font-extrabold text-crimson">
              {mockup.metric2.value}
            </span>
          </div>
        </div>

        {/* Live Audio / Activity Waveform Bars */}
        <div className="mt-6 flex items-center gap-1">
          {[4, 12, 8, 16, 24, 14, 28, 18, 10, 22, 12, 6, 18, 26, 14, 8].map((h, i) => (
            <span
              key={i}
              className="w-1 rounded-full bg-crimson/70 transition-all duration-300"
              style={{ height: `${h}px` }}
            />
          ))}
        </div>
      </div>

      {/* Bottom Footer Notice */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-crimson animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-cream/70">
            Preview Coming Soon
          </span>
        </div>
        <span className="font-mono text-[10px] text-cream/40 uppercase tracking-widest">
          Interactive Case Study ↓
        </span>
      </div>
    </div>
  );
}

export default ProjectVisual;
