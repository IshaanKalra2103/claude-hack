from __future__ import annotations

from typing import Any

import httpx

from server.config import settings


class SendblueService:
    def __init__(self) -> None:
        self.base_url = settings.sendblue_base_url.rstrip("/")

    def is_configured(self) -> bool:
        return bool(settings.sendblue_api_key and settings.sendblue_api_secret and settings.sendblue_from_number)

    async def send_message(self, *, to_number: str, content: str) -> dict[str, Any]:
        if not self.is_configured():
            return {"status": "SKIPPED", "reason": "Sendblue not configured", "content": content}
        payload = {"number": to_number, "from_number": settings.sendblue_from_number, "content": content}
        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.post(
                f"{self.base_url}/api/send-message",
                headers={
                    "sb-api-key-id": settings.sendblue_api_key or "",
                    "sb-api-secret-key": settings.sendblue_api_secret or "",
                    "Content-Type": "application/json",
                },
                json=payload,
            )
            response.raise_for_status()
            return response.json()
