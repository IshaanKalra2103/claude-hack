from __future__ import annotations

from server.scrapers.local_kb import LocalKnowledgeBase


class ScraperAgent:
    """Background research interface.

    Live Exa / Firecrawl / parallel web integrations can replace this later.
    For now, it uses the local KB plus a clear stub so the handoff path works.
    """

    def __init__(self) -> None:
        self.local_kb = LocalKnowledgeBase()

    async def run(self, query: str) -> str:
        kb_hits = self.local_kb.format_hits(query)
        return (
            "Background scraper agent result:\n"
            f"{kb_hits}\n\n"
            "Live scraper integrations are not wired yet. Drop Firecrawl output into the local KB or replace this agent with Exa + Firecrawl calls."
        )
