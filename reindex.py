"""Скрипт переиндексации документов из docs/ в ChromaDB."""
import sys

from config import get_settings
from embeddings import EmbeddingStore, reindex_documents
from cache import ResponseCache


def main() -> int:
    settings = get_settings()

    if not settings.openai_api_key:
        print("Ошибка: не задан OPENAI_API_KEY в .env", file=sys.stderr)
        return 1

    print("Инициализация ChromaDB...")
    embedding_store = EmbeddingStore(
        collection_name=settings.collection_name,
        persist_directory=settings.chroma_persist_dir,
        embedding_model=settings.embedding_model,
        api_key=settings.openai_api_key,
    )
    cache = ResponseCache(cache_file=settings.cache_file)

    try:
        doc_count = reindex_documents(
            embedding_store=embedding_store,
            docs_folder=settings.docs_folder,
            clear_cache=cache,
        )
        print(f"Готово: переиндексировано {doc_count} документов.")
        return 0
    except ValueError as e:
        print(f"Ошибка: {e}", file=sys.stderr)
        return 1
    except Exception as e:
        print(f"Ошибка переиндексации: {e}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
