# CLAUDE HACK

## Terp Support Copilot

Static MVP for the UMD "Campus Intelligence & Equity" track.

### What it does

- Takes a free-text student situation
- Maps the message to a narrow pool of UMD support and involvement resources
- Returns the top matches, why they fit, and what to do next

### Current scope

- UMD official resources only
- Focused on basic needs, academic triage, mental health, legal aid, disability support, first-gen support, and club discovery
- Built as a no-dependency front-end so it can be demoed fast
- Core routing logic lives in `src/copilot.js` so it can be reused from an existing iMessage interface
- Optional live ingestion path now exists for Exa + Parallel + Firecrawl

### Run it

Open [index.html](./index.html) in a browser.

If you want to serve it locally instead of opening the file directly:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

### Live scraping setup

The live ingestion script uses:

- `Exa` for discovery of relevant official UMD URLs
- `Parallel` for additional live web search/ranking
- `Firecrawl` for scraping each URL into clean markdown

It writes generated resources to:

- [data/umd_live_resources.json](/Users/Sathya1/Documents/claude-hack/data/umd_live_resources.json)
- [src/live-resources.js](/Users/Sathya1/Documents/claude-hack/src/live-resources.js)

Set these env vars first:

```bash
export EXA_API_KEY=...
export PARALLEL_API_KEY=...
export FIRECRAWL_API_KEY=...
```

Run the ingester:

```bash
python3 scripts/ingest_umd_live.py
```

Notes:

- `Parallel Web Systems` is treated here as the `Parallel` API at `parallel.ai`
- I did not wire any separate product called `websystems`; if you meant a different vendor, send the docs or API name
- I have not executed the live scrape because the keys are not available in this workspace

### Reuse in your iMessage interface

Import from `src/copilot.js`:

```js
import { formatCopilotResponse, findBestResources } from "./src/copilot.js";
```

Use `formatCopilotResponse(query)` if you want a ready-made response payload, or `findBestResources(query)` if your iMessage layer already formats messages itself.
