"""
FastAPI-сервер для веб-виджета RAG-ассистента «Пардус-Р».
Запуск: uvicorn api:app --host 0.0.0.0 --port 8000 --reload
"""
import time
import uuid
from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel

from config import get_settings
from embeddings import EmbeddingStore, get_sample_documents
from rag import RAGAssistant
from cache import ResponseCache
from db_logger import DatabaseLogger


_state: dict = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()

    if not settings.openai_api_key:
        raise RuntimeError("OPENAI_API_KEY не задан в .env")

    print("=" * 60)
    print("🌐 ИНИЦИАЛИЗАЦИЯ WEB-ВИДЖЕТА RAG-АССИСТЕНТА")
    print("=" * 60)

    cache = ResponseCache(cache_file=settings.cache_file)

    embedding_store = EmbeddingStore(
        collection_name=settings.collection_name,
        persist_directory=settings.chroma_persist_dir,
        embedding_model=settings.embedding_model,
        api_key=settings.openai_api_key,
    )

    if embedding_store.collection.count() == 0:
        print("\n📝 База данных пуста. Загружаем документы...")
        documents = get_sample_documents(settings.docs_folder)
        if documents:
            embedding_store.add_documents(documents)
        else:
            print(f"⚠️  В папке '{settings.docs_folder}' нет .md/.txt файлов.")

    rag = RAGAssistant(
        embedding_store=embedding_store,
        api_key=settings.openai_api_key,
        model=settings.model_name,
        temperature=settings.temperature,
        max_tokens=settings.max_tokens,
    )

    logger = DatabaseLogger(db_path=settings.logs_db_path)

    _state.update(settings=settings, cache=cache, rag=rag, logger=logger)

    print("\n✅ Виджет готов. Документация: http://localhost:8000/docs")
    print("=" * 60)

    yield

    _state.clear()


app = FastAPI(
    title="PardusR RAG Widget API",
    description="AI-консультант по аппарату «Пардус-Р»",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


# ── Схемы запроса/ответа ──────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None


class ChatResponse(BaseModel):
    answer: str
    from_cache: bool
    response_time_ms: int
    session_id: str


class HealthResponse(BaseModel):
    status: str
    chunks: int
    cache_size: int
    model: str


# ── Маршруты ──────────────────────────────────────────────────────────────────

@app.post("/chat", response_model=ChatResponse, summary="Задать вопрос ассистенту")
def chat(req: ChatRequest):
    """
    Принимает вопрос пользователя, выполняет RAG-поиск и возвращает ответ.
    Повторные одинаковые вопросы возвращаются из кеша.
    """
    message = req.message.strip()
    if not message:
        raise HTTPException(status_code=400, detail="Сообщение не может быть пустым")

    session_id = req.session_id or str(uuid.uuid4())
    cache: ResponseCache = _state["cache"]
    rag: RAGAssistant = _state["rag"]
    logger: DatabaseLogger = _state["logger"]
    settings = _state["settings"]

    start = time.time()

    cached = cache.get(message, verbose=False)
    from_cache = cached is not None

    if from_cache:
        answer = cached
    else:
        answer, _ = rag.generate_response(
            query=message,
            top_k=settings.top_k,
            verbose=False,
        )
        cache.set(message, answer, verbose=False)

    elapsed_ms = int((time.time() - start) * 1000)

    logger.log_interaction(
        query=message,
        response=answer,
        source="widget",
        user_id=session_id,
        from_cache=from_cache,
        response_time_ms=elapsed_ms,
    )

    return ChatResponse(
        answer=answer,
        from_cache=from_cache,
        response_time_ms=elapsed_ms,
        session_id=session_id,
    )


@app.get("/health", response_model=HealthResponse, summary="Состояние системы")
def health():
    """Возвращает статус системы: количество чанков, размер кеша, модель."""
    return HealthResponse(
        status="ok",
        chunks=_state["rag"].embedding_store.collection.count(),
        cache_size=_state["cache"].size(),
        model=_state["rag"].model,
    )


@app.get("/", include_in_schema=False)
def demo():
    """Демо-страница с виджетом (static/widget.html)."""
    return FileResponse("static/widget.html")


# Статические файлы (виджет) — монтируем последними
app.mount("/static", StaticFiles(directory="static"), name="static")
