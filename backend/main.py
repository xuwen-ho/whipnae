from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from agents.orchestrator import select_agent
from services.llm_service import LLMService

app = FastAPI(title="Whipnae Backend", version="0.1.0")

# Configure CORS to allow frontend to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="User prompt or question.")


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
