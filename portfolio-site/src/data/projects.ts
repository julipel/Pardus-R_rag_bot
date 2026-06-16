export type ProjectCategory =
  | "rag"
  | "automation"
  | "support"
  | "content"
  | "learning"
  | "utility";

export type MaturityLevel = 1 | 2 | 3 | 4 | 5;

export interface ArchitectureStep {
  label: string;
  description?: string;
}

export interface BusinessMetric {
  label: string;
  value: string;
}

export interface Project {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  problem: string;
  solution: string;
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
  architecture: ArchitectureStep[];
  businessMetrics: BusinessMetric[];
  relatedSlugs: string[];
}

export const projects: Project[] = [
  {
    slug: "rag-chromadb-pardus",
    name: "Пардус-Р RAG Consultant",
    shortDescription:
      "RAG-ассистент с ChromaDB, кешем, логами и Telegram-ботом для консультаций по медоборудованию.",
    description:
      "Полноценный RAG-пайплайн на русском языке: индексация docs/, семантический поиск OpenAI + ChromaDB, генерация ответов, файловый кеш, SQLite-аудит и три режима запуска (консоль, демо, Telegram).",
    problem:
      "Presales и support тратят время на повторяющиеся вопросы по портативному рентген-аппарату «Пардус-Р»: комплектация, безопасность, технические параметры, регистрация.",
    solution:
      "RAG-ассистент на регламентной документации с кешем, логами и Telegram-каналом — ответы 24/7 строго по базе знаний.",
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
      "8 документов базы знаний по медоборудованию",
      "Кеш ответов и экспорт логов в CSV",
      "Telegram-бот с /stats и скрытыми dev-командами",
      "Три режима: консоль, demo, Telegram",
    ],
    architecture: [
      { label: "docs/", description: "8 .txt документов" },
      { label: "Chunking", description: "Разбиение на фрагменты" },
      { label: "ChromaDB", description: "text-embedding-3-small" },
      { label: "Semantic Search", description: "top_k=3" },
      { label: "GPT-3.5", description: "Генерация ответа" },
      { label: "Cache", description: "cache.json" },
      { label: "SQLite Logs", description: "logs.db" },
      { label: "Telegram", description: "python-telegram-bot" },
    ],
    businessMetrics: [
      { label: "Доступность", value: "24/7 без оператора" },
      { label: "База знаний", value: "8 регламентных документов" },
      { label: "Экономия API", value: "Кеш повторяющихся запросов" },
      { label: "Аудит", value: "SQLite + CSV экспорт" },
    ],
    relatedSlugs: ["per07-rag-minimal", "support-faq-tradehub"],
  },
  {
    slug: "support-faq-tradehub",
    name: "TradeHub Support FAQ",
    shortDescription:
      "Нейроассистент техподдержки: структурированная база знаний, промпты и политики эскалации.",
    description:
      "Кастомный FAQ/support-ассистент с разделением knowledge (FAQ, инструкции, политики, шаблоны) и системных промптов. Готов к интеграции в каналы поддержки.",
    problem:
      "Операторы поддержки e-commerce тратят 60–70% времени на типовые вопросы: оплата, доставка, возвраты, сбои аккаунта.",
    solution:
      "Структурированная knowledge base + system prompts с правилами эскалации. Сборка GPT-пакета скриптами, roadmap до API + CRM.",
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
      "FAQ, policies, templates, escalation rules",
      "Скрипты: normalize_kb, build_upload_bundle, validate_links",
      "Roadmap: GPT → API + RAG → n8n + CRM",
      "Генерация тест-кейсов для QA",
    ],
    architecture: [
      { label: "knowledge/", description: "FAQ, policies, templates" },
      { label: "prompts/", description: "System prompt, tone, escalation" },
      { label: "Scripts", description: "normalize, split, bundle" },
      { label: "GPT Upload", description: "exports/gpt_upload/" },
      { label: "Tests", description: "generated_cases.json" },
      { label: "Roadmap", description: "API + n8n + CRM" },
    ],
    businessMetrics: [
      { label: "Self-service", value: "Типовые L1-кейсы закрывает бот" },
      { label: "Tone of voice", value: "Единый стиль ответов" },
      { label: "Обновление KB", value: "Без правки кода" },
      { label: "Эскалация", value: "По правилам на оператора" },
    ],
    relatedSlugs: ["rag-chromadb-pardus", "n8n-gmail-inn"],
  },
  {
    slug: "pem08-competitor-monitor",
    name: "PEm08 — Мониторинг конкурентов",
    shortDescription:
      "MVP AI-ассистента для анализа конкурентной среды с backend, frontend и desktop.",
    description:
      "Многослойное приложение (backend / frontend / desktop) для сбора и анализа данных о конкурентах с использованием LLM. Подходит как основа market intelligence продукта.",
    problem:
      "Product и marketing команды тратят часы на ручной анализ конкурентов: сайты, креативы, позиционирование, ценовые сигналы.",
    solution:
      "Multi-surface MVP: FastAPI backend + web UI + PyQt6 desktop. Мультимодальный анализ текста, изображений и сайтов с GPT-4o-mini.",
    repoUrl: "https://github.com/julipel/PEm08",
    language: "Python",
    stack: ["FastAPI", "OpenAI GPT-4o", "PyQt6", "Selenium", "BeautifulSoup"],
    category: "content",
    maturity: 4,
    portfolioScore: 8,
    commercial: true,
    commercialCase:
      "Конкурентная разведка для product/marketing команд: мониторинг позиционирования, фич и ценовых сигналов.",
    featured: true,
    updatedAt: "2026-04-08",
    highlights: [
      "Мультимодальный анализ: текст, изображения, сайты",
      "FastAPI REST API + web UI + PyQt6 desktop",
      "Структурированные отчёты: SWOT, оценки 0–10",
      "История последних 10 анализов",
    ],
    architecture: [
      { label: "Input", description: "Текст / изображение / URL" },
      { label: "Scraper", description: "BeautifulSoup + Selenium" },
      { label: "FastAPI", description: "REST API backend" },
      { label: "GPT-4o-mini", description: "AI-анализ" },
      { label: "Report", description: "SWOT + scores + recommendations" },
      { label: "Web UI", description: "Браузерный интерфейс" },
      { label: "Desktop", description: "PyQt6 приложение" },
    ],
    businessMetrics: [
      { label: "Скорость", value: "Отчёт за минуты vs часы" },
      { label: "Поверхности", value: "API + Web + Desktop" },
      { label: "Мультимодальность", value: "Текст, фото, сайты" },
      { label: "История", value: "10 последних анализов" },
    ],
    relatedSlugs: ["social-content-ai", "per08-rag"],
  },
  {
    slug: "social-content-ai",
    name: "Social Content AI Assistant",
    shortDescription:
      "AI-генерация контента для соцсетей под бизнес-задачи: knowledge, n8n, прототип.",
    description:
      "Решение для контент-команд: база знаний бренда, промпты, n8n-сценарии и прототип. Ориентировано на repeatable content pipelines.",
    problem:
      "Малый бизнес и агентства не успевают выпускать контент: творческий блок, разный tone, ручная адаптация под Instagram / Telegram / VK.",
    solution:
      "Prompt runner + tone presets + platform rules. Генерация ideas, draft, CTA, hashtags, adapt — с n8n для масштабирования.",
    repoUrl: "https://github.com/julipel/social-content-ai-assistant",
    language: "Python",
    stack: ["Python", "OpenAI", "n8n", "Google Sheets", "Prompt Engineering"],
    category: "content",
    maturity: 4,
    portfolioScore: 8,
    commercial: true,
    commercialCase:
      "Ускорение SMM и performance-маркетинга: единый тон бренда, серия постов из брифа, интеграция в n8n.",
    featured: true,
    updatedAt: "2026-04-23",
    highlights: [
      "5 tone presets: expert, friendly, premium, casual, sales-light",
      "Адаптация под Instagram, Telegram, VK",
      "Примеры по нишам: beauty, food, services",
      "n8n pipeline + prompt_runner prototype",
    ],
    architecture: [
      { label: "Brief Form", description: "niche, platform, goal, topic" },
      { label: "knowledge/", description: "Brand voice, rules" },
      { label: "prompts/", description: "ideas, draft, CTA, hashtags" },
      { label: "OpenAI", description: "gpt-4o-mini" },
      { label: "Platform Adapt", description: "IG / TG / VK rules" },
      { label: "n8n", description: "Orchestration pipeline" },
    ],
    businessMetrics: [
      { label: "Скорость", value: "Серия постов из одного брифа" },
      { label: "Tone of voice", value: "5 presets + brand KB" },
      { label: "Платформы", value: "Instagram, Telegram, VK" },
      { label: "Ниши", value: "Beauty, HoReCa, услуги, школы" },
    ],
    relatedSlugs: ["pem08-competitor-monitor", "n8n-gmail-inn"],
  },
  {
    slug: "n8n-gmail-inn",
    name: "n8n Gmail INN Automation",
    shortDescription:
      "Автоматизация обработки заявок из Gmail с извлечением ИНН и маршрутизацией в n8n.",
    description:
      "Готовый workflow для n8n + docker-compose: парсинг входящих писем, бизнес-валидация ИНН, автоматизация рутины back-office.",
    problem:
      "Back-office вручную копирует реквизиты из входящих писем в Google Sheets, проверяет дубли по ИНН и отправляет ответы с вложениями.",
    solution:
      "n8n workflow: Gmail Trigger → parse → Sheets dedup → автоответ с/без .docx. Docker-ready деплой.",
    repoUrl: "https://github.com/julipel/n8n-Gmail-INN-Automation",
    language: "n8n",
    stack: ["n8n", "Gmail", "Google Sheets", "Docker", "JavaScript"],
    category: "automation",
    maturity: 3,
    portfolioScore: 7,
    commercial: true,
    commercialCase:
      "Back-office автоматизация для B2B: обработка входящих заявок без ручного копирования реквизитов.",
    featured: true,
    updatedAt: "2026-05-30",
    highlights: [
      "Gmail Trigger + OAuth2 credentials",
      "Parse: email, INN, org_name, org_address",
      "Dedup по ИНН в Google Sheets",
      "Автоответ с .docx или без (дубликат)",
    ],
    architecture: [
      { label: "Gmail Trigger", description: "Subject filter" },
      { label: "Parse Email", description: "Code node JS" },
      { label: "Google Sheets", description: "Read all rows" },
      { label: "Check INN", description: "Duplicate detection" },
      { label: "IF Branch", description: "New vs duplicate" },
      { label: "Append + Reply", description: "Sheet row + .docx" },
    ],
    businessMetrics: [
      { label: "Ручной ввод", value: "Устранён полностью" },
      { label: "Дубли", value: "Автопроверка по ИНН" },
      { label: "Ответ клиенту", value: "Мгновенный email" },
      { label: "Деплой", value: "docker-compose ready" },
    ],
    relatedSlugs: ["support-faq-tradehub", "social-content-ai"],
  },
  {
    slug: "per08-rag",
    name: "PEr08 — RAG Assistant",
    shortDescription:
      "Расширенный RAG-ассистент (учебный/исследовательский масширенный репозиторий).",
    description:
      "Крупный RAG-проект с полным стеком retrieval + generation. Ценен для демонстрации эволюции архитектуры; часть артефактов учебного формата.",
    problem:
      "Необходимость сравнить OpenAI и GigaChat в одном RAG-контуре с метриками качества.",
    solution:
      "Два модуля: assistant_api (OpenAI) и assistant_giga (GigaChat) + RAGAS evaluation.",
    repoUrl: "https://github.com/julipel/PEr08",
    language: "Python",
    stack: ["Python", "RAG", "ChromaDB", "OpenAI", "GigaChat", "RAGAS"],
    category: "learning",
    maturity: 3,
    portfolioScore: 5,
    commercial: false,
    commercialCase: "",
    featured: false,
    updatedAt: "2026-02-02",
    highlights: ["OpenAI + GigaChat dual mode", "RAGAS quality metrics", "Полный RAG-стек"],
    architecture: [
      { label: "Documents", description: "Custom KB" },
      { label: "ChromaDB", description: "Vector store" },
      { label: "OpenAI / GigaChat", description: "Dual LLM" },
      { label: "RAGAS", description: "Quality evaluation" },
    ],
    businessMetrics: [],
    relatedSlugs: ["per07-rag-minimal", "rag-chromadb-pardus"],
  },
  {
    slug: "per07-rag-minimal",
    name: "PEr07 — Minimal RAG",
    shortDescription:
      "Минимальный рабочий RAG с ChromaDB и кешированием — эталон базовой архитектуры.",
    description:
      "Компактный референс: embeddings, rag, cache, main. Хорош как teaching demo, предшественник production-версии Пардус-Р.",
    problem:
      "Нужен понятный референс RAG-архитектуры для обучения и быстрого прототипирования.",
    solution:
      "Минимальный код: ChromaDB + OpenAI embeddings + cache + interactive/demo modes.",
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
    highlights: ["Минимальный код", "Понятная структура модулей", "Предшественник Пардус-Р"],
    architecture: [
      { label: "docs/", description: "Sample documents" },
      { label: "ChromaDB", description: "Local vector store" },
      { label: "OpenAI", description: "Embeddings + GPT" },
      { label: "Cache", description: "Response cache" },
    ],
    businessMetrics: [],
    relatedSlugs: ["rag-chromadb-pardus", "per08-rag"],
  },
  {
    slug: "prompt-library",
    name: "Prompt Library",
    shortDescription: "Библиотека переиспользуемых промптов для LLM-workflow.",
    description:
      "Вспомогательный репозиторий шаблонов промптов. Усиливает остальные проекты, но не является самостоятельным продуктом.",
    problem:
      "Промпты разбросаны по проектам без единого стандарта версионирования и тест-кейсов.",
    solution:
      "Централизованная библиотека с naming convention, prompt cards и versioning rules.",
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
    highlights: ["ocr / rag / classification / generation", "Versioning rules", "Prompt card standard"],
    architecture: [
      { label: "ocr/", description: "Text extraction" },
      { label: "rag/", description: "QA prompts" },
      { label: "classification/", description: "Routing logic" },
      { label: "generation/", description: "Content creation" },
    ],
    businessMetrics: [],
    relatedSlugs: ["rag-chromadb-pardus", "social-content-ai"],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getRelatedProjects(slug: string): Project[] {
  const project = getProjectBySlug(slug);
  if (!project) return [];
  return project.relatedSlugs
    .map((s) => getProjectBySlug(s))
    .filter((p): p is Project => p !== undefined);
}

export const featuredProjects = projects.filter((p) => p.featured);
export const commercialProjects = projects.filter((p) => p.commercial);
