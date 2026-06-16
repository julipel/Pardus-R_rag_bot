export const repositoryAnalysis = {
  analyzedAt: "2026-05-30",
  account: "julipel",
  totalRepos: 9,
  summary:
    "Портфель сфокусирован на прикладном AI: RAG, поддержка клиентов, контент и n8n-автоматизации. Наиболее зрелые — production-oriented RAG и support-ассистенты; сильные коммерческие кейсы — медоборудование, TradeHub FAQ, конкурентный мониторинг, SMM и Gmail/ИНН automation.",
  maturityRanking: [
    {
      rank: 1,
      repo: "RAG--ChromaDB-",
      score: 5,
      reason:
        "Полный цикл RAG + кеш + логи + Telegram + техническая документация (ARCHITECTURE, DEPLOYMENT, PORTFOLIO).",
    },
    {
      rank: 2,
      repo: "Support-FAQ-assistant",
      score: 4,
      reason:
        "Структурированная knowledge base, промпты, политики эскалации, roadmap интеграции.",
    },
    {
      rank: 3,
      repo: "PEm08",
      score: 4,
      reason: "Multi-tier MVP (backend / frontend / desktop) с чёткой продуктовой идеей.",
    },
    {
      rank: 4,
      repo: "social-content-ai-assistant",
      score: 4,
      reason: "Knowledge + n8n + prototype + examples — зрелый контур контент-автоматизации.",
    },
    {
      rank: 5,
      repo: "n8n-Gmail-INN-Automation",
      score: 3,
      reason: "Фокусный workflow + Docker; узкая, но готовая бизнес-автоматизация.",
    },
    {
      rank: 6,
      repo: "PEr08",
      score: 3,
      reason: "Большой RAG-проект; смешение учебных и продуктовых артефактов.",
    },
    {
      rank: 7,
      repo: "PEr07",
      score: 2,
      reason: "Минимальный учебный RAG — база для обучения, не production.",
    },
    {
      rank: 8,
      repo: "prompt-library",
      score: 2,
      reason: "Утилитарный репозиторий без runtime.",
    },
  ],
  portfolioPicks: [
    "RAG--ChromaDB-",
    "Support-FAQ-assistant",
    "PEm08",
    "social-content-ai-assistant",
    "n8n-Gmail-INN-Automation",
  ],
  commercialCases: [
    {
      title: "Медицинский product consultant",
      repo: "RAG--ChromaDB-",
      value: "24/7 консультации по «Пардус-Р» на основе регламентной документации.",
    },
    {
      title: "AI-линия поддержки TradeHub",
      repo: "Support-FAQ-assistant",
      value: "Снижение нагрузки на операторов, единый тон и эскалация.",
    },
    {
      title: "Конкурентная разведка",
      repo: "PEm08",
      value: "MVP мониторинга конкурентов для marketing/product.",
    },
    {
      title: "Контент-фабрика для соцсетей",
      repo: "social-content-ai-assistant",
      value: "Генерация контента под бренд с n8n-оркестрацией.",
    },
    {
      title: "Обработка заявок Gmail + ИНН",
      repo: "n8n-Gmail-INN-Automation",
      value: "Автоматизация back-office без ручного ввода реквизитов.",
    },
  ],
  recommendations: [
    "Объединить лучшие практики PEr07/PEr08 в единый RAG template repo.",
    "Добавить CI (lint/test) в топ-3 Python-проекта.",
    "Вынести portfolio-site в julipel/julipel или отдельный repo для GitHub Pages.",
    "Заменить SVG-заглушки в PORTFOLIO.md реальными скриншотами Telegram/UI.",
  ],
} as const;
