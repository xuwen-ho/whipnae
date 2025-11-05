from __future__ import annotations

from typing import Iterable, List


class EmbeddingService:
    """Lightweight placeholder for vector embeddings and semantic search."""

    def __init__(self, embedding_size: int = 8) -> None:
        self.embedding_size = embedding_size

    def embed_text(self, text: str) -> List[float]:
        tokens = text.lower().split()
        base_score = float(len(tokens)) or 1.0
        return [base_score / (index + 1) for index in range(self.embedding_size)]

    def semantic_search(
        self, query: str, documents: Iterable[dict], limit: int = 3
    ) -> list[dict]:
        query_tokens = set(query.lower().split())
        scored: list[tuple[float, dict]] = []
        for doc in documents:
            description = str(doc.get("description", ""))
            doc_tokens = set(description.lower().split())
            overlap = len(query_tokens & doc_tokens)
            score = overlap / (len(doc_tokens) or 1)
            scored.append((score, doc))
        scored.sort(key=lambda item: item[0], reverse=True)
        return [doc for score, doc in scored if score > 0][:limit]
