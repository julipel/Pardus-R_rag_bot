import type { ReactNode } from "react";

const variants = {
  default: "bg-zinc-800/80 text-zinc-300 ring-zinc-700/60",
  accent: "bg-cyan-500/10 text-cyan-300 ring-cyan-500/30",
  commercial: "bg-amber-500/10 text-amber-200 ring-amber-500/30",
  maturity: "bg-violet-500/10 text-violet-200 ring-violet-500/30",
} as const;

export function Badge({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: keyof typeof variants;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
