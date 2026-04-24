from __future__ import annotations

from datetime import datetime, timezone
from uuid import uuid4


def parse_sendblue_payload(payload: dict) -> dict:
    message_handle_raw = payload.get("message_handle")
    message_handle = str(message_handle_raw) if message_handle_raw else None
    message_id = str(
        message_handle_raw
        or payload.get("message_id")
        or payload.get("id")
        or payload.get("uuid")
        or payload.get("trace_id")
        or uuid4().hex
    )
    return {
        "message_id": message_id,
        "message_handle": message_handle,
        "from_number": str(payload.get("from_number") or payload.get("number") or "unknown"),
        "to_number": str(payload.get("to_number")) if payload.get("to_number") else None,
        "received_at": _parse_date(payload.get("date_sent")) or datetime.now(timezone.utc),
        "text": payload.get("content") or payload.get("text") or "",
    }


def _parse_date(value: str | None) -> datetime | None:
    if not value:
        return None
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except Exception:
        return None
