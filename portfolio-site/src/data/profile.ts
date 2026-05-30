export const profile = {
  name: "Julia Plavinsky",
  handle: "julipel",
  title: "AI Automation Engineer",
  tagline:
    "Проектирую RAG-ассистентов, ботов и n8n-автоматизации с измеримым бизнес-эффектом",
  bio: "Инженер и практик в области ИИ, автоматизации и цифровых ассистентов. Специализация: retrieval-augmented generation, Telegram-интерфейсы, снижение нагрузки на поддержку и ускорение контент-процессов.",
  location: "Remote / CIS",
  email:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL ??
    "julipel@users.noreply.github.com",
  github: "https://github.com/julipel",
  telegram: process.env.NEXT_PUBLIC_TELEGRAM_URL ?? "",
  focusAreas: [
    "RAG & vector search",
    "LLM product assistants",
    "Telegram bots",
    "n8n workflows",
    "Support automation",
  ],
  stats: {
    publicRepos: 9,
    aiProjects: 7,
    commercialCases: 5,
  },
} as const;
