from __future__ import annotations

from typing import Iterable, Sequence

from models.embedding_service import EmbeddingService
from services.llm_service import LLMService

from .tools import calculate_cash_flow, fetch_recent_transactions


class FinancialAgent:
    def __init__(
        self,
        llm_service: LLMService | None = None,
        embedding_service: EmbeddingService | None = None,
    ) -> None:
        self.llm_service = llm_service or LLMService()
        self.embedding_service = embedding_service or EmbeddingService()
        self.name = "financial"

    async def handle_message(self, message: str) -> str:
        transactions = fetch_recent_transactions(limit=6)
        cash_flow = calculate_cash_flow(transactions)
        highlights = self.embedding_service.semantic_search(
            query=message, documents=transactions, limit=3
        )
        prompt = self._compose_prompt(message, cash_flow, highlights)
        return await self.llm_service.generate_response(prompt)

    def _compose_prompt(
        self, message: str, cash_flow: float, highlights: Sequence[dict]
    ) -> str:
        lines = [
            "You are a financial operations assistant.",
            "Leverage the provided snapshot to help the user.",
            f"Net cash flow (sample data): {cash_flow:+.2f}",
            "Relevant transactions:",
        ]
        if not highlights:
            lines.append("  (no similar transactions found)")
        else:
            lines.extend(self._format_transactions(highlights))
        lines.append("\nUser message:")
        lines.append(message.strip())
        lines.append("\nRespond with concise, actionable insight.")
        return "\n".join(lines)

    def _format_transactions(self, transactions: Iterable[dict]) -> list[str]:
        formatted: list[str] = []
        for item in transactions:
            formatted.append(
                f"  - {item['occurred_on']}: {item['description']} ({item['amount']:+.2f})"
            )
        return formatted
