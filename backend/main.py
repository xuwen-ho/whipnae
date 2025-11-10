from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from database.database import fetch_transactions

from agents.orchestrator import select_agent

app = FastAPI(title="Whipnae Backend", version="0.1.0")

# --- CORS so the Next.js app (localhost:3000 by default) can call this directly ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],  # tighten in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="User prompt or question.")


class ChatResponse(BaseModel):
    reply: str
    source: str | None = Field(default=None, description="Agent identifier that generated the reply.")


@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(payload: ChatRequest) -> ChatResponse:
    agent = select_agent(intent="financial")
    if agent is None:
        raise HTTPException(status_code=503, detail="No agent available to process the request.")

    try:
        reply = await agent.handle_message(payload.message)
    except NotImplementedError as exc:
        raise HTTPException(status_code=501, detail="Agent capability not implemented yet.") from exc

    return ChatResponse(reply=reply, source=getattr(agent, "name", None))


# ---------- New: transactions (optional, handy for debugging) ----------
@app.get("/transactions")
async def get_transactions(limit: int = 10):
    rows = fetch_transactions(limit=limit)
    return [
        {
            "id": int(r["id"]),
            "occurred_on": r["occurred_on"],
            "description": r["description"],
            "amount": float(r["amount"]),
        }
        for r in rows
    ]

# ---------- New: insights for the home page ----------
@app.get("/insights")
async def get_insights():
    """
    Returns cards shaped for the frontend's <InsightsRail>.
    You can expand this logic later (ML, categorization, etc.).
    """
    rows = fetch_transactions(limit=100)

    total_income = sum(float(r["amount"]) for r in rows if float(r["amount"]) > 0)
    total_expenses = -sum(float(r["amount"]) for r in rows if float(r["amount"]) < 0)
    net = total_income - total_expenses

    def fmt_usd(x: float) -> str:
        return f"${x:,.2f}"

    cards = [
        {
            "id": "ai-expenses",
            "amount": fmt_usd(total_expenses),
            "description": "AI-detected expenses",
            "subDescription": "Last 100 txns",
        },
        {
            "id": "net-cashflow",
            "amount": fmt_usd(net),
            "description": "Net cash flow",
            "subDescription": "Income − Expenses",
        },
        {
            "id": "income",
            "amount": fmt_usd(total_income),
            "description": "Recognized income",
            "subDescription": "Last 100 txns",
        },
    ]
    return cards