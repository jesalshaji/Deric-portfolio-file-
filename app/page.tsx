import { Navigation } from "@/components/layout/Navigation";
import { Hero } from "@/components/hero/Hero";
import { IntroSection } from "@/components/intro/IntroSection";
import { ExpertiseSection } from "@/components/expertise/ExpertiseSection";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import { CaseStudySection } from "@/components/case-study/CaseStudySection";
import { MoreProjectsSection } from "@/components/more-projects/MoreProjectsSection";
import { AboutSection } from "@/components/about/AboutSection";
import { ContactSection } from "@/components/contact/ContactSection";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <IntroSection />
        <ExpertiseSection />
        <ProjectsSection />
        <CaseStudySection />
        <MoreProjectsSection />
        <AboutSection />
        <ContactSection />
      </main>
    </>
  );
}
