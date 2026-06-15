"""
Централизованная загрузка настроек из переменных окружения (.env).
"""

import os
from dataclasses import dataclass
from typing import Optional, Set

from dotenv import load_dotenv

load_dotenv(override=True)


def _parse_admin_ids(raw: Optional[str]) -> Set[str]:
    if not raw:
        return set()
    return {item.strip() for item in raw.split(",") if item.strip()}


@dataclass(frozen=True)
class Settings:
    openai_api_key: Optional[str]
    telegram_bot_token: Optional[str]
    model_name: str
    temperature: float
    embedding_model: str
    chroma_persist_dir: str
    collection_name: str
    cache_file: str
    logs_db_path: str
    docs_folder: str
    top_k: int
    max_tokens: int
    telegram_admin_ids: Set[str]

    @classmethod
    def from_env(cls) -> "Settings":
        return cls(
            openai_api_key=os.getenv("OPENAI_API_KEY"),
            telegram_bot_token=os.getenv("TELEGRAM_BOT_TOKEN"),
            model_name=os.getenv("MODEL_NAME", "gpt-3.5-turbo"),
            temperature=float(os.getenv("TEMPERATURE", "0.7")),
            embedding_model=os.getenv("EMBEDDING_MODEL", "text-embedding-3-small"),
            chroma_persist_dir=os.getenv("CHROMA_PERSIST_DIR", "./chroma_db"),
            collection_name=os.getenv("COLLECTION_NAME", "rag_documents"),
            cache_file=os.getenv("CACHE_FILE", "cache.json"),
            logs_db_path=os.getenv("LOGS_DB_PATH", "logs.db"),
            docs_folder=os.getenv("DOCS_FOLDER", "docs"),
            top_k=int(os.getenv("TOP_K", "3")),
            max_tokens=int(os.getenv("MAX_TOKENS", "500")),
            telegram_admin_ids=_parse_admin_ids(os.getenv("TELEGRAM_ADMIN_IDS")),
        )


def get_settings() -> Settings:
    return Settings.from_env()
