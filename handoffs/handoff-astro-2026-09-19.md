# Handoff — 2026-09-19

| Field | Value |
| --- | --- |
| **Date** | 2026-09-19 |
| **GitHub username** | Unknown. `git config user.name` is `Dave` (`dave@hmdg.co.uk`); the remote `https://github.com/hannah639/balance-physio.git` is owned by `hannah639`. Neither is confirmed to be the committing GitHub account. |
| **AI agent used** | Claude Code (Opus 5, 1M context) |
| **Repository** | `hannah639/balance-physio` |
| **Branch** | `news-events-updates-19-9-26`, cut from `main` at `bab1d99` (level with `origin/main`; `git pull` reported "Already up to date") |

## Objective

Add a third entry to `/news-events/` covering the Mulligan Manual Therapy
Concept training sessions, from copy and one image supplied by the owner.

## Files created

| File | Purpose |
| --- | --- |
| `public/news/mulligan-manual-therapy-concept-2026.avif` | 7 124 bytes — the owner's file, **copied verbatim**. It was already AVIF and well compressed; re-encoding would only have added loss. |
| `public/news/mulligan-manual-therapy-concept-2026.webp` | 11 640 bytes — generated from the AVIF, quality 80, effort 5. |
| `public/news/mulligan-manual-therapy-concept-2026.jpg` | 23 620 bytes — generated from the AVIF, quality 88, mozjpeg. The `<picture>` fallback. |
| `handoffs/handoff-astro-2026-09-19.md` | This log. |

Variants were produced with **sharp 0.34 / libvips**, already in `node_modules`,
as on 2026-09-08. `scripts/gen-image-variants.sh` still does not run on this
machine and was not touched.

## Files modified

| File | Change |
| --- | --- |
| `src/data/events.js` | New `mulligan-manual-therapy-concept-2026` entry (18 lines) inserted at index 1. The field reference and JSDoc typedef at the top are untouched. |
| `handoffs/handoff-astro.md` | §11 event count 2 → 3. |

## Content added

| Field | Value |
| --- | --- |
| `slug` | `mulligan-manual-therapy-concept-2026` |
| `category` | `Training` |
| `headline` | `Mulligan Manual Therapy Concept` |
| `image` | `/news/mulligan-manual-therapy-concept-2026.jpg` |
| `imageWidth` / `imageHeight` | `480` / `502` — the source's real dimensions |
| `body` | Three paragraphs from the owner's copy |
| `date` | **omitted** — see below |
| `imageFit` | **omitted** — this is a photograph, not a poster, so the default crop applies |

## Four judgment calls, each a one-line change if the owner disagrees

### 1. No `date` field

The copy gives no date — it says only "our last 2 Mulligans Manual Therapy
Concept sessions". `date` is optional in the typedef, so it was **left out rather
than invented**. The card renders headline and category with no `<time>`. On
2026-09-08 the opera entry's date was read off a poster and flagged as the single
unverified fact on that card; there was no equivalent source here, so nothing was
guessed.

### 2. `category: 'Training'`

Not supplied. The two existing categories are "Upcoming Event" and "Sponsorship",
neither of which fits a completed CPD course. "Training" is a classification
rather than a factual claim, which is why it was chosen rather than queried.

### 3. Placed at index 1, not index 0

`events.js` opens with "add new events at the top", but the wellness evening at
index 0 is **still upcoming** (8 October, and today is 19 September) while this
entry is retrospective. Pushing a live call-to-register below a completed course
would be the wrong trade — the same reasoning applied on 2026-09-08. It sits
above the July opera entry because it is the more recent of the two past events.

> **Consequence:** the page alternates image side by array index, so the opera
> card has moved from index 1 to index 2 and **its layout has flipped** — it now
> renders image-left rather than image-right. Confirmed in the built HTML: the
> new card carries `news-card--reverse`, the opera card no longer does. Nothing
> about the opera entry itself changed.

### 4. "Jarryd Ferriera" corrected to "Jarryd Ferreira"

The supplied copy spells the surname **Ferriera**. Both `src/data/team.js` and
Sanity spell it **Ferreira** (`jarryd-ferreira`). The site's own spelling was
used, because publishing a colleague's name misspelled on a public page is a real
cost and the correction is unambiguous. **This is the only edit made to the
owner's words** — everything else, including the typographic apostrophes and the
phrase "Mulligans Manual Therapy Concept sessions" in the first sentence, is
verbatim.

## The image shows two people; the copy names four

The supplied photograph shows **two** clinicians in navy Balance polo shirts,
arms around each other's shoulders, in front of a framed blue poster. The body
text names **four** attendees — Sam Stringer, Portia Morey, Jarryd Ferreira and
Patrick O'Leary.

The image was opened and looked at (converted to PNG and viewed) specifically so
the required `imageAlt` could describe what is actually there rather than
paraphrasing the headline. The alt text therefore says "two clinicians" and
**does not name them**, because they cannot be identified from the photograph
with any confidence.

This mismatch is not necessarily wrong — a photo of two attendees alongside copy
naming four is ordinary — but the owner should know the card does not show all
four, and that no name is attached to either face.

## Why the default crop, not `imageFit: 'contain'`

The existing two entries both use `contain` because both are text-heavy posters
that must not be cropped. This is a photograph, so it takes the default:
`object-fit: cover` with `object-position: center top` in a column of
`min-height: 360px`. The faces sit in the upper half of a near-square frame
(480 × 502, aspect 0.956), so a `cover` crop against the taller body column
trims the sides rather than the heads. No `imageBackdrop` is needed, since
nothing is letterboxed.

## Components / schemas / wired fields

None. No component, template, CSS, GROQ query, loader or schema was touched. The
card, the category pill and the `<picture>` treatment all already existed.

Events are **not** in Sanity — `src/data/events.js` is the live source for
`/news-events/` (`handoff-astro.md` §11) — so this needs a rebuild to appear, not
a publish.

## Bug fixes / refactoring / breaking changes

None. Purely additive.

## Performance / SEO / accessibility

- **Performance:** one page gains one image. Browsers taking AVIF fetch 7 KB.
  `loading="lazy" decoding="async"` with explicit `width`/`height`, so no layout
  shift.
- **SEO:** no route added or removed **by this change** — an event is a card, not
  a page. The card adds a `#mulligan-manual-therapy-concept-2026` anchor.
- **Accessibility:** heading order intact — one `<h1>` in `PageHero`, one `<h2>`
  per card (now 4 `<h2>` on the page: three cards plus `BookingCTA`). The alt
  text describes the photograph rather than restating the headline. `<time>` is
  absent on this card because no date was supplied; the two other cards' `<time>`
  elements still carry no `datetime` attribute, an issue open since 2026-09-04.

## The page count rose again, and again not because of this work

The build produced **116** pages and **105** sitemap URLs, against 115 and 104 on
2026-09-17. The cause is content: a new blog post,
**`sam-stringer-and-portia-morey-win-in-tennis-doubles`**, was created in Sanity
at `2026-09-18T16:39:50Z`, and `/news/<slug>/` is a generated route. The team
roster is unchanged at 35.

This is the second consecutive session where the headline page count moved
through content alone. §1 of the master file already carries the annotation
explaining that the figure tracks the CMS; it has **not** been bumped again,
because chasing it each session is exactly what that note exists to avoid.

## Testing / QA

| Check | Result |
| --- | --- |
| `npm run build` | Succeeded, no errors. |
| Card count | **3** `<article class="news-card">`, up from 2. |
| Card order and layout | `[0] wellness-meet-the-team-october-2026`, `[1] mulligan-manual-therapy-concept-2026` (`news-card--reverse`), `[2] st-pauls-opera-la-traviata-2026`. |
| New card text | Category "Training", headline, and all three paragraphs read back from `dist/client/news-events/index.html` with tags stripped, and match the supplied copy (with the one surname correction). |
| **Existing cards not damaged** | Both read back in full — wellness card **702** characters, opera card **581** characters, pills, dates and bodies all present. Checked as rendered text, per §13, not by counting elements. |
| `<picture>` markup | AVIF → WebP → JPG in that order, `width="480" height="502"`, lazy/async, full alt text. |
| Assets over HTTP | `.avif` **200** `image/avif` 7 124 B, `.webp` **200** `image/webp` 11 640 B, `.jpg` **200** `image/jpeg` 23 620 B. |
| Assets in `dist/` | All three present under `dist/client/news/` at the same sizes. |
| Page count | 116 / 105 — explained above, caused by a Sanity blog post, not this change. |
| **Browser / visual QA** | **NOT DONE.** No screenshot or browser-automation tool in this session, as in every previous one. Everything above comes from built HTML and HTTP responses. The card has not been seen, and this is the first card on the page to use the **default crop** rather than `contain`. |
| Responsive / keyboard / screen reader / real device | **Not tested.** |

## Known issues

1. **The crop has not been seen.** This is the first `/news-events/` card to use
   `object-fit: cover`. The faces sit in the upper half of the frame and
   `object-position: center top` should protect them, but that is reasoning from
   the CSS, not observation. If heads are clipped, `imagePosition` is the fix and
   it is one line.
2. **The photograph is 480 × 502.** The desktop photo column is roughly 460 CSS
   px wide, so it is adequate at 1× and soft on a 2× display. Only a larger
   original fixes this — the same limitation as the opera poster.
3. **Two faces, four names** (see above). Owner's call whether that matters.
4. **The opera card's layout has flipped** as a side effect of the insert
   position (see judgment call 3). Intentional, but visible.
5. **No date on the new card.** Deliberate; supply one and it renders.
6. Everything open from 2026-09-17 and 2026-09-10 remains open, including the
   still-unviewed wellness tiles and specialisms blocks, `/about-us/` still
   reading "27 professionals" in six places, and the empty
   `SANITY_API_READ_TOKEN`.

## Remaining tasks

- **View `/news-events/` in a browser** at 1200, 900, 768 and 400 px — in
  particular the new card's crop (issue 1) and the opera card's flipped side.
- Supply a date for the sessions if one should appear.
- Confirm "Training" is the right category pill.
- Confirm the surname correction (judgment call 4).
- Decide whether a photo showing two of the four named attendees is the image you
  want on the card.
- **Not committed and not pushed.** The working tree holds the entry, three image
  files and two handoff files.

## Recommendations

- Open supplied images before writing their alt text. The photograph here does
  not show what the copy describes, and that would not have surfaced from the
  brief alone.
- If `/news-events/` gains many more entries, the index-based image alternation
  will keep re-flipping existing cards whenever one is inserted mid-list. A
  per-entry `reverse` flag would make each card's layout stable and explicit.
