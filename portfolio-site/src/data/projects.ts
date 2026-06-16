export type ProjectCategory =
  | "rag"
  | "automation"
  | "support"
  | "content"
  | "learning"
  | "utility";

export type MaturityLevel = 1 | 2 | 3 | 4 | 5;

export interface Project {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  repoUrl: string;
  demoLabel?: string;
  language: string;
  stack: string[];
  category: ProjectCategory;
  maturity: MaturityLevel;
  portfolioScore: number;
  commercial: boolean;
  commercialCase: string;
  featured: boolean;
  updatedAt: string;
  highlights: string[];
}

export const projects: Project[] = [
  {
    slug: "rag-chromadb-pardus",
    name: "Пардус-Р RAG Consultant",
    shortDescription:
      "RAG-ассистент с ChromaDB, кешем, логами и Telegram-ботом для консультаций по медоборудованию.",
    description:
      "Полноценный RAG-пайплайн на русском языке: индексация docs/, семантический поиск OpenAI + ChromaDB, генерация ответов, файловый кеш, SQLite-аудит и три режима запуска (консоль, демо, Telegram).",
    repoUrl: "https://github.com/julipel/RAG--ChromaDB-",
    language: "Python",
    stack: ["Python", "ChromaDB", "OpenAI", "Telegram", "SQLite"],
    category: "rag",
    maturity: 5,
    portfolioScore: 10,
    commercial: true,
    commercialCase:
      "B2B product consultant для портативного рентген-аппарата: снижает нагрузку на presales и поддержку, даёт 24/7 ответы по регламенту документации.",
    featured: true,
    updatedAt: "2026-05-30",
    highlights: [
      "ARCHITECTURE / DEPLOYMENT / PORTFOLIO docs",
      "Кеш ответов и экспорт логов в CSV",
      "8 документов базы знаний",
    ],
  },
  {
    slug: "support-faq-tradehub",
    name: "TradeHub Support FAQ",
    shortDescription:
      "Нейроассистент техподдержки: структурированная база знаний, промпты и политики эскалации.",
    description:
      "Кастомный FAQ/support-ассистент с разделением knowledge (FAQ, инструкции, политики, шаблоны) и системных промптов. Готов к интеграции в каналы поддержки.",
    repoUrl: "https://github.com/julipel/Support-FAQ-assistant",
    language: "Python",
    stack: ["LLM prompts", "Knowledge base", "Markdown", "Support ops"],
    category: "support",
    maturity: 4,
    portfolioScore: 9,
    commercial: true,
    commercialCase:
      "Сокращение нагрузки на линию поддержки e-commerce / SaaS: типовые кейсы закрываются ботом, эскалация по правилам.",
    featured: true,
    updatedAt: "2026-05-30",
    highlights: [
      "Документация integration_roadmap",
      "Тон коммуникации и scope поддержки",
      "Шаблоны эскалации на оператора",
    ],
  },
  {
    slug: "pem08-competitor-monitor",
    name: "PEm08 — Мониторинг конкурентов",
    shortDescription:
      "MVP AI-ассистента для анализа конкурентной среды с backend, frontend и desktop.",
    description:
      "Многослойное приложение (backend / frontend / desktop) для сбора и анализа данных о конкурентах с использованием LLM. Подходит как основа market intelligence продукта.",
    repoUrl: "https://github.com/julipel/PEm08",
    language: "Python",
    stack: ["Python", "Backend API", "Desktop", "LLM"],
    category: "content",
    maturity: 4,
    portfolioScore: 8,
    commercial: true,
    commercialCase:
      "Конкурентная разведка для product/marketing команд: мониторинг позиционирования, фич и ценовых сигналов.",
    featured: true,
    updatedAt: "2026-04-08",
    highlights: ["run.py entrypoint", "Отдельные frontend и desktop", "Описанный MVP-scope"],
  },
  {
    slug: "social-content-ai",
    name: "Social Content AI Assistant",
    shortDescription:
      "AI-генерация контента для соцсетей под бизнес-задачи: knowledge, n8n, прототип.",
    description:
      "Решение для контент-команд: база знаний бренда, промпты, n8n-сценарии и прототип. Ориентировано на repeatable content pipelines.",
    repoUrl: "https://github.com/julipel/social-content-ai-assistant",
    language: "Python",
    stack: ["Python", "n8n", "LLM", "Knowledge base"],
    category: "content",
    maturity: 4,
    portfolioScore: 8,
    commercial: true,
    commercialCase:
      "Ускорение SMM и performance-маркетинга: единый тон бренда, серия постов из брифа, интеграция в n8n.",
    featured: true,
    updatedAt: "2026-04-23",
    highlights: ["CHANGELOG и examples", "Папки knowledge / prompts / n8n", "Прототип pipeline"],
  },
  {
    slug: "n8n-gmail-inn",
    name: "n8n Gmail INN Automation",
    shortDescription:
      "Автоматизация обработки заявок из Gmail с извлечением ИНН и маршрутизацией в n8n.",
    description:
      "Готовый workflow для n8n + docker-compose: парсинг входящих писем, бизнес-валидация ИНН, автоматизация рутины back-office.",
    repoUrl: "https://github.com/julipel/n8n-Gmail-INN-Automation",
    language: "n8n",
    stack: ["n8n", "Gmail", "Docker", "Automation"],
    category: "automation",
    maturity: 3,
    portfolioScore: 7,
    commercial: true,
    commercialCase:
      "Back-office автоматизация для B2B: обработка входящих заявок без ручного копирования реквизитов.",
    featured: true,
    updatedAt: "2026-05-30",
    highlights: ["Экспорт workflow JSON", "docker-compose", "Узкая бизнес-задача"],
  },
  {
    slug: "per08-rag",
    name: "PEr08 — RAG Assistant",
    shortDescription:
      "Расширенный RAG-ассистент (учебный/исследовательский масштаб репозитория).",
    description:
      "Крупный RAG-проект с полным стеком retrieval + generation. Ценен для демонстрации эволюции архитектуры; часть артефактов учебного формата.",
    repoUrl: "https://github.com/julipel/PEr08",
    language: "Python",
    stack: ["Python", "RAG", "ChromaDB", "OpenAI"],
    category: "learning",
    maturity: 3,
    portfolioScore: 5,
    commercial: false,
    commercialCase: "",
    featured: false,
    updatedAt: "2026-02-02",
    highlights: ["Полный RAG-стек", "Большой объём артефактов"],
  },
  {
    slug: "per07-rag-minimal",
    name: "PEr07 — Minimal RAG",
    shortDescription:
      "Минимальный рабочий RAG с ChromaDB и кешированием — эталон базовой архитектуры.",
    description:
      "Компактный референс: embeddings, rag, cache, main. Хорош как teaching demo, предшественник production-версии Пардус-Р.",
    repoUrl: "https://github.com/julipel/PEr07",
    language: "Python",
    stack: ["Python", "ChromaDB", "OpenAI"],
    category: "learning",
    maturity: 2,
    portfolioScore: 4,
    commercial: false,
    commercialCase: "",
    featured: false,
    updatedAt: "2026-02-01",
    highlights: ["Минимальный код", "Понятная структура модулей"],
  },
  {
    slug: "prompt-library",
    name: "Prompt Library",
    shortDescription: "Библиотека переиспользуемых промптов для LLM-workflow.",
    description:
      "Вспомогательный репозиторий шаблонов промптов. Усиливает остальные проекты, но не является самостоятельным продуктом.",
    repoUrl: "https://github.com/julipel/prompt-library",
    language: "Markdown",
    stack: ["Prompt engineering"],
    category: "utility",
    maturity: 2,
    portfolioScore: 3,
    commercial: false,
    commercialCase: "",
    featured: false,
    updatedAt: "2026-02-20",
    highlights: ["Reusable prompts", "Документация purpose"],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export const featuredProjects = projects.filter((p) => p.featured);
export const commercialProjects = projects.filter((p) => p.commercial);
