# RAG-ассистент с ChromaDB, кешем и Telegram-ботом

Проект реализует RAG-ассистента на русском языке для консультаций по портативному рентген-аппарату `Пардус-Р`.

Ассистент:
- загружает `.md` и `.txt` документы из папки `docs/`,
- индексирует их в `ChromaDB` через эмбеддинги OpenAI,
- отвечает на вопросы через LLM с учетом найденного контекста,
- кеширует ответы в `cache.json`,
- ведет логи запросов в `logs.db`,
- работает как Telegram-бот.

## Возможности

- RAG-пайплайн: поиск релевантных фрагментов + генерация ответа.
- Доменный промпт под аппарат «Пардус-Р» (безопасность, характеристики, эксплуатация).
- Персистентное векторное хранилище в `chroma_db/`.
- Кеш повторяющихся запросов (ускоряет ответы и снижает стоимость API).
- Переиндексация базы знаний (скрипт `reindex.py`, команда `/reindex`).
- Логирование всех взаимодействий в SQLite.
- Экспорт логов в CSV.
- Telegram-интерфейс с ограничением админ-команд.

## Стек

- Python 3.11+
- `openai`
- `chromadb`
- `python-dotenv`
- `python-telegram-bot`
- SQLite (встроен в Python)

## Структура проекта

- `main.py` — точка входа: инициализация системы и запуск Telegram-бота.
- `config.py` — загрузка настроек из `.env`.
- `embeddings.py` — загрузка документов, чанкование, эмбеддинги, поиск в ChromaDB.
- `rag.py` — RAG-логика и генерация ответа через OpenAI.
- `cache.py` — файловый кеш ответов (`cache.json`).
- `db_logger.py` — логирование и статистика (`logs.db`, таблица `logs`).
- `telegram_bot.py` — команды и обработка сообщений Telegram-бота.
- `reindex.py` — скрипт переиндексации документов.
- `docs/` — база знаний в `.md` / `.txt`.
- `env.example` — пример переменных окружения.

## Подготовка окружения (Windows PowerShell)

```powershell
cd "C:\path\to\your\project"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

Если PowerShell блокирует активацию:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\.venv\Scripts\Activate.ps1
```

## Настройка `.env`

1. Скопируйте `env.example` в `.env`.
2. Заполните обязательные переменные:

```env
OPENAI_API_KEY=your_openai_api_key_here
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_ADMIN_IDS=123456789
```

`TELEGRAM_BOT_TOKEN` обязателен для запуска бота.

`TELEGRAM_ADMIN_IDS` — Telegram user ID администраторов через запятую. Без этой переменной команды `/stats`, `/logs` и `/reindex` недоступны никому.

### Все настройки из `.env`

| Переменная | По умолчанию | Описание |
|---|---|---|
| `OPENAI_API_KEY` | — | Ключ OpenAI (обязательно) |
| `TELEGRAM_BOT_TOKEN` | — | Токен Telegram-бота |
| `TELEGRAM_ADMIN_IDS` | — | ID админов через запятую |
| `MODEL_NAME` | `gpt-3.5-turbo` | Модель LLM |
| `TEMPERATURE` | `0.7` | Креативность LLM |
| `MAX_TOKENS` | `500` | Макс. длина ответа |
| `TOP_K` | `3` | Число фрагментов для RAG |
| `EMBEDDING_MODEL` | `text-embedding-3-small` | Модель эмбеддингов |
| `CHROMA_PERSIST_DIR` | `./chroma_db` | Папка ChromaDB |
| `COLLECTION_NAME` | `rag_documents` | Имя коллекции |
| `DOCS_FOLDER` | `docs` | Папка с документами |
| `CACHE_FILE` | `cache.json` | Файл кеша |
| `LOGS_DB_PATH` | `logs.db` | Файл логов |

## Запуск

### Telegram-бот

```powershell
python main.py
```

### Переиндексация документов

После обновления файлов в `docs/`:

```powershell
python reindex.py
```

В Telegram — команда `/reindex` (только для администраторов).

Переиндексация очищает ChromaDB, загружает документы заново и сбрасывает кеш ответов.

## Команды Telegram-бота

Пользовательские команды:
- `/start` — приветственное сообщение,
- `/help` — справка и примеры вопросов.

Админ-команды (требуют `TELEGRAM_ADMIN_IDS`):
- `/stats` — статистика системы,
- `/logs` — выгрузка всех логов в CSV,
- `/reindex` — переиндексация базы знаний.

## Логи и CSV

### Где хранятся логи

- Файл БД: `logs.db`
- Таблица: `logs`

### Экспорт `logs.db` в CSV (без `sqlite3` CLI)

```powershell
python -c "import sqlite3,csv; conn=sqlite3.connect('logs.db'); cur=conn.cursor(); cur.execute('SELECT * FROM logs'); rows=cur.fetchall(); headers=[d[0] for d in cur.description]; f=open('logs_export.csv','w',newline='',encoding='utf-8-sig'); w=csv.writer(f); w.writerow(headers); w.writerows(rows); f.close(); conn.close(); print('logs_export.csv created')"
```

Открыть в Excel:

```powershell
start excel "logs_export.csv"
```

## Частые проблемы

- `ModuleNotFoundError: No module named 'dotenv'`  
  Установите зависимости:
  ```powershell
  .\.venv\Scripts\python.exe -m pip install -r requirements.txt
  ```

- Бот не отвечает по документам «Пардус-Р»  
  Проверьте, что в `docs/` есть `.md` файлы, и выполните `python reindex.py`.

- Админ-команды не работают  
  Задайте `TELEGRAM_ADMIN_IDS` в `.env` (узнать ID: @userinfobot).

- Бот не запускается  
  Проверьте, что в `.env` заданы `OPENAI_API_KEY` и `TELEGRAM_BOT_TOKEN`.

## Безопасность

- Не коммитьте `.env` и реальные ключи API.
- Задайте `TELEGRAM_ADMIN_IDS` — без него админ-команды отключены.
- Логи могут содержать пользовательские сообщения — учитывайте это при передаче CSV.
