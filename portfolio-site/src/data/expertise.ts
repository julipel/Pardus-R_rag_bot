export interface TechLayer {
  layer: string;
  technologies: string[];
  projects: string[];
}

export const techLayers: TechLayer[] = [
  {
    layer: "LLM / AI",
    technologies: ["OpenAI API", "GPT-4o / 4o-mini", "GigaChat", "Prompt Engineering"],
    projects: ["RAG--ChromaDB-", "PEm08", "social-content-ai-assistant"],
  },
  {
    layer: "RAG & Search",
    technologies: ["ChromaDB", "text-embedding-3-small", "Semantic Search", "Chunking"],
    projects: ["RAG--ChromaDB-", "PEr08", "Support-FAQ-assistant"],
  },
  {
    layer: "Backend",
    technologies: ["Python 3.11+", "FastAPI", "uvicorn", "pydantic", "SQLite"],
    projects: ["RAG--ChromaDB-", "PEm08", "Support-FAQ-assistant"],
  },
  {
    layer: "Bots & UI",
    technologies: ["python-telegram-bot", "PyQt6", "Web UI", "REST API"],
    projects: ["RAG--ChromaDB-", "PEm08"],
  },
  {
    layer: "Automation",
    technologies: ["n8n", "Make", "Docker", "docker-compose", "Gmail OAuth"],
    projects: ["n8n-Gmail-INN-Automation", "social-content-ai-assistant"],
  },
  {
    layer: "Data & Integrations",
    technologies: ["Google Sheets", "CSV", "JSON cache", "Gmail", "Telegram"],
    projects: ["n8n-Gmail-INN-Automation", "RAG--ChromaDB-", "social-content-ai-assistant"],
  },
];

export const expertiseAreas = [
  {
    title: "RAG & Vector Search",
    description:
      "Production-пайплайны: индексация документов, семантический поиск, генерация ответов с контекстом.",
    icon: "🔍",
  },
  {
    title: "Support Automation",
    description:
      "Knowledge engineering, FAQ-ассистенты, эскалация на оператора, единый tone of voice.",
    icon: "💬",
  },
  {
    title: "Content & Marketing AI",
    description:
      "Генерация контента под бренд, tone presets, адаптация под платформы, n8n-pipeline.",
    icon: "✍️",
  },
  {
    title: "n8n & Back-office",
    description:
      "Email-парсинг, валидация данных, Google Sheets, автоматические ответы клиентам.",
    icon: "⚡",
  },
] as const;
