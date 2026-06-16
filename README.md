# Пардус-Р RAG-бот

Telegram-бот-консультант по портативному рентген-аппарату **«Пардус-Р»**.

Отвечает на вопросы врачей, закупщиков и операторов на основе официальной документации: технических характеристик, руководства по эксплуатации, паспорта и сценариев применения.

## Как это работает

1. Документы из `docs/` разбиваются на фрагменты и индексируются в ChromaDB через OpenAI-эмбеддинги.
2. При поступлении вопроса система находит наиболее релевантные фрагменты.
3. LLM генерирует ответ на основе найденного контекста и добавляет ссылки на источники.
4. Повторные одинаковые вопросы возвращаются из кеша без обращения к API.

## Стек

| Компонент | Технология |
|---|---|
| LLM и эмбеддинги | OpenAI API (`gpt-3.5-turbo`, `text-embedding-3-small`) |
| Векторная база | ChromaDB (персистентная, локальная) |
| Бот | python-telegram-bot |
| Кеш | JSON-файл с FIFO-вытеснением (лимит 1000 записей) |
| Логи | SQLite (`logs.db`) |
| Конфигурация | python-dotenv |

## Структура проекта

```
├── main.py          # Точка входа: инициализация и запуск бота
├── config.py        # Настройки из .env
├── embeddings.py    # Загрузка документов, чанкование, ChromaDB
├── rag.py           # RAG-логика: поиск + генерация ответа
├── cache.py         # Файловый кеш ответов
├── db_logger.py     # Логирование в SQLite
├── telegram_bot.py  # Команды и обработка сообщений
├── reindex.py       # Скрипт переиндексации
├── docs/            # База знаний (.md / .txt)
└── env.example      # Пример переменных окружения
```

## Быстрый старт

### 1. Виртуальное окружение и зависимости (Windows PowerShell)

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Если PowerShell блокирует активацию:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\.venv\Scripts\Activate.ps1
```

### 2. Настройка `.env`

```powershell
Copy-Item env.example .env
```

Откройте `.env` и заполните три обязательных значения:

```env
OPENAI_API_KEY=sk-...
TELEGRAM_BOT_TOKEN=...
TELEGRAM_ADMIN_IDS=123456789
```

`TELEGRAM_ADMIN_IDS` — Telegram user ID через запятую (несколько: `111,222`).  
Узнать свой ID: напишите боту [@userinfobot](https://t.me/userinfobot).

### 3. Запуск

```powershell
python main.py
```

При первом запуске система автоматически проиндексирует документы из `docs/`.

## Все настройки `.env`

| Переменная | По умолчанию | Описание |
|---|---|---|
| `OPENAI_API_KEY` | — | Ключ OpenAI (обязательно) |
| `TELEGRAM_BOT_TOKEN` | — | Токен Telegram-бота (обязательно) |
| `TELEGRAM_ADMIN_IDS` | — | ID администраторов через запятую |
| `MODEL_NAME` | `gpt-3.5-turbo` | Модель LLM |
| `TEMPERATURE` | `0.7` | Креативность LLM (0.0–1.0) |
| `MAX_TOKENS` | `1000` | Макс. длина ответа (в токенах) |
| `TOP_K` | `3` | Число фрагментов для RAG-поиска |
| `EMBEDDING_MODEL` | `text-embedding-3-small` | Модель эмбеддингов |
| `CHROMA_PERSIST_DIR` | `./chroma_db` | Папка векторной базы |
| `COLLECTION_NAME` | `rag_documents` | Имя коллекции ChromaDB |
| `DOCS_FOLDER` | `docs` | Папка с документами базы знаний |
| `CACHE_FILE` | `cache.json` | Файл кеша ответов |
| `LOGS_DB_PATH` | `logs.db` | Файл логов SQLite |

## Команды Telegram-бота

**Для всех пользователей:**

| Команда | Действие |
|---|---|
| `/start` | Приветственное сообщение |
| `/help` | Справка и примеры вопросов |

**Только для администраторов** (требуют `TELEGRAM_ADMIN_IDS`):

| Команда | Действие |
|---|---|
| `/stats` | Статистика: число чанков, запросов, хиты кеша |
| `/logs` | Выгрузка всех логов в CSV-файл |
| `/reindex` | Переиндексация базы знаний из `docs/` |

## Обновление базы знаний

После изменения или добавления файлов в `docs/`:

```powershell
python reindex.py
```

Или командой `/reindex` в Telegram (только для администраторов).

Переиндексация очищает ChromaDB, загружает документы заново и сбрасывает кеш ответов.

## Просмотр логов

Открыть базу напрямую:

```powershell
python -c "
import sqlite3, csv
conn = sqlite3.connect('logs.db')
cur = conn.cursor()
cur.execute('SELECT * FROM logs')
rows = cur.fetchall()
headers = [d[0] for d in cur.description]
with open('logs_export.csv', 'w', newline='', encoding='utf-8-sig') as f:
    w = csv.writer(f)
    w.writerow(headers)
    w.writerows(rows)
conn.close()
print('Готово: logs_export.csv')
"
start excel "logs_export.csv"
```

## Частые проблемы

**`ModuleNotFoundError: No module named 'dotenv'`**  
Зависимости не установлены в активном окружении:
```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

**Бот не отвечает по теме «Пардус-Р»**  
Проверьте, что в `docs/` есть `.md`-файлы, и запустите `python reindex.py`.

**Команды `/stats`, `/logs`, `/reindex` не работают**  
Задайте `TELEGRAM_ADMIN_IDS` в `.env`.

**Бот запускается, но сразу падает**  
Проверьте, что в `.env` заданы `OPENAI_API_KEY` и `TELEGRAM_BOT_TOKEN`.

## Безопасность

- Файл `.env` добавлен в `.gitignore` — не коммитьте ключи.
- Без `TELEGRAM_ADMIN_IDS` администраторские команды отключены для всех.
- CSV-экспорт логов содержит тексты сообщений пользователей — передавайте осторожно.
