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
from pydantic import BaseModel, Field

from agents.orchestrator import select_agent
from services.llm_service import LLMService
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

# Configure CORS to allow frontend to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

class ChatResponse(BaseModel):
    reply: str
    source: str | None = Field(default=None, description="Agent identifier that generated the reply.")


class ProfileInsightsRequest(BaseModel):
    userName: str = Field(..., description="User's first name")
    profileType: str = Field(..., description="Profile type category")
    profileName: str = Field(..., description="Profile category name")
    riskScore: float = Field(..., ge=0, le=10, description="Risk score from 0-10")
    profileSummary: str = Field(..., description="Profile summary text")
    characteristics: dict = Field(..., description="Profile characteristics")
    recommendations: list[str] = Field(..., description="Existing recommendations")


class ProfileInsightsResponse(BaseModel):
    insights: list[str] = Field(..., description="3 personalized AI-generated insights")
    personalizationSummary: str = Field(..., description="How AI personalizes for this user")


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


@app.post("/profile/insights", response_model=ProfileInsightsResponse)
async def generate_profile_insights(payload: ProfileInsightsRequest) -> ProfileInsightsResponse:
    """
    Generate personalized AI insights based on user's financial profile.

    Takes the complete financial profile and returns 3 actionable insights
    plus a personalization summary.
    """
    llm_service = LLMService()

    # Build a simpler prompt for the LLM to reduce errors
    prompt = f"""Provide 3 brief financial tips for {payload.userName} based on:
- Risk score: {payload.riskScore}/10
- Time horizon: {payload.characteristics.get('timeHorizon', 'medium')}
- Knowledge: {payload.characteristics.get('knowledgeLevel', 'intermediate')}

Return ONLY valid JSON in this exact format:
{{
  "insights": ["tip 1", "tip 2", "tip 3"],
  "personalizationSummary": "brief summary"
}}

Keep each tip under 100 characters."""

    try:
        import json
        import traceback

        response_text = await llm_service.generate_response(prompt)
        print(f"LLM Response: {response_text}")  # Debug logging

        # Parse JSON response from LLM
        try:
            # Strip markdown code blocks if present
            cleaned_text = response_text.strip()
            if cleaned_text.startswith("```json"):
                cleaned_text = cleaned_text[7:]  # Remove ```json
            elif cleaned_text.startswith("```"):
                cleaned_text = cleaned_text[3:]  # Remove ```

            if cleaned_text.endswith("```"):
                cleaned_text = cleaned_text[:-3]  # Remove trailing ```

            cleaned_text = cleaned_text.strip()

            response_data = json.loads(cleaned_text)
            insights = response_data.get("insights", [])
            personalization_summary = response_data.get("personalizationSummary", "")

            # Validate we got 3 insights
            if len(insights) < 3:
                # Pad with generic insights if needed
                while len(insights) < 3:
                    insights.append("Continue monitoring your financial goals and adjust as needed.")

            return ProfileInsightsResponse(
                insights=insights[:3],  # Ensure exactly 3
                personalizationSummary=personalization_summary or f"AI adapts recommendations to {payload.userName}'s {payload.characteristics.get('riskTolerance', 'unique')} risk profile"
            )

        except json.JSONDecodeError as e:
            # Fallback if LLM doesn't return valid JSON
            print(f"JSON Parse Error: {str(e)}")
            print(f"Response was: {response_text}")
            raise HTTPException(
                status_code=500,
                detail="Failed to parse LLM response. Please try again."
            )

    except ValueError as e:
        # No API key configured
        print(f"ValueError: {str(e)}")
        traceback.print_exc()
        raise HTTPException(
            status_code=503,
            detail=str(e)
        )

    except RuntimeError as e:
        # LLM API error
        print(f"RuntimeError: {str(e)}")
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"AI service error: {str(e)}"
        )

    except Exception as e:
        # Catch all other errors
        import sys
        print(f"Unexpected error: {str(e)}", file=sys.stdout, flush=True)
        traceback.print_exc()
        sys.stdout.flush()
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error: {str(e)}"
        )
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
