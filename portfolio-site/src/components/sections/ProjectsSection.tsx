"use client";

import { useMemo, useState } from "react";
import { projects, type ProjectCategory } from "@/data/projects";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

const filters: { id: "all" | ProjectCategory | "commercial"; label: string }[] =
  [
    { id: "all", label: "Все" },
    { id: "commercial", label: "B2B" },
    { id: "rag", label: "RAG" },
    { id: "support", label: "Support" },
    { id: "content", label: "Content" },
    { id: "automation", label: "Automation" },
    { id: "learning", label: "Learning" },
  ];

export function ProjectsSection() {
  const [active, setActive] = useState<(typeof filters)[number]["id"]>("all");

  const filtered = useMemo(() => {
    if (active === "all") return projects;
    if (active === "commercial") return projects.filter((p) => p.commercial);
    return projects.filter((p) => p.category === active);
  }, [active]);

  return (
    <section id="projects" className="scroll-mt-24 border-t border-zinc-800/60 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Projects"
          title="Проекты"
          description="От production RAG до n8n-автоматизаций — отфильтруйте по типу или коммерческому потенциалу."
        />

        <div className="mt-10 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActive(f.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                active === f.id
                  ? "bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-500/40"
                  : "bg-zinc-900 text-zinc-400 ring-1 ring-zinc-800 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
