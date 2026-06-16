import Link from "next/link";
import type { ReactNode } from "react";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400";

const variants = {
  primary:
    "bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:brightness-110",
  secondary:
    "border border-zinc-700 bg-zinc-900/50 px-6 py-3 text-zinc-100 hover:border-zinc-500 hover:bg-zinc-800/80",
  ghost: "px-4 py-2 text-zinc-400 hover:text-white",
} as const;

export function Button({
  href,
  children,
  variant = "primary",
  external,
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof variants;
  external?: boolean;
}) {
  const className = `${base} ${variants[variant]}`;

  if (external) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
