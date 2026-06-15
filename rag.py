"""
Модуль для реализации RAG (Retrieval-Augmented Generation).

RAG объединяет поиск релевантной информации (Retrieval) с генерацией ответа (Generation)
для создания более точных и информативных ответов на вопросы пользователя.
"""

from typing import List, Tuple, Optional
from openai import OpenAI
import os


SYSTEM_PROMPT = """Ты — консультант по портативному рентгеновскому аппарату «Пардус-Р».

Твоя задача — отвечать на вопросы врачей, закупщиков, инженеров и операторов
на основе официальной документации: технических характеристик, руководства по эксплуатации,
паспорта, регистрационных данных, рекомендаций по радиационной безопасности и сценариев применения.

Правила:
- Отвечай только на основе предоставленного контекста из базы знаний
- Если информации недостаточно — честно скажи об этом, не выдумывай
- Отвечай на русском языке, чётко и по делу
- При вопросах о безопасности и дозовой нагрузке будь особенно точен
- Не давай клинических диагнозов и не заменяй консультацию врача-рентгенолога
- Используй корректные медицинские и технические термины
- В конце каждого ответа обязательно добавь блок «Источники» со списком документов,
  на которых основан ответ. Указывай путь к файлу из контекста (поле «Источник»), например:
  docs/01_Технические_параметры_Пардус-Р.md
- Перечисляй только те документы, из которых ты реально использовал информацию"""


class RAGAssistant:
    """
    Класс RAG-ассистента, который использует векторный поиск и LLM для ответов.
    
    Процесс работы:
    1. Получает запрос пользователя
    2. Ищет релевантные документы в векторной базе
    3. Формирует контекст из найденных документов
    4. Отправляет запрос + контекст в LLM
    5. Возвращает сгенерированный ответ
    """
    
    def __init__(
        self, 
        embedding_store,
        api_key: Optional[str] = None,
        model: str = "gpt-3.5-turbo",
        temperature: float = 0.7,
        max_tokens: int = 500,
    ):
        """
        Инициализация RAG-ассистента.
        
        Args:
            embedding_store: Экземпляр EmbeddingStore для поиска документов
            api_key: API ключ OpenAI (если None, берется из переменной окружения)
            model: Название модели OpenAI для генерации ответов
            temperature: Параметр "креативности" модели (0.0 - детерминированный, 1.0 - креативный)
            max_tokens: Максимальная длина ответа LLM
        """
        self.embedding_store = embedding_store
        self.model = model
        self.temperature = temperature
        self.max_tokens = max_tokens
        
        # Инициализируем клиент OpenAI
        # API ключ берется из параметра или переменной окружения OPENAI_API_KEY
        self.client = OpenAI(api_key=api_key or os.getenv("OPENAI_API_KEY"))
        
        print(f"✓ RAG-ассистент инициализирован (модель: {model})")
    
    def _format_context(self, search_results: List[Tuple[str, str, float]]) -> str:
        """
        Форматирует результаты поиска в контекст для LLM.
        
        Args:
            search_results: Список результатов поиска (текст, источник, расстояние)
            
        Returns:
            Отформатированный текст контекста
        """
        if not search_results:
            return "Релевантных документов не найдено."
        
        context_parts = []
        
        for i, (chunk_text, source, distance) in enumerate(search_results, 1):
            context_parts.append(
                f"[Фрагмент {i} | Источник: {source}]\n{chunk_text}\n"
            )
        
        return "\n".join(context_parts)
    
    def _build_sources_footer(self, search_results: List[Tuple[str, str, float]]) -> str:
        """Формирует блок со ссылками на документы, использованные при поиске."""
        seen = []
        for _, source, _ in search_results:
            if source not in seen:
                seen.append(source)
        if not seen:
            return ""
        lines = "\n".join(f"• {source}" for source in seen)
        return f"\n\n📎 Источники:\n{lines}"
    
    def _create_prompt(self, query: str, context: str) -> str:
        """
        Создает промпт для LLM, включающий контекст и запрос пользователя.
        
        Args:
            query: Запрос пользователя
            context: Контекст из найденных документов
            
        Returns:
            Сформированный промпт
        """
        prompt = f"""Используй контекст из базы знаний по аппарату «Пардус-Р», чтобы ответить на вопрос.

В каждом фрагменте контекста указан путь к исходному документу (поле «Источник»).
В конце ответа добавь блок:

📎 Источники:
• путь/к/документу.md

Перечисли только документы, информация из которых реально использована в ответе.

=== КОНТЕКСТ ИЗ БАЗЫ ЗНАНИЙ ===
{context}

=== ВОПРОС ПОЛЬЗОВАТЕЛЯ ===
{query}

=== ОТВЕТ ===
"""
        return prompt
    
    def generate_response(
        self, 
        query: str, 
        top_k: int = 3,
        verbose: bool = True
    ) -> Tuple[str, List[Tuple[str, str, float]]]:
        """
        Генерирует ответ на запрос пользователя используя RAG.
        
        Это основной метод, который:
        1. Ищет релевантные документы
        2. Формирует контекст
        3. Отправляет запрос в LLM
        4. Возвращает ответ
        
        Args:
            query: Запрос пользователя
            top_k: Количество документов для поиска
            verbose: Выводить ли детальную информацию о процессе
            
        Returns:
            Кортеж (ответ_llm, список_найденных_документов)
        """
        # Шаг 1: Поиск релевантных документов в векторной базе
        if verbose:
            print(f"\n🔍 Поиск релевантных документов (top_k={top_k})...")
        
        search_results = self.embedding_store.search(query, top_k=top_k)
        
        if verbose and search_results:
            print(f"\n📚 Найдено {len(search_results)} релевантных фрагментов:")
            for i, (chunk, source, distance) in enumerate(search_results, 1):
                print(f"  {i}. [{source}] (similarity: {1 - distance:.3f})")
                print(f"     {chunk[:100]}...")
        
        # Шаг 2: Форматируем контекст из найденных документов
        context = self._format_context(search_results)
        
        # Шаг 3: Создаем промпт с контекстом и запросом
        prompt = self._create_prompt(query, context)
        
        # Шаг 4: Отправляем запрос в LLM
        if verbose:
            print(f"\n🤖 Генерация ответа с помощью {self.model}...")
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": SYSTEM_PROMPT,
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=self.temperature,
                max_tokens=self.max_tokens
            )
            
            # Извлекаем текст ответа
            answer = response.choices[0].message.content.strip()
            
            if search_results and "📎 Источники" not in answer and "Источники:" not in answer:
                answer += self._build_sources_footer(search_results)
            
            return answer, search_results
            
        except Exception as e:
            error_message = f"Ошибка при генерации ответа: {str(e)}"
            print(f"❌ {error_message}")
            return error_message, search_results
    
    def simple_response(self, query: str) -> str:
        """
        Упрощенная версия generate_response, возвращающая только текст ответа.
        
        Args:
            query: Запрос пользователя
            
        Returns:
            Ответ LLM
        """
        answer, _ = self.generate_response(query, verbose=False)
        return answer

