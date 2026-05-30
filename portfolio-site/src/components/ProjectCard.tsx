import Link from "next/link";
import type { Project } from "@/data/projects";
import { Badge } from "@/components/ui/Badge";

const maturityLabels: Record<number, string> = {
  5: "Production-ready",
  4: "MVP+",
  3: "Focused MVP",
  2: "Learning / util",
  1: "Concept",
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 transition-all duration-300 hover:border-cyan-500/40 hover:bg-zinc-900/70 hover:shadow-xl hover:shadow-cyan-500/5">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Badge variant="maturity">
          Зрелость {project.maturity}/5 · {maturityLabels[project.maturity]}
        </Badge>
        {project.commercial && <Badge variant="commercial">B2B</Badge>}
        <Badge variant="accent">Portfolio {project.portfolioScore}/10</Badge>
      </div>

      <h3 className="text-xl font-semibold text-white group-hover:text-cyan-300 transition-colors">
        <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0">
          {project.name}
        </Link>
      </h3>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-400">
        {project.shortDescription}
      </p>

      <ul className="mt-4 flex flex-wrap gap-2">
        {project.stack.slice(0, 4).map((tech) => (
          <li
            key={tech}
            className="rounded-md bg-zinc-800/80 px-2 py-0.5 text-xs text-zinc-400"
          >
            {tech}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between text-xs text-zinc-500">
        <span>{project.language}</span>
        <span>{project.updatedAt}</span>
      </div>
    </article>
  );
}
