# MIDAD (مِداد) — Product Roadmap

MIDAD is a smart infrastructure for trusted Islamic knowledge. The platform is staged into small, self-contained milestones so each one ships something usable.

## ✅ Milestone 1 — Product surface (done)
Branded, trilingual (Arabic / English / Indonesian, RTL + LTR) site with day/night themes and the MIDAD logo.
- Landing page, Knowledge Explorer (semantic-search stub + filters), Knowledge Graph, AI Assistant (retrieval stub with citations), Sources library, Human Review console, Developers / API docs, Customer Support (auto-reply chat + FAQ + contact form).
- Sign-language interpreter panel (captions, word highlighting, fingerspelling, speed, large text) available from every page and from every text card.
- All data lives in `src/data/fixtures.ts`.

## ✅ Milestone 1.5 — Accounts, Mushaf & review routing (done)
- Netlify Identity sign-in / sign-up / guest / admin; admin-only Review console and Admin dashboard.
- Full Mushaf reader with a daily reading streak; unanswered questions stored in Netlify Database and emailed via Netlify Forms.
- Responsive header/menu bar and mobile layout; more topics (parents, kinship, patience, du‘a, neighbours, truthfulness, repentance, dhikr, orphans).

## Milestone 2 — Knowledge data model
- Netlify Database (Postgres + Drizzle) schema: `sources`, `editions`, `items`, `translations`, `narrators`, `concepts`, `item_concepts`, `relations`, `verification_events`.
- Seed script that imports the current fixtures, then bulk import of full collections (Qur’an, the Six Books, Muwatta’, Musnad Ahmad, Riyad al-Salihin, tafsir works).
- Replace fixture imports with TanStack Start server functions / loaders.

## Milestone 3 — Accounts & roles
- Netlify Identity: readers, reviewers (by speciality: hadith, tafsir, fiqh), admins.
- Protect the Review console; record reviewer identity on every decision.

## Milestone 4 — Human review workflow
- Persist approve / edit / reject decisions as `verification_events` with an audit trail.
- Multi-reviewer rules (e.g. two approvals for grades), comments, and a public “verification history” on each item.

## Milestone 5 — Real semantic search
- Embeddings for texts + translations via Netlify AI Gateway, stored alongside items; hybrid (keyword + vector) ranking with filters for status, source and type.

## Milestone 6 — AI extraction pipeline
- Background functions that analyse newly ingested sources and propose concepts, narrators, grades and relations into the review queue (with model confidence).

## Milestone 7 — Grounded AI Assistant
- LLM through Netlify AI Gateway, answering only from retrieved verified items, with inline citations and a clear “not a fatwa” guardrail. Conversation history per user.

## Milestone 8 — Knowledge Graph at scale
- Graph endpoints from the relations table; force-directed layout, filters by concept/narrator/source, item drill-down.

## Milestone 9 — Public API
- `/v1/search`, `/v1/items/:id`, `/v1/concepts/:id/graph`, `/v1/sources`, `/v1/assistant`; API keys, rate limits, usage dashboard, licence terms.

## Milestone 10 — Customer support backend
- Store contact-form submissions and chat transcripts; AI-assisted support replies with hand-off to a human agent; “report a mistake” tickets routed to reviewers.

## Milestone 11 — Sign language & accessibility
- Integrate a certified Arabic Sign Language (and BISINDO / ASL) avatar or recorded-video service for full interpretation, plus a full WCAG 2.2 AA audit.
