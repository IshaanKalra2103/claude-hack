from __future__ import annotations

import asyncio
from typing import Any

from server.chat import ShellMateChatAgent
from server.user_context import UserContextService

from imessage_agent.sendblue_adapter import parse_sendblue_payload
from imessage_agent.sendblue_service import SendblueService


class ShellMateIMessageService:
    def __init__(self) -> None:
        self.chat_agent = ShellMateChatAgent()
        self.user_context = UserContextService()
        self.sendblue = SendblueService()

    async def handle_payload(self, payload: dict[str, Any]) -> None:
        event = parse_sendblue_payload(payload)
        phone = event["from_number"]
        user_id = self.user_context.ensure_user(phone)
        self.user_context.add_message(user_id, "user", event.get("text"), event.get("message_id"))
        self.user_context.update_from_user_text(user_id, event.get("text") or "")

        if _should_delegate_search(event.get("text") or ""):
            ack = "looking into that now - keep texting me if you want, and i’ll send the deeper answer when it’s ready"
            await self.sendblue.send_message(to_number=phone, content=ack)
            self.user_context.add_message(user_id, "assistant", ack)
            asyncio.create_task(self._background_followup(user_id=user_id, phone=phone, user_text=event.get("text") or ""))
            return

        context = self.user_context.load_context(user_id)
        reply = await self.chat_agent.reply(context=context, user_text=event.get("text") or "")
        await self.sendblue.send_message(to_number=phone, content=reply)
        self.user_context.add_message(user_id, "assistant", reply)

    async def _background_followup(self, *, user_id: int, phone: str, user_text: str) -> None:
        context = self.user_context.load_context(user_id)
        reply = await self.chat_agent.reply(context=context, user_text=user_text, delegated_search=True)
        await self.sendblue.send_message(to_number=phone, content=reply)
        self.user_context.add_message(user_id, "assistant", reply)


def _should_delegate_search(text: str) -> bool:
    lowered = text.lower().strip()
    if len(lowered.split()) < 5:
        return False
    keywords = (
        "find",
        "where",
        "what",
        "which",
        "deadline",
        "office hours",
        "resource",
        "scholarship",
        "internship",
        "career",
        "tutoring",
        "advising",
        "support",
        "help me with",
    )
    return any(keyword in lowered for keyword in keywords)
