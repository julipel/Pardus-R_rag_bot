import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/sections/Hero";
import { AnalysisSection } from "@/components/sections/AnalysisSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { CommercialSection } from "@/components/sections/CommercialSection";
import { ContactSection } from "@/components/sections/ContactSection";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <AnalysisSection />
        <ProjectsSection />
        <CommercialSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
