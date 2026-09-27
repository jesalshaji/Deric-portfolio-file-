/**
 * ScrollTrigger refreshes in creation order unless refreshPriority is set —
 * and Hero's pin is created asynchronously (after the frame preload
 * resolves), well after every later section has already registered its
 * triggers. Without an explicit page-order priority, refresh() measures
 * sections using Hero's stale (pre-pin) height, leaving every trigger below
 * it permanently offset. Lower runs first; order matches page order top to
 * bottom.
 */
export const REFRESH_PRIORITY = {
  hero: 0,
  intro: 10,
  expertise: 20,
  projects: 30,
  caseStudy: 40,
  moreProjects: 50,
  about: 60,
  contact: 70,
} as const;
