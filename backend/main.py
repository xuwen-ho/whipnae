# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel, Field
# from database.database import fetch_transactions
# from agents.orchestrator import select_agent


# app = FastAPI(title="Whipnae Backend", version="0.1.0")

# # --- CORS so the Next.js app (localhost:3000 by default) can call this directly ---
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],  # tighten in prod
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# class ChatRequest(BaseModel):
#     message: str = Field(..., min_length=1, description="User prompt or question.")


# class ChatResponse(BaseModel):
#     reply: str
#     source: str | None = Field(default=None, description="Agent identifier that generated the reply.")


# @app.post("/chat", response_model=ChatResponse)
# async def chat_endpoint(payload: ChatRequest) -> ChatResponse:
#     agent = select_agent(intent="financial")
#     if agent is None:
#         raise HTTPException(status_code=503, detail="No agent available to process the request.")

#     try:
#         reply = await agent.handle_message(payload.message)
#     except NotImplementedError as exc:
#         raise HTTPException(status_code=501, detail="Agent capability not implemented yet.") from exc

#     return ChatResponse(reply=reply, source=getattr(agent, "name", None))


# # ---------- New: transactions (optional, handy for debugging) ----------
# @app.get("/transactions")
# async def get_transactions(limit: int = 10):
#     rows = fetch_transactions(limit=limit)
#     return [
#         {
#             "id": int(r["id"]),
#             "occurred_on": r["occurred_on"],
#             "description": r["description"],
#             "amount": float(r["amount"]),
#         }
#         for r in rows
#     ]

# # ---------- New: insights for the home page ----------
# @app.get("/insights")
# async def get_insights():
#     """
#     Returns cards shaped for the frontend's <InsightsRail>.
#     You can expand this logic later (ML, categorization, etc.).
#     """
#     rows = fetch_transactions(limit=100)

#     total_income = sum(float(r["amount"]) for r in rows if float(r["amount"]) > 0)
#     total_expenses = -sum(float(r["amount"]) for r in rows if float(r["amount"]) < 0)
#     net = total_income - total_expenses

#     def fmt_usd(x: float) -> str:
#         return f"${x:,.2f}"

#     cards = [
#         {
#         "id": "total-income",
#         "amount": f"${total_income:,.2f}",
#         "description": "Total income",
#         "subDescription": "Month-to-date",
#         },
#         {
#         "id": "total-expenses",
#         "amount": f"${abs(total_expenses):,.2f}",
#         "description": "Total expenses",
#         "subDescription": "Month-to-date",
#         },
#         {
#         "id": "net-balance",
#         "amount": f"${net:,.2f}",
#         "description": "Net balance",
#         "subDescription": "Current",
#         },
#     ]
#     return cards


from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database.database import fetch_transactions, compute_insights  # NEW
from database.database import list_recurring, patch_recurring, create_recurring

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_methods=["*"], allow_headers=["*"]
)

@app.get("/transactions")
def list_transactions(limit: int = 100):
    rows = fetch_transactions(limit=limit)
    return {"items": rows}

@app.get("/insights")
def get_insights():
    data = compute_insights()
    if not data.get("ready"):
        raise HTTPException(status_code=500, detail=data.get("reason","insights unavailable"))
    return data

@app.get("/recurring")
def get_recurring(limit: int = 200):
    rows = list_recurring(limit=limit)
    # return rows as plain dicts
    return {"items": [dict(r) for r in rows]}

@app.patch("/recurring/{rc_id}")
def update_recurring(rc_id: int, payload: dict):
    result = patch_recurring(
        rc_id,
        name=payload.get("name"),
        cadence=payload.get("cadence"),
        amount=payload.get("amount"),
        currency=payload.get("currency"),
        recurring=payload.get("recurring"),  # 1 = ON, 0 = OFF
        notes=payload.get("notes"),
    )
    if result.get("updated", 0) == 0:
        raise HTTPException(status_code=404, detail="Recurring item not found or no changes.")
    return result["item"]

@app.post("/recurring")
def post_recurring(payload: dict):
    item = create_recurring(
        name=payload["name"],
        cadence=payload.get("cadence", "Monthly"),
        amount=float(payload.get("amount", 0)),
        currency=payload.get("currency", "CNY"),
        recurring=int(1 if payload.get("recurring", 1) else 0),
        notes=payload.get("notes", ""),
    )
    return item
