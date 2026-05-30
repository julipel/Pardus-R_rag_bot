import { processSteps } from "@/data/process";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ProcessSection() {
  return (
    <section
      id="process"
      className="scroll-mt-24 border-t border-zinc-800/60 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Process"
          title="MVP → Production"
          description="Системный подход к каждому проекту: от discovery до измеримых метрик. Так построены все 5 коммерческих кейсов в портфолио."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step) => (
            <div
              key={step.step}
              className="relative rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white">
                {step.step}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                {step.description}
              </p>
              <ul className="mt-4 space-y-1.5">
                {step.deliverables.map((d) => (
                  <li
                    key={d}
                    className="flex items-center gap-2 text-xs text-zinc-500"
                  >
                    <span className="text-cyan-500">✓</span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
