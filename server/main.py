from __future__ import annotations

from fastapi import BackgroundTasks, FastAPI, Request
from pydantic import BaseModel

from imessage_agent import ShellMateIMessageService
from server.storage import init_db


class DebugChatRequest(BaseModel):
    phone: str
    text: str


app = FastAPI(title="ShellMate", version="0.1.0")
service = ShellMateIMessageService()


@app.on_event("startup")
async def startup() -> None:
    init_db()


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "service": "shellmate"}


@app.post("/webhooks/sendblue")
async def sendblue_webhook(request: Request, background: BackgroundTasks) -> dict[str, bool]:
    payload = await request.json()
    background.add_task(service.handle_payload, payload)
    return {"ok": True}


@app.post("/api/debug/chat")
async def debug_chat(body: DebugChatRequest, background: BackgroundTasks) -> dict[str, bool]:
    background.add_task(service.handle_payload, {"from_number": body.phone, "content": body.text})
    return {"ok": True}
