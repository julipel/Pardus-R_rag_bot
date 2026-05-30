export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  deliverables: string[];
}

export const processSteps: ProcessStep[] = [
  {
    step: 1,
    title: "Discovery",
    description:
      "Разбор бизнес-задачи, источников данных, каналов коммуникации и метрик успеха.",
    deliverables: ["Scope документ", "Карта интеграций", "KPI"],
  },
  {
    step: 2,
    title: "MVP",
    description:
      "Минимальный рабочий прототип: RAG-pipeline, промпты или n8n-workflow с реальными данными.",
    deliverables: ["Рабочий прототип", "База знаний v1", "Тест-кейсы"],
  },
  {
    step: 3,
    title: "Deploy",
    description:
      "Telegram-бот, API, docker-compose или GPT-публикация — выбор канала под аудиторию.",
    deliverables: ["Production deploy", "env.example", "Документация"],
  },
  {
    step: 4,
    title: "Metrics",
    description:
      "Кеш hit rate, логи запросов, CSV-экспорт, качество ответов — измеримый эффект.",
    deliverables: ["SQLite / CSV логи", "Статистика", "Roadmap v2"],
  },
];

export const evolutionStory = {
  title: "От учебного MVP к production",
  description:
    "PEr07 — минимальный RAG с ChromaDB и кешем. RAG--ChromaDB- — production-версия с Telegram, логами и 8 документами базы знаний по медоборудованию.",
  from: {
    repo: "PEr07",
    label: "Minimal RAG",
    url: "https://github.com/julipel/PEr07",
    slug: "per07-rag-minimal",
  },
  to: {
    repo: "RAG--ChromaDB-",
    label: "Пардус-Р RAG Consultant",
    url: "https://github.com/julipel/RAG--ChromaDB-",
    slug: "rag-chromadb-pardus",
  },
  additions: [
    "Telegram-интерфейс для пользователей",
    "SQLite-аудит всех запросов",
    "8 регламентных документов базы знаний",
    "CSV-экспорт логов и /stats",
    "Три режима запуска: консоль, demo, bot",
  ],
} as const;
