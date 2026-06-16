import { expertiseAreas, techLayers } from "@/data/expertise";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ExpertiseSection() {
  return (
    <section
      id="expertise"
      className="scroll-mt-24 border-t border-zinc-800/60 bg-zinc-950 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Expertise"
          title="Экспертиза и технологии"
          description="Сквозной стек: Python → OpenAI → ChromaDB/RAG → Telegram/n8n → structured data. Каждый слой подкреплён реальными проектами."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {expertiseAreas.map((area) => (
            <div
              key={area.title}
              className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 transition-colors hover:border-cyan-500/30"
            >
              <span className="text-2xl" role="img" aria-hidden>
                {area.icon}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-white">
                {area.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                {area.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/30">
          <div className="border-b border-zinc-800/80 px-6 py-4 sm:px-8">
            <h3 className="text-lg font-semibold text-white">
              Матрица технологий
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              По слоям архитектуры и связанным репозиториям
            </p>
          </div>
          <div className="divide-y divide-zinc-800/60">
            {techLayers.map((layer) => (
              <div
                key={layer.layer}
                className="grid gap-4 px-6 py-5 sm:grid-cols-[140px_1fr_1fr] sm:px-8 sm:items-start"
              >
                <span className="text-sm font-semibold text-cyan-400">
                  {layer.layer}
                </span>
                <div className="flex flex-wrap gap-2">
                  {layer.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md bg-zinc-800/80 px-2.5 py-1 text-xs text-zinc-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {layer.projects.map((repo) => (
                    <span
                      key={repo}
                      className="rounded-md border border-zinc-700/60 px-2.5 py-1 text-xs text-zinc-500"
                    >
                      {repo}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
