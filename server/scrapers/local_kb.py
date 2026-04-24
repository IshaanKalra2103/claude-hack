from __future__ import annotations

import re
from pathlib import Path

from server.config import settings


class LocalKnowledgeBase:
    def __init__(self) -> None:
        self.root = Path(settings.local_kb_root)

    def search(self, query: str, limit: int = 3) -> list[dict[str, str | int]]:
        tokens = [token for token in re.findall(r"[a-z0-9]{3,}", query.lower()) if token not in {"the", "and", "for", "with", "that"}]
        hits: list[dict[str, str | int]] = []
        for path in self.root.glob("umd_kb*.md"):
            text = path.read_text(errors="ignore")
            lower = text.lower()
            score = sum(lower.count(token) for token in tokens)
            if score <= 0:
                continue
            hits.append({"path": path.name, "score": score, "snippet": _snippet(text, tokens)})
        hits.sort(key=lambda item: int(item["score"]), reverse=True)
        return hits[:limit]

    def format_hits(self, query: str) -> str:
        hits = self.search(query)
        if not hits:
            return "No local KB hits found."
        return "\n\n".join(
            f"Source: {hit['path']}\nScore: {hit['score']}\nSnippet: {hit['snippet']}" for hit in hits
        )


def _snippet(text: str, tokens: list[str], window: int = 220) -> str:
    lower = text.lower()
    for token in tokens:
        idx = lower.find(token)
        if idx >= 0:
            start = max(0, idx - 80)
            end = min(len(text), idx + window)
            return " ".join(text[start:end].split())
    return " ".join(text[:window].split())
