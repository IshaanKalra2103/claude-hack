ShellMate - Campus Helping buddy for UMD

Repo layout:

- `imessage_agent/`: Sendblue adapter, outbound sender, and non-blocking iMessage orchestration
- `server/chat/`: ShellMate chat agent using OpenAI Agents SDK with scraper handoff
- `server/scrapers/`: local KB search plus scraper-agent stub for Exa/Firecrawl replacement
- `server/user_context/`: SQLite-backed user preferences, memories, and message history
- `server/main.py`: FastAPI entrypoint
