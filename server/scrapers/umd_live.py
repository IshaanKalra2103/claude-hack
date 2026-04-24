from __future__ import annotations

import json
import re
import time
from pathlib import Path
from typing import Any
from urllib import error, request

from server.config import REPO_ROOT, settings


DATA_DIR = REPO_ROOT / "data"
SRC_DIR = REPO_ROOT / "src"

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
        if lower.startswith(("skip to main content", "home |", "search this site")):
            continue
        if cleaned.startswith("- ") or cleaned.count("|") > 3:
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


def exa_search(query: str, tags: list[str] | None = None, limit: int = 8) -> list[dict[str, Any]]:
    if not settings.exa_api_key:
        return []

    payload = {
        "query": query,
        "type": "auto",
        "numResults": limit,
        "includeDomains": OFFICIAL_DOMAINS,
        "contents": {"highlights": {"maxCharacters": 1200}},
    }
    try:
        response = http_json(
            "https://api.exa.ai/search",
            method="POST",
            headers={"x-api-key": settings.exa_api_key},
            payload=payload,
        )
    except (error.HTTPError, error.URLError):
        return []

    results = []
    for result in response.get("results", []):
        url = result.get("url")
        if not url:
            continue
        results.append(
            {
                "url": url,
                "title": result.get("title") or "",
                "excerpt": " ".join(result.get("highlights") or []),
                "topic_tags": tags or [],
                "provider": "exa",
            }
        )
    return results


def parallel_search(query: str, tags: list[str] | None = None) -> list[dict[str, Any]]:
    if not settings.parallel_api_key:
        return []

    payload = {
        "objective": f"Find official University of Maryland student resources for: {query}",
        "search_queries": [query],
        "include_domains": OFFICIAL_DOMAINS,
    }
    try:
        response = http_json(
            "https://api.parallel.ai/v1/search",
            method="POST",
            headers={"x-api-key": settings.parallel_api_key},
            payload=payload,
        )
    except (error.HTTPError, error.URLError):
        return []

    results = []
    for result in response.get("results", []):
        url = result.get("url")
        if not url:
            continue
        results.append(
            {
                "url": url,
                "title": result.get("title") or "",
                "excerpt": " ".join(result.get("excerpts") or []),
                "topic_tags": tags or [],
                "provider": "parallel",
            }
        )
    return results


def firecrawl_scrape(url: str) -> dict[str, Any] | None:
    if not settings.firecrawl_api_key:
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
            headers={"Authorization": f"Bearer {settings.firecrawl_api_key}"},
            payload=payload,
            timeout=90,
        )
    except (error.HTTPError, error.URLError):
        return None

    return response.get("data")


def gather_candidate_urls(query: str | None = None) -> list[dict[str, Any]]:
    candidates: list[dict[str, Any]] = []
    topics = [{"name": "custom", "query": query, "tags": []}] if query else SEARCH_TOPICS

    for topic in topics:
        candidates.extend(exa_search(topic["query"], topic["tags"]))
        candidates.extend(parallel_search(topic["query"], topic["tags"]))

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

    if not deduped and not query:
        for seed in SEED_URLS:
            deduped[seed["url"]] = {**seed, "excerpt": ""}

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


def build_live_resources(query: str | None = None, limit: int | None = None) -> list[dict[str, Any]]:
    candidates = gather_candidate_urls(query)
    if limit is not None:
        candidates = candidates[:limit]

    resources = []
    for candidate in candidates:
        resource = build_live_resource(candidate)
        if resource:
            resources.append(resource)
    return resources


def write_outputs(resources: list[dict[str, Any]]) -> None:
    DATA_DIR.mkdir(exist_ok=True)
    SRC_DIR.mkdir(exist_ok=True)

    json_path = DATA_DIR / "umd_live_resources.json"
    js_path = SRC_DIR / "live-resources.js"

    json_path.write_text(json.dumps(resources, indent=2), encoding="utf-8")
    js_path.write_text(
        "export const liveResources = " + json.dumps(resources, indent=2) + ";\n",
        encoding="utf-8",
    )


def available_scraper_keys() -> list[str]:
    keys = []
    if settings.exa_api_key:
        keys.append("EXA_API_KEY")
    if settings.parallel_api_key:
        keys.append("PARALLEL_API_KEY")
    if settings.firecrawl_api_key:
        keys.append("FIRECRAWL_API_KEY")
    return keys


def require_firecrawl() -> str | None:
    if settings.firecrawl_api_key:
        return None
    return "Missing FIRECRAWL_API_KEY. Firecrawl is required to scrape live pages."
