# Astro Daily Handoff — 2026-07-28

| | |
| --- | --- |
| **Date** | 2026-07-28 |
| **GitHub username** | @hmdg-junemark (June Mark Bayno) |
| **AI agent used** | Claude Code (Claude Opus 5) |
| **Branch** | `main` |
| **Repository** | `hannah639/balance-physio` |
| **Commit(s)** | `5f5a447`, `753fe0b`, plus this commit |
| **Reviewed by** | Unknown |

---

## Objective

Create the mandated `/handoffs/` documentation for the Astro project, and close out the
last housekeeping items from the CMS migration.

## Files created

- `handoffs/handoff-astro.md` — master Astro documentation (454 lines)
- `handoffs/handoff-astro-2026-07-28.md` — this file
- `CLAUDE.md` — this repository had none; it now requires reading the handoff before work

## Files modified

- `src/lib/sanity/seo.ts` — team sitemap entries now come from `getTeam()`
- `src/pages/404.astro` — heading, intro and SEO now from the `page-404` document
- `src/pages/thank-you.astro` — hero and SEO now from the `page-thank-you` document
- `docs/deployment.md` — deploy hook URL removed

## Files removed

- `src/data/news.js` — left with zero importers by the blog migration; the blog now
  comes from Sanity

## Components added

None.

## Schemas added or updated

None in this repository. Two Sanity **content** documents were created to support the
page wiring: `page-404` and `page-thank-you` (hero + SEO only).

## Wired and fetched fields

| Document | Loader | Rendered by |
| --- | --- | --- |
| `page-404` | `pages.bySlug('404')` | `src/pages/404.astro` |
| `page-thank-you` | `pages.bySlug('thank-you')` | `src/pages/thank-you.astro` |

Both keep the previous wording as a literal fallback, so output is unchanged if the
document is missing.

The link lists on those two pages were deliberately **not** migrated. They are
navigation, already owned by the `navigation` document — copying them into a page
document would create a second source of navigation truth.

## Bug fixes

**Sitemap listed pages that do not exist.** `getSitemapEntries()` built team URLs from
`src/data/team.js` while `src/pages/team/[slug].astro` generates its pages from Sanity.
Unpublishing a team member removed the page but left the URL in `sitemap.xml` — a 404
submitted to search engines.

Both now read `getTeam()`. Proven by unpublishing a real member: the page and the sitemap
entry disappear together (35 → 34) and both return on republish. No member is currently
unpublished, so the bug was latent rather than live.

## Refactoring

None beyond the sitemap source change.

## Performance improvements

None. **Performance remains unmeasured** — see Known issues.

## SEO changes

- Sitemap team entries now match the pages that actually exist.
- `/404/` and `/thank-you/` take `metaTitle` / `metaDescription` from Sanity.
- Deploy hook URL removed from `docs/deployment.md`.

## Accessibility improvements

None.

## Breaking changes

None. All output verified byte-identical apart from the intended sitemap correction.

## Testing completed

- `npm run build` — clean, 114 pages
- Team unpublish/republish cycle, verifying page **and** sitemap together
- Secret scan of `dist/`: the read token appears only in `dist/server/.dev.vars`, a
  wrangler dev artifact — **never** in `dist/client/`, and `dist/` is gitignored

## QA completed

| Check | Result |
| --- | --- |
| Build | clean, 114 pages |
| Services vs baseline | 0 of 24 differ |
| Conditions vs baseline | 0 of 19 differ |
| Homepage vs baseline | identical |
| `/404/` and `/thank-you/` | byte-identical; link counts 9/9 and 6/6 |
| Blog pages | 7 |
| Sitemap vs generated team pages | exact set match (35/35) |
| Documentation coverage | all 67 routes present in `handoff-astro.md` |

## Remaining tasks

1. **Run Lighthouse against a deployed URL.** No PSI or LCP figures exist for this build.
2. Test responsive behaviour and accessibility on real devices and with a screen reader.
3. **Rotate the Cloudflare deploy hook** — it is in git history.
4. Turn off Cloudflare's managed robots.txt, which injects a second `User-agent: *` block
   ahead of the Sanity-controlled one.

## Known issues

- **Performance has never been measured.** The build is static, images are AVIF/WebP with
  explicit dimensions, and nothing hydrates — but that describes implementation, not
  results. Do not claim PSI 90+ or LCP under 2.5s until Lighthouse has been run.
- **Responsive and accessibility are code-reviewed only.** The four breakpoints and the
  semantics were checked in source, not on devices or with assistive technology.
- `/testimonials/` and `/news-events/` still render from `src/data/` files, by instruction.

## Recommendations for the next developer

- **Read `handoffs/handoff-astro.md` first.** Two sections matter most: §2, which records
  that **there is no Tailwind in this project** (a brief has already assumed otherwise —
  installing it would create a second styling system), and §7, which explains that adding
  a field takes four coordinated edits.
- **Diff rendered text, not just element counts.** Element counts alone have missed real
  content loss here more than once — a paragraph can vanish while the count holds because
  something else took its place.
- **Sitemap sources must match page sources.** That mismatch is exactly the bug fixed
  today; the same trap exists for any future dynamic route.
- **Internal links must end in `/`** — `trailingSlash: 'always'`.
- Do not push or deploy without being asked. Standing project rule.
