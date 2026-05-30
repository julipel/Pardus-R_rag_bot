import type { ArchitectureStep } from "@/data/projects";

export function ArchitectureDiagram({ steps }: { steps: ArchitectureStep[] }) {
  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-max items-stretch gap-0 py-2">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center">
            <div className="flex w-28 flex-col items-center sm:w-32">
              <div className="flex h-14 w-full items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/5 px-2 text-center">
                <span className="text-xs font-semibold leading-tight text-cyan-200 sm:text-sm">
                  {step.label}
                </span>
              </div>
              {step.description && (
                <p className="mt-2 max-w-[8rem] text-center text-[10px] leading-snug text-zinc-500 sm:text-xs">
                  {step.description}
                </p>
              )}
            </div>
            {i < steps.length - 1 && (
              <div className="mx-1 flex shrink-0 items-center text-cyan-500/50 sm:mx-2">
                <svg
                  width="20"
                  height="12"
                  viewBox="0 0 20 12"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M0 6h16m0 0l-5-5m5 5l-5 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
