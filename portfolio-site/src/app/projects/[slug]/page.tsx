import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { projects, getProjectBySlug, getRelatedProjects } from "@/data/projects";
import { createPageMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return createPageMetadata({
    title: project.name,
    description: project.shortDescription,
    path: `/projects/${slug}`,
  });
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const related = getRelatedProjects(slug);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-20">
        <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/#projects"
            className="text-sm text-cyan-400 hover:text-cyan-300"
          >
            ← Все проекты
          </Link>

          <div className="mt-8 flex flex-wrap gap-2">
            <Badge variant="maturity">Зрелость {project.maturity}/5</Badge>
            <Badge variant="accent">Portfolio {project.portfolioScore}/10</Badge>
            {project.commercial && <Badge variant="commercial">B2B кейс</Badge>}
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {project.name}
          </h1>
          <p className="mt-4 text-lg text-zinc-400">{project.description}</p>

          <section className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-red-300">
                Проблема
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                {project.problem}
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-emerald-300">
                Решение
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                {project.solution}
              </p>
            </div>
          </section>

          {project.commercial && project.commercialCase && (
            <div className="mt-8 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-300">
                Коммерческая ценность
              </h2>
              <p className="mt-2 text-zinc-300">{project.commercialCase}</p>
            </div>
          )}

          {project.businessMetrics.length > 0 && (
            <section className="mt-10">
              <h2 className="text-lg font-semibold text-white">
                Бизнес-метрики
              </h2>
              <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                {project.businessMetrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4"
                  >
                    <dt className="text-xs uppercase tracking-wider text-zinc-500">
                      {metric.label}
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-zinc-200">
                      {metric.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          <section className="mt-10">
            <h2 className="text-lg font-semibold text-white">Архитектура</h2>
            <div className="mt-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6">
              <ArchitectureDiagram steps={project.architecture} />
            </div>
          </section>

          <section className="mt-10">
            <h2 className="text-lg font-semibold text-white">
              Ключевые особенности
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-zinc-400">
              {project.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="text-lg font-semibold text-white">Стек</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm text-zinc-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>

          {related.length > 0 && (
            <section className="mt-10">
              <h2 className="text-lg font-semibold text-white">
                Связанные проекты
              </h2>
              <ul className="mt-4 space-y-3">
                {related.map((rel) => (
                  <li key={rel.slug}>
                    <Link
                      href={`/projects/${rel.slug}`}
                      className="group flex items-center justify-between rounded-xl border border-zinc-800/80 bg-zinc-900/30 px-4 py-3 transition-colors hover:border-cyan-500/30"
                    >
                      <span className="text-sm font-medium text-zinc-300 group-hover:text-cyan-300">
                        {rel.name}
                      </span>
                      <span className="text-xs text-zinc-500">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="mt-12 flex flex-wrap gap-4">
            <Button href={project.repoUrl} external>
              Открыть на GitHub
            </Button>
            <Button href="/" variant="secondary">
              На главную
            </Button>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
