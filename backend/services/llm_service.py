from __future__ import annotations

import asyncio
import os
from typing import Optional


class LLMService:
    """Minimal async wrapper around an LLM provider."""

    def __init__(self, api_key: Optional[str] = None) -> None:
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")

    async def generate_response(self, prompt: str) -> str:
        # TODO: Replace with a real call to the chosen LLM provider.
        await asyncio.sleep(0)
        header = "(LLM placeholder response)"
        return f"{header}\n{prompt}"
