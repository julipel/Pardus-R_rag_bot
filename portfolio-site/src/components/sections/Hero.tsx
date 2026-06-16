import { profile } from "@/data/profile";
import { repositoryAnalysis } from "@/data/analysis";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[120px]" />
        <div className="absolute top-20 right-0 h-64 w-64 rounded-full bg-blue-600/15 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/5 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-cyan-300">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            AI Automation · RAG · n8n
          </p>

          <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-7xl">
            {profile.name}
            <span className="mt-2 block bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300 bg-clip-text text-transparent">
              {profile.title}
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-xl">
            {profile.tagline}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="#projects">Смотреть проекты</Button>
            <Button href="#analysis" variant="secondary">
              Анализ GitHub
            </Button>
            <Button href={profile.github} variant="secondary" external>
              GitHub
            </Button>
          </div>

          <dl className="mt-14 grid grid-cols-3 gap-6 border-t border-zinc-800/80 pt-10 sm:max-w-lg">
            <div>
              <dt className="text-xs uppercase tracking-wider text-zinc-500">
                Репозитории
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-white">
                {profile.stats.publicRepos}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-zinc-500">
                AI-проекты
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-white">
                {profile.stats.aiProjects}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-zinc-500">
                B2B-кейсы
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-cyan-400">
                {profile.stats.commercialCases}
              </dd>
            </div>
          </dl>

          <p className="mt-8 text-sm text-zinc-500">
            Обновлено: {repositoryAnalysis.analyzedAt} · анализ аккаунта @
            {repositoryAnalysis.account}
          </p>
        </div>
      </div>
    </section>
  );
}
