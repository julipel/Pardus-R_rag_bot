"""
Модуль для работы с эмбеддингами и векторным хранилищем ChromaDB.

Здесь мы создаем векторные представления текстов используя OpenAI API
и сохраняем их в ChromaDB для быстрого семантического поиска.
"""
try:
    __import__("pysqlite3")
    import sys
    sys.modules["sqlite3"] = sys.modules.pop("pysqlite3")
except ModuleNotFoundError:
    pass

import chromadb
from chromadb.config import Settings
from openai import OpenAI
from typing import List, Tuple
import os
from pathlib import Path


class EmbeddingStore:
    """
    Класс для работы с векторным хранилищем ChromaDB.
    
    Использует OpenAI API для создания эмбеддингов
    и ChromaDB для их хранения и поиска.
    """
    
    def __init__(
        self, 
        collection_name: str = "documents",
        persist_directory: str = "./chroma_db",
        embedding_model: str = "text-embedding-3-small",
        api_key: str = None
    ):
        """
        Инициализация хранилища эмбеддингов.
        
        Args:
            collection_name: Имя коллекции в ChromaDB
            persist_directory: Директория для сохранения данных ChromaDB
            embedding_model: Название модели OpenAI для эмбеддингов
            api_key: API ключ OpenAI (если None, берется из переменной окружения)
        """
        print(f"Инициализация ChromaDB в директории: {persist_directory}")
        
        # Создаем клиент ChromaDB с персистентным хранилищем
        # Данные будут сохраняться на диск и загружаться при перезапуске
        self.client = chromadb.PersistentClient(
            path=persist_directory,
            settings=Settings(
                anonymized_telemetry=False  # Отключаем телеметрию
            )
        )
        
        # Инициализируем клиент OpenAI для создания эмбеддингов
        # API ключ берется из параметра или переменной окружения OPENAI_API_KEY
        self.openai_client = OpenAI(api_key=api_key or os.getenv("OPENAI_API_KEY"))
        self.embedding_model = embedding_model
        
        print(f"Модель эмбеддингов: {embedding_model} (OpenAI API)")
        
        # Получаем или создаем коллекцию в ChromaDB
        self.collection = self.client.get_or_create_collection(
            name=collection_name,
            metadata={"description": "Документы для RAG-ассистента"}
        )
        
        print(f"✓ ChromaDB инициализирована. Документов в коллекции: {self.collection.count()}")
    
    def _create_chunks(self, text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
        """
        Разбивает текст на чанки (фрагменты) с перекрытием.
        
        Перекрытие важно, чтобы не потерять контекст на границах чанков.
        
        Args:
            text: Исходный текст
            chunk_size: Размер чанка в символах
            overlap: Размер перекрытия между чанками
            
        Returns:
            Список чанков текста
        """
        chunks = []
        start = 0
        
        while start < len(text):
            # Вычисляем конец текущего чанка
            end = start + chunk_size
            
            # Добавляем чанк в список
            chunk = text[start:end].strip()
            if chunk:  # Пропускаем пустые чанки
                chunks.append(chunk)
            
            # Сдвигаемся вперед с учетом перекрытия
            start = end - overlap
        
        return chunks
    
    def _create_embeddings(self, texts: List[str]) -> List[List[float]]:
        """
        Создает эмбеддинги для списка текстов используя OpenAI API.
        
        Args:
            texts: Список текстов для создания эмбеддингов
            
        Returns:
            Список векторов эмбеддингов
        """
        try:
            # Отправляем запрос к OpenAI API для создания эмбеддингов
            # API автоматически обрабатывает батчи текстов
            response = self.openai_client.embeddings.create(
                model=self.embedding_model,
                input=texts,
                encoding_format="float"  # Получаем векторы в формате float
            )
            
            # Извлекаем векторы эмбеддингов из ответа
            embeddings = [item.embedding for item in response.data]
            
            return embeddings
            
        except Exception as e:
            print(f"❌ Ошибка при создании эмбеддингов: {str(e)}")
            raise
    
    def add_documents(self, documents: List[Tuple[str, str]]) -> None:
        """
        Добавляет документы в векторное хранилище.
        
        Каждый документ разбивается на чанки, для каждого чанка создается
        эмбеддинг через OpenAI API, и все сохраняется в ChromaDB.
        
        Args:
            documents: Список кортежей (название_документа, текст_документа)
        """
        all_chunks = []
        all_metadatas = []
        all_ids = []
        
        chunk_id = self.collection.count()  # Начинаем нумерацию с текущего количества
        
        print(f"\nДобавление {len(documents)} документов в ChromaDB...")
        
        for item in documents:
            if len(item) == 3:
                doc_name, doc_text, source_path = item
            else:
                doc_name, doc_text = item
                source_path = doc_name

            chunks = self._create_chunks(doc_text)
            
            print(f"  • {doc_name}: {len(chunks)} чанков")
            
            for chunk in chunks:
                all_chunks.append(chunk)
                all_metadatas.append({
                    "source": doc_name,
                    "source_path": source_path,
                    "chunk_length": len(chunk),
                })
                all_ids.append(f"chunk_{chunk_id}")
                chunk_id += 1
        
        # Создаем эмбеддинги через OpenAI API
        print(f"\nСоздание эмбеддингов для {len(all_chunks)} чанков через OpenAI API...")
        print(f"(Модель: {self.embedding_model})")
        
        # OpenAI API имеет ограничение на размер батча, поэтому обрабатываем по частям
        batch_size = 100  # Максимум 100 текстов за раз для безопасности
        all_embeddings = []
        
        for i in range(0, len(all_chunks), batch_size):
            batch = all_chunks[i:i + batch_size]
            print(f"  Обработка чанков {i+1}-{min(i+batch_size, len(all_chunks))} из {len(all_chunks)}...")
            
            batch_embeddings = self._create_embeddings(batch)
            all_embeddings.extend(batch_embeddings)
        
        # Добавляем все данные в ChromaDB одним батчем
        print("Сохранение в ChromaDB...")
        self.collection.add(
            embeddings=all_embeddings,
            documents=all_chunks,
            metadatas=all_metadatas,
            ids=all_ids
        )
        
        print(f"✓ Добавлено {len(all_chunks)} чанков. Всего в базе: {self.collection.count()}")
    
    def search(self, query: str, top_k: int = 3) -> List[Tuple[str, str, float]]:
        """
        Выполняет семантический поиск по векторному хранилищу.
        
        Находит top_k наиболее релевантных чанков для запроса.
        
        Args:
            query: Поисковый запрос пользователя
            top_k: Количество результатов для возврата
            
        Returns:
            Список кортежей (текст_чанка, путь_к_документу, расстояние)
            Расстояние: чем меньше, тем более релевантен результат
        """
        # Проверяем, есть ли документы в коллекции
        if self.collection.count() == 0:
            print("⚠ Предупреждение: коллекция пуста, нет документов для поиска")
            return []
        
        # Создаем эмбеддинг для запроса через OpenAI API
        query_embeddings = self._create_embeddings([query])
        query_embedding = query_embeddings[0]
        
        # Выполняем поиск в ChromaDB
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=min(top_k, self.collection.count())
        )
        
        # Форматируем результаты
        formatted_results = []
        
        if results['documents'] and len(results['documents'][0]) > 0:
            for i in range(len(results['documents'][0])):
                chunk_text = results['documents'][0][i]
                metadata = results['metadatas'][0][i]
                source = metadata.get("source_path") or metadata["source"]
                distance = results['distances'][0][i]
                
                formatted_results.append((chunk_text, source, distance))
        
        return formatted_results
    
    def clear_collection(self) -> None:
        """
        Очищает коллекцию (удаляет все документы).
        """
        # Удаляем коллекцию и создаем заново
        self.client.delete_collection(self.collection.name)
        self.collection = self.client.get_or_create_collection(
            name=self.collection.name,
            metadata={"description": "Документы для RAG-ассистента"}
        )
        print("✓ Коллекция очищена")


def load_documents_from_folder(folder_path: str = "docs") -> List[Tuple[str, str]]:
    """
    Загружает документы из папки (.md и .txt).
    
    Читает все .md и .txt файлы из указанной папки и возвращает их содержимое
    в формате списка кортежей (имя_файла, содержимое).
    
    Args:
        folder_path: Путь к папке с документами
        
    Returns:
        Список кортежей (название_файла, текст_документа)
    """
    docs_path = Path(folder_path)
    documents = []
    
    if not docs_path.exists():
        print(f"⚠ Предупреждение: папка {folder_path} не найдена")
        return documents
    
    if not docs_path.is_dir():
        print(f"⚠ Предупреждение: {folder_path} не является папкой")
        return documents
    
    doc_files = sorted(
        list(docs_path.glob("*.md")) + list(docs_path.glob("*.txt")),
        key=lambda p: p.name.lower(),
    )
    
    if not doc_files:
        print(f"⚠ Предупреждение: в папке {folder_path} не найдено .md или .txt файлов")
        return documents
    
    print(f"📂 Найдено {len(doc_files)} файлов в папке {folder_path}")
    
    for doc_file in doc_files:
        try:
            with open(doc_file, 'r', encoding='utf-8') as f:
                content = f.read().strip()
            
            if content:
                doc_name = doc_file.stem
                source_path = f"{folder_path}/{doc_file.name}".replace("\\", "/")
                documents.append((doc_name, content, source_path))
                print(f"  ✓ Загружен: {doc_file.name}")
            else:
                print(f"  ⚠ Пропущен (пустой): {doc_file.name}")
                
        except Exception as e:
            print(f"  ❌ Ошибка при чтении {doc_file.name}: {str(e)}")
    
    return documents


def reindex_documents(
    embedding_store: "EmbeddingStore",
    docs_folder: str = "docs",
    clear_cache=None,
) -> int:
    """
    Переиндексирует базу знаний: очищает ChromaDB и загружает документы заново.
    
    Args:
        embedding_store: Экземпляр EmbeddingStore
        docs_folder: Папка с документами
        clear_cache: Опциональный ResponseCache — будет очищен после переиндексации
        
    Returns:
        Количество загруженных документов
        
    Raises:
        ValueError: если документы не найдены
    """
    documents = load_documents_from_folder(docs_folder)
    if not documents:
        raise ValueError(
            f"Нет документов для индексации в папке '{docs_folder}'. "
            "Добавьте .md или .txt файлы."
        )
    
    print("\n🔄 Переиндексация базы знаний...")
    embedding_store.clear_collection()
    embedding_store.add_documents(documents)
    
    if clear_cache is not None:
        clear_cache.clear()
        print("✓ Кеш ответов очищен")
    
    chunk_count = embedding_store.collection.count()
    print(f"✓ Переиндексация завершена: {len(documents)} документов, {chunk_count} чанков")
    return len(documents)


def get_sample_documents(docs_folder: str = "docs") -> List[Tuple[str, str]]:
    """
    Загружает документы из папки docs/ для индексации в ChromaDB.
    
    Returns:
        Список кортежей (название, текст)
    """
    return load_documents_from_folder(docs_folder)
