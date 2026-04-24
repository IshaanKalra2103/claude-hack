#!/usr/bin/env python3
"""
Live UMD resource ingestion.

Pipeline:
1. Exa search discovers relevant official UMD URLs.
2. Parallel search discovers and ranks additional official UMD URLs.
3. Firecrawl scrapes the URLs into clean markdown.
4. The script writes:
   - data/umd_live_resources.json
   - src/live-resources.js

Environment variables:
  EXA_API_KEY
  PARALLEL_API_KEY
  FIRECRAWL_API_KEY
"""

from __future__ import annotations

import json
import os
import re
import sys
import time
from pathlib import Path
from typing import Any
from urllib import error, request

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"
SRC_DIR = ROOT / "src"
DATA_DIR.mkdir(exist_ok=True)

OFFICIAL_DOMAINS = [
    "umd.edu",
    "studentaffairs.umd.edu",
    "deanofstudents.umd.edu",
    "stamp.umd.edu",
    "terplink.umd.edu",
    "financialaid.umd.edu",
    "counseling.umd.edu",
    "ads.umd.edu",
    "reslife.umd.edu",
    "undergradlegalaid.umd.edu",
]

SEARCH_TOPICS = [
    {
        "name": "basic-needs",
        "query": "University of Maryland College Park student emergency housing food pantry counseling dean of students emergency grants",
        "tags": ["basic-needs", "food", "housing", "wellbeing", "finances"],
    },
    {
        "name": "academic-support",
        "query": "University of Maryland College Park academic support tutoring accessibility disability service first generation support",
        "tags": ["academics", "disability", "first-gen"],
    },
    {
        "name": "clubs",
        "query": "University of Maryland College Park TerpLink student organizations joining a club First Look Fair Second Look Fair SORC",
        "tags": ["clubs", "community", "belonging", "events"],
    },
]

SEED_URLS = [
    {
        "url": "https://studentaffairs.umd.edu/support-resources/thrive-center-for-essential-needs",
        "title": "Thrive Center for Essential Needs",
        "topic_tags": ["basic-needs", "food", "housing", "finances", "wellbeing", "first-gen"],
        "provider": "seed",
    },
    {
        "url": "https://studentaffairs.umd.edu/support-resources/dean-students/campus-pantry",
        "title": "Campus Pantry",
        "topic_tags": ["basic-needs", "food"],
        "provider": "seed",
    },
    {
        "url": "https://studentaffairs.umd.edu/thrive-center-essential-needs/housing",
        "title": "Housing Support",
        "topic_tags": ["basic-needs", "housing"],
        "provider": "seed",
    },
    {
        "url": "https://studentaffairs.umd.edu/thrive-center-essential-needs/finances",
        "title": "Financial Wellness",
        "topic_tags": ["basic-needs", "finances"],
        "provider": "seed",
    },
    {
        "url": "https://deanofstudents.umd.edu/get-help",
        "title": "Dean of Students Get Help",
        "topic_tags": ["triage", "basic-needs", "academics"],
        "provider": "seed",
    },
    {
        "url": "https://counseling.umd.edu/",
        "title": "Counseling Center",
        "topic_tags": ["wellbeing", "crisis"],
        "provider": "seed",
    },
    {
        "url": "https://undergradlegalaid.umd.edu/legal-advice",
        "title": "Undergraduate Student Legal Aid Office",
        "topic_tags": ["legal", "housing"],
        "provider": "seed",
    },
    {
        "url": "https://ads.umd.edu/",
        "title": "Accessibility & Disability Service",
        "topic_tags": ["disability", "academics"],
        "provider": "seed",
    },
    {
        "url": "https://terplink.umd.edu/organizations",
        "title": "TerpLink Organization Directory",
        "topic_tags": ["clubs", "community", "events"],
        "provider": "seed",
    },
    {
        "url": "https://stamp.umd.edu/get_involved/student_org_resource_center_sorc",
        "title": "Student Org Resource Center",
        "topic_tags": ["clubs", "community", "triage"],
        "provider": "seed",
    },
    {
        "url": "https://stamp.umd.edu/activities/student_org_resource_center_sorc/get_involved/joining_club",
        "title": "Joining a Club Guide",
        "topic_tags": ["clubs", "community", "triage"],
        "provider": "seed",
    },
    {
        "url": "https://stamp.umd.edu/get_involved/student_org_resource_center_sorc/get_involved/second_look_fair",
        "title": "Second Look Fair",
        "topic_tags": ["clubs", "community", "events"],
        "provider": "seed",
    },
    {
        "url": "https://stamp.umd.edu/get_involved/student_org_resource_center_sorc/get_involved/second_look_fair/organization_list",
        "title": "Second Look Fair Organization List",
        "topic_tags": ["clubs", "community", "categories"],
        "provider": "seed",
    },
]


def http_json(
    url: str,
    method: str = "GET",
    headers: dict[str, str] | None = None,
    payload: dict[str, Any] | None = None,
    timeout: int = 60,
) -> dict[str, Any]:
    body = None
    req_headers = headers or {}
    if payload is not None:
        body = json.dumps(payload).encode("utf-8")
        req_headers["Content-Type"] = "application/json"

    req = request.Request(url=url, method=method, headers=req_headers, data=body)
    with request.urlopen(req, timeout=timeout) as resp:
        data = resp.read().decode("utf-8")
        return json.loads(data)


def slugify(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")


def first_paragraph(markdown: str) -> str:
    chunks = [chunk.strip() for chunk in re.split(r"\n\s*\n", markdown) if chunk.strip()]
    for chunk in chunks:
        cleaned = re.sub(r"^#+\s*", "", chunk).strip()
        cleaned = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", cleaned)
        cleaned = re.sub(r"!\[[^\]]*\]\([^)]+\)", "", cleaned)
        cleaned = re.sub(r"\s+", " ", cleaned).strip()
        lower = cleaned.lower()
        if lower.startswith("skip to main content"):
            continue
        if lower.startswith("home |"):
            continue
        if lower.startswith("search this site"):
            continue
        if cleaned.startswith("- "):
            continue
        if cleaned.count("|") > 3:
            continue
        if len(cleaned) >= 80:
            return cleaned[:300]
    return chunks[0][:300] if chunks else ""


def infer_tags(text: str, seeded_tags: list[str]) -> list[str]:
    haystack = text.lower()
    tags = set(seeded_tags)
    rules = {
        "food": ["food", "meal", "pantry", "groceries"],
        "housing": ["housing", "rent", "landlord", "homeless"],
        "wellbeing": ["mental health", "counsel", "well-being", "wellbeing"],
        "finances": ["financial", "grant", "aid", "scholarship", "money"],
        "academics": ["tutoring", "academic", "class", "study"],
        "clubs": ["organization", "club", "terplink", "student org"],
        "community": ["community", "belonging", "involvement"],
        "events": ["fair", "event"],
        "disability": ["disability", "accommodation", "accessibility"],
        "legal": ["legal", "landlord", "immigration", "contract"],
        "first-gen": ["first-gen", "first generation"],
    }
    for tag, keywords in rules.items():
        if any(keyword in haystack for keyword in keywords):
            tags.add(tag)
    return sorted(tags)


def infer_keywords(title: str, summary: str, url: str) -> list[str]:
    text = f"{title} {summary} {url}".lower()
    candidates = [
        "rent",
        "housing",
        "food",
        "groceries",
        "mental health",
        "counseling",
        "financial aid",
        "first gen",
        "first-generation",
        "clubs",
        "organization",
        "terplink",
        "second look fair",
        "student org",
        "legal",
        "accommodation",
        "tutoring",
    ]
    return [candidate for candidate in candidates if candidate in text]


def exa_search(topic: dict[str, Any]) -> list[dict[str, Any]]:
    api_key = os.environ.get("EXA_API_KEY")
    if not api_key:
      return []

    payload = {
        "query": topic["query"],
        "type": "auto",
        "numResults": 8,
        "includeDomains": OFFICIAL_DOMAINS,
        "contents": {"highlights": {"maxCharacters": 1200}},
    }
    try:
        response = http_json(
            "https://api.exa.ai/search",
            method="POST",
            headers={"x-api-key": api_key},
            payload=payload,
        )
    except error.HTTPError as exc:
        print(f"Exa search failed for topic {topic['name']}: {exc}", file=sys.stderr)
        return []
    return response.get("results", [])


def parallel_search(topic: dict[str, Any]) -> list[dict[str, Any]]:
    api_key = os.environ.get("PARALLEL_API_KEY")
    if not api_key:
        return []

    payload = {
        "objective": f"Find official University of Maryland student resources for: {topic['query']}",
        "search_queries": [topic["query"]],
        "include_domains": OFFICIAL_DOMAINS,
    }
    try:
        response = http_json(
            "https://api.parallel.ai/v1/search",
            method="POST",
            headers={"x-api-key": api_key},
            payload=payload,
        )
    except error.HTTPError as exc:
        print(f"Parallel search failed for topic {topic['name']}: {exc}", file=sys.stderr)
        return []
    return response.get("results", [])


def firecrawl_scrape(url: str) -> dict[str, Any] | None:
    api_key = os.environ.get("FIRECRAWL_API_KEY")
    if not api_key:
        return None

    payload = {
        "url": url,
        "formats": ["markdown"],
        "onlyMainContent": True,
        "maxAge": 0,
    }
    try:
        response = http_json(
            "https://api.firecrawl.dev/v2/scrape",
            method="POST",
            headers={"Authorization": f"Bearer {api_key}"},
            payload=payload,
            timeout=90,
        )
    except error.HTTPError as exc:
        print(f"Firecrawl scrape failed for {url}: {exc}", file=sys.stderr)
        return None

    return response.get("data")


def gather_candidate_urls() -> list[dict[str, Any]]:
    candidates: list[dict[str, Any]] = []

    for topic in SEARCH_TOPICS:
        for result in exa_search(topic):
            url = result.get("url")
            if not url:
                continue
            candidates.append(
                {
                    "url": url,
                    "title": result.get("title") or "",
                    "excerpt": " ".join(result.get("highlights") or []),
                    "topic_tags": topic["tags"],
                    "provider": "exa",
                }
            )

        for result in parallel_search(topic):
            url = result.get("url")
            if not url:
                continue
            excerpt = " ".join(result.get("excerpts") or [])
            candidates.append(
                {
                    "url": url,
                    "title": result.get("title") or "",
                    "excerpt": excerpt,
                    "topic_tags": topic["tags"],
                    "provider": "parallel",
                }
            )

    deduped: dict[str, dict[str, Any]] = {}
    for candidate in candidates:
        url = candidate["url"]
        if url not in deduped:
            deduped[url] = candidate
            continue

        merged_tags = set(deduped[url].get("topic_tags", [])) | set(candidate.get("topic_tags", []))
        deduped[url]["topic_tags"] = sorted(merged_tags)
        if len(candidate.get("excerpt", "")) > len(deduped[url].get("excerpt", "")):
            deduped[url]["excerpt"] = candidate["excerpt"]
        if not deduped[url].get("title") and candidate.get("title"):
            deduped[url]["title"] = candidate["title"]

    if not deduped:
        for seed in SEED_URLS:
            deduped[seed["url"]] = {
                **seed,
                "excerpt": "",
            }

    return list(deduped.values())


def build_live_resource(candidate: dict[str, Any]) -> dict[str, Any] | None:
    scraped = firecrawl_scrape(candidate["url"])
    if not scraped:
        return None

    markdown = scraped.get("markdown", "")
    title = scraped.get("metadata", {}).get("title") or candidate.get("title") or candidate["url"]
    summary = first_paragraph(markdown) or candidate.get("excerpt", "")[:300]
    office = scraped.get("metadata", {}).get("ogSiteName") or "Official UMD Resource"
    all_text = f"{title}\n{summary}\n{markdown[:600]}"
    tags = infer_tags(all_text, candidate.get("topic_tags", []))

    return {
        "id": f"live-{slugify(title)}",
        "name": title.strip(),
        "office": office,
        "summary": summary.strip(),
        "tags": tags,
        "keywords": infer_keywords(title, summary, candidate["url"]),
        "urgency": "medium",
        "nextStep": "Open the official page and follow the contact, join, or request instructions there.",
        "reasonTemplate": "Fresh result pulled from official UMD web content.",
        "url": candidate["url"],
        "sourceProviders": sorted({candidate["provider"], "firecrawl"}),
        "fetchedAt": int(time.time()),
    }


def write_outputs(resources: list[dict[str, Any]]) -> None:
    json_path = DATA_DIR / "umd_live_resources.json"
    js_path = SRC_DIR / "live-resources.js"

    json_path.write_text(json.dumps(resources, indent=2), encoding="utf-8")
    js_path.write_text(
        "export const liveResources = " + json.dumps(resources, indent=2) + ";\n",
        encoding="utf-8",
    )


def main() -> int:
    available = [key for key in ("EXA_API_KEY", "PARALLEL_API_KEY", "FIRECRAWL_API_KEY") if os.environ.get(key)]
    if "FIRECRAWL_API_KEY" not in available:
        print("Missing FIRECRAWL_API_KEY. Firecrawl is required to build the live resource dataset.", file=sys.stderr)
        return 1
    if not available:
        print("No API keys available.", file=sys.stderr)
        return 1

    candidates = gather_candidate_urls()
    resources = []
    for candidate in candidates:
        resource = build_live_resource(candidate)
        if resource:
            resources.append(resource)

    write_outputs(resources)
    print(f"Wrote {len(resources)} live resources to data/umd_live_resources.json and src/live-resources.js")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
