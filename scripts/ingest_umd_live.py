#!/usr/bin/env python3
"""Live UMD resource ingestion wrapper."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from server.scrapers.umd_live import available_scraper_keys, build_live_resources, require_firecrawl, write_outputs  # noqa: E402


def main() -> int:
    missing_firecrawl = require_firecrawl()
    if missing_firecrawl:
        print(missing_firecrawl, file=sys.stderr)
        return 1
    available = available_scraper_keys()
    if not available:
        print("No API keys available.", file=sys.stderr)
        return 1

    resources = build_live_resources()
    write_outputs(resources)
    print(f"Wrote {len(resources)} live resources to data/umd_live_resources.json and src/live-resources.js")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
