# Handoff — 2026-08-05

| Field | Value |
| --- | --- |
| **Date** | 2026-08-05 |
| **GitHub username** | Unknown (`git config user.name` is unset in this clone) |
| **AI agent used** | Claude Code (Opus 5) |
| **Repository** | `hannah639/balance-physio` (remote unchanged) |
| **Branch** | `main` |

## Objective

Two pieces of work in one session:

1. Clone the repository into a fresh local working copy, rename the project from
   `balance-physio` to `balancephysio`, and configure the environment and
   deployment configuration files.
2. Add a new patient testimonial (attributed `DB`) to `/testimonials/`, matching
   the existing card layout and reusing an image already present in the repo.

## Files created

| File | Purpose |
| --- | --- |
| `.env` | Local environment, filled from `.env.example`. Git-ignored. `SANITY_PROJECT_ID=3po4zrtd`, `SANITY_DATASET=production`, `SANITY_API_VERSION=2025-02-19`. Token and deploy hook left blank — neither is used by the build. |
| `worker-configuration.d.ts` | Cloudflare runtime types, generated via `npx wrangler types`. `tsconfig.json` already referenced this file but it was absent from the repo. |
| `public/testimonials/db-balance-rehab.{jpg,webp,avif}` | Avatar for the new DB testimonial. **Not a new photograph** — a byte-for-byte copy of the existing, previously unreferenced `je-balance.*` (single-leg balance work on a BOSU ball). Renamed rather than referenced in place so the `je-` prefix stays associated with JE's testimonial. All three formats copied because `Picture.astro` requires `<stem>.avif` and `<stem>.webp` to exist on disk. |
| `handoffs/handoff-astro-2026-08-05.md` | This log. |

## Files modified

| File | Change |
| --- | --- |
| `src/data/testimonials.js` | New `DB` entry prepended to the array (see "Content added") |
| `package.json` | `name`: `balance-physio` → `balancephysio` |
| `package-lock.json` | `name` fields updated to match (by `npm install`) |
| `wrangler.jsonc` | `name`: `balance-physio` → `balancephysio` — **this renames the Cloudflare Worker on next deploy** |
| `studio/package.json` | `name` → `balancephysio` |
| `studio/package-lock.json` | `name` fields → `balancephysio` |
| `.claude/launch.json` | `name` → `balancephysio`; `cwd` was hard-coded to the original author's macOS path (`/Users/hannahhumphries/Downloads/balance-physio`) and now points at this working copy |
| `README.md` | Clone/`cd` instructions and the worker name in the Deployment section |
| `docs/deployment.md` | Cloudflare project/worker name references |
| `handoffs/handoff-astro.md` | §12 Cloudflare environment-variables path now names the `balancephysio` worker |

## Files removed

None.

## Content added — DB testimonial

Placed **first** in the `testimonials` array so it renders at the top of the
masonry, matching how `AB` (the most recent prior entry) was positioned.

| Field | Value |
| --- | --- |
| `name` | `DB` |
| `image` | `/testimonials/db-balance-rehab.jpg` |
| `role` | **Omitted deliberately.** Initials-only entries (`JE`, `Patient G`, `Tal H`, `George C`) carry no role; only named athletes and professionals do. |
| `quote` | Five paragraphs, supplied copy used **verbatim** — no editing, tightening or re-punctuation. |

**No design work was required and none was done.** The card is a data entry
rendered by the existing `.tm-card` styles in `src/pages/testimonials.astro`. Zero
CSS and zero markup changed, so the new card matches the other 25 by construction
rather than by restyling. At 5 paragraphs the quote exceeds the page's
`READ_MORE_THRESHOLD` of 450 characters, so it picks up the `is-long` class and the
"Read more" toggle automatically.

## Components added / schemas added or updated / wired fields

None. No component, GROQ query, loader or schema was changed. Testimonials are
**not** in Sanity — `src/data/testimonials.js` is the live source for
`/testimonials/` (see `handoff-astro.md` §11), so adding one is a code edit, not a
CMS entry, and the change requires a rebuild to appear.

## Note: there is no `wrangler.toml`

The task named `wrangler.toml`. This project has never had one — it uses
`wrangler.jsonc`, the JSON-with-comments equivalent. That file was configured
instead. A `wrangler.toml` was deliberately **not** created: Wrangler errors when
both a `.toml` and a `.jsonc` config are present in the same directory.

## Bug fixes / refactoring / performance / SEO / accessibility

None attempted. The `.claude/launch.json` `cwd` correction is the only fix, and it
only affected that debug launch profile.

## Breaking changes

- **Worker rename.** Deploying with the new `wrangler.jsonc` name creates a
  *new* Worker called `balancephysio` rather than updating `balance-physio`. The
  old Worker, its custom domain binding, its environment variables and its deploy
  hook all stay attached to the old name. See "Remaining tasks".

## Testing / QA

| Check | Result |
| --- | --- |
| `npm install` | Succeeded. 13 npm-audit vulnerabilities reported (1 low, 12 high) — pre-existing, not investigated. 4 packages (`esbuild` ×2, `sharp`, `workerd`) have install scripts not yet approved by the local npm `allow-scripts` policy; the build works regardless. |
| `npm run build` | Run twice — after the rename, and again after the testimonial. Both succeeded, no errors. |
| Page count | **114** both times — matches `handoff-astro.md` §13, and correctly unchanged by the testimonial (a data entry adds no route). |
| Testimonial in built output | Verified in `dist/client/testimonials/index.html`, not just in dev: **26** `.tm-card`s (was 25), DB card first, **5** paragraphs, `is-long` applied, `<picture>` emitting `.avif`/`.webp`/`.jpg`, and all three image variants copied to `dist/client/testimonials/`. |
| Rendered text | All five paragraphs confirmed by substring match on the built HTML, **not** by element counts — per the `handoff-astro.md` warning that element counts have masked real content loss on this project before. |
| Sanity connected | Confirmed by output, not by assumption: `dist/client/index.html` contains 66 `cdn.sanity.io` image references and 76 header nav links. A credential-less build renders 2 nav links, so `.env` is being read and the project ID is correct. |
| `dist/server/.dev.vars` | Generated with all five variables, as documented. |
| `npx astro check` | **Not run.** `@astrojs/check` and `typescript` are not project dependencies and the command prompts to install them; adding dependencies was out of scope. |
| Responsive / keyboard / real-device | **Not tested.** No CSS or markup changed, so no visual regression was expected — but the new card was never viewed in a browser at any breakpoint, and the "Read more" toggle was never clicked. Both are verified as present in the HTML only. |

## Known issues (pre-existing, not introduced here)

1. **Two different Sanity project IDs live in the repo.** `3po4zrtd` is the real
   one (`handoff-astro.md` §12, and the header comment in
   `src/lib/sanity/client.ts`). The abandoned `da13xw8y` still appears in
   `studio/sanity.cli.js`, `studio/sanity.config.js` and `docs/deployment.md`
   (§"Critical config" and §"Sanity project details"). Left as-is: the real Studio
   lives in the separate **balance-physio-sanity** repo per `CLAUDE.md`, and the
   local `studio/` folder carries only 3 schema types, so it appears vestigial.
   Deciding whether to repoint or delete it needs an owner call.
2. **`docs/deployment.md` documents `src/lib/sanity.js`**, which no longer exists —
   the client is `src/lib/sanity/client.ts`.
3. **Hard-coded staging URLs in form markup.** `src/pages/contact-us.astro:53` and
   `src/pages/clinic/clapham.astro:44` both redirect to
   `https://balance-physio.hannah-9e0.workers.dev/thank-you`. That hostname is tied
   to both the old worker name *and* the original Cloudflare account subdomain, so
   it will not resolve for a new owner. Not changed — the correct replacement
   depends on the new deployment target.
4. **The deploy hook was previously committed** to `docs/deployment.md` and should
   be rotated (already flagged in `handoff-astro.md` §12).
5. **`Patrick` is not in `src/data/team.js`.** The new DB testimonial praises both
   Jose and Patrick. Jose is present as `Dr. Jose Sanz Mengibar`; Patrick is not.
   That file is only the *fallback* for `getTeam()` — the live team comes from
   Sanity — so Patrick may well exist in the CMS. Unverified either way: checking
   needs Sanity Studio access. Worth confirming, since the testimonial now names a
   therapist the site may not list.
6. **`@sanity/image-url` deprecation warning** on dev-server start:
   `src/lib/sanity/client.ts` uses the default export
   (`import imageUrlBuilder from '@sanity/image-url'`), which is deprecated in
   favour of the named `createImageUrlBuilder`. Works today; will need changing
   before a major-version bump of that package.

## Remaining tasks

- Decide the Cloudflare deployment target for the renamed worker. If the intent is
  to keep serving the existing site, either keep the worker name `balance-physio`
  or migrate the custom domain, environment variables and deploy hook to the new
  `balancephysio` worker after first deploy.
- Set `SANITY_PROJECT_ID`, `SANITY_DATASET` and `SANITY_API_VERSION` in the
  Cloudflare dashboard for whichever worker is used. Without them the build
  produces a site with no CMS content.
- Update the two hard-coded `workers.dev` form-redirect URLs (issue 3 above).
- Resolve the `git remote`: `origin` still points at
  `https://github.com/hannah639/balance-physio.git`. Repoint it before pushing if
  this copy is meant to live in a different repository.
- Resolve or remove the local `studio/` folder (issue 1 above).
- Confirm whether `Patrick` should be added to the team listing (issue 5 above).
- View `/testimonials/` in a browser at 1100px and 700px to confirm the new card
  and its "Read more" toggle behave as expected — not done in this session.
- If a fresh photograph is preferred over the reused `je-balance` image, replace
  `public/testimonials/db-balance-rehab.*` and re-run
  `scripts/gen-image-variants.sh` to regenerate the AVIF/WebP variants.

## Recommendations

- Run `npm audit` and triage the 12 high-severity advisories separately.
- Consider adding `worker-configuration.d.ts` regeneration to the workflow —
  `wrangler types` must be rerun whenever `wrangler.jsonc` changes.
- Fix the stale `src/lib/sanity.js` reference and the `da13xw8y` project ID in
  `docs/deployment.md`, which currently contradict the code.
