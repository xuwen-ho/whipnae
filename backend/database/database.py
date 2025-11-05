from __future__ import annotations

import sqlite3
from contextlib import contextmanager
from pathlib import Path
from typing import Iterator, Sequence

DB_PATH = Path(__file__).with_name("transactions.db")

SCHEMA = """
CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    occurred_on TEXT NOT NULL,
    description TEXT NOT NULL,
    amount REAL NOT NULL
);
"""

SEED_TRANSACTIONS = [
    ("2025-01-15", "Monthly subscription revenue", 2750.00),
    ("2025-01-18", "Cloud infrastructure", -640.35),
    ("2025-01-20", "Payroll", -1420.10),
    ("2025-01-22", "Contractor payment", -320.50),
    ("2025-01-25", "Customer refund", -95.00),
]


def ensure_database(seed: bool = True) -> None:
    """Create the SQLite file and seed basic data for local development."""
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(DB_PATH) as connection:
        connection.execute("PRAGMA journal_mode=WAL;")
        connection.executescript(SCHEMA)
        if seed:
            cursor = connection.execute("SELECT COUNT(*) FROM transactions;")
            (count,) = cursor.fetchone()
            if count == 0:
                connection.executemany(
                    "INSERT INTO transactions(occurred_on, description, amount) VALUES (?, ?, ?);",
                    SEED_TRANSACTIONS,
                )
        connection.commit()


@contextmanager
def get_connection(seed: bool = True) -> Iterator[sqlite3.Connection]:
    ensure_database(seed=seed)
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    try:
        yield connection
    finally:
        connection.close()


def fetch_transactions(limit: int = 10) -> Sequence[sqlite3.Row]:
    with get_connection() as connection:
        cursor = connection.execute(
            """
            SELECT id, occurred_on, description, amount
            FROM transactions
            ORDER BY occurred_on DESC, id DESC
            LIMIT ?;
            """,
            (limit,),
        )
        return cursor.fetchall()
