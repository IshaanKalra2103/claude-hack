from __future__ import annotations

from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = Path(__file__).resolve().parent
REPO_ROOT = BASE_DIR.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(str(REPO_ROOT / ".env"), str(BASE_DIR / ".env")),
        extra="ignore",
    )

    app_env: str = "dev"
    openai_api_key: str | None = None
    openai_main_model: str = "gpt-5.4-mini-2026-03-17"
    openai_scraper_model: str = "gpt-5.4-mini-2026-03-17"
    sendblue_base_url: str = "https://api.sendblue.co"
    sendblue_api_key: str | None = None
    sendblue_api_secret: str | None = None
    sendblue_from_number: str | None = None
    exa_api_key: str | None = None
    parallel_api_key: str | None = None
    firecrawl_api_key: str | None = None
    database_path: str = str(BASE_DIR / "shellmate.db")
    local_kb_root: str = str(BASE_DIR)


settings = Settings()
