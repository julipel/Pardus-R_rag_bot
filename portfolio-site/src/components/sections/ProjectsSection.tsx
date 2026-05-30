"use client";

import { useMemo, useState } from "react";
import { projects, type ProjectCategory, type MaturityLevel } from "@/data/projects";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

type CategoryFilter = "all" | ProjectCategory | "commercial";
type MaturityFilter = "all" | "3+" | "4+" | "5";

const categoryFilters: { id: CategoryFilter; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "commercial", label: "B2B" },
  { id: "rag", label: "RAG" },
  { id: "support", label: "Support" },
  { id: "content", label: "Content" },
  { id: "automation", label: "Automation" },
  { id: "learning", label: "Learning" },
];

const maturityFilters: { id: MaturityFilter; label: string; min: MaturityLevel | 0 }[] = [
  { id: "all", label: "Любая зрелость", min: 0 },
  { id: "3+", label: "3+", min: 3 },
  { id: "4+", label: "4+", min: 4 },
  { id: "5", label: "Production", min: 5 },
];

export function ProjectsSection() {
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [maturity, setMaturity] = useState<MaturityFilter>("all");

  const filtered = useMemo(() => {
    const minMaturity =
      maturityFilters.find((f) => f.id === maturity)?.min ?? 0;

    return projects.filter((p) => {
      const categoryMatch =
        category === "all" ||
        (category === "commercial" ? p.commercial : p.category === category);
      const maturityMatch = p.maturity >= minMaturity;
      return categoryMatch && maturityMatch;
    });
  }, [category, maturity]);

  return (
    <section id="projects" className="scroll-mt-24 border-t border-zinc-800/60 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Projects"
          title="Проекты"
          description="От production RAG до n8n-автоматизаций — фильтруйте по типу, зрелости или коммерческому потенциалу."
        />

        <div className="mt-10 space-y-4">
          <div className="flex flex-wrap gap-2">
            {categoryFilters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setCategory(f.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  category === f.id
                    ? "bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-500/40"
                    : "bg-zinc-900 text-zinc-400 ring-1 ring-zinc-800 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-zinc-500">
              Зрелость:
            </span>
            {maturityFilters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setMaturity(f.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                  maturity === f.id
                    ? "bg-violet-500/20 text-violet-300 ring-1 ring-violet-500/40"
                    : "bg-zinc-900 text-zinc-500 ring-1 ring-zinc-800 hover:text-zinc-300"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-6 text-sm text-zinc-500">
          Показано: {filtered.length} из {projects.length}
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-12 text-center text-zinc-500">
            Нет проектов по выбранным фильтрам. Попробуйте изменить критерии.
          </p>
        )}
      </div>
    </section>
  );
}
