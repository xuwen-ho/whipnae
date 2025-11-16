from __future__ import annotations

import sqlite3
from contextlib import contextmanager
from pathlib import Path
from typing import Iterator, Sequence
from typing import Optional, Dict, Any, List, Tuple
import math
from datetime import datetime, timedelta


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

# === Recurring costs schema + helpers =======================================

RECURRING_SCHEMA = """
CREATE TABLE IF NOT EXISTS recurring_costs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  cadence TEXT NOT NULL,              -- 'Daily' | 'Weekly' | 'Monthly' | 'Yearly'
  amount REAL NOT NULL DEFAULT 0,     -- amount per cadence
  currency TEXT NOT NULL DEFAULT 'CNY',
  recurring INTEGER NOT NULL DEFAULT 1,  -- 1 = ON, 0 = OFF
  notes TEXT
);
"""

SEED_RECURRING = [
    # --- Your CNY items ---
    ("房租 - 南山区一居", "Monthly", 3500.00, "CNY", 1, "公寓租金"),
    ("电费",           "Monthly", 162.92,  "CNY", 1, ""),
    ("水费",           "Monthly", 44.38,   "CNY", 1, ""),
    ("燃气费",         "Monthly", 54.74,   "CNY", 1, ""),
    ("中国移动广东 5G套餐", "Monthly", 68.00, "CNY", 1, ""),
    ("腾讯视频VIP月费", "Monthly", 20.00,   "CNY", 1, ""),
    ("爱奇艺VIP月费",  "Monthly", 19.00,   "CNY", 1, ""),

    # (Optional) keep the USD examples if you want
    # ("Daily Coffee", "Daily", 6.00, "USD", 1, "Default example"),
    # ("StreamVerse",  "Monthly", 12.99, "USD", 1, ""),
    # ("MusicFlow",    "Monthly", 9.99,  "USD", 0, ""),
]


def ensure_recurring_table(conn: sqlite3.Connection) -> None:
    conn.executescript(RECURRING_SCHEMA)
    cur = conn.execute("SELECT COUNT(*) FROM recurring_costs;")
    (cnt,) = cur.fetchone()
    if cnt == 0:
        conn.executemany(
            "INSERT INTO recurring_costs(name, cadence, amount, currency, recurring, notes) VALUES (?, ?, ?, ?, ?, ?);",
            SEED_RECURRING,
        )

def list_recurring(limit: int = 100) -> Sequence[sqlite3.Row]:
    with get_connection() as connection:
        cur = connection.execute(
            """
            SELECT id, name, cadence, amount, currency, recurring, COALESCE(notes,'') AS notes
            FROM recurring_costs
            ORDER BY id DESC
            LIMIT ?;
            """,
            (limit,),
        )
        return cur.fetchall()

def patch_recurring(
    rc_id: int,
    *,
    name: Optional[str] = None,
    cadence: Optional[str] = None,
    amount: Optional[float] = None,
    currency: Optional[str] = None,
    recurring: Optional[int] = None,
    notes: Optional[str] = None,
) -> Dict[str, Any]:
    fields = []
    params: List[Any] = []
    if name is not None:
        fields.append("name = ?"); params.append(name)
    if cadence is not None:
        fields.append("cadence = ?"); params.append(cadence)
    if amount is not None:
        fields.append("amount = ?"); params.append(float(amount))
    if currency is not None:
        fields.append("currency = ?"); params.append(currency)
    if recurring is not None:
        fields.append("recurring = ?"); params.append(int(1 if recurring else 0))
    if notes is not None:
        fields.append("notes = ?"); params.append(notes)

    if not fields:
        return {"updated": 0}

    with get_connection() as connection:
        q = f"UPDATE recurring_costs SET {', '.join(fields)} WHERE id = ?"
        params.append(rc_id)
        cur = connection.execute(q, params)
        connection.commit()
        updated = cur.rowcount or 0
        row = connection.execute(
            "SELECT id, name, cadence, amount, currency, recurring, COALESCE(notes,'') AS notes FROM recurring_costs WHERE id = ?",
            (rc_id,),
        ).fetchone()
        return {"updated": updated, "item": dict(row) if row else None}

def create_recurring(
    name: str, cadence: str, amount: float, currency: str = "CNY", recurring: int = 1, notes: str = ""
) -> Dict[str, Any]:
    with get_connection() as connection:
        cur = connection.execute(
            "INSERT INTO recurring_costs(name, cadence, amount, currency, recurring, notes) VALUES (?, ?, ?, ?, ?, ?)",
            (name, cadence, float(amount), currency, int(1 if recurring else 0), notes),
        )
        connection.commit()
        new_id = int(cur.lastrowid)
        row = connection.execute(
            "SELECT id, name, cadence, amount, currency, recurring, COALESCE(notes,'') AS notes FROM recurring_costs WHERE id = ?",
            (new_id,),
        ).fetchone()
        return dict(row)
# ============================================================================




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
                
        ensure_recurring_table(connection)  # <-- add this line before commit
        connection.commit()


@contextmanager
def get_connection(seed: bool = True) -> Iterator[sqlite3.Connection]:
    ensure_database(seed=seed)
    print("DB path:", DB_PATH.resolve())
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


def _detect_columns(cursor):
    # pick the transactions table and key columns by name
    tables = [r["name"] for r in cursor.execute(
        "SELECT name FROM sqlite_master WHERE type='table'")]
    tx_table = next((t for t in tables if t.lower() == "transactions"), None) \
        or next((t for t in tables if "trans" in t.lower()), None) \
        or (tables[0] if tables else None)

    if not tx_table:
        return {"table": None}

    cols = [r[1] for r in cursor.execute(f"PRAGMA table_info({tx_table})")]

    def pick(*cands):
        lowers = {c.lower(): c for c in cols}
        for c in cands:
            if c in lowers:
                return lowers[c]
        for c in cands:
            for k in cols:
                if c in k.lower():
                    return k
        return None

    amount    = pick("amount","amt","value","money")
    date      = pick("occurred_on","date","txn_date","created_at","posted_at","booked_at")
    category  = pick("category","category_name","cat","tag")
    merchant  = pick("merchant","counterparty","payee","vendor","name","description","memo")
    direction = pick("direction","txn_type","transaction_type","type","debit","credit")

    return {
        "table": tx_table,
        "amount": amount,
        "date": date,
        "category": category,
        "merchant": merchant,
        "direction": direction,
    }


def compute_insights():
    with get_connection(seed=False) as conn:
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        meta = _detect_columns(cur)
        tx = meta.get("table")
        if not tx or not meta.get("amount"):
            return {"ready": False, "reason": "transactions table or amount column not found"}

        amount = meta["amount"]
        date   = meta.get("date")
        cat    = meta.get("category")
        merch  = meta.get("merchant")
        dire   = meta.get("direction")

                # Robust direction handling + fallback to numeric sign
        if dire:
            dir_norm = f"LOWER(TRIM({dire}))"
            expense_terms = (
                "'debit','expense','outflow','spend','spent','payment','withdrawal','purchase','fee','charge',"
                "'支出','转出','扣款','dr','debit card','card debit'"
            )
            income_terms = (
                "'credit','income','inflow','deposit','refund','reversal','salary','payroll','transfer_in','interest',"
                "'收入','转入','收款','cr','card credit'"
            )
            # Use ABS(amount) when direction is known to avoid double-applying signs
            signed_sql = f"""
              CASE
                WHEN {dir_norm} IN ({expense_terms}) THEN -1.0*ABS({amount})
                WHEN {dir_norm} IN ({income_terms})  THEN  1.0*ABS({amount})
                -- unknown/missing direction → trust the numeric sign already in amount
                ELSE {amount}
              END
            """
        else:
            # No direction column at all → rely on amount sign
            signed_sql = f"{amount}"


        income_only_sql  = f"CASE WHEN ({signed_sql}) > 0 THEN ({signed_sql}) ELSE 0 END"
        expense_only_sql = f"CASE WHEN ({signed_sql}) < 0 THEN -({signed_sql}) ELSE 0 END"

        # Totals
        totals_row = cur.execute(f"""
            SELECT
              SUM({income_only_sql})  AS income,
              SUM({expense_only_sql}) AS expenses,
              SUM({signed_sql})       AS net,
              COUNT(*)                AS cnt
            FROM {tx}
        """).fetchone() or {}

        income   = float(totals_row["income"] or 0)
        expenses = float(totals_row["expenses"] or 0)
        net      = float(totals_row["net"] or 0)
        count    = int(totals_row["cnt"] or 0)

        # Averages
        avg_row = cur.execute(f"""
            SELECT
              SUM(CASE WHEN {income_only_sql}  > 0 THEN 1 ELSE 0 END) AS inc_cnt,
              SUM(CASE WHEN {expense_only_sql} > 0 THEN 1 ELSE 0 END) AS exp_cnt
            FROM {tx}
        """).fetchone() or {}
        inc_cnt = int(avg_row["inc_cnt"] or 0)
        exp_cnt = int(avg_row["exp_cnt"] or 0)
        avg_income  = income / inc_cnt if inc_cnt else 0.0
        avg_expense = expenses / exp_cnt if exp_cnt else 0.0

        # Latest month
        latest = {"month": None, "income": None, "expenses": None, "net": None}
        if date:
            lm = cur.execute(f"""
                WITH per AS (
                  SELECT strftime('%Y-%m', DATE({date})) AS ym,
                         {income_only_sql}  AS inc,
                         {expense_only_sql} AS exp,
                         {signed_sql}       AS signed
                  FROM {tx}
                )
                SELECT ym,
                       SUM(inc)   AS income,
                       SUM(exp)   AS expenses,
                       SUM(signed) AS net
                FROM per
                WHERE ym IS NOT NULL
                GROUP BY ym
                ORDER BY ym DESC
                LIMIT 1
            """).fetchone()
            if lm:
                latest = {
                    "month":     lm["ym"],
                    "income":    float(lm["income"] or 0),
                    "expenses":  float(lm["expenses"] or 0),
                    "net":       float(lm["net"] or 0),
                }
                
        # --- Average monthly expenses (true monthly average) ---
        avg_month_expense = 0.0
        months_count = 0
        if date:
            row = cur.execute(f"""
                WITH per AS (
                SELECT strftime('%Y-%m', DATE({date})) AS ym,
                        {expense_only_sql} AS exp
                FROM {tx}
                ),
                monthly AS (
                SELECT ym, SUM(exp) AS month_exp
                FROM per
                WHERE ym IS NOT NULL
                GROUP BY ym
                )
                SELECT COUNT(*) AS months, AVG(month_exp) AS avg_month_exp
                FROM monthly
            """).fetchone()
            if row:
                months_count = int(row["months"] or 0)
                avg_month_expense = float(row["avg_month_exp"] or 0.0)


        # Top categories / merchants by spend
        def top_by(col, limit=5):
            if not col: return []
            rows = cur.execute(f"""
                SELECT {col} AS name,
                       SUM({expense_only_sql}) AS spend
                FROM {tx}
                GROUP BY {col}
                ORDER BY spend DESC
                LIMIT {limit}
            """).fetchall() or []
            return [{"name": r["name"], "spend": float(r["spend"] or 0)} for r in rows if r["name"] is not None]

        top_categories = top_by(cat)
        top_merchants  = top_by(merch)

        # Biggest expense in last 30 days
        biggest = None
        if date:
            r = cur.execute(f"""
                SELECT {date} AS d,
                       {expense_only_sql} AS spend_mag,
                       {cat   or 'NULL'} AS what,
                       {merch or 'NULL'} AS who
                FROM {tx}
                WHERE DATE({date}) >= DATE('now','-30 day')
                ORDER BY spend_mag DESC
                LIMIT 1
            """).fetchone()
            if r and (r["spend_mag"] or 0) > 0:
                biggest = {
                    "amount": float(r["spend_mag"] or 0),
                    "date": str(r["d"]),
                    "merchant": r["who"],
                    "category": r["what"],
                }

        return {
            "ready": True,
            "meta": meta,
            "totals": {
                "income": round(income,2),
                "expenses": round(expenses,2),
                "net": round(net,2),
                "count": count,
                "avg_income": round(avg_income,2),
                "avg_expense": round(avg_expense,2),
                "avg_monthly_expense": round(avg_month_expense, 2),
                "months_observed": months_count,
            },
            "latest_month": latest,
            "top_categories": top_categories,
            "top_merchants": top_merchants,
            "biggest_expense_30d": biggest,
        }
        
