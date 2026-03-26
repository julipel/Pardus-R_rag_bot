# RAG-ассистент с ChromaDB, кешем и Telegram-ботом

Проект реализует RAG-ассистента на русском языке для консультаций по портативному рентген-аппарату `Пардус-Р`.

Ассистент:
- загружает `.txt` документы из папки `docs/`,
- индексирует их в `ChromaDB` через эмбеддинги OpenAI,
- отвечает на вопросы через LLM с учетом найденного контекста,
- кеширует ответы в `cache.json`,
- ведет логи запросов в `logs.db`,
- поддерживает интерактивный режим в консоли и режим Telegram-бота.

## Возможности

- RAG-пайплайн: поиск релевантных фрагментов + генерация ответа.
- Персистентное векторное хранилище в `chroma_db/`.
- Кеш повторяющихся запросов (ускоряет ответы и снижает стоимость API).
- Логирование всех взаимодействий в SQLite.
- Экспорт логов в CSV.
- Telegram-интерфейс для пользователей.

## Стек

- Python 3.11+
- `openai`
- `chromadb`
- `python-dotenv`
- `python-telegram-bot`
- SQLite (встроен в Python)

## Структура проекта

- `main.py` — точка входа, инициализация системы, выбор режима (консоль/демо/Telegram).
- `embeddings.py` — загрузка документов, чанкование, эмбеддинги, поиск в ChromaDB.
- `rag.py` — RAG-логика и генерация ответа через OpenAI.
- `cache.py` — файловый кеш ответов (`cache.json`).
- `db_logger.py` — логирование и статистика (`logs.db`, таблица `logs`).
- `telegram_bot.py` — команды и обработка сообщений Telegram-бота.
- `docs/` — база знаний в `.txt`.
- `env.example` — пример переменных окружения.

## Подготовка окружения (Windows PowerShell)

```powershell
cd "ваша директория"
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
2. Заполните минимум:

```env
OPENAI_API_KEY=your_openai_api_key_here
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
```

`TELEGRAM_BOT_TOKEN` нужен только для режима Telegram-бота.

## Запуск

### 1) Запуск приложения

```powershell
python main.py
```

После запуска приложение предложит режим:
- `1` — интерактивный режим в консоли,
- `2` — демонстрационный режим,
- `3` — Telegram-бот (показывается только если задан `TELEGRAM_BOT_TOKEN`).

### 2) Быстрый запуск Telegram-бота

```powershell
.\.venv\Scripts\python.exe main.py
```

В меню выберите `3`.

## Команды Telegram-бота

Пользовательские команды:
- `/start` — приветственное сообщение,
- `/help` — справка и примеры вопросов.

Служебные команды разработчика (работают, но скрыты из `/help`):
- `/stats` — статистика системы,
- `/logs` — выгрузка логов пользователя в CSV.

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

## Последние изменения

- Исправлена синтаксическая ошибка в `main.py` (кавычки в демо-вопросах про `Пардус-Р`).
- Обновлены зависимости в локальном `.venv` для корректных импортов (`python-dotenv`, `chromadb` и др.).
- Исправлена совместимость Telegram API: удален аргумент `quote=False` в `reply_text(...)`.
- Обновлен текст `/start` под тематику `Пардус-Р`.
- Обновлен текст `/help` в едином стиле под `Пардус-Р`.
- Команды `/stats` и `/logs` убраны из отображаемого списка `/help`, но сохранены рабочими.
- Уточнено, что для `logs.db` корректная таблица — `logs` (не `interactions`).

## Частые проблемы

- `ModuleNotFoundError: No module named 'dotenv'`  
  Установите зависимости в нужное окружение:
  ```powershell
  .\.venv\Scripts\python.exe -m pip install -r requirements.txt
  ```

- `No module named 'chromadb'`  
  Запускайте проект тем же интерпретатором `.venv`:
  ```powershell
  .\.venv\Scripts\python.exe main.py
  ```

- В меню нет пункта Telegram-бота  
  Проверьте, что в `.env` задан `TELEGRAM_BOT_TOKEN`.

- `sqlite3 ... command not found` в PowerShell  
  Используйте экспорт через Python (см. раздел выше).

## Безопасность

- Не коммитьте `.env` и реальные ключи API.
- Логи могут содержать пользовательские сообщения — учитывайте это при передаче CSV.

