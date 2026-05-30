import { repositoryAnalysis } from "@/data/analysis";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function AnalysisSection() {
  return (
    <section id="analysis" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="GitHub Analysis"
          title="Анализ репозиториев"
          description={repositoryAnalysis.summary}
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-white">
              Рейтинг зрелости
            </h3>
            <ol className="mt-6 space-y-4">
              {repositoryAnalysis.maturityRanking.map((item) => (
                <li
                  key={item.repo}
                  className="flex gap-4 border-b border-zinc-800/60 pb-4 last:border-0 last:pb-0"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-sm font-bold text-cyan-400">
                    {item.rank}
                  </span>
                  <div>
                    <p className="font-medium text-zinc-200">{item.repo}</p>
                    <p className="mt-1 text-sm text-zinc-500">{item.reason}</p>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"
                        style={{ width: `${(item.score / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-cyan-300">
                Лучшие для портфолио
              </h3>
              <ul className="mt-4 space-y-2">
                {repositoryAnalysis.portfolioPicks.map((repo) => (
                  <li
                    key={repo}
                    className="flex items-center gap-2 text-sm text-zinc-300"
                  >
                    <span className="text-cyan-400">◆</span>
                    {repo}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-white">
                Рекомендации
              </h3>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-zinc-400">
                {repositoryAnalysis.recommendations.map((rec) => (
                  <li key={rec}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
