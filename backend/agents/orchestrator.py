from __future__ import annotations

from typing import Dict, Protocol

from .financial_agent import FinancialAgent


class Agent(Protocol):
    name: str

    async def handle_message(self, message: str) -> str: ...


_AGENT_REGISTRY: Dict[str, Agent] = {
    "financial": FinancialAgent(),
}


def select_agent(intent: str = "financial") -> Agent | None:
    key = intent.lower().strip()
    if key in _AGENT_REGISTRY:
        return _AGENT_REGISTRY[key]
    if key.startswith("finance"):
        return _AGENT_REGISTRY["financial"]
    return None
