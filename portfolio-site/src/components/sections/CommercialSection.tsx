import { repositoryAnalysis } from "@/data/analysis";
import { commercialProjects } from "@/data/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export function CommercialSection() {
  return (
    <section
      id="commercial"
      className="scroll-mt-24 border-t border-zinc-800/60 bg-gradient-to-b from-zinc-950 to-zinc-900/50 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Commercial Cases"
          title="Коммерческие кейсы"
          description="Проекты, которые можно презентовать заказчику как решения с измеримым ROI: поддержка, контент, разведка, автоматизация."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {repositoryAnalysis.commercialCases.map((item, i) => {
            const project = commercialProjects.find((p) =>
              p.repoUrl.includes(item.repo),
            );
            return (
              <div
                key={item.title}
                className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-zinc-900/50 p-6 sm:p-8"
              >
                <span className="text-5xl font-bold text-zinc-800/80 absolute top-4 right-6">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-xs font-medium uppercase tracking-wider text-amber-400/90">
                  {item.repo}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                  {item.value}
                </p>
                {project && (
                  <div className="mt-6">
                    <Button
                      href={`/projects/${project.slug}`}
                      variant="secondary"
                    >
                      Подробнее о проекте
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
