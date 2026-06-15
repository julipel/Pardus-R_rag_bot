"""
Точка входа: инициализация RAG-системы и запуск Telegram-бота.
"""

import sys
from typing import Optional, Tuple

from config import Settings, get_settings
from embeddings import EmbeddingStore, get_sample_documents
from rag import RAGAssistant
from cache import ResponseCache
from db_logger import DatabaseLogger
from telegram_bot import TelegramRAGBot


def initialize_system(settings: Optional[Settings] = None) -> Tuple[EmbeddingStore, RAGAssistant, ResponseCache, DatabaseLogger, Settings]:
    """
    Инициализирует все компоненты RAG-системы.

    Returns:
        Кортеж (embedding_store, rag_assistant, cache, logger, settings)
    """
    if settings is None:
        settings = get_settings()

    print("=" * 70)
    print("🚀 ИНИЦИАЛИЗАЦИЯ RAG-АССИСТЕНТА")
    print("=" * 70)

    api_key = settings.openai_api_key
    if not api_key:
        print("⚠️  ВНИМАНИЕ: Не найден OPENAI_API_KEY в переменных окружения!")
        print("   Создайте файл .env и добавьте туда: OPENAI_API_KEY=your_key_here")
        print()

    if not settings.telegram_bot_token:
        print("❌ Не задан TELEGRAM_BOT_TOKEN в .env")
        sys.exit(1)

    print("\n[1/4] Инициализация кеша...")
    cache = ResponseCache(cache_file=settings.cache_file)

    print("\n[2/4] Инициализация векторного хранилища...")
    embedding_store = EmbeddingStore(
        collection_name=settings.collection_name,
        persist_directory=settings.chroma_persist_dir,
        embedding_model=settings.embedding_model,
        api_key=api_key,
    )

    if embedding_store.collection.count() == 0:
        print("\n📝 База данных пуста. Загружаем документы...")
        documents = get_sample_documents(settings.docs_folder)
        if documents:
            embedding_store.add_documents(documents)
        else:
            print(
                f"⚠️  В папке '{settings.docs_folder}' нет .md/.txt файлов. "
                "Добавьте документы и выполните: python reindex.py"
            )
    else:
        print(f"✓ В базе уже есть {embedding_store.collection.count()} чанков")

    print("\n[3/4] Инициализация RAG-ассистента...")
    rag_assistant = RAGAssistant(
        embedding_store=embedding_store,
        api_key=api_key,
        model=settings.model_name,
        temperature=settings.temperature,
        max_tokens=settings.max_tokens,
    )

    print("\n[4/4] Инициализация логгера базы данных...")
    logger = DatabaseLogger(db_path=settings.logs_db_path)
    print("✓ Логгер инициализирован")

    print("\n" + "=" * 70)
    print("✅ СИСТЕМА ГОТОВА К РАБОТЕ")
    print("=" * 70)

    return embedding_store, rag_assistant, cache, logger, settings


def main():
    """Запускает Telegram-бота."""
    try:
        embedding_store, rag_assistant, cache, logger, settings = initialize_system()

        print("\n" + "=" * 70)
        print("🤖 ЗАПУСК TELEGRAM БОТА")
        print("=" * 70)

        bot = TelegramRAGBot(
            token=settings.telegram_bot_token,
            rag_assistant=rag_assistant,
            cache=cache,
            logger=logger,
            embedding_store=embedding_store,
            settings=settings,
        )
        bot.run()

    except Exception as e:
        print(f"\n❌ Критическая ошибка: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
