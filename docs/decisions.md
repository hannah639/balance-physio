# Key Decisions

Non-obvious choices and why they were made. Read this before changing anything fundamental.

## Why Astro + Sanity + Cloudflare?

Original site was built on Netlify with static HTML. Decision to rebuild was driven by:
1. **CMS requirement** — client wants to edit content without involving developers
2. **Performance** — Astro produces static HTML which is faster than the WordPress alternative
3. **Cost** — Cloudflare free tier covers this site easily; Sanity free tier fits a single-site project

An earlier plan to rebuild in WordPress was abandoned once this Astro version came together — the client's preference was to ship the Astro site as the real one rather than replicate the design in WordPress.

## Why `/service/` (singular) instead of `/services/`?

The URL scheme matches the legacy WordPress sitemap (`/service/physiotherapy/` etc.) to simplify a future migration if Balance ever needs redirects from the old WP site. `/services` (plural) exists as the index page listing all services; `/service/*` (singular) is each individual service.

Same pattern for `/condition/*` (individual) vs `/conditions` (index).

## Why are team bios in code, not Sanity?

The Sanity `teamMember` schema exists and was originally used. Switched to a static file (`src/data/team.js`) when we scraped all 27 bios from the old WP site, because:
1. Loading 27 team members into Sanity manually would be tedious
2. The bios don't change often — editing a JS file once a year is easier than maintaining a CMS
3. With static data we can still build bio pages at `/team/[slug]` via dynamic routing

If the client ever wants to manage team members themselves, the Sanity schema is still there — just re-wire `Team.astro` to fetch from Sanity and migrate the static data into Studio.

## Why not load the Cyclist video file into the build?

`/public/Cyclist.mp4` is served as a static file. It doesn't pass through Astro's build pipeline so it won't be optimised — but that's fine for a hero video that's served once and cached by Cloudflare's CDN.

## Why two heading styles on the homepage?

The homepage has:
1. A small uppercase H1 ("Rehabilitation Clinic in Clapham") in the video hero
2. A big H2 ("We can make you better") further down

This is deliberate for SEO — there's only one H1 per page (the small subtitle), which gives Google a clear page topic. The "We can make you better" is the visual headline but an H2 to avoid two H1s.

## Why `useCdn: false` for Sanity?

The Sanity CDN caches responses for 60 seconds. For a static site that only queries Sanity at build time, this caused a bug where content updates took 60+ seconds to appear after a rebuild. Setting `useCdn: false` forces fresh data on every build. Don't flip this back without understanding the tradeoff.

## Why is the Header outside `.bp-page`?

Originally the Header was inside the main `.bp-page` div. This broke `position: fixed` on secondary pages because `.bp-page` was acting as a containing block. Moving Header outside fixed it.

Side effect: Header lost the `font-family: Inter` inherited from `.bp-page`, so we explicitly set `font-family` on `.bp-header`.

## Why initials-based team avatars?

No real team headshots were available at build time. Rather than use generic stock photos or broken image boxes, each member gets a unique gradient background with their initials (deterministic hash based on name, so the same person always has the same colour).

Swap to real photos by adding a `photo` field to each member in `team.js` and a conditional render in `Team.astro` + `team/[slug].astro`.

## Why static placeholder images on service pages?

Most service pages don't yet have real photos, so each uses the 8-image `placeholders/` set as a shared fallback. Individual service pages can override with their own `marqueeImages` prop (e.g. sports-physio, lift).

## Why MindBody for booking?

Client already has an account. All booking buttons point to:
`https://go.mindbodyonline.com/book/widgets/appointments/view/8068777f5e/services`

Open in a new tab (`target="_blank"`) so users don't lose their place on the site.

## URL structure

Final sitemap (54 pages):

- `/` — homepage
- `/about-us`, `/meet-the-team`, `/our-clinic`, `/our-studios`, `/outcomes`, `/pricing`, `/work-for-us`, `/testimonials`, `/faqs`
- `/services` (index) + `/service/<slug>` × 21
- `/conditions` (index) + `/condition/<slug>` × 19
- `/team/<slug>` × 27 (bio pages)
- `/clinic/clapham`, `/contact-us`, `/privacy-policy`, `/terms-conditions`

## Mobile hamburger menu

Built because the mobile breakpoint originally just hid the desktop nav entirely with no replacement. Now `.hamburger` appears at `max-width: 900px`, toggling a full-screen panel with collapsible sub-sections. Uses native `<details>` elements for the expand/collapse behaviour (no JS library needed).
