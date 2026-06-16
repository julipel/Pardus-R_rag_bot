import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/sections/Hero";
import { ExpertiseSection } from "@/components/sections/ExpertiseSection";
import { AnalysisSection } from "@/components/sections/AnalysisSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { CommercialSection } from "@/components/sections/CommercialSection";
import { EvolutionSection } from "@/components/sections/EvolutionSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { ContactSection } from "@/components/sections/ContactSection";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ExpertiseSection />
        <AnalysisSection />
        <ProjectsSection />
        <CommercialSection />
        <EvolutionSection />
        <ProcessSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
