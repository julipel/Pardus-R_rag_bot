import { profile } from "@/data/profile";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-cyan-950/30 p-8 sm:p-12 lg:p-16">
          <SectionHeading
            eyebrow="Contact"
            title="Готовы обсудить проект?"
            description="Открыта к сотрудничеству: RAG-ассистенты под продукт, линии поддержки, n8n-автоматизации и Telegram-интерфейсы."
          />

          <div className="mt-10 flex flex-wrap gap-4">
            <Button href={profile.github} external>
              GitHub @{profile.handle}
            </Button>
            {profile.email && (
              <Button href={`mailto:${profile.email}`} variant="secondary" external>
                Email
              </Button>
            )}
            {profile.telegram && (
              <Button href={profile.telegram} external variant="secondary">
                Telegram
              </Button>
            )}
            <Button href="#projects" variant="secondary">
              Все проекты
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            {profile.focusAreas.map((area) => (
              <span
                key={area}
                className="rounded-full border border-zinc-700 bg-zinc-950/50 px-4 py-2 text-sm text-zinc-400"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
