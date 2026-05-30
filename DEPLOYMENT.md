# Deployment

This guide covers running the **Пардус-Р RAG assistant** locally, on a Linux server, and in production-oriented setups. The application is a single Python process; deployment is primarily about dependencies, secrets, persistent data directories, and choosing console versus Telegram mode.

## Prerequisites

| Requirement | Notes |
|-------------|--------|
| Python | 3.11 or newer recommended |
| Network | Outbound HTTPS to `api.openai.com`; for Telegram, outbound to Telegram API |
| OpenAI account | API key with access to embeddings and chat models |
| Telegram bot (optional) | Token from [@BotFather](https://t.me/BotFather) |

## Repository layout (runtime artifacts)

After first run, these paths are created beside the code (all gitignored except `docs/`):

| Path | Purpose |
|------|---------|
| `chroma_db/` | ChromaDB persistent vector index |
| `cache.json` | Cached LLM responses |
| `logs.db` | SQLite interaction log |
| `logs_*.csv` | Exported logs (console or Telegram) |
| `.env` | Secrets (you create from `env.example`) |

Back up `chroma_db/`, `cache.json`, and `logs.db` if you redeploy or migrate hosts.

## Local development (Linux / macOS)

```bash
cd /path/to/project
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python -m pip install pysqlite3-binary
```

`pysqlite3` is required at runtime because `embeddings.py` and `db_logger.py` patch `sqlite3` for ChromaDB compatibility. It is **not** pinned in `requirements.txt` today — install it explicitly until the dependency file is updated.

### Environment configuration

```bash
cp env.example .env
```

Edit `.env`:

```env
OPENAI_API_KEY=sk-...
TELEGRAM_BOT_TOKEN=123456:ABC...   # optional
```

Only `OPENAI_API_KEY` and `TELEGRAM_BOT_TOKEN` are read by the application. Optional keys in `env.example` (`MODEL_NAME`, `EMBEDDING_MODEL`, etc.) are documentation placeholders and are **not** applied unless you change code in `main.py`.

### First run and indexing

```bash
python main.py
```

On first start with an empty `chroma_db/`:

1. All `docs/*.txt` files are loaded and chunked.
2. Embeddings are created via OpenAI (`text-embedding-3-small`).
3. Vectors are written to `chroma_db/`.

This can take a minute and incurs OpenAI embedding API charges proportional to document size (~8 small text files in the default repo).

Choose a mode when prompted:

- `1` — interactive console
- `2` — demo script
- `3` — Telegram bot (only if `TELEGRAM_BOT_TOKEN` is set)

### Verify installation

```bash
# Quick import check
python -c "from embeddings import EmbeddingStore; from rag import RAGAssistant; print('OK')"

# Optional: run demo mode non-interactively (requires OPENAI_API_KEY)
# printf '2\n' | python main.py
```

## Local development (Windows PowerShell)

See [README.md](./README.md) for Windows-specific venv activation and execution policy notes. The same `.env` and `python main.py` flow applies.

## Production deployment (Linux VM / VPS)

### 1. System packages

```bash
sudo apt-get update
sudo apt-get install -y python3.11 python3.11-venv git
```

### 2. Application user (recommended)

```bash
sudo useradd -r -m -s /bin/bash ragbot
sudo su - ragbot
git clone <your-repo-url> app && cd app
```

### 3. Install application

```bash
python3.11 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pip install pysqlite3-binary
cp env.example .env
# edit .env with production keys
```

### 4. Pre-create data directory and permissions

```bash
mkdir -p chroma_db
chmod 700 .env
```

Ensure the process user owns the project directory so ChromaDB and SQLite can write.

### 5. Run Telegram bot under systemd

For production, mode `3` (Telegram) is typical. Example unit file `/etc/systemd/system/pardus-rag.service`:

```ini
[Unit]
Description=Pardus-R RAG Telegram Bot
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=ragbot
WorkingDirectory=/home/ragbot/app
Environment=PATH=/home/ragbot/app/.venv/bin
ExecStart=/home/ragbot/app/.venv/bin/python -c "import os; from dotenv import load_dotenv; load_dotenv(); from main import initialize_system; from telegram_bot import TelegramRAGBot; es, rag, cache, logger = initialize_system(); TelegramRAGBot(os.environ['TELEGRAM_BOT_TOKEN'], rag, cache, logger).run()"
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Alternatively, use a small wrapper script that calls `main.py` with stdin `3\n` or refactor startup to accept `MODE=telegram` (planned in [ROADMAP.md](./ROADMAP.md)).

Enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable pardus-rag
sudo systemctl start pardus-rag
sudo journalctl -u pardus-rag -f
```

### 6. Process supervision without systemd

```bash
source .venv/bin/activate
export $(grep -v '^#' .env | xargs)
# Interactive menu still required today:
python main.py
```

For unattended Telegram operation, prefer systemd or a process manager until a non-interactive entrypoint exists.

## Docker (manual recipe)

The repository does not ship a `Dockerfile` yet. A minimal production image pattern:

```dockerfile
FROM python:3.11-slim

WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt pysqlite3-binary

COPY . .
ENV PYTHONUNBUFFERED=1

VOLUME ["/app/chroma_db", "/app/cache.json", "/app/logs.db"]
CMD ["python", "main.py"]
```

Build and run (interactive menu inside container unless you add a dedicated CMD):

```bash
docker build -t pardus-rag .
docker run --env-file .env -v $(pwd)/chroma_db:/app/chroma_db -it pardus-rag
```

Mount volumes for `chroma_db`, `cache.json`, and `logs.db` so data survives container restarts.

## Environment variables reference

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | Embeddings and chat completions |
| `TELEGRAM_BOT_TOKEN` | For bot mode | Bot token from BotFather |

Documented but **not loaded** by current code (set in code or extend `main.py`):

- `MODEL_NAME`, `TEMPERATURE`
- `EMBEDDING_MODEL`, `CHROMA_PERSIST_DIR`, `CACHE_FILE`, `LOGS_DB_PATH`

## Updating the knowledge base

To refresh vectors after changing files in `docs/`:

1. Stop the running process.
2. Remove the vector store: `rm -rf chroma_db/` (or call `EmbeddingStore.clear_collection()` from a maintenance script).
3. Optionally clear `cache.json` if answers must reflect new content.
4. Restart `python main.py` — empty collection triggers re-indexing.

There is no hot-reload of documents in the current version.

## Monitoring and maintenance

| Task | Command / location |
|------|---------------------|
| View service logs | `journalctl -u pardus-rag` or console stdout |
| Interaction stats | Console `stats` or Telegram `/stats` |
| Export logs | Console `logs` or Telegram `/logs` (per-user CSV) |
| Clear response cache | Console `clear_cache` or delete `cache.json` |
| Disk usage | `du -sh chroma_db cache.json logs.db` |

### SQLite → CSV (without Telegram)

```bash
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
print('logs_export.csv created')
"
```

## Security checklist

- [ ] `.env` file mode `600`, owned by service user
- [ ] `.env` never committed (already in `.gitignore`)
- [ ] Restrict SSH and firewall on VPS; bot only needs outbound HTTPS
- [ ] Rotate `OPENAI_API_KEY` and `TELEGRAM_BOT_TOKEN` on compromise
- [ ] Treat `logs.db` and CSV exports as sensitive (user messages)
- [ ] Review who can invoke Telegram `/stats` and `/logs` (no admin ACL today)

## Cost and quotas

- **Embeddings**: charged on initial index and on every cache miss (query embedding per search).
- **Chat**: charged per cache miss (`gpt-3.5-turbo`, up to 500 completion tokens).
- **Cache**: identical normalized questions avoid both embedding and chat calls.

Monitor usage in the [OpenAI usage dashboard](https://platform.openai.com/usage).

## Troubleshooting

| Symptom | Likely cause | Action |
|---------|----------------|--------|
| `ModuleNotFoundError: pysqlite3` | Missing shim package | `pip install pysqlite3-binary` |
| Chroma / sqlite version errors | System SQLite too old | Ensure `pysqlite3` patch runs (import order in `embeddings.py`) |
| Empty or generic answers | Empty `chroma_db` or wrong docs | Delete `chroma_db/`, restart to re-index |
| Telegram option missing | No `TELEGRAM_BOT_TOKEN` | Set in `.env`, restart |
| `OPENAI_API_KEY` warning at start | Missing env | Create `.env` or export variable |
| Stale answers after doc update | Response cache | Clear `cache.json` or `clear_cache` |
| Rate limit / 429 from OpenAI | Quota or burst | Back off, upgrade plan, rely on cache |

## Related documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) — components and data flow
- [ROADMAP.md](./ROADMAP.md) — planned deployment improvements (Dockerfile, FastAPI, env wiring)
- [README.md](./README.md) — quick start and feature overview
