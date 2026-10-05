# AGENTS.md — MIDAD (مِداد)

Trilingual (ar/en/id) product site for a trusted-Islamic-knowledge platform. Built with TanStack Start + Tailwind 4, deployed on Netlify.

**Continue from [PLAN.md](./PLAN.md).** Milestone 1 (UI surface) is done; the next milestone is the database-backed knowledge model.

## Layout
```
src/
  routes/          file-based routes: index, explore, graph, assistant, sources, review, developers, support, __root
  components/
    Header.tsx     header (nav, language select, theme toggle, sign-language button) + Footer
    ui.tsx         Logo, StatusBadge, PageHeader, ItemCard, cdn() image helper
    Support.tsx    SupportChat (auto-reply) + floating SupportWidget
    SignPanel.tsx  sign-language interpreter modal
  lib/
    i18n.ts        ALL UI strings, one dictionary per language (ar is the source of the Dict type)
    prefs.tsx      PrefsProvider: lang/dir, theme, large text, sign panel state; boot script avoids flashes
    support.ts     keyword rules for support auto-replies
  data/fixtures.ts the ONLY data source: sources, concepts, items, reviewQueue, searchItems() stub
public/img/        midad-logo.jpeg (full logo), midad-mark.png (emblem crop), signer.png (interpreter illustration)
```

## Conventions
- Never hard-code UI text: add a key to `ar` in `src/lib/i18n.ts`, then to `en` and `id` (TypeScript enforces parity).
- Colors come from CSS variables in `src/styles.css` (`--bg --bg2 --bg3 --sf --bd --tx --mu --pr --ac …`) exposed to Tailwind as `bg-sf`, `text-pr`, `border-bd`, etc. Dark mode = `[data-theme="dark"]` on `<html>`.
- Shared block classes from the design kit: `.hero .pat .tl .rad .steps .emp .band .card .tk .lk .tbr .tr .t1 .t2 .t3 .bd .quote .btn .field`.
- Use logical utilities (`ps-`, `pe-`, `start-`, `end-`, `ms-`) so RTL and LTR both work.
- Arabic scripture/hadith text uses `.quote` (Amiri). Never generate or alter Qur’an/hadith wording; take it from a verified source.
- Images go through the Netlify Image CDN via `cdn(path, width)`.

## Non-obvious decisions
- Default language is Arabic; SSR renders `ar`/`rtl` and the inline boot script applies saved prefs before paint (`suppressHydrationWarning` on `<html>`).
- Assistant and search are deterministic stubs over fixtures, so the UI works with no backend; swap `searchItems()`/`answer()` for server functions later.
- The sign-language panel is a preview (captions + fingerspelling + illustration); full interpretation is a roadmap item.
