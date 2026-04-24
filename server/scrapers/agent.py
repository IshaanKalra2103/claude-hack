from __future__ import annotations

import json

from server.scrapers.local_kb import LocalKnowledgeBase
from server.scrapers.umd_live import (
    available_scraper_keys,
    build_live_resource,
    gather_candidate_urls,
    require_firecrawl,
)


class ScraperAgent:
    """Background research interface for local KB and live UMD scraping."""

    def __init__(self) -> None:
        self.local_kb = LocalKnowledgeBase()

    async def run(self, query: str) -> str:
        kb_hits = self.local_kb.format_hits(query)
        live_hits = self.search_umd_web(query)
        return (
            "Background scraper agent result:\n"
            f"{kb_hits}\n\n"
            f"Live candidate URLs:\n{live_hits}"
        )

    def search_umd_web(self, query: str, limit: int = 8) -> str:
        candidates = gather_candidate_urls(query)[:limit]
        if not candidates:
            available = ", ".join(available_scraper_keys()) or "none"
            return f"No live candidates found. Available scraper keys: {available}."
        return json.dumps(candidates, indent=2)

    def scrape_umd_url(self, url: str) -> str:
        missing = require_firecrawl()
        if missing:
            return missing

        resource = build_live_resource({"url": url, "title": "", "topic_tags": [], "provider": "agent"})
        if not resource:
            return f"No scrape result returned for {url}."
        return json.dumps(resource, indent=2)
