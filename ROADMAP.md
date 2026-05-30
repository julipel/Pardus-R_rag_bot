# Roadmap

This roadmap reflects the **current state** of the repository (reviewed May 2026) and proposes prioritized improvements. Items are grouped by theme; order within a phase is suggestive, not a strict schedule.

## Current maturity snapshot

| Area | Status |
|------|--------|
| Core RAG (retrieve + generate) | Implemented |
| Knowledge base (`docs/` for «Пардус-Р») | Implemented (8 files) |
| Response cache | Implemented (`cache.json`) |
| Interaction logging + CSV export | Implemented (`logs.db`) |
| Telegram bot | Implemented (polling) |
| HTTP API (FastAPI) | Not present |
| Docker / CI | Not present |
| Config via environment (all `env.example` keys) | Partial — only API key and bot token |
| Automated tests | Not present |
| `vector_store.py` | Present but unused by `main.py` |

---

## Phase 1 — Stability and operations

Focus: production hygiene with minimal architectural change.

### 1.1 Dependencies and packaging

- [ ] Add `pysqlite3-binary` (or `pysqlite3`) to `requirements.txt` — required at runtime today but only imported in code.
- [ ] Pin major dependency versions in `requirements.txt` or adopt a lock file (`pip-tools`, `uv lock`).
- [ ] Document minimum Python version in `pyproject.toml` or `setup.cfg` (optional).

### 1.2 Configuration

- [ ] Read `MODEL_NAME`, `TEMPERATURE`, `EMBEDDING_MODEL`, `CHROMA_PERSIST_DIR`, `CACHE_FILE`, `LOGS_DB_PATH` from environment in `initialize_system()` (already listed in `env.example`).
- [ ] Fail fast on startup if `OPENAI_API_KEY` is missing when not in dry-run/demo mode.

### 1.3 Deployment ergonomics

- [ ] Add `Dockerfile` and `docker-compose.yml` (app + volume mounts for `chroma_db`, `cache.json`, `logs.db`).
- [ ] Non-interactive CLI flags, e.g. `python main.py --mode telegram` or `MODE=telegram`, for systemd/Docker CMD.
- [ ] Ship example `systemd` unit in `deploy/pardus-rag.service`.

### 1.4 Knowledge base maintenance

- [ ] Admin command or script: `python -m scripts.reindex` to reload `docs/` without manual `rm -rf chroma_db`.
- [ ] Optional: detect filesystem changes (hash of `docs/`) and warn when index is stale.

---

## Phase 2 — Quality, safety, and observability

Focus: trustworthiness for real users and operators.

### 2.1 Testing

- [ ] Unit tests for `ResponseCache` key normalization and round-trip JSON persistence.
- [ ] Unit tests for `_create_chunks()` boundaries and overlap.
- [ ] Integration tests with mocked OpenAI client for `RAGAssistant.generate_response()`.
- [ ] Smoke test: empty Chroma → load fixture docs → single search hit.

### 2.2 Telegram and access control

- [ ] Restrict `/stats` and `/logs` to an allowlist of Telegram user IDs (`ADMIN_USER_IDS` in `.env`).
- [ ] Remove or gate the public “answer from cache” footnote for end users (optional UX).
- [ ] Rate limiting per `user_id` (token bucket) to control OpenAI spend.

### 2.3 Logging and privacy

- [ ] Configurable log retention (delete rows older than N days).
- [ ] Option to log hashes instead of full `query`/`response` for compliance.
- [ ] Structured logging (JSON) to stdout for centralized log stacks.

### 2.4 RAG quality

- [ ] Token-aware chunking (tiktoken) instead of fixed 500 characters.
- [ ] Cite sources in answers (append document names from chunk metadata).
- [ ] Evaluate retrieval with a small Russian Q&A golden set in `tests/fixtures/`.
- [ ] Consider `gpt-4o-mini` or newer models via config for higher accuracy on safety-critical answers.

---

## Phase 3 — Product and platform expansion

Focus: new interfaces and scale.

### 3.1 HTTP API (FastAPI)

Aligns with the intended stack for this project family:

- [ ] `POST /ask` — body `{ "question": "..." }`, returns `{ "answer", "sources", "from_cache" }`.
- [ ] `GET /health`, `GET /stats` — operational endpoints.
- [ ] Reuse `answer_question()` or extracted service layer from `main.py`.
- [ ] API key authentication for server-to-server clients.

### 3.2 n8n and automation

- [ ] Webhook workflow template: Telegram → n8n → FastAPI `/ask` → reply.
- [ ] Scheduled re-index workflow after CMS/export updates to `docs/`.

### 3.3 Multi-instance and cache

- [ ] Replace file `cache.json` with Redis for horizontal Telegram replicas.
- [ ] Shared Chroma server mode or managed vector DB (e.g. Pinecone, Qdrant) if local disk is insufficient.

### 3.4 Codebase cleanup

- [ ] Either wire `vector_store.py` into `main.py` or remove it to avoid duplicate abstractions.
- [ ] Split `main.py` into `cli.py` + `services/qa.py` for clearer testing boundaries.

---

## Phase 4 — Knowledge and UX

Focus: richer content and user experience beyond MVP.

### 4.1 Content

- [ ] Expand `docs/` with official manuals, regulatory PDFs (with PDF → text pipeline).
- [ ] Support Markdown and metadata (product version, locale).
- [ ] Multilingual prompts if non-Russian users are expected.

### 4.2 User experience

- [ ] Telegram inline keyboards for FAQ shortcuts (“Технические параметры”, “Безопасность”).
- [ ] Streaming partial replies for long generations.
- [ ] Feedback buttons (👍/👎) stored in `logs` for quality review.

### 4.3 Analytics

- [ ] Dashboard (Grafana/Metabase) on `logs.db`: top questions, cache hit rate, p95 latency.
- [ ] Weekly email digest for product owners.

---

## Suggested priority matrix

| Priority | Item | Impact | Effort |
|----------|------|--------|--------|
| P0 | `pysqlite3` in requirements | Prevents deploy failures | Low |
| P0 | Non-interactive `--mode telegram` | Enables systemd/Docker | Low |
| P1 | Env-based model paths | Ops flexibility | Low |
| P1 | Re-index script | Content updates | Medium |
| P1 | Dockerfile | Repeatable deploy | Medium |
| P2 | Admin-only Telegram commands | Security | Low |
| P2 | Source citations in answers | Trust | Medium |
| P2 | FastAPI `/ask` | Integrations | Medium |
| P3 | Redis cache | Scale | Medium |
| P3 | Automated RAG eval suite | Quality | High |

---

## Out of scope (for now)

- Fine-tuning a custom model on device documentation (cost/complexity vs. RAG).
- Real-time connection to live device telemetry or hospital systems.
- Replacing OpenAI with fully offline embeddings (possible later; different hardware profile).

---

## How to contribute

1. Pick an unchecked item in Phase 1 or 2 for the highest immediate value.
2. Open an issue describing acceptance criteria before large refactors (especially FastAPI or vector DB migration).
3. Keep [ARCHITECTURE.md](./ARCHITECTURE.md) and [DEPLOYMENT.md](./DEPLOYMENT.md) updated when behavior or deploy steps change.

For system design details, see [ARCHITECTURE.md](./ARCHITECTURE.md).
