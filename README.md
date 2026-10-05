# مِداد · MIDAD

**Smart Infrastructure for Trusted Islamic Knowledge** — منصة البنية التحتية الذكية للمعرفة الإسلامية الموثوقة.

MIDAD brings Islamic sources together into a unified, structured, searchable knowledge base. AI extracts concepts and relationships, human specialists review them before approval, and every item is linked to its source and verification status. The platform offers semantic search, a knowledge graph, an AI assistant, and a developer API.

## What's in this version
- Trilingual UI: Arabic (RTL), English, Indonesian — switch from the header.
- Day / night themes in greens and beige; preferences are saved in the browser.
- Screens: Home, Explore, Knowledge Graph, AI Assistant, Sources, Review, Developers, Support.
- Customer-support chat with instant auto-replies (floating button on every page).
- Sign-language interpreter panel for Deaf and hard-of-hearing users (header button, or the ✋ icon on any text).
- 49 sample texts (hadith, ayat, athar) across 19 classical sources, with references, grades and verification status.

## Tech
TanStack Start (React 19, file-based routing) · Vite 7 · Tailwind CSS 4 · lucide-react · Netlify (Image CDN).

## Run locally
```bash
pnpm install
netlify dev   # or: pnpm dev
```

## Roadmap
The data currently comes from `src/data/fixtures.ts`. Next up: database-backed knowledge model, reviewer accounts, the persisted review workflow, real semantic search, AI extraction, a grounded LLM assistant, and the public API. See [PLAN.md](./PLAN.md).
