# Handoff — 2026-09-30

| Field | Value |
| --- | --- |
| **Date** | 2026-09-30 |
| **GitHub username** | Unknown. `git config user.name` is `Dave` (`dave@hmdg.co.uk`); the remote `https://github.com/hannah639/balance-physio.git` is owned by `hannah639`. Neither is confirmed to be the committing GitHub account. |
| **AI agent used** | Claude Code (Opus 5, 1M context) |
| **Repository** | `hannah639/balance-physio` |
| **Branch** | `updates-30-9-26`, cut from `main` at `dcb61da` (level with `origin/main`) |

## Objective

Two briefs, both supplied as Google Docs:

1. Build a **Personal Training** page from "PT Content - Balance Performance
   Physiotherapy", reusing the `/service/strength-conditioning/` photographs in a
   different order, and link to it from a **Personal Training** item beneath
   Strength & Conditioning in the services menu.
2. Add an **"Our experts"** team block to specific condition and service pages
   from "Condition Page Team Linking Blocks - Balance Performance
   Physiotherapy", with every clinician name linked to their team page.

## Reading the source documents

Both links were `/edit` URLs, which return only the Docs chrome to an
unauthenticated fetch. **They are readable through the export endpoint** —
`https://docs.google.com/document/d/<id>/export?format=txt` — provided redirects
are followed; the first hop is a 307 to `googleusercontent.com`. Worth knowing:
the documents were nearly abandoned as private when they were not.

### The expert document validated cleanly before any code was written

Every name and route in it was checked against the live CMS and the repo:

| Check | Result |
| --- | --- |
| Blocks in the document | **25** — 19 condition pages, 6 service pages |
| Clinician references | **95**, across 27 distinct people |
| Names resolving to a published team member | **95 / 95** |
| Target routes that exist in `src/pages/` | **25 / 25** |
| Job titles differing from Sanity | **0** — exact match on all 95 |

That last row decided the data model (below). A document this consistent is
unusual and is the reason this went in without a round of queries.

## Files created

| File | Purpose |
| --- | --- |
| `src/pages/service/personal-training.astro` | The new page. ~290 lines including scoped CSS. |
| `src/components/PageExperts.astro` | Renders one "Our experts" block for a given route. |
| `src/data/page-experts.js` | The 25 blocks, transcribed from the document. Generated, then committed as source. |
| `handoffs/handoff-astro-2026-09-30.md` | This log. |

## Files modified

| File | Change |
| --- | --- |
| `src/components/ConditionPage.astro` | Imports `PageExperts`, renders it after the FAQs — **one edit covering all 19 condition pages**, since every condition renders through this component. |
| `src/components/ServicePage.astro` | New optional `expertsRoute` prop, rendered before `BookingCTA`. This wrapper backs `tmj-and-jaw-pain`, `pilates` and `paediatric-sports-physiotherapy`. |
| `src/pages/service/{vojta-therapy,sports-massage-clapham-soft-tissue-therapy,strength-conditioning,hydrotherapy}.astro` | Import and render `PageExperts` directly — these four own their closing `BookingCTA`. |
| `src/pages/service/{tmj-and-jaw-pain,pilates}.astro` | Pass `expertsRoute` to `ServicePage`. |
| `src/components/Header.astro` | `MENU_ADDITIONS` table plus the render hook that places Personal Training under Strength & Conditioning. |

## Part 1 — the Personal Training page

### It is not CMS-driven, and that is a forced choice

Every other service page reads its copy from Sanity via
`services.required('<slug>')`. **There is no `personal-training` service
document** — confirmed by query, 24 service documents and none with that slug.
A document can only be created in the Studio, and this repo has no Sanity write
access (`SANITY_API_READ_TOKEN` is empty, and content authoring is not a code
task anyway).

So the copy is held in the page file, transcribed from the brief. This is a
deliberate, documented deviation from §1 of the master file, with the migration
path written at the top of the file: create a `service` document with slug
`personal-training`, move the copy into it, and rewrite the page to match
`strength-conditioning.astro`. **Until that happens, a copy change is a code
change and a deploy.**

### Photographs: reused, not duplicated

The brief asked for the strength-and-conditioning images "mixed up". The S&C page
renders **12 distinct Sanity assets** — six in the `PhotoMarquee`, six as section
images. All twelve are reused here **by their Sanity CDN URL**, so nothing is
copied to disk and nothing can drift, and all twelve appear in a different
position and a different role:

| | Strength & Conditioning | Personal Training |
| --- | --- | --- |
| Marquee | Coached strength session, Progressive loading, S&C coaching, Group training, Barbell training, Kettlebell work | **Barbell training, Progressive loading, Kettlebell work, Coached strength session, Group training, S&C coaching** |
| First section image | Coach guiding a barbell session | **Coach supporting a barbell squat** |
| Later sections | Lifting technique → Tracking progress → Coach supporting a squat → S&C coaches → Coach guiding strength | **Coach guiding strength → Coach guiding a barbell session → Tracking progress → Lifting technique → S&C coaches** |

**Alt text is inherited from the CMS unchanged.** Several of the inherited alts
are terse labels ("Progressive loading", "Kettlebell work") rather than
descriptions. They were not rewritten, because none of these photographs has been
looked at in this session and inventing a description would be a guess. See
Known issues.

### Copy

Used as supplied, with links added where the copy names another part of the site
— physiotherapy, strength and conditioning, the Weight training club, the pricing
page, and both trainers' team pages. One wording repair: the brief reads "Parents
training around childcare timeshort", which is garbled; it renders as "Parents
training around childcare, short on time". Flagged rather than silently kept.

The page ends with the offers block, a pricing panel, the six FAQs verbatim, and
the standard `BookingCTA`.

### No "Our experts" block on this page

The expert document defines no block for `/service/personal-training/`, so none
was invented. The page already has a **Your trainers** section naming Alex Deif
and Jonathan Lewis with links to both team pages, which covers the same ground.

## Part 2 — the menu item

**This is the weakest part of the change and should be undone as soon as
possible.**

Navigation is a Sanity singleton, and a nav item stores a **reference to a
document**, never a URL (§7). `/service/personal-training/` has no document, so
there is nothing for a nav entry to point at — the correct CMS route is closed
until the document exists.

The link is therefore injected in `Header.astro` through a `MENU_ADDITIONS`
table keyed by the item it sits under:

```js
const MENU_ADDITIONS = {
	'/service/strength-conditioning/': [
		{ label: 'Personal Training', href: '/service/personal-training/' },
	],
};
```

The comment above it says to delete the whole table once a `personal-training`
document exists and the item can be added in the Studio.

> **Consequence, and it is a real gap: the item appears only in the desktop
> services mega-menu.** The mobile drawer and the footer render from the same
> Sanity data through different code paths that this table does not touch, so a
> phone user will not find Personal Training in the menu at all. Fixing that
> properly means creating the document; patching two more code paths would treble
> the size of a hack that is meant to be temporary.

## Part 3 — the "Our experts" blocks

### Data model: slugs only

`src/data/page-experts.js` maps a route path to a heading and an **ordered list
of team slugs**. It deliberately does *not* store names or job titles, even
though the document supplies both: `PageExperts.astro` reads those from Sanity
via `getTeam()` at build time. An editor renaming someone in the Studio, or
changing their job title, updates all 25 blocks with no code change.

This was only safe because all 95 job titles in the document already matched
Sanity exactly — had they disagreed, the document's wording would have needed
storing and the two would have drifted.

Unknown or unpublished slugs are dropped rather than rendered as dead links,
matching `cliniciansFor()` on the news page and the navigation's own behaviour.

### Wiring: one edit for nineteen pages

All 19 condition pages render through `ConditionPage.astro`, which receives the
whole `Condition` document including its slug — so a single line there,
`<PageExperts route={`/condition/${doc.slug}/`} />`, covers every one. The six
service pages needed individual attention because they are bespoke files, and two
of those six (`tmj-and-jaw-pain`, `pilates`) render through `ServicePage.astro`
and take a new `expertsRoute` prop instead.

A page with no entry in the data file renders **nothing** — no empty section, no
stray heading — which is why the component can sit unconditionally in a shared
template. `paediatric-sports-physiotherapy` shares `ServicePage.astro` and has no
block in the document; it correctly shows none.

### Placement and heading level

The block sits after the FAQs and before the booking banner, so a reader meets
the clinicians once the condition itself has been explained. The heading is an
`<h2>`, as the document specifies — each page has one `<h1>` in `PageHero`, so
the order stays intact.

### One editorial change, and four left alone

The document lower-cases the condition phrase in every heading ("…specialising in
lower back pain"), which is a consistent house style and was preserved. One
exception: **"tMJ" was corrected to "TMJ"** — that is a sentence-casing artifact
applied to an acronym, not a style choice.

**Four headings keep a lower-case proper noun** and were *not* changed, because
unlike "tMJ" they are indistinguishable from a deliberate style decision:

- "Our experts specialising in **parkinson's**"
- "Our experts specialising in **vojta** therapy"
- "Our experts specialising in **pilates**"
- "Our experts specialising in **children's neurological and developmental**" (reads as a truncated phrase)

Each is a one-word edit in `src/data/page-experts.js` if the owner wants them
capitalised.

## Components added / schemas / wired fields

- **Components added:** `PageExperts.astro`.
- **Schemas:** none. No Sanity schema was touched and **nothing was written to
  Sanity.**
- **Wired fields:** none new. `PageExperts` reads `name`, `jobTitle` and `slug`,
  all already fetched by `getTeam()`.

## Performance / SEO / accessibility

- **Performance:** no new network request at build — `getTeam()` is memoised and
  already called by other components on these pages. The PT page's twelve images
  are existing Sanity assets already served to visitors of the S&C page, so they
  are likely to be CDN-warm. No hydration, no client JS added.
- **SEO:** the site gains one route, `/service/personal-training/`, and one
  sitemap entry — **and the sitemap needed no change**, because
  `getSitemapEntries()` globs `/src/pages/**/*.astro` rather than reading the
  CMS, so a new static route is picked up automatically. This is the §8 rule
  working as designed. The 25 expert blocks add **95 internal links** from
  condition and service pages to team profiles, which is the point of the brief.
- **Accessibility:** each expert is a real `<a>` with a `:focus-visible` style
  matching hover. Heading order is intact on all 26 touched pages (one `<h1>`,
  the block's `<h2>` among the existing `<h2>`s). The PT page uses semantic lists
  for its five bulleted sections. The trainers' sub-headings are `<h3>` under the
  section `<h2>`.

## Breaking changes

None. `ServicePage.astro`'s new `expertsRoute` prop is optional, and
`paediatric-sports-physiotherapy` renders unchanged without it.

## Testing / QA

| Check | Result |
| --- | --- |
| `npm run build` | Succeeded, no errors. The only warning is the unrelated vite inspector-port line. |
| Page count | **117**, up from 116 — exactly the one new route. Sitemap **106**, up from 105. |
| PT page builds | 72 972 bytes. `<h1>` "Personal Training in Clapham", 9 `<h2>`, 6 FAQ `<details>`, all 12 Sanity images present, sitemap entry present. |
| PT internal links | `/pricing/`, `/contact-us/`, `/team/alex-deif/`, `/team/jonathan-lewis/`, `/service/strength-conditioning/`, `/service/lift-weight-training-club/`, `/service/physiotherapy/` — all resolve to built pages. |
| Menu item | Personal Training renders **directly after** Strength & Conditioning, and the link is present in the header of all **117** pages. |
| **Expert blocks** | **25 / 25 correct.** For every block the rendered names were compared **in order** against the source document — not just counted — and all matched. |
| Clinician links | **95**, matching the document exactly, and **every `/team/<slug>/` target exists as a built page**. Zero dead links. |
| Pages that should have no block | `paediatric-sports-physiotherapy` correctly renders none. |
| Dev server | `/service/personal-training/`, `/condition/lower-back-pain/`, `/service/pilates/` and `/service/tmj-and-jaw-pain/` all **200**, blocks present where expected. |
| **Browser / visual QA** | **NOT DONE.** No screenshot or browser-automation tool, as in every prior session. A new full-length page and a block on 25 existing pages have been verified in built HTML only. **Nothing here has been seen.** |
| Responsive / keyboard / screen reader / real device | **Not tested.** |

## Known issues

1. **Nothing in this change has been looked at.** It is the largest change in any
   session so far — one new page plus a new section on 25 existing pages — and
   every claim above comes from parsing HTML. The PT page's offers banner is a
   two-column grid that has never been rendered.
2. **The menu item is desktop-only** (see Part 2). On mobile there is no way to
   reach the new page from the navigation.
3. **The PT page is not in the CMS.** Copy changes require a developer until a
   `personal-training` service document exists.
4. **Inherited alt text.** Six of the twelve reused photographs carry terse CMS
   alt text ("Progressive loading", "Group training") that describes a theme
   rather than an image. Not rewritten, because the images have not been seen.
5. **Four headings keep a lower-case proper noun** (see Part 3).
6. **"childcare timeshort"** in the brief was rendered as "childcare, short on
   time". If the intended wording was different, it is one line.
7. **`src/data/` keeps growing.** `page-experts.js` joins `events.js` and
   `testimonials.js` as content that lives in the repo rather than the CMS. That
   is now three pages' worth of copy outside the Studio.
8. Everything open from 2026-09-19 and earlier remains open, including
   `/about-us/` still reading "27 professionals" in six places.

## Remaining tasks

- **Look at all of it in a browser**, especially `/service/personal-training/`
  end to end and two or three condition pages at 1200 / 900 / 768 / 400 px.
- **Create a `personal-training` service document in Sanity**, then move the copy
  into it, add the real nav item in the Studio, and delete `MENU_ADDITIONS` from
  `Header.astro`. That closes issues 2, 3 and part of 7 together.
- Decide on the four lower-case headings, and on the "childcare" wording.
- Rewrite the six weak alt texts once someone has seen the photographs.
- **Not committed and not pushed.**

## Recommendations

- The expert blocks are worth the data file, but the PT page is not worth the
  precedent. Treat it as owing a migration rather than as a second content
  system: the page carries its own migration note at the top so whoever picks it
  up does not have to reconstruct the reasoning.
- Validate a content document against the CMS *before* writing any code. Doing
  that here turned a 25-page change into a mechanical one and surfaced that all
  95 job titles already matched — which is what made the slug-only data model
  safe.

---

# 2026-09-30 — later the same day (same branch)

Follow-up to the "Our experts" work above, requested by the owner:

1. Move the block **above the FAQ section** on all condition pages.
2. Give it **photographs and the homepage "Meet Our Team" layout**, as a
   **carousel**.

## 1. Position

`ConditionPage.astro` now renders `<PageExperts>` immediately before the FAQ
section instead of after it. One edit, all 19 condition pages. Verified by
character offset in every built page: experts → FAQs → booking banner.

> **The 6 service pages were deliberately not moved.** The request named
> condition pages, and widening it unasked would be a change to six pages nobody
> requested. They still render the block *after* their FAQs, so the two page
> types are now inconsistent. It is the same one-line move on each if the owner
> wants them matched — see Remaining tasks.

## 2. Layout — reuse, not restyle

The first version of `PageExperts.astro` was a bespoke grid of text cards. It has
been replaced by a thin wrapper around **`<Team sliderRow>`** — the very
component the homepage "Meet Our Team" section uses. The block now gets the
photo card, the name, the job title, the horizontal scroller, the prev/next
buttons, the hover treatment and every breakpoint **identically to the homepage,
and for free**, because it is the same code rather than a copy of it.

The bespoke CSS from this morning is gone. What remains in `PageExperts.astro`
is one rule giving the section its tinted background, since `Team.astro` brings
none of its own.

### Two supporting changes to `Team.astro`

Both are small, both are guarded, and neither changes the homepage:

| Change | Why | Effect elsewhere |
| --- | --- | --- |
| `{subheading && <p>{subheading}</p>}` | An experts block has a heading and the people, and nothing else. The source document supplies no supporting line, and writing 25 of them would be copy nobody asked for. Previously an empty string still rendered an empty `<p>`. | None — every other caller passes a non-empty subheading. |
| Slider nav rendered only when `members.length > 1` | **Six of the 25 blocks hold a single clinician.** Prev/next arrows that cannot scroll anything are noise. | None — the homepage has 32 cards, `/meet-the-team/` is not a slider. |

## Verification

| Check | Result |
| --- | --- |
| `npm run build` | Succeeded, no errors. Page count **117**, unchanged. |
| Order on condition pages | **19 / 19** render experts **above** the FAQs. Checked by offset in the built HTML, not by reading the template. |
| Blocks still correct | **95** clinician links, names matched **in order** against the source document on all 25 pages, every `/team/<slug>/` target exists. |
| Carousel markup | Every block renders `team-slider` with `team-card team-card-slide` cards — the same classes as the homepage. |
| Photographs | **93** photo cards and **2** initials fallbacks across the 95 cards. |
| Single-person blocks | 6 of them, and **0** render nav arrows. |
| Homepage untouched | **32** `team-card-slide` cards and its nav arrows still present. |
| **Browser / visual QA** | **NOT DONE**, as throughout. A carousel is a scroll interaction and **it has not been scrolled.** |

## Known issues added by this part

1. **The Pilates block shows two initials tiles, not photographs.** Alice
   Croucher and Agur Arrien are the only two of the 35 team members with no photo
   in Sanity, and both are the Pilates block. That block will look unlike the
   other 24. Fixed by adding their photos in the Studio — no code change.
2. **Condition and service pages now disagree** on where the block sits
   (see Part 1).
3. **A one-card carousel is still a carousel.** Six blocks hold a single person;
   the arrows are gone, but the card sits in a scroller sized for several. Not
   seen rendered.
4. The block has never been viewed, on any page, at any width.

## Remaining tasks after this part

- View a condition page and scroll the carousel. `/condition/shoulder-specialist-physiotherapy/`
  has the most clinicians (10) and `/condition/verrucas/` has one — the two ends
  of the range.
- Decide whether the 6 service pages should match the condition pages' order.
- Add photographs for Alice Croucher and Agur Arrien in the Studio (issue 1).
- Everything still open from earlier today.

---

# 2026-09-30 — third change (same branch)

The owner reported a bullet on `/service/personal-training/` and asked for the
check icon only.

## It was my CSS fighting the design system

`Layout.astro` already styles lists inside an `ImageText` body exactly as
requested — `.bp-page .image-text-content ul li::before` draws an orange circle
and `::after` puts a white `✓` inside it. Every CMS-driven service page gets this
for free.

The PT page's lists are written directly rather than coming from the CMS, and I
had given them a `.pt-list` class with:

```css
.pt-list li { … list-style: disc; }
```

That did not replace the house marker, it **stacked on top of it**: the orange
tick from the global rule, plus a disc bullet from mine.

## The fix was deletion

- The `.pt-list` CSS block was removed entirely.
- The class was dropped from the four content lists, leaving plain `<ul>`.

They now inherit the house rule and render the check icon alone. The page is also
more consistent than before, since every other service page's lists reach the
same rule by the same route.

`.pt-offers-list` was left alone — it carries its own "Free" / "10 → 12" tags
instead of markers, by design.

## Verification

| Check | Result |
| --- | --- |
| `npm run build` | Succeeded, no errors. |
| `list-style: disc` anywhere on the page | **absent** |
| `.pt-list` rule remaining | **none** |
| Content lists | 4 plain `<ul>` (7, 5, 6 and 6 items) |
| House rule reaching the page | The page links `_astro/Layout.*.css`, which carries `…ul li:before{…border-radius:50%;background:var(--accent)…}` and `…ul li:after{content:"✓"…}` |
| **Browser / visual QA** | **NOT DONE.** Verified in built CSS and HTML; the rendered marker has not been looked at. |

## Lesson worth keeping

A hand-written list inside `ImageText` should carry **no list CSS at all**. The
design system already covers it, and anything added competes rather than
overrides. Worth checking the global rules before styling a list on any future
hardcoded page.

---

# 2026-09-30 — fourth change (same branch)

Three follow-ups, all requested by the owner.

## 1. Service pages now match the condition pages

The block moved above the FAQs on the six service pages too, closing the
inconsistency flagged in part 2. Four of them own their FAQ section directly;
`tmj-and-jaw-pain` and `pilates` were handled once through `ServicePage.astro`.

**25 / 25 pages** now render experts → FAQs → booking banner, up from 19 / 25.

## 2. Small sets centre instead of hugging the left edge

A `team-slider--centered` class is applied when a block holds **fewer than five**
members.

The threshold is not arbitrary. Cards are `flex: 0 0 240px` with a 20px gap
inside a 1152px content area, so **four cards (4 x 240 + 3 x 20 = 1020px) fit
without scrolling** and five (1280px) do not. Below five there is nothing to
scroll, so the row centres; from five up it stays a left-aligned scroller.

The centred variant also **wraps rather than scrolls**:

```css
.team-slider--centered { overflow-x: visible; flex-wrap: wrap; justify-content: center; }
```

That matters at narrower widths. Four 240px cards overflow a 900px viewport, and
`justify-content: center` on an *overflowing* flex row pushes the first card off
the left edge where it cannot be scrolled back into view — a well-known trap.
Wrapping avoids it: the cards drop to a second centred row instead.

## 3. Arrows only from five cards up

The nav threshold moved from `members.length > 1` to `members.length >= 5`, so it
now matches the point at which the track can actually scroll.

| Blocks | Treatment |
| --- | --- |
| **17** with fewer than 5 members | centred, wrapping, no arrows |
| **8** with 5 or more | left-aligned scroller with arrows |

Block sizes run 1, 1, 1, 1, 1, 1, 2 x10, 4, 6, 6, 8, 8, 9, 9, 9, 10.

## Verification

| Check | Result |
| --- | --- |
| `npm run build` | Succeeded, no errors. Page count **117**, unchanged. |
| Order | **25 / 25** render the block above the FAQs. Checked by offset in the built HTML. |
| Centring | **17** blocks carry `team-slider--centered` — exactly the 17 with fewer than 5 members, no more and no fewer. |
| Arrows | **8** blocks render `team-slider-btn` — exactly the 8 with 5 or more. |
| Links | **95** clinician links intact. |
| Homepage untouched | 32 cards, arrows present, and **no** centred class (32 >= 5). |
| **Browser / visual QA** | **NOT DONE.** The wrapping behaviour below 900px is reasoned from the box maths, not observed. |

## Known issues after this part

1. **The wrap has not been seen.** A 4-member block at ~900px should become two
   centred rows; that is arithmetic, not observation.
2. Issues from earlier today still stand: the Pilates block shows two initials
   tiles rather than photographs, the Personal Training page is not in the CMS,
   and its menu item is desktop-only.
