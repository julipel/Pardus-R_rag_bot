# Cursor Cloud — RAG--ChromaDB-

## Cursor Cloud specific instructions

- **Venv:** `python3 -m venv .venv && .venv/bin/pip install -r requirements.txt` then **also** `.venv/bin/pip install pysqlite3-binary` (required by `embeddings.py` but missing from `requirements.txt`).
- **Env:** `cp env.example .env` and set a real `OPENAI_API_KEY`. Optional `TELEGRAM_BOT_TOKEN` for menu option 3.
- **Run:** `.venv/bin/python main.py` — option `2` is demo mode (non-interactive questions except Enter between items).
- **Data dirs:** `chroma_db/`, `cache.json`, `logs.db` created at runtime in repo root.
- **Lint/tests:** none in repo; manual QA via console/Telegram.

## Multi-repo workspace

Sibling projects under `/agent/repos/`. n8n: port 5678; Support-FAQ: stdlib scripts only.
