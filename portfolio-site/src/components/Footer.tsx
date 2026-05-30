import Link from "next/link";
import { profile } from "@/data/profile";
import { repositoryAnalysis } from "@/data/analysis";

const footerNav = [
  { href: "/#expertise", label: "Экспертиза" },
  { href: "/#projects", label: "Проекты" },
  { href: "/#commercial", label: "Кейсы" },
  { href: "/#process", label: "Процесс" },
  { href: "/#contact", label: "Контакты" },
];

export function Footer() {
  return (
    <footer className="border-t border-zinc-800/80 bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-medium text-white">{profile.name}</p>
            <p className="mt-1 text-sm text-zinc-500">{profile.title}</p>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm text-cyan-400 hover:text-cyan-300"
            >
              github.com/{profile.handle}
            </a>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {footerNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-zinc-500 hover:text-zinc-300"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <p className="mt-10 border-t border-zinc-800/80 pt-6 text-xs text-zinc-600">
          Анализ репозиториев: {repositoryAnalysis.analyzedAt} ·{" "}
          {repositoryAnalysis.totalRepos} public repos · @
          {repositoryAnalysis.account}
        </p>
      </div>
    </footer>
  );
}
