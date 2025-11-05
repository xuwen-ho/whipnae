from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from agents.orchestrator import select_agent

app = FastAPI(title="Whipnae Backend", version="0.1.0")


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
