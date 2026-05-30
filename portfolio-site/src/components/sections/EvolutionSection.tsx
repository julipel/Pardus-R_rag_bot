import Link from "next/link";
import { evolutionStory } from "@/data/process";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export function EvolutionSection() {
  const { from, to, additions } = evolutionStory;

  return (
    <section
      id="evolution"
      className="scroll-mt-24 border-t border-zinc-800/60 bg-gradient-to-b from-zinc-950 to-zinc-900/30 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Evolution"
          title={evolutionStory.title}
          description={evolutionStory.description}
        />

        <div className="mt-14 flex flex-col items-center gap-8 lg:flex-row lg:items-stretch lg:gap-6">
          <div className="flex-1 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 sm:p-8">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Было
            </p>
            <h3 className="mt-2 text-xl font-semibold text-zinc-300">
              {from.label}
            </h3>
            <p className="mt-1 font-mono text-sm text-zinc-500">{from.repo}</p>
            <p className="mt-4 text-sm text-zinc-400">
              Минимальный RAG: ChromaDB, embeddings, cache, console/demo modes.
            </p>
            <div className="mt-6">
              <Button href={`/projects/${from.slug}`} variant="secondary">
                Подробнее
              </Button>
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-cyan-500/40 bg-cyan-500/10 text-cyan-400">
              →
            </div>
          </div>

          <div className="flex-1 rounded-2xl border border-cyan-500/30 bg-cyan-500/5 p-6 sm:p-8">
            <p className="text-xs font-medium uppercase tracking-wider text-cyan-400">
              Стало
            </p>
            <h3 className="mt-2 text-xl font-semibold text-white">
              {to.label}
            </h3>
            <p className="mt-1 font-mono text-sm text-zinc-400">{to.repo}</p>
            <ul className="mt-4 space-y-2">
              {additions.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-zinc-300"
                >
                  <span className="mt-0.5 text-cyan-400">+</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Button href={`/projects/${to.slug}`}>Подробнее</Button>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-zinc-500">
          <Link href={to.url} className="text-cyan-400 hover:text-cyan-300">
            {to.repo}
          </Link>
          {" · "}
          <Link href={from.url} className="text-zinc-400 hover:text-zinc-300">
            {from.repo}
          </Link>
        </p>
      </div>
    </section>
  );
}
