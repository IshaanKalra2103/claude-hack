from __future__ import annotations

import json
from typing import Any

from openai import AsyncOpenAI

from server.config import settings
from server.scrapers import ScraperAgent
from server.scrapers.local_kb import LocalKnowledgeBase


class ShellMateChatAgent:
    def __init__(self) -> None:
        self.client = AsyncOpenAI(api_key=settings.openai_api_key) if settings.openai_api_key else None
        self.scraper_agent = ScraperAgent()
        self.local_kb = LocalKnowledgeBase()

    async def reply(self, *, context: dict[str, Any], user_text: str, delegated_search: bool = False) -> str:
        if not self.client:
            return "i’m not fully wired up yet - set OPENAI_API_KEY and i can help properly"

        sdk_reply = await self._try_agents_sdk(context=context, user_text=user_text)
        if sdk_reply:
            return sdk_reply
        return await self._fallback_reply(context=context, user_text=user_text, delegated_search=delegated_search)

    async def _try_agents_sdk(self, *, context: dict[str, Any], user_text: str) -> str | None:
        try:
            from agents import Agent, Runner, function_tool
        except Exception:
            return None

        kb = self.local_kb
        scraper = self.scraper_agent

        @function_tool
        def search_local_kb(query: str) -> str:
            return kb.format_hits(query)

        @function_tool
        async def scraper_search(query: str) -> str:
            return await scraper.run(query)

        @function_tool
        def search_umd_web(query: str) -> str:
            return scraper.search_umd_web(query)

        @function_tool
        def scrape_umd_url(url: str) -> str:
            return scraper.scrape_umd_url(url)

        scraper_agent = Agent(
            name="ShellMate Scraper Agent",
            instructions=(
                "You are ShellMate's background research agent. Use scraper_search for local context plus live candidates, "
                "search_umd_web to discover official UMD URLs, and scrape_umd_url to turn one URL into a structured resource. "
                "Summarize only the useful bits and return them to the main chat agent."
            ),
            model=settings.openai_scraper_model,
            tools=[scraper_search, search_umd_web, scrape_umd_url],
        )
        chat_agent = Agent(
            name="ShellMate",
            instructions=(
                "You are ShellMate - Campus Helping buddy for UMD. Be warm, concise, and useful. Use search_local_kb for general campus questions. "
                "Use search_umd_web and scrape_umd_url when the answer needs current official UMD web context. "
                "If the user needs deeper research, hand off to the scraper agent. Reply as plain text messages, no markdown, no bullets."
            ),
            model=settings.openai_main_model,
            tools=[search_local_kb, scraper_search, search_umd_web, scrape_umd_url],
            handoffs=[scraper_agent],
        )
        result = await Runner.run(chat_agent, input=json.dumps({"context": context, "user_text": user_text}))
        final_output = getattr(result, "final_output", None)
        if isinstance(final_output, str) and final_output.strip():
            return final_output.strip()
        return str(final_output).strip() if final_output else None

    async def _fallback_reply(self, *, context: dict[str, Any], user_text: str, delegated_search: bool) -> str:
        kb_hits = self.local_kb.format_hits(user_text)
        system = (
            "You are ShellMate - Campus Helping buddy for UMD. Reply like a helpful older student in 1-3 short text bubbles worth of plain text. "
            "No markdown, no bullet lists, no em-dashes."
        )
        if delegated_search:
            system += " This is a background follow-up, so give the useful answer directly."
        response = await self.client.chat.completions.create(
            model=settings.openai_main_model,
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": json.dumps({"context": context, "user_text": user_text, "local_kb": kb_hits})},
            ],
            max_tokens=280,
        )
        return (response.choices[0].message.content or "").strip() or "i looked and here’s the best next step i found"
