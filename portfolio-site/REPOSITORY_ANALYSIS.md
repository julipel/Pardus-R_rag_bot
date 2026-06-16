# Анализ репозиториев @julipel

**Дата анализа:** 2026-05-30  
**Источник:** GitHub API, README, структура файлов (9 public repositories)

---

## Сводка

| Категория | Репозитории |
|-----------|-------------|
| **Наиболее зрелые** | `RAG--ChromaDB-`, `Support-FAQ-assistant`, `PEm08`, `social-content-ai-assistant` |
| **Лучшие для портфолио** | `RAG--ChromaDB-`, `Support-FAQ-assistant`, `PEm08`, `social-content-ai-assistant`, `n8n-Gmail-INN-Automation` |
| **Коммерческие кейсы** | Все пять выше (B2B/support/content/automation) |
| **Учебные / вспомогательные** | `PEr07`, `PEr08`, `prompt-library`, `julipel` |

---

## Рейтинг зрелости (1–5)

| # | Репозиторий | Оценка | Обоснование |
|---|-------------|--------|-------------|
| 1 | **RAG--ChromaDB-** | 5 | Production RAG: ChromaDB, кеш, SQLite-логи, Telegram, документация ARCHITECTURE/DEPLOYMENT/PORTFOLIO |
| 2 | **Support-FAQ-assistant** | 4 | TradeHub: структурированная KB (FAQ, policies, templates), промпты, roadmap интеграции |
| 3 | **PEm08** | 4 | MVP мониторинга конкурентов: backend + frontend + desktop |
| 4 | **social-content-ai-assistant** | 4 | Контент-AI: knowledge, n8n, prompts, prototype, examples |
| 5 | **n8n-Gmail-INN-Automation** | 3 | Узкий workflow + docker-compose, готов к деплою |
| 6 | **PEr08** | 3 | Крупный RAG, смешение учебных и продуктовых артефактов (~117 MB) |
| 7 | **PEr07** | 2 | Минимальный учебный RAG (предшественник Пардус-Р) |
| 8 | **prompt-library** | 2 | Утилита, без runtime |
| 9 | **julipel** | — | GitHub Profile README |

---

## Портфолио: что показывать

1. **Пардус-Р RAG** — флагман: end-to-end AI product assistant с метриками и каналами.
2. **TradeHub FAQ** — enterprise support automation (prompt + knowledge engineering).
3. **PEm08** — multi-surface MVP (web + desktop) для market intelligence.
4. **Social Content AI** — маркетинг и n8n pipeline.
5. **Gmail INN Automation** — классическая бизнес-автоматизация без кода приложения.

Не акцентировать в портфолио: `PEr07` (слишком базовый), `PEr08` (объём учебных данных), `prompt-library` (вспомогательный).

---

## Коммерческие кейсы (для продаж и кейс-стади)

| Кейс | Репозиторий | Ценность для бизнеса |
|------|-------------|----------------------|
| Product consultant 24/7 | RAG--ChromaDB- | Меньше нагрузки на presales/support по медоборудованию |
| AI-линия поддержки | Support-FAQ-assistant | −нагрузка на операторов, единый tone of voice |
| Конкурентная разведка | PEm08 | Сигналы рынка для product/marketing |
| Контент-фабрика SMM | social-content-ai-assistant | Масштабирование постов под бренд |
| Back-office Gmail/ИНН | n8n-Gmail-INN-Automation | Устранение ручного ввода реквизитов из писем |

---

## Рекомендации

1. Добавить CI (lint/test) в топ-3 Python-репозитория.
2. Вынести `portfolio-site` на GitHub Pages (Vercel / `julipel.github.io`).
3. Заменить SVG-заглушки в `PORTFOLIO.md` реальными скриншотами.
4. Создать единый RAG template из лучших практик `PEr07` + `RAG--ChromaDB-`.

---

Интерактивная версия: запустите `portfolio-site` (`npm run dev`).
