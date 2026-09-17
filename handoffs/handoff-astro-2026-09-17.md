# Handoff — 2026-09-17

| Field | Value |
| --- | --- |
| **Date** | 2026-09-17 |
| **GitHub username** | Unknown. `git config user.name` is `Dave` (`dave@hmdg.co.uk`); the remote `https://github.com/hannah639/balance-physio.git` is owned by `hannah639`. Neither is confirmed to be the committing GitHub account. |
| **AI agent used** | Claude Code (Opus 5, 1M context) |
| **Repository** | `hannah639/balance-physio` |
| **Branch** | `wellness-updates-17-9-26`, cut from `main` at `c362072` (level with `origin/main`; `git pull` reported "Already up to date") |

## Objective

On `/service/psychological-wellness/`, replace the three placeholder tiles in
**Meet The Wellness Team** — Sally McGinn, Katrina Johnson, Richard Lepper — with
their profile photos.

## Root cause — a shape mismatch, not a missing photo

The photos were never missing. Every source had one:

- `public/team/sally-mcginn.{jpg,webp,avif}` and the same for the other two, all
  present on disk.
- Sanity holds a 600 × 800 image for all three, with alt text, plus `jobTitle`
  and `wellnessOnly: true`.

The page was passing the wrong **shape**. It read the roster from the legacy
`src/data/team.js`:

```js
import { team } from '../../data/team.js';
const wellnessTeam = team.filter((m) => m.wellness);
```

`Team.astro` reads the **Sanity** shape — `member.photo?.url` and
`member.jobTitle`. The legacy file stores `photo` as a plain **string**
(`'/team/sally-mcginn.jpg'`) and calls the role field `role`. So:

| `Team.astro` reads | Legacy file provides | Result |
| --- | --- | --- |
| `member.photo?.url` | `photo` is a string, so `.url` is `undefined` | fell through to the gradient-initials placeholder |
| `member.jobTitle` | field is called `role` | **role rendered empty** |

Neither produced an error. The tiles looked deliberate, which is why this sat
unnoticed. **The empty job title was not in the brief** — it was found while
confirming the photo fault, has the identical cause, and is fixed by the same
line, so leaving it broken while fixing the photo beside it made no sense. It is
called out here rather than folded in silently.

This is the same class of failure as the `qualifications` bug on 2026-09-10: the
data is fetched and present, and a type mismatch makes it render as nothing.

## The fix

```js
import { getTeam } from '../../lib/sanity/team';
const wellnessTeam = (await getTeam()).filter((m) => m.wellnessOnly);
```

Plus a guard that throws if the filter comes back empty, so the section can never
render an empty grid (`handoff-astro.md` §14).

Three reasons this is the right direction rather than reshaping the legacy
objects at the call site:

1. **It matches the architecture.** All content comes from Sanity; `data/team.js`
   is a build-time *fallback*, not a source (§11).
2. **It costs nothing.** `getTeam()` memoises and `Team.astro` already calls it,
   so this is one shared request, not a second fetch.
3. **The fallback still works.** If Sanity is unreachable, `team.ts`'s
   `fromFallback()` maps `wellness` → `wellnessOnly` and wraps the photo path in
   the object shape `Team.astro` expects — so the tiles degrade to the local
   JPEGs rather than back to placeholders.

## Files modified

| File | Change |
| --- | --- |
| `src/pages/service/psychological-wellness.astro` | Legacy `data/team.js` import swapped for `getTeam()`; filter on `wellnessOnly`; empty-roster guard; comment explaining the shape trap. |
| `handoffs/handoff-astro.md` | §1 page count 114 → 115 with a note that it tracks the CMS; §6 route row now lists `getTeam`; §11 `team.js` row warns against handing its objects to `Team.astro`. |
| `handoffs/handoff-astro-2026-09-17.md` | This log. |

## Files created / removed

Created: this log. Removed: none. **Nothing was written to Sanity.**

## Components / schemas / wired fields

No component, schema or GROQ query was touched. No new field was wired — the
page now reads fields that were already being fetched.

## The page count changed, and not because of this work

The build produced **115** pages and **104** sitemap URLs, against 114 and 103 on
2026-09-10. The cause is content, not code: a new team member,
**`patrick-oleary`**, was created in Sanity at `2026-09-17T10:57:52Z`, and
`/team/<slug>/` is a generated route. `git status` shows exactly one modified
file, and this change adds no route.

`handoff-astro.md` §1 has been updated to 115 **and annotated**, because the
figure is a moving target: team, who-we-help and news pages are all generated
from the CMS, so any published document changes it. Treating 114 as a fixed
expectation would turn ordinary content work into a failed QA check.

## Bug fixes

Two, both from the one root cause: the placeholder tiles (reported) and the empty
job titles (found while verifying).

## Refactoring / performance / SEO / accessibility

- **Refactoring:** removes this page's last dependency on the legacy roster.
  `news-events.astro` is now the only page importing `src/data/team.js` directly,
  and it renders the objects itself rather than passing them to `Team.astro`.
- **Performance:** no extra request — `getTeam()` was already being called by
  `Team.astro` on this page and is memoised. The three tiles now load ~25–61 KB
  images from the Sanity CDN instead of rendering a CSS gradient, which is a real
  addition, but they are `loading="lazy" decoding="async"` with explicit
  `width`/`height`, so nothing shifts.
- **SEO:** no route added or removed by this change. Three internal links to
  `/team/<slug>/` already existed on the tiles and are unchanged.
- **Accessibility:** each photo now carries Sanity's alt text, e.g. "Sally
  McGinn, Chartered Sports Performance Psychologist at Balance Performance
  Physiotherapy" — previously these tiles offered a decorative gradient and two
  initials with no equivalent. The job title is also now announced rather than
  being an empty `<span>`. Both are improvements, neither has been screen-reader
  tested.

## Breaking changes

None.

## Testing / QA

| Check | Result |
| --- | --- |
| `npm run build` | Succeeded, no errors. |
| Placeholders on the page | **0** `team-initials` in the wellness section, down from 3. |
| Photo tiles | **3** `team-photo-wrap--img`, up from 0. |
| Per-tile check (built HTML) | Sally McGinn / Katrina Johnson / Richard Lepper each render `<img>` with the correct Sanity 600 × 800 asset, full alt text, `loading="lazy"`, `decoding="async"`, `width="400" height="500"`. |
| Job titles | All three now render: "Chartered Sports Performance Psychologist", "Holistic Therapist", "Clinical Hypnotherapy & Mental Health Practitioner". Previously empty. |
| Images actually fetch | All three Sanity CDN URLs return **HTTP 200** (61 KB, 43 KB, 25 KB). |
| `/meet-the-team/` not affected | **32** team cards, and the wellness trio is still correctly excluded (35 members − 3 wellness). |
| Page count | 115 / 104 sitemap — explained above, not caused by this change. |
| Dev server | Served the page 200 throughout with the corrected tiles. |
| **Browser / visual QA** | **NOT DONE.** No screenshot or browser-automation tool in this session, as in every prior session. The tiles are confirmed in built HTML and the images confirmed to fetch; **nobody has looked at the row.** Specifically unverified: whether three 600 × 800 portraits sit well in a 240px-tall tile cropped `object-position: center top`. |
| Responsive / keyboard / screen reader / real device | **Not tested.** |

## Known issues

1. **The corrected row has not been seen.** The tile is `height: 240px` with
   `object-fit: cover; object-position: center top`, and these are the first
   Sanity portraits to go through it on this page. Faces could sit high or be
   cropped.
2. **A dev server bound to `::1` looked like a dead server** at the start of this
   session — the process was healthy but the browser resolved `localhost` to
   `127.0.0.1` and got nothing. Restarted with `npm run dev -- --host 127.0.0.1`.
   Noted in case it recurs; the tell is `Get-NetTCPConnection -LocalPort 4321`
   reporting `::1` as the LocalAddress.
3. **`news-events.astro` still imports `src/data/team.js` directly.** Not a fault
   today — it renders the objects itself — but it is the last direct consumer and
   the same trap is one refactor away.
4. **`patrick-oleary` is new and unreviewed here.** The profile builds; its
   content has not been checked.
5. Everything from `handoff-astro-2026-09-10.md` remains open, including the
   still-unviewed specialisms pill blocks and the still-unscrolled sticky photo,
   both of which are **live in production**.

## Remaining tasks

- **Look at the wellness row in a browser** at 1200, 900, 768 and 400 px
  (issue 1). This is the only outstanding check on the change.
- Review `patrick-oleary`'s new profile.
- Consider whether `news-events.astro` should move to `getTeam()` as well
  (issue 3).
- **Not committed and not pushed.** The working tree holds one modified source
  file plus the two handoff files, on `wellness-updates-17-9-26`, which has no
  upstream yet.

## Recommendations

- When a component renders a placeholder rather than an error, suspect the shape
  of what was passed in before suspecting the data. Both faults this session, and
  the `qualifications` bug last week, were present-but-mistyped data — none of
  them produced a single warning.
- `Team.astro` would be safer if it accepted a string photo as well as an object,
  or if it warned on a member with neither a photo nor a job title. Either would
  have surfaced this in the terminal instead of on the page.

---

# 2026-09-17 — later the same day (same branch)

Two follow-up changes after the wellness photo fix above, both requested by the
owner, both on `wellness-updates-17-9-26`.

## 1. Job titles removed from the wellness tiles

The photo fix above also restored the job titles on those three tiles, which had
been rendering as empty `<span>`s. **The owner did not want them** and asked for
them removed.

### How it was scoped

`Team.astro` is shared by three pages, so deleting the role line outright would
have stripped it from **32 cards on `/meet-the-team/` and 32 on the homepage
carousel** as well. That was not asked for, so instead the component gained a
prop:

```astro
hideRole = false,          // default: unchanged behaviour everywhere
...
{!hideRole && <span class="role">{member.jobTitle}</span>}
```

applied in **both** the slider and grid branches — a prop that silently worked in
only one of them would be a trap for the next caller — and
`psychological-wellness.astro` passes `hideRole`.

The job-title half of the earlier fix is therefore superseded: the shape fix
still stands, because that is what supplies the photos, but the titles are no
longer rendered on this page.

### Verified

| Page | `class="role"` spans |
| --- | --- |
| Wellness tiles | **0** |
| `/meet-the-team/` | **32** — unchanged |
| Homepage carousel | **32** — unchanged |

Photos unaffected: still 3 photo tiles, 0 placeholders.

## 2. "27 professionals" → "28 professionals"

Requested for the **Meet Our Team** section on the homepage and
`/meet-the-team/`. The string is the **default** `subheading` prop in
`Team.astro`, and exactly two callers rely on that default:

| Caller | Passes a subheading? |
| --- | --- |
| `index.astro` — `<Team sliderRow />` | no → uses the default |
| `meet-the-team.astro` — `<Team />` | no → uses the default |
| `service/psychological-wellness.astro` | **yes**, its own copy → unaffected |

So the one-word edit reaches precisely the two pages named and nothing else.
Confirmed in the built HTML: both now read "We have **28** professionals under
one roof waiting to help you move, recover and perform."

### `/about-us/` still says 27 — deliberately left

Six occurrences remain on that page, and they were **not** changed: the owner
named two pages, and most of this is CMS copy rather than code.

| Location | Source | Text |
| --- | --- | --- |
| Hero subtitle | **Sanity** `page.heroSubtitle` | "London's largest rehabilitation centre, 27 professionals under one roof, united by one mission." |
| Meta description | **Sanity** `page.seo.metaDescription` | "…with 27 professionals under one roof…" |
| Body copy | **Sanity** section body | "…we have 27 professionals under one roof waiting to impart their knowledge…" |
| `about-us.astro:15` | code **fallback** | same meta description, used only when Sanity is empty |
| `about-us.astro:18` | code **fallback** | same hero subtitle, used only when Sanity is empty |

The three live strings need a Studio edit and a rebuild; the two fallbacks are a
code change. Raised with the owner, not actioned.

> **The number is hand-maintained, not derived.** The roster currently holds 35
> team members and `/meet-the-team/` renders 32 cards, so "28 professionals" does
> not match what a visitor can count on the page. It has drifted before — the
> copy said 27 while the roster grew — and will drift again. Deriving it from
> `getTeam()` was offered and not taken up; it remains the durable fix.

## Files modified in this part

| File | Change |
| --- | --- |
| `src/components/Team.astro` | New `hideRole` prop (default `false`), honoured in both the slider and grid branches; default `subheading` count 27 → 28. |
| `src/pages/service/psychological-wellness.astro` | Passes `hideRole`. |

## Testing / QA for this part

| Check | Result |
| --- | --- |
| `npm run build` | Succeeded, no errors. |
| Page count | **115** — unchanged from earlier today. |
| Role spans | 0 on the wellness tiles; 32 on `/meet-the-team/`; 32 on the homepage. Checked in the built HTML, so the scoping is proven rather than assumed. |
| Subheading | "28 professionals" on the homepage and `/meet-the-team/`; the wellness page keeps its own subheading and shows no count line. |
| Remaining "27 professionals" | **1** page — `/about-us/`, as set out above. Searched the whole build rather than only the pages touched. |
| Wellness photos | Still 3 photo tiles, 0 placeholders after both changes. |
| **Browser / visual QA** | **NOT DONE.** No screenshot tool, as throughout. A tile with the role line removed is shorter than one without, and that row has not been looked at. |

## Known issues added by this part

1. **The wellness tiles now show a name and nothing else.** Whether three
   photo-and-name tiles read as finished or as missing information is a visual
   judgement nobody here has been able to make.
2. **`hideRole` has no test and one caller.** If a future page passes it to the
   slider variant, that path is implemented but has never been exercised.
3. **The professionals count remains hardcoded** and now disagrees with the
   roster by a wider margin than before (28 stated, 32 cards rendered, 35
   members).

## Remaining tasks after this part

- View `/service/psychological-wellness/`, `/meet-the-team/` and the homepage in
  a browser.
- Decide on `/about-us/`: three Sanity strings and two code fallbacks still say
  27.
- Decide whether the professionals count should be derived from `getTeam()`.
- Everything still open from earlier today and from 2026-09-10.
