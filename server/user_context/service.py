from __future__ import annotations

import json
import re
from typing import Any

from server.storage import get_connection


class UserContextService:
    def ensure_user(self, phone_e164: str) -> int:
        with get_connection() as conn:
            row = conn.execute("select id from users where phone_e164 = ?", (phone_e164,)).fetchone()
            if row:
                return int(row["id"])
            cursor = conn.execute("insert into users (phone_e164) values (?)", (phone_e164,))
            conn.commit()
            return int(cursor.lastrowid)

    def add_message(self, user_id: int, role: str, body: str | None, provider_message_id: str | None = None) -> None:
        with get_connection() as conn:
            conn.execute(
                "insert into messages (user_id, role, body, provider_message_id) values (?, ?, ?, ?)",
                (user_id, role, body, provider_message_id),
            )
            conn.commit()

    def load_context(self, user_id: int) -> dict[str, Any]:
        with get_connection() as conn:
            user = conn.execute("select * from users where id = ?", (user_id,)).fetchone()
            messages = conn.execute(
                "select role, body, created_at from messages where user_id = ? order by created_at desc limit 12",
                (user_id,),
            ).fetchall()
        return {
            "phone": user["phone_e164"],
            "display_name": user["display_name"],
            "profile_summary": user["profile_summary"],
            "preferences": json.loads(user["preferences_json"] or "{}"),
            "memories": json.loads(user["memories_json"] or "[]"),
            "recent_messages": [dict(row) for row in reversed(messages)],
        }

    def update_from_user_text(self, user_id: int, text: str) -> None:
        with get_connection() as conn:
            user = conn.execute("select * from users where id = ?", (user_id,)).fetchone()
            preferences = json.loads(user["preferences_json"] or "{}")
            memories = json.loads(user["memories_json"] or "[]")
            lower = text.lower()

            if "commuter" in lower:
                preferences["commuter"] = True
            if any(term in lower for term in ("quiet study", "quiet place", "quiet spot", "quiet library")):
                preferences["study_environment"] = "quiet"
            if any(term in lower for term in ("keep it short", "be concise", "short answers")):
                preferences["answer_style"] = "concise"

            year = _extract_year(lower)
            major = _extract_major(text)
            if major:
                preferences["major"] = major
            if year:
                preferences["year"] = year

            struggle = _extract_struggle(text)
            if struggle:
                _upsert_memory(memories, f"needs help with {struggle}")
            if "internship" in lower:
                _upsert_memory(memories, "wants internship help")
            if "resume" in lower:
                _upsert_memory(memories, "wants resume help")

            profile_summary = _build_summary(preferences, memories)
            conn.execute(
                "update users set preferences_json = ?, memories_json = ?, profile_summary = ?, updated_at = current_timestamp where id = ?",
                (json.dumps(preferences), json.dumps(memories[:8]), profile_summary, user_id),
            )
            conn.commit()


def _extract_year(text: str) -> str | None:
    for needle, value in (("freshman", "freshman"), ("sophomore", "sophomore"), ("junior", "junior"), ("senior", "senior")):
        if needle in text:
            return value
    return None


def _extract_major(text: str) -> str | None:
    patterns = (
        re.compile(r"major(?:ing)? in\s+([a-zA-Z0-9&/+ .-]{2,40})", re.I),
        re.compile(r"my major is\s+([a-zA-Z0-9&/+ .-]{2,40})", re.I),
    )
    for pattern in patterns:
        match = pattern.search(text)
        if match:
            return match.group(1).strip(" .,!?:;")
    return None


def _extract_struggle(text: str) -> str | None:
    patterns = (
        re.compile(r"(?:struggling with|behind in|failing|bombing)\s+([a-zA-Z0-9&/+ .-]{2,40})", re.I),
        re.compile(r"need help with\s+([a-zA-Z0-9&/+ .-]{2,40})", re.I),
    )
    for pattern in patterns:
        match = pattern.search(text)
        if match:
            return match.group(1).strip(" .,!?:;")
    return None


def _upsert_memory(memories: list[str], value: str) -> None:
    if value not in memories:
        memories.insert(0, value)


def _build_summary(preferences: dict[str, Any], memories: list[str]) -> str | None:
    parts: list[str] = []
    if preferences.get("year") and preferences.get("major"):
        parts.append(f"{preferences['year']} {preferences['major']} student")
    elif preferences.get("major"):
        parts.append(f"{preferences['major']} student")
    if preferences.get("commuter"):
        parts.append("commuter")
    if preferences.get("study_environment") == "quiet":
        parts.append("prefers quiet study spots")
    if preferences.get("answer_style") == "concise":
        parts.append("prefers concise replies")
    if memories:
        parts.append(memories[0])
    return ", ".join(parts) or None
