# Handoff — 2026-09-10

| Field | Value |
| --- | --- |
| **Date** | 2026-09-10 |
| **GitHub username** | Unknown. `git config user.name` is `Dave` (`dave@hmdg.co.uk`); the remote `https://github.com/hannah639/balance-physio.git` is owned by `hannah639`. Neither is confirmed to be the committing GitHub account. |
| **AI agent used** | Claude Code (Opus 5, 1M context) |
| **Repository** | `hannah639/balance-physio` |
| **Branch** | `team-updates`, cut from `main` at `bf7ff9d` (level with `origin/main`; `git pull` reported "Already up to date") |

## Objective

Silence the one actionable warning printed by `npm run dev`:

```
[WARN] [vite] The default export of @sanity/image-url has been deprecated.
Use the named export `createImageUrlBuilder` instead.
```

The branch was created for team-page work; this fix was done first because the
warning fires on every dev start and every build, and hides genuine warnings
behind noise.

## Files created

| File | Purpose |
| --- | --- |
| `handoffs/handoff-astro-2026-09-10.md` | This log. |

## Files modified

| File | Change |
| --- | --- |
| `src/lib/sanity/client.ts` | Two lines. L13 `import imageUrlBuilder from '@sanity/image-url'` → `import {createImageUrlBuilder} from '@sanity/image-url'`; L54 `imageUrlBuilder(sanityClient)` → `createImageUrlBuilder(sanityClient)`. |
| `handoffs/handoff-astro.md` | §7 `client.ts` row: added `urlFor` to its exports (it was omitted) and recorded that the named `createImageUrlBuilder` export is the one to use. |

## Files removed

None.

## The warning — what it was, and why the fix is exactly two lines

`@sanity/image-url` 2.1.1 ships both forms. Read from
`node_modules/@sanity/image-url/lib/index.js`:

```js
import { defineDeprecated, createImageUrlBuilder } from "./_chunks-es/compat.js";
const deprecatedcreateImageUrlBuilder = defineDeprecated(createImageUrlBuilder);
export { createImageUrlBuilder, deprecatedcreateImageUrlBuilder as default };
```

The default export is the *same function* wrapped in `defineDeprecated`, which
does nothing but log. `lib/index.d.ts:37` carries the matching
`@deprecated Use the named export createImageUrlBuilder instead of the default
export`. So the named export is not a new API to migrate to — it is the same
callable, minus the warning wrapper. Behaviour of `urlFor()` is unchanged.

`src/lib/sanity/client.ts` was the only importer: `grep -rn "image-url" src/`
returns one line. No other module, component or page touches the package.

## Components added / schemas added or updated / wired and fetched fields

None. No component, template, CSS, GROQ query, loader or schema was touched.

## Bug fixes

One, if a deprecation warning counts as a bug: the deprecated import path in
`client.ts`. Nothing was rendering wrongly — the wrapper still returned a working
builder — so this is a warning removal and a guard against the day the default
export is deleted, not a rendering fix.

## Refactoring / performance / SEO / accessibility

- **Refactoring:** none beyond the two-line import change.
- **Performance:** unchanged. Same builder function, same URLs, same request
  count. Confirmed by the identical Sanity CDN URL counts below.
- **SEO:** unchanged. `dist/client/sitemap.xml` still lists **103** URLs;
  page count still **114**.
- **Accessibility:** untouched. No markup change.

## Breaking changes

None.

## Testing / QA

| Check | Result |
| --- | --- |
| `npm run dev` | Running throughout on `http://localhost:4321`. After the edit Vite reloaded the module and served `/` → **200** and `/news-events/` → **200** with **no deprecation warning** in the log. |
| `npm run build` | Succeeded, server built in 61.19 s, no errors. The "file not created, response body was empty" lines are the 193 legacy redirects and are pre-existing. |
| Build warnings after the fix | Re-ran the build filtering for `deprecat|WARN|error`: the only remaining line is `[vite] Default inspector port 9229 not available, using 9230 instead`, which is unrelated to this change. The `@sanity/image-url` warning is gone. |
| Page count | **114** `index.html` under `dist/client` — matches `handoff-astro.md` §1. |
| Sitemap | **103** `<loc>` entries — matches the 2026-09-08 log. |
| Images still resolve through `urlFor()` | **1 097** `cdn.sanity.io/images/…` URLs across the built HTML, **346** distinct, all under project `3po4zrtd/production`. A broken builder would have produced zero. |
| Content of the two `/news-events/` cards | Not re-verified this session; the page returns 200 and no markup changed. |
| **Browser / visual QA** | **NOT DONE.** No screenshot or browser-automation tool in this session, as on 2026-09-03, -09-04 and -09-08. Every claim above comes from built HTML, dev-server logs and HTTP status codes. |
| Responsive / keyboard / screen reader / real device | **Not tested.** Not applicable to this change — no markup or CSS was touched. |

### The other dev-server warning was deliberately left alone

`npm run dev` also prints `[WARN] [content] Content config not loaded`. There is
no `src/content/` directory and the project uses no content collections — all
content comes from Sanity at build time. The warning is Astro noting the absence,
not a fault. Adding a stub `src/content/config.ts` purely to silence it would
introduce an unused subsystem, so it stays.

## Known issues

Nothing new. Every open item from `handoff-astro-2026-09-08.md` is untouched and
still open:

1. The `/news-events/` sponsorship PDF is a draft (`/Title` "Balance report draft").
2. St Paul's Opera poster is 435 × 664 px — soft on a 2× display.
3. **Neither event card has ever been viewed in a browser**, at any width.
4. `public/news/wellness-event-2026.{jpg,webp,avif}` (517 KB) still orphaned.
5. `scripts/gen-image-variants.sh` still does not run on this machine.
6. Pre-existing items from `handoff-astro-2026-08-05.md` — two Sanity project IDs,
   stale `docs/deployment.md`, hard-coded `workers.dev` form redirects,
   un-rotated deploy hook, unresolved `studio/` folder.

`handoff-astro.md`'s "Last verified" header still reads **28 July 2026** and was
deliberately not advanced. This session verified the page count, the sitemap
count, the dependency version and the Sanity client — not the whole document.

## Remaining tasks

- **Nothing has been committed or pushed this session.** The working tree holds
  this fix plus the two handoff files. `team-updates` is still at `bf7ff9d`.
- The team work the branch was cut for has not been started.
- Everything under Known issues above, all carried from 2026-09-08.

## Recommendations

- Commit this on `team-updates` before starting the team work, so a one-line
  dependency fix does not end up mixed into a content change.
- When any dependency next prints a deprecation warning, check whether the named
  export is the same function first — here it was, which is what made the fix
  safe rather than a migration.

---

# Session 2 — 2026-09-10 (same day, same branch)

| Field | Value |
| --- | --- |
| **Date** | 2026-09-10 |
| **GitHub username** | Unknown. `git config user.name` is `Dave` (`dave@hmdg.co.uk`); the remote `https://github.com/hannah639/balance-physio.git` is owned by `hannah639`. |
| **AI agent used** | Claude Code (Opus 5, 1M context) |
| **Branch** | `team-updates`, at `a03c786` when this session started |

## Objective

Show credentials and specialisms on `/team/dr-lucy-goldby/`, with each specialism
linked to the page on the site that covers it.

## What the request turned out to be

**No content needed adding.** Every value the owner supplied was already in
Sanity on the `teamMember` document, character for character:

```
jobTitle          "Consultant Spinal Physiotherapist"
qualifications    ["Ph.D, MCSP, SRP ", "30+ Years of Experience"]
specialistAreas   ["Spinal and lower back pain ", "Neck pain ",
                   "Shoulder pain ", "Hip pain"]
```

`name` and `jobTitle` already rendered. `qualifications` and `specialistAreas`
were **queried in `TEAM_QUERY`, mapped in `team.ts` — and rendered by nothing.**
This is `handoff-astro.md` §7's four-edit rule failing at step 4, plus a variant
of it the master file did not describe (below). The work was therefore a
template change and a loader fix, not a content change. **Nothing was written to
Sanity.**

Note the trailing spaces in the CMS values. They are trimmed on the way through
the loader now, not corrected in the CMS.

## The loader bug found on the way

`team.ts` declared `qualifications: string | null` and read it with
`str(r.qualifications)`. The field is an **array** in Sanity, and `str()` returns
`null` for anything that is not a string — so `qualifications` has been `null`
for **every team member since the migration**, silently. TypeScript could not
catch it: the row arrives as `Record<string, unknown>`.

Fixed by typing it `string[]` and adding a `strList()` helper, which is now also
used for `specialistAreas` (it previously used `.filter(Boolean)`, which kept
untrimmed strings). `handoff-astro.md` §7 gained a paragraph describing this
trap, since the existing text only warns about forgetting the query or the
loader — not about a loader that runs and still yields nothing.

## Files created

| File | Purpose |
| --- | --- |
| `src/lib/sanity/specialisms.ts` | 133 lines. Resolves a `specialistAreas` label to the page covering it. |

## Files modified

| File | Change |
| --- | --- |
| `src/lib/sanity/team.ts` | `qualifications` retyped from `string \| null` to `string[]`; new `strList()` helper; `qualifications` and `specialistAreas` both mapped through it; fallback roster returns `[]`. |
| `src/pages/team/[slug].astro` | Imports `resolveSpecialisms`; renders a `.bio-creds` list and a `.bio-specialisms` block between the job-title line and the bio prose; ~20 lines of scoped CSS. |
| `handoffs/handoff-astro.md` | §6 team route row now lists `specialisms`; §7 module table gained a `specialisms.ts` row; §7 four-edit rule gained the mistyped-loader trap. |
| `handoffs/handoff-astro-2026-09-10.md` | This section. |

## How specialisms are linked — and why not a URL table

`specialistAreas` is an array of **free-text strings**, not references, so there
is no document to hand to `resolveHref()`. `specialisms.ts` bridges the two
without storing a URL anywhere:

```
label  →  slug   ALIASES table, else the label slugified
slug   →  href   resolveHref() — still the only thing that knows route structure
```

The resolved slug is then checked against the **route files** —
`import.meta.glob('/src/pages/condition/*.astro')` and the service equivalent —
rather than against the CMS. Condition and service pages are static files, one
per document, so a document can exist without a page; checking documents would
let a specialism link at a URL that 404s. This is the link-side form of the
sitemap rule in §8. Only the glob keys are read, so no page module is pulled
into the bundle.

**The alias table holds five entries, all genuine mismatches:**

| Label | Page | Why an alias is needed |
| --- | --- | --- |
| `spinal and lower back pain` | `/condition/lower-back-pain/` | Page is titled "Back Pain Treatment in Clapham"; no wording of the specialism slugifies to `lower-back-pain` |
| `lower back pain` | `/condition/lower-back-pain/` | Same page, common phrasing |
| `back pain` | `/condition/lower-back-pain/` | Same page, the title's own wording |
| `shoulder pain` | `/condition/shoulder-specialist-physiotherapy/` | Page titled "Shoulder Pain Treatment in Clapham", slug is not |
| `knee pain` | `/condition/acl-knee-specialist-london/` | Page titled "Knee & ACL Injuries Treatment in Clapham" |

`Neck pain` and `Hip pain` are **not** in the table — they slugify to
`neck-pain` and `hip-pain`, which are real routes, so the automatic match
handles them. The same is true of `multiple sclerosis`, `parkinsons`,
`balance and dizziness`, `ankle pain`, `elbow pain`, `foot pain`,
`cycling injuries`, `running injuries`, `stroke`, `verrucas` and every service
whose label matches its slug. Aliases were deliberately kept to what real data
needs — five entries — rather than pre-populating guesses for the 33 members who
have no specialisms yet. Adding one is a single line.

A first draft of this table had `specialist-neuro-physio-london` typed as a
`condition`; it is a **service**. The build-time guard below caught it.

### Guard

An `ALIASES` entry pointing at a route file that does not exist **throws and
fails the build**, naming the label, the slug and the file it expected. A typo
in that table is a code error, and a silent dead link is worse than a failed
build (§14). An unmatched *label*, by contrast, is not an error — it renders as
plain grey text, since a specialism need not have a page.

## Where it renders, and heading order

The owner's list ran name → job title → qualifications → Specialisms, so the two
new blocks sit directly under the job-title line, above the bio prose, keeping
that order. "Specialisms" is an `<h3>` — the page already has one `<h1>`
(PageHero) and an `<h2>` (the member's name), so the order is intact:
**h1 → h2 → h3**, verified in the built HTML. The colon in the owner's
"Specialisms:" was dropped, as it is a heading rather than a label.

## Components added / schemas added or updated

None. No Sanity schema was touched — the fields already existed. No component
was added; `specialisms.ts` is a lib module, not a component.

## Wired and fetched fields

| Field | Status before | Status now |
| --- | --- | --- |
| `teamMember.qualifications` | In `TEAM_QUERY`, mapped to `null` by a type error, rendered nowhere | `string[]`, trimmed, rendered as `.bio-creds` |
| `teamMember.specialistAreas` | In `TEAM_QUERY`, mapped untrimmed, rendered nowhere | Trimmed, rendered as linked pills |

Both were already in the GROQ query. No query change was needed.

## Refactoring / performance / SEO / accessibility

- **Refactoring:** `strList()` replaces one ad-hoc `.filter(Boolean)`.
- **Performance:** no new request — both fields were already in the one memoised
  team fetch. No image, script or hydration added. `import.meta.glob` is resolved
  at build time and reads keys only.
- **SEO:** 114 pages and 103 sitemap URLs, both unchanged. Four new internal
  links from a team profile to four condition pages, which is a small
  internal-linking gain. No `<head>` change.
- **Accessibility:** heading order intact (h1 → h2 → h3). Pills are real `<a>`
  elements with a `:focus-visible` style matching hover, so keyboard focus is
  visible. New CSS uses the `Layout.astro` tokens (`--primary`, `--accent`,
  `--border`, `--primary-bg`, `--radius`, `--white`, `--text`, `--text-muted`)
  rather than literals — note the surrounding CSS in this file predates that rule
  and still hardcodes `#e87722`, `#3EBEDF` and `#555555`.

## Breaking changes

`TeamMember.qualifications` changed type from `string | null` to `string[]`. No
consumer read it — `grep -rn "qualifications" src/` finds only `team.ts` and the
new template block — so nothing broke, but a future consumer must expect an array.

## Testing / QA

| Check | Result |
| --- | --- |
| `npm run build` | Succeeded, 58.87 s, no errors and no new warnings. |
| Page count | **114** — unchanged. |
| Team pages | **34** — unchanged. |
| Sitemap | **103** URLs — unchanged. |
| Rendered summary block | Read back from `dist/client/team/dr-lucy-goldby/index.html`: job title, then `Ph.D, MCSP, SRP` and `30+ Years of Experience` (trailing spaces gone), then `Specialisms`, then the four pills. Matches the owner's text exactly. |
| Links resolve | `Spinal and lower back pain` → `/condition/lower-back-pain/`, `Neck pain` → `/condition/neck-pain/`, `Shoulder pain` → `/condition/shoulder-specialist-physiotherapy/`, `Hip pain` → `/condition/hip-pain/`. All four confirmed as **built files** in `dist/client/`, and all four **200** over the dev server. |
| Bio not lost | 4 bio paragraphs plus the job-title line and the "Back to the team" link all still present, read back as text per §13 — not counted. Paragraph lengths 153 / 462 / 265 / 241 chars. |
| Other 33 profiles | `<ul class="bio-creds">` and `<div class="bio-specialisms">` markup appears in **exactly one** built file, Lucy's. The other 33 have no data, so both blocks are omitted. Spot-checked `/team/pat-leahy/`: bio intact, 200. (The class *names* appear in all 34 files because the scoped `<style>` block is inlined on every page — that is CSS text, not markup.) |
| Heading order | h1 → h2 → h3 in the built HTML. |
| **Browser / visual QA** | **NOT DONE.** No screenshot or browser-automation tool in this session, as on 2026-09-03, -09-04 and -09-08. Every claim above comes from built HTML, dev-server status codes and rendered text. The pill block has never been seen. |
| Responsive / keyboard / screen reader / real device | **Not tested.** A `@media (max-width: 900px)` padding rule was added for the block but has not been viewed at any width. |

## Known issues

1. **The pill block has not been viewed in a browser** at any width. Unverified
   specifically: whether four pills wrap tidily in the 1fr bio column at 1200 px,
   and whether the tinted panel reads as part of the profile or as an interruption
   between the job title and the bio.
2. **The eyebrow above Lucy's name reads "About Dr."** — the template does
   `member.name.split(' ')[0]`, which takes "Dr." as the first name. Pre-existing,
   visible on this page and on `/team/dr-jose-sanz-mengibar/`, and **not fixed**:
   it is a separate change affecting all 34 profiles and was not asked for.
3. **33 of 34 members have no `qualifications` or `specialistAreas`.** The
   template now supports both for everyone; the fields are simply empty. Filling
   them in the Studio needs no code change — but see issue 4.
4. **An unmatched specialism is silent.** It renders as plain grey text with no
   build warning, so a typo in the Studio ("Shoulder Pian") loses its link
   quietly. Deliberate — unmatched labels are legitimate — but it means the
   Studio gets no feedback. A build-time list of unmatched labels would fix it.
5. Everything under Known issues in Session 1 above is still open, including the
   draft PDF, the low-resolution poster and the unviewed event cards.

## Remaining tasks

- **View `/team/dr-lucy-goldby/` in a browser** at 1200, 900, 768 and 400 px
  (issue 1). This is the only outstanding check on the change itself.
- Decide whether "About Dr." is worth a template fix across all 34 profiles
  (issue 2).
- Decide whether the block belongs above the bio, as the owner's ordering
  implied, or below it next to the "Back to the team" link.
- Populate `qualifications` and `specialistAreas` for the other 33 members if
  wanted — no code change needed.
- Consider logging unmatched specialism labels at build time (issue 4).
- **Not committed and not pushed.** Session 1's fix is committed as `a03c786`;
  this session's four files are uncommitted in the working tree.

## Recommendations

- Look at the page before merging. The change is verified in HTML but has never
  been seen, and it inserts a tinted panel into a layout that previously ran
  straight from job title into prose.
- When wiring any remaining CMS field, check the loader's **type** against the
  real shape of the data, not just that the field is queried and mapped. This
  field passed both of those checks and still rendered nothing for months.

---

# Session 3 — 2026-09-10 (same day, same branch)

| Field | Value |
| --- | --- |
| **Date** | 2026-09-10 |
| **GitHub username** | Unknown. `git config user.name` is `Dave` (`dave@hmdg.co.uk`); the remote is owned by `hannah639`. |
| **AI agent used** | Claude Code (Opus 5, 1M context) |
| **Branch** | `team-updates`, still at `a03c786`; sessions 2 and 3 are both uncommitted |

## Objective

On every individual team profile page, make the photo (`.bio-photo.bio-photo--img`)
sticky, so it stays in view within the bio section while the page scrolls.

## Files modified

| File | Change |
| --- | --- |
| `src/pages/team/[slug].astro` | `.bio-photo--img` gains `position: sticky; top: 100px; align-self: start`, with a comment explaining each part; the `max-width: 900px` block turns it off again with `position: static; top: auto`. CSS only — no markup, no data, no component change. |
| `handoffs/handoff-astro.md` | §4 gained a **Sticky media columns** subsection recording the shared recipe and the `overflow` hazard. |
| `handoffs/handoff-astro-2026-09-10.md` | This section. |

## The change

```css
.bio-photo--img { padding: 0; position: sticky; top: 100px; align-self: start; }

@media (max-width: 900px) {
  .bio-photo--img { position: static; top: auto; }
}
```

Nothing was invented. **This is the pattern the project already uses in two
places** — `.image-text-media` and `.image-toggle-media`, both in
`Layout.astro`, are `position: sticky; top: 100px; align-self: start`, and both
revert to `position: static; top: auto` at `max-width: 900px`. The team photo now
matches, so there is one sticky recipe on the site rather than two. §4 of the
master file records it.

Three things make it work, each checked rather than assumed:

1. **`top: 100px`** clears the header, which is `position: fixed` with a 52px
   logo. It is also the offset the other two sticky columns already use, so the
   number is the project's, not a fresh guess.
2. **`align-self: start`** is what gives sticky room to travel — a stretched grid
   item fills its row and has nowhere to move. `.bio-grid` already sets
   `align-items: start`, so this was inherited; it is now stated on the item that
   depends on it, matching the other two rules.
3. **No ancestor sets `overflow`.** Sticky is disabled with no error by an
   `overflow` on any ancestor. `grep -n overflow src/layouts/Layout.astro`
   confirms nothing on `.bp-page`, `.container`, `.bio-section` or `.bio-grid`
   does. This is now written down in §4, because it is the failure mode someone
   will hit later.

## Why it stays inside the section

A sticky grid item is bounded by its **grid area**. The photo's area is the
single grid row, whose height is set by the taller item next to it — the bio
column. So the photo travels down as far as the bottom of the bio and then
releases, which is the requested "stays in the section" behaviour. It required no
extra wrapper and no JavaScript.

## Scope — the two profiles this does not cover

The request named `.bio-photo.bio-photo--img`, which is the **photo** variant.
Of 34 profiles, **32** use it. The other two — `agur-arrien` and
`alice-croucher` — have no photo in Sanity and render the gradient-initials
fallback, `<div class="bio-photo" style="background: …">`, which is deliberately
left non-sticky because the class named in the request does not apply to it.
Extending it is one selector if that is wanted; it was not assumed.

## Travel room

Bio prose across the 34 built profiles runs from **541 to 3 487 characters**
(`ruth-eastwood` shortest, `pat-leahy` longest, 3 to 17 paragraphs). Against a
400px photo, all but the shortest have well over a screen of text to scroll past.
On `ruth-eastwood` the text column is roughly the same height as the photo, so
sticky will have little or no visible travel there — not broken, simply nothing
to do. This is a rough estimate from character counts, not a measured layout.

## Components / schemas / wired fields / SEO / accessibility

- **Components added:** none. **Schemas:** none. **Wired fields:** none. No
  Sanity call changed.
- **SEO:** no markup change at all, so nothing to affect. 114 pages, 103 sitemap
  URLs, 34 team pages — all unchanged.
- **Accessibility:** no markup, no focus order and no heading change. Sticky
  positioning does not remove the photo from the flow or alter reading order.
  Worth noting for later: sticky elements can be awkward at high browser zoom or
  on short viewports, where a pinned 400px photo eats vertical space. Not tested.
- **Performance:** unchanged. `position: sticky` is compositor-driven; no
  JavaScript, no scroll listener, no new asset.

## Bug fixes / refactoring / breaking changes

None. Purely additive CSS on one selector, plus its mobile counterpart.

## Testing / QA

| Check | Result |
| --- | --- |
| `npm run build` | Succeeded, no errors. |
| Page count | **114** — unchanged. Team pages **34** — unchanged. |
| Rule reaches the output | `.bio-photo--img[data-astro-cid-zgofuphd]{padding:0;position:sticky;top:100px;align-self:start}` present in the built CSS. |
| Mobile override is scoped correctly | `.bio-photo--img[…]{position:static;top:auto}` sits **inside** `@media(max-width:900px)`, immediately after the `.bio-photo` mobile rule — verified by reading the surrounding characters of the minified CSS, not by assuming. Had the media query been lost, the static rule would have overridden sticky at every width and killed the feature silently. |
| Sticky-blocking `overflow` | None on any ancestor — `.bp-page`, `.container`, `.bio-section`, `.bio-grid` all clear. |
| Profiles affected | 32 of 34 carry `.bio-photo--img` markup; 2 use the initials fallback and are unchanged. |
| **Browser / visual QA** | **NOT DONE.** No screenshot or browser-automation tool in this session. Sticky behaviour is, by its nature, a scroll behaviour — **it has not been scrolled.** Everything above is static verification of the CSS that reaches the page, which is not the same as watching it stick and release. |
| Responsive / keyboard / screen reader / real device | **Not tested.** Behaviour at 900px and below is switched off by a rule that has been read in the output but not seen. |

## Known issues

1. **The sticky behaviour has not been observed.** This is the central gap: the
   rule is confirmed present and correctly scoped, but no one has scrolled the
   page. Specifically unverified — whether the photo releases cleanly at the
   bottom of the bio rather than overlapping `BookingCTA`, and whether 100px
   leaves a comfortable gap under the header on this particular layout.
2. **Short viewports.** A 400px photo pinned 100px from the top needs 500px of
   viewport. On a landscape phone or a small laptop window above 900px wide, it
   will consume most of the screen. Untested, and the 900px switch-off is a width
   query, so it will not help a short-but-wide window.
3. **The two fallback profiles behave differently** now (see Scope above).
4. Everything under Known issues in Sessions 1 and 2 remains open, including the
   unviewed specialisms block, the "About Dr." eyebrow, the draft PDF and the
   low-resolution poster.

## Remaining tasks

- **Scroll a team profile in a browser** — `/team/pat-leahy/` is the longest bio
  and the best test, `/team/ruth-eastwood/` the shortest and the least useful.
  Check the release at the bottom of the section and the gap under the header.
- Check a short viewport (issue 2) and decide whether a `max-height` or a
  `@media (max-height: …)` escape hatch is wanted.
- Decide whether the initials fallback should stick too (2 profiles).
- **Not committed and not pushed.** Sessions 2 and 3 are together in the working
  tree: 5 files, one of them new.

## Recommendations

- Commit sessions 2 and 3 separately — the specialisms work and the sticky photo
  are unrelated changes to the same file, and splitting them keeps either one
  revertible on its own.
- Before adding a fourth sticky column, read §4 of the master file rather than
  copying whichever rule is nearest; the three that exist now agree, and that is
  worth keeping.

---

# Session 4 — 2026-09-10 (same day, same branch)

| Field | Value |
| --- | --- |
| **Date** | 2026-09-10 |
| **GitHub username** | Unknown. `git config user.name` is `Dave` (`dave@hmdg.co.uk`); the remote is owned by `hannah639`. |
| **AI agent used** | Claude Code (Opus 5, 1M context) |
| **Branch** | `team-updates`, still at `a03c786`; sessions 2–4 are all uncommitted |

## Objective

The owner filled in `qualifications` and `specialistAreas` across the roster in
Sanity. Show them on every profile, with each specialist area linked to the page
that covers it.

## What was actually needed

**The rendering was already done** in session 2 — the template renders both
fields for any member who has them, so the new content appeared on rebuild with
no code change. The real work was **link coverage**: the alias table was built
for one member's four labels and had never met the other 26.

So this session is an audit plus two changes to `specialisms.ts`.

## Coverage before and after

The roster now holds **27 distinct specialist-area labels** across 27 members.
Every label was run through the resolver against the real route files:

| | Before | After |
| --- | --- | --- |
| Resolve to a page | 22 | **26** |
| Resolve to nothing | 5 | **1** |

The five that did not resolve, and what was done about each:

| Label | Members | Outcome |
| --- | --- | --- |
| `Knee injuries and ACL` | 9 | Alias → `/condition/acl-knee-specialist-london/`. The page is "Knee & ACL Injuries Treatment in Clapham"; no wording of the label slugifies to that. |
| `Soft tissue and sports massage` | 4 | Alias → `/service/sports-massage-clapham-soft-tissue-therapy/`. The slug leads on the clinic location, which no label will contain. |
| `Strength and conditioning` | 2 | **No alias** — fixed generically, see below. |
| `Children's neurological and developmental` | 1 | **No alias** — fixed generically, see below. |
| `Breathwork` | 1 | **Left unlinked**, deliberately. See below. |

## Change 1 — the site is inconsistent about "and" in slugs

`Strength and conditioning` and `Children's neurological and developmental` both
failed for the same reason: their pages are `/service/strength-conditioning/` and
`/condition/childrens-neurological-developmental/`, which **drop** the connecting
"and" — while `/condition/balance-and-dizziness/` and
`/service/tmj-and-jaw-pain/` **keep** it.

Two more aliases would have papered over that. Instead `slugify()` became
`slugCandidates()`, which returns the literal slug and then the same slug with
`and` removed, tried in that order:

```
"Balance and dizziness"  → balance-and-dizziness  ✓ (first candidate)
"Strength and condition" → strength-and-conditioning ✗ → strength-conditioning ✓
```

This cannot invent a link: both candidates are exact matches against a real
route file, so the second attempt either hits a page or it does not. It also
covers any future label with the same shape without another alias.

## Change 2 — two aliases, and one label left alone

`ALIASES` went from 5 entries to 9: the two genuine rewordings above, plus
`sports massage` and `soft tissue therapy` as short forms of the same service
page, since the roster already writes that specialism three ways.

**`Breathwork` (Jonathan Lewis) is not linked, on purpose.** The word appears on
exactly two built pages and neither is about it:
`/service/psychological-wellness/` has one FAQ line ("Is breathwork included?
Where appropriate, breathing techniques may be used…"), and
`/service/sports-massage-clapham-soft-tissue-therapy/` mentions it inside
Jonathan's own bio blurb, which would be a circular link. Pointing a specialism
at a page that merely contains the word would be worse than plain text, so it
renders as plain grey text — the behaviour the module was designed for. Linking
it to psychological-wellness is an editorial call for the owner, and a one-line
alias if wanted.

## Nine members still have no data

`qualifications` and `specialistAreas` are **empty in the published dataset** for:

| Member | qualifications | specialistAreas |
| --- | --- | --- |
| `alice-croucher` | empty | present |
| `agur-arrien` | empty | present |
| `sally-mcginn` | empty | empty |
| `katrina-johnson` | empty | empty |
| `richard-lepper` | empty | empty |
| `victoria-chapman` | empty | empty |
| `charlotte-fordyce` | empty | empty |
| `rose-martin` | empty | empty |
| `ruth-eastwood` | empty | empty |

25 of 34 have qualifications; 27 of 34 have specialist areas.

**The likely explanation is that those edits are unpublished drafts.** The build
reads `perspective: 'published'` (`client.ts`), so a saved-but-unpublished field
is invisible to it. **This could not be verified:** `SANITY_API_READ_TOKEN` in
`.env` is present but **empty** (length 0), and an unauthenticated draft read
returns `Unauthorized`. So the finding is "empty in published data", and the
draft theory is inference, not fact. Publishing those nine documents and
rebuilding is the test.

Nothing in code needs to change for them — the template already handles any
member who has the fields.

## Files modified

| File | Change |
| --- | --- |
| `src/lib/sanity/specialisms.ts` | `slugify()` → `slugCandidates()` with the "and" fallback; `ALIASES` 5 → 9 entries; the `resolveSpecialism` loop and its doc comment updated. |
| `handoffs/handoff-astro.md` | §7 `specialisms.ts` row extended with the "and" rule and the coverage figures. |
| `handoffs/handoff-astro-2026-09-10.md` | This section. |

No template, component, CSS, GROQ query, loader or schema was touched this
session. **Nothing was written to Sanity.**

## Components / schemas / wired fields

None added. Both fields were already wired in session 2.

## Testing / QA

| Check | Result |
| --- | --- |
| `npm run build` | Succeeded, no errors, no new warnings. |
| Page count | **114**; team pages **34** — both unchanged. |
| Credentials block | Renders on **25** of 34 profiles — exactly the 25 with data. |
| Specialisms block | Renders on **27** of 34 — exactly the 27 with data. |
| Total specialism links | **95** across the roster, resolving to **25 distinct pages** (19 conditions, 6 services). |
| **Every link target exists** | All 95 hrefs were checked against `dist/client/<href>/index.html`. **Zero broken targets.** This is the check that matters — the resolver validates against route files, and this confirms the built pages agree. |
| Unlinked pills | **1** — `jonathan-lewis: Breathwork`, as intended. |
| Alias integrity | All 9 alias targets exist as route files; a bad one fails the build by design. |
| Rendered text | Spot-checked `jonathan-lewis` (`BSc (Hons), MCSP` / `30+ Years of Experience`, two links plus the plain `Breathwork`) and `deri-wilson` (`Dip ITEC, MCThA` / `18 Years of Experience`, one link). Both match the CMS. |
| **Browser / visual QA** | **NOT DONE.** No screenshot or browser-automation tool in this session. 27 profiles now carry a pill block and **none has been seen rendered.** Members with 5+ specialisms will wrap to multiple rows; that has not been looked at. |
| Responsive / keyboard / screen reader / real device | **Not tested.** |

## Known issues

1. **27 pill blocks, none viewed.** Session 2's known issue is now 27× larger.
   The widest case is a member with several long labels — "Children's
   neurological and developmental" is 41 characters and will dominate a row in
   the 1fr bio column. Unseen.
2. **Nine members show no credentials or specialisms** (table above). Probably
   unpublished; unverifiable here.
3. **`SANITY_API_READ_TOKEN` is empty in `.env`.** The master file describes it
   as "reserved for future draft/preview work"; it is not merely unused, it has
   no value, so no draft read is possible from this checkout. Worth correcting in
   §12 if drafts are ever needed.
4. **`Breathwork` is unlinked** (see above) — owner's call.
5. **An unmatched label is still silent at build time.** Carried from session 2,
   and now more relevant: with 27 labels in play, a Studio typo loses its link
   with no warning. The audit script written for this session lives only in the
   scratchpad; making it a build-time log line is the fix.
6. Sessions 1–3 known issues all remain open.

## Remaining tasks

- **Publish the nine documents** in the Studio if their fields were filled in,
  then rebuild — no code change needed (issue 2).
- **View several profiles in a browser**, choosing ones with the most and longest
  specialisms, at 1200, 900, 768 and 400 px (issue 1).
- Decide whether `Breathwork` should link to `/service/psychological-wellness/`
  (issue 4).
- Consider a build-time warning listing unmatched labels (issue 5).
- **Not committed and not pushed.** Sessions 2–4 sit together in the working
  tree: 5 files, one new.

## Recommendations

- The alias table should stay a last resort. Two of the five gaps this session
  were a general pattern, not special cases, and fixing the pattern removed the
  need for four aliases rather than two. Prefer that order — pattern first,
  alias only for a genuine reword.
- Before adding a specialism in the Studio that is meant to link somewhere,
  check the target page's **slug**, not its title. Every alias in the file exists
  because a title and a slug disagree.

---

# Session 5 — 2026-09-10 (same day, same branch)

| Field | Value |
| --- | --- |
| **Date** | 2026-09-10 |
| **GitHub username** | Unknown. `git config user.name` is `Dave` (`dave@hmdg.co.uk`); the remote is owned by `hannah639`. |
| **AI agent used** | Claude Code (Opus 5, 1M context) |
| **Branch** | `team-updates`, still at `a03c786`; sessions 2–4 remain uncommitted |

## Objective

The owner reported that qualifications and specialist areas were **not appearing**
on team profile pages, and asked for the data to be pulled from Sanity and
rendered following the layout of `/team/dr-lucy-goldby/`.

## Diagnosis — a stale dev server, not missing code

**No code was written this session.** The fields were already wired (session 2)
and the link coverage already extended (session 4); the 21:50 build contained all
of it. The problem was the running dev server.

`getTeam()` **memoises its Sanity fetch for the lifetime of the process**
(`handoff-astro.md` §7: "Every loader memoises its promise for the build's
lifetime"). The dev server had been running since **19:48**, so it was serving a
team snapshot taken *before* the owner's edits, which Sanity records at
**13:42–13:44 UTC** on the same day.

The signature made it unmistakable:

| Profile | Dev server (19:48 process) | 21:50 build |
| --- | --- | --- |
| `dr-lucy-goldby` | blocks present | blocks present |
| `jonathan-lewis` | **absent** | present |
| `deri-wilson` | **absent** | present |
| `pat-leahy` | **absent** | present |

Lucy's data predated the dev server, so it was inside the cached snapshot. Every
member edited later was not. The owner was looking at a page that could not show
the new content no matter how many times it was reloaded.

This is the third fact in `handoff-astro.md` §1 — a content change needs a
rebuild — applying to `npm run dev` as well as to a deploy. **Editing Sanity does
not refresh a running dev server, and neither does saving a file:** Vite reloads
changed modules, but if `team.ts` is untouched its memo survives.

## What was done

1. Stopped the 19:48 dev server.
2. Killed the orphaned `node` process still holding port **4321** — the first
   restart had silently come up on **4322** while the stale server kept answering
   on 4321, which would have looked like the bug persisting.
3. Started a clean server on 4321, which fetched Sanity fresh.

## Layout

No layout work was needed or done. There is **one** profile template,
`src/pages/team/[slug].astro`, so every profile already renders the exact layout
seen on `/team/dr-lucy-goldby/` — job title, then the `.bio-creds` list, then the
`.bio-specialisms` pill panel, then the bio prose. Lucy's page was never special;
it was simply the only one whose data was in the cached snapshot.

## Verification — dev server now matches the CMS

A sweep of all 34 profiles over the restarted server, compared against a live
GROQ query:

| | Live Sanity (published) | Dev server |
| --- | --- | --- |
| Members with `qualifications` | 25 | **25** |
| Members with `specialistAreas` | 27 | **27** |
| Specialism links rendered | — | **95** |
| Unlinked pills | — | **1** (`Breathwork`) |
| HTTP non-200 | — | **0** |

The first sweep of this session reported 24 and 26 and listed
`caroline-curtis` as empty. **That was my measurement error, not a fault:** the
sweep hit all 34 routes immediately after startup and raced Astro's on-demand
compilation. Re-checking her page alone returned 200 with both blocks and all
five links present, and the warm re-sweep agreed with Sanity exactly. Recorded
here because the first numbers were wrong and the corrected ones are the real
result.

Trimming confirmed on real data: Caroline Curtis's specialism is stored as
`" Knee injuries and ACL"` with a **leading** space and still resolves, as do the
trailing-space values.

## The seven profiles that show nothing

`charlotte-fordyce`, `katrina-johnson`, `richard-lepper`, `rose-martin`,
`ruth-eastwood`, `sally-mcginn`, `victoria-chapman` have both fields empty in the
published dataset and therefore render neither block.

Their `_updatedAt` is **2026-07-26**, whereas every member edited in this round
carries **2026-09-10T13:4x**. So those seven were not published today. Whether
they were never filled in, or filled in and left unpublished, still **cannot be
determined from here** — publishing updates `_updatedAt` on the published
document, so a draft-only edit leaves the July date either way, and
`SANITY_API_READ_TOKEN` in `.env` is empty (session 4, issue 3), so drafts cannot
be read.

Separately, `agur-arrien` and `alice-croucher` have one specialism (`Pilates`)
and no qualifications, which is why the two counts differ by two.

## Files modified

| File | Change |
| --- | --- |
| `handoffs/handoff-astro-2026-09-10.md` | This section. |
| `handoffs/handoff-astro.md` | §12 gained a note that a running dev server does not see CMS edits. |

No source file was touched. **Nothing was written to Sanity.**

## Components / schemas / wired fields / bug fixes / refactoring / breaking changes

None. Diagnosis and a process restart.

## Testing / QA

| Check | Result |
| --- | --- |
| Dev server | Restarted cleanly on `http://localhost:4321/`, Astro 6.1.7, ready in 5.3 s. |
| All 34 profiles over HTTP | **0** non-200. |
| Blocks rendered | 25 credentials, 27 specialisms — matches live Sanity exactly. |
| Links | 95 rendered; every distinct target was already confirmed against built pages in session 4. |
| Ports | 4321 and 4322 both verified free before the final start, so nothing stale can answer. |
| **Browser / visual QA** | **NOT DONE.** Still no screenshot tool. The owner can now see the content; nobody on this side has. |

## Known issues

1. **A running dev server hides CMS changes.** Now written into §12. Worth
   knowing that the symptom is indistinguishable from "the field was never
   wired", which is exactly how it was reported.
2. **A restart can land on a different port** while the old process keeps the
   original one, which makes the original problem appear to persist. Kill the
   port, do not just restart.
3. Seven profiles show nothing because their published documents are empty
   (above). Not a code issue.
4. Sessions 1–4 known issues all remain open, including the fact that **no pill
   block has been viewed in a browser** on this side.

## Remaining tasks

- Publish the seven documents if their fields were filled in, then restart the
  dev server or rebuild.
- Everything still outstanding from sessions 1–4.
- **Not committed and not pushed.** Sessions 2–4 remain in the working tree:
  5 files, one new.

## Recommendations

- When a CMS field looks unwired, check the process age before the code. A
  memoised loader plus a long-lived dev server produces precisely this symptom,
  and the code was correct throughout.
- After editing Sanity, restart `npm run dev`. There is no way to invalidate the
  memo from the Studio.
