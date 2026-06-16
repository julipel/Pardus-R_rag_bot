import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-zinc-800">404</p>
      <h1 className="mt-4 text-xl font-semibold text-white">Страница не найдена</h1>
      <Link href="/" className="mt-8 text-cyan-400 hover:text-cyan-300">
        ← На главную
      </Link>
    </div>
  );
}
