import { profile } from "@/data/profile";
import { repositoryAnalysis } from "@/data/analysis";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800/80 bg-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-white">{profile.name}</p>
          <p className="mt-1 text-sm text-zinc-500">{profile.title}</p>
        </div>
        <p className="text-xs text-zinc-600">
          Анализ репозиториев: {repositoryAnalysis.analyzedAt} ·{" "}
          {repositoryAnalysis.totalRepos} public repos
        </p>
        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-cyan-400 hover:text-cyan-300"
        >
          github.com/{profile.handle}
        </a>
      </div>
    </footer>
  );
}
