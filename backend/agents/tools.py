from __future__ import annotations

from typing import Iterable, List, Sequence

from database.database import fetch_transactions

Transaction = dict[str, float | int | str]


def fetch_recent_transactions(limit: int = 10) -> List[Transaction]:
    rows = fetch_transactions(limit=limit)
    transactions: List[Transaction] = []
    for row in rows:
        transactions.append(
            {
                "id": int(row["id"]),
                "occurred_on": str(row["occurred_on"]),
                "description": str(row["description"]),
                "amount": float(row["amount"]),
            }
        )
    return transactions


def calculate_cash_flow(transactions: Iterable[Transaction]) -> float:
    return round(sum(float(item["amount"]) for item in transactions), 2)


def summarize_transactions(transactions: Sequence[Transaction]) -> str:
    if not transactions:
        return "No transactions available."
    lines = []
    for item in transactions:
        lines.append(
            f"{item['occurred_on']}: {item['description']} ({float(item['amount']):+.2f})"
        )
    return "\n".join(lines)
