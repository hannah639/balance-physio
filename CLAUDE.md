---
description: Operating guide for Claude in the Balance Physio Astro website repo. Enforces reading the handoff documentation before any work.
---

# CLAUDE.md — Astro website

## Handoff documentation (read before anything else)

`handoffs/handoff-astro.md` is the **master documentation for this repository** and the
single source of truth for the website.

**Before starting ANY task** — features, bug fixes, refactoring, styling, content wiring,
performance or SEO work, or review — Claude must:

1. Read `handoffs/handoff-astro.md` completely.
2. Read the newest `handoffs/handoff-astro-YYYY-MM-DD.md` dated log.
3. Read older dated logs when more context is needed.

Do not begin work before doing this. Prefer the handoff over assumptions, and prefer the
code over the handoff if the two disagree — then correct the handoff in the same change.

The CMS is documented separately in `handoffs/handoff-sanity.md` in the
**balance-physio-sanity** repository. Read that too when the task touches schemas, GROQ or
the content model.

**After every completed session** Claude must:

1. Update `handoffs/handoff-astro.md` if architecture, the design system, components,
   routes, integrations, build or deployment changed.
2. Create or update `handoffs/handoff-astro-<YYYY-MM-DD>.md` for today. One file per day —
   extend today's file rather than creating a second.
3. Record in the dated log: date · GitHub username · AI agent used · branch · objective ·
   files created / modified / removed · components added · schemas added or updated ·
   wired and fetched fields · bug fixes · refactoring · performance · SEO · accessibility ·
   breaking changes · testing · QA · remaining tasks · known issues · recommendations.
   Read metadata from git (`git config user.name`, `git remote get-url origin`,
   `git branch --show-current`, `git log`). Where a value cannot be determined, write
   `Unknown` — never leave a field blank.
4. **Rolling retention:** keep the master file plus the newest **10** dated logs. When
   adding an 11th, delete the oldest. Never delete `handoff-astro.md`.

A task is not complete until the documentation reflects it.

**Verify rather than recall.** Read the code and report what is actually there. If
something cannot be verified — performance figures, real-device testing — say so plainly
instead of implying it passed.

## Facts that are easy to get wrong

- **There is no Tailwind in this project.** No dependency, no config, no integration.
  Styling is hand-written CSS with custom properties scoped under `.bp-page`. Do not
  install Tailwind, even if a brief asks for "Tailwind standards".
- **All content comes from Sanity at build time.** The browser never contacts Sanity and no
  token reaches the client. A content change needs a rebuild.
- **Adding a field takes four coordinated edits:** schema (Sanity repo) → GROQ in
  `src/lib/sanity/queries.ts` → loader in `src/lib/sanity/*.ts` → component. Missing the
  query or the loader makes the field render blank with **no error**.
- **`trailingSlash: 'always'`** — every internal link ends in `/`.
- **Never `set:html` on CMS content.** Portable Text renders through `RichText.astro`.
- **Sitemap sources must match the sources that generate pages**, or the sitemap will list
  URLs that 404.

## Working standards

- Astro components by default; hydrate only for genuine interaction (nothing does today).
- Use the design tokens in `Layout.astro`, not literal colours.
- Component CSS stays in the component's `<style>` block; global CSS is for shared rules.
- Images go through `Picture.astro` with explicit `width`/`height`.
- Links resolve through `resolveHref()` from a reference — never store a URL in the CMS.
- Loaders memoise; components never fetch independently.
- Guard against empty CMS: throw rather than render an empty page.

## Verification

Run `npm run build` and diff the affected pages before considering work done — compare
**rendered text and element counts**, not element counts alone. Element counts have missed
real content loss on this project more than once.

## Safety

- Pull and merge before starting work.
- Develop against `localhost`, never production.
- **Never push or deploy without being asked explicitly.**
