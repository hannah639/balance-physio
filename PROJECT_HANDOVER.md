# Balance Performance Physiotherapy — Project Handover

A complete reference for everyone involved with the Balance Physio website. Skim the section that's relevant to you — the doc is layered from "I just want to update some text" through to "I'm picking up the codebase from scratch".

---

## 1. The 30-second summary

- **Live site:** https://balancephysio.com
- **Staging URL:** https://balance-physio.hannah-9e0.workers.dev
- **Built with:** Astro (static site generator) + Cloudflare Workers (hosting)
- **Repository:** https://github.com/hannah639/balance-physio (private)
- **Auto-deploys:** every `git push` to `main` triggers a Cloudflare build and goes live in ~90 seconds
- **CMS:** None active. All content lives in code (Astro files + JS data files). Sanity Studio was wired up early on but disconnected — the site reads from `src/data/site-settings.js` instead.

---

## 2. Who needs to know what

| If you are… | Read sections… |
|---|---|
| **Lucy / clinical staff** doing content review | 3, 4 (just to know how to flag changes) |
| **Hannah** maintaining the site day-to-day | 3, 5, 6, 7, 8 |
| **A new developer** picking up the project | All of it, in order |

---

## 3. Editing the site without writing code

The site doesn't have a CMS, so content edits go through Hannah (or whoever is technical on the project). The fastest way for Lucy or anyone else to flag a change is:

- **Spot it on the live site**, copy the URL of the page
- **Send Hannah** the URL plus the exact text/image change
- For images, attach the new image. Tell Hannah which existing image it should replace, e.g. "the photo on the 'How we work' section of /service/sports-physiotherapy/"

There's a `News` page at https://balancephysio.com/news for team achievements (marathons, qualifications, milestones). Adding entries is a code change but a small one — flag the headline + photo + a paragraph or two of body copy.

---

## 4. The site at a glance

### Pages
- **Homepage** (custom layout, not the same as other pages — see "Gotchas")
- **About cluster:** `/about-us`, `/meet-the-team`, `/our-clinic`, `/our-studios`, `/outcomes`, `/pricing`, `/news`, `/work-for-us`, `/testimonials`, `/shop`
- **23 service pages** under `/service/...` — Physiotherapy, Sports Physio, Osteopathy, Pilates, etc.
- **19 condition pages** under `/condition/...` — Lower back pain, knee, shoulder, etc.
- **Who we help cluster:** `/who-we-help/the-performance-athlete`, etc.
- **Individual team bios** at `/team/[slug]` — auto-generated from `src/data/team.js`
- **Legal:** `/terms-conditions`, `/privacy-policy`
- **Utility:** `/faqs`, `/contact-us`, `404`, `/sitemap.xml`, `/robots.txt`

### Components (the building blocks of pages)
- `Header` / `Footer` — site navigation, footer links, contact info, Google Map iframe
- `VideoHero` / `Hero` / `PageHero` — hero sections (homepage uses video, internal pages use PageHero)
- `ImageText` — the workhorse: alternating image/text sections used on every service and condition page
- `ServicePage` / `ConditionPage` — wrappers that lay out the standard service/condition page structure
- `BookingCTA` — "Ready To Book?" section at the bottom of most pages
- `Team` — team grid (with slider mode for homepage carousel)
- `Testimonials` — Trustindex Google reviews carousel widget
- `CookiesBanner` — GDPR consent banner gating GA/GTM
- `Approach` — homepage's "We can make you better" 3-step section
- `Conditions` / `Features` — homepage condition tags + service cards

### Data files (`src/data/`)
- `team.js` — every team member's slug, name, role, photo, bio
- `news.js` — news entries for the /news page
- `testimonials.js` — patient testimonial quotes (used on /testimonials)
- `site-settings.js` — site-wide config (SEO defaults, GA/GTM IDs, business info, lat/lng, opening hours, social links)

---

## 5. Setting up the site on your computer

### Step 1 — Get access
You need:
1. **GitHub** — collaborator access on `hannah639/balance-physio`
2. **Cloudflare** — team member invite to the Balance Physio worker (so you can see deploy logs and manage the domain)

GitHub alone gets you contributing code. Cloudflare is for debugging deploy failures and DNS.

### Step 2 — Install prerequisites
- **Node.js 22.12 or newer** — https://nodejs.org
- **Git**
- A code editor (VS Code, Cursor, etc.)

Verify in a terminal:
```bash
node --version    # must be v22.12.0 or higher
npm --version
git --version
```

### Step 3 — Clone the repo
```bash
git clone https://github.com/hannah639/balance-physio.git
cd balance-physio
npm install
```

`npm install` takes a minute or two on first run.

### Step 4 — Run the dev server
```bash
npm run dev
```

Open http://localhost:4321 in your browser. You'll see the site exactly as it appears live. Edit any file in `src/` and the page auto-reloads in your browser within a second or two.

### Step 5 — Make a change and deploy

Pick a small change as a test — like updating a word on `/about-us`:
1. Open `src/pages/about-us.astro`
2. Change one word
3. Save
4. Check http://localhost:4321/about-us — your change should appear instantly
5. Commit and push:
   ```bash
   git add .
   git commit -m "Test change to about page"
   git push
   ```
6. Watch the Cloudflare dashboard → **Workers & Pages → balance-physio → Deployments**. A new build starts within 30 seconds and finishes in ~90 seconds.
7. Visit https://balancephysio.com/about-us to confirm the change is live.

If that worked, your environment is fully set up.

---

## 6. Common edits — where to go

| Task | File to edit |
|---|---|
| Change homepage hero copy | `src/components/VideoHero.astro` or `src/components/Hero.astro` |
| Change a service page (e.g. Physiotherapy) | `src/pages/service/physiotherapy.astro` |
| Change a condition page (e.g. Back Pain) | `src/pages/condition/lower-back-pain.astro` |
| Add/remove/edit a team member | `src/data/team.js` |
| Add a news item | `src/data/news.js` (top of array = most recent) |
| Add a testimonial | `src/data/testimonials.js` |
| Change brand colours | CSS variables at top of `src/layouts/Layout.astro` (and mirror on `src/pages/index.astro` for the homepage — see "Gotchas") |
| Add a new service page | Copy an existing `src/pages/service/*.astro`, update `src/components/Header.astro` (services dropdown) + `src/components/Features.astro` (homepage cards) |
| Update header navigation dropdowns | `src/components/Header.astro` — the `about`, `services`, `conditions` arrays at the top |
| Update footer links or hours | `src/components/Footer.astro` |
| Update the Google Map | `src/components/Footer.astro` — the `<iframe>` in `.footer-map` |
| Change the booking button URL | Search/replace `https://go.mindbodyonline.com/...` across components |
| Update SEO meta titles/descriptions | The page itself (`title=`/`description=` on the Layout call, or `seoTitle=`/`seoDescription=` on ServicePage/ConditionPage) |
| Update GA/GTM IDs, business info | `src/data/site-settings.js` |

### Adding a new news item

Edit `src/data/news.js`. Add a new entry at the **top** of the array:

```js
{
    slug: 'short-id-for-this-news',
    date: '15 May 2026',
    category: 'Team Achievement',  // or 'Clinic Update', etc — optional
    headline: 'Short headline that shows above the body',
    image: '/news/photo-filename.jpg',
    imageAlt: 'Description of the photo',
    body: [
        "First paragraph of the news item.",
        "Second paragraph if you need one.",
    ],
},
```

Save the photo to `public/news/` first. Resize to ~1200px wide, target under 500KB.

### Adding a new team member

Edit `src/data/team.js`. Each entry has a `slug` (URL-friendly id), `name`, `role`, `photo`, `bio` (array of paragraphs). The `slug` becomes the URL: `/team/[slug]`. Save the photo to `public/team/SLUG.jpg` at **600×800 portrait (3:4)** to match the rest of the team — anything else gets cropped awkwardly.

### Replacing an image

1. Save the new image to the right folder under `public/`
2. Resize to about 1400px wide (or 600×800 for team headshots), keep under 500KB
3. Reference it from the relevant `.astro` page

ImageMagick recipe (if you have it installed):
```bash
convert source.jpg -auto-orient -resize '1400x1400>' -quality 82 -strip output.jpg
```

For team headshots specifically:
```bash
convert source.jpg -resize 600x800^ -gravity center -crop 600x800+0+0 +repage -quality 85 -strip team-photo.jpg
```

---

## 7. The patch workflow (collaborating with Claude)

Hannah's been collaborating with Claude on this project. Claude works in a sandboxed environment and can't push directly to GitHub, so changes flow as patch files:

1. Hannah describes a change in chat
2. Claude makes the change in its sandboxed clone, builds, verifies
3. Claude exports a patch with `git format-patch` and shares it via the chat UI
4. Hannah downloads the patch to `~/Downloads/` and applies:
   ```bash
   cd ~/balance-physio
   git am ~/Downloads/patch-NN-description.patch
   git push
   ```
5. Cloudflare auto-deploys within ~90 seconds

If `git am` fails (typically because the local branch has diverged from origin), the recovery is:
```bash
git am --abort
git fetch origin
git reset --hard origin/main
git am ~/Downloads/patch-NN-description.patch
```

Patches are sequentially numbered (patch-01-..., patch-02-..., etc.) so you can apply them in order if you're catching up.

---

## 8. Architecture decisions — why things are the way they are

These are decisions worth understanding before changing anything fundamental.

### Astro for the framework
Static-first with selective interactivity. Most pages are pure HTML at deploy time — fast to load, free to host, and works even if JavaScript fails. Astro's component model makes the alternating image/text layouts trivial to compose without React-style state.

### Cloudflare Workers for hosting
The output is deployed as a Cloudflare Worker (via the `@astrojs/cloudflare` adapter) rather than as static files. This gives us server-side redirects (the `astro.config.mjs` redirect map handles ~30 old WordPress URLs → new Astro URLs), edge-cached HTML, and automatic SSL. Free tier is more than generous for a small business site.

### Sanity disconnected
The repo wired up Sanity Studio early on for editable site settings, but it was disconnected in Patch 18 because:
- The site only had two real CMS users
- Every Studio publish triggered a 90-second Cloudflare rebuild
- A simple JS data file (`src/data/site-settings.js`) does the same job with no extra moving parts

If you want to re-enable Sanity for clinical staff in future, the schema files are still in the repo at `sanity/` and the connection logic is in `src/lib/sanity.js` (with `useCdn: false` so updates appear immediately).

### Trustindex for testimonials
Two Trustindex widgets are embedded:
- The carousel on the homepage and `/about-us` (id `65abd1...`) — replaced the static testimonial cards in Patch 22
- The Google reviews badge site-wide (id `d31b89...`) — added in Patch 38

Both load via `cdn.trustindex.io/loader.js` and render after page load. The `/testimonials` page still uses the static testimonials in `src/data/testimonials.js`.

### MindBody for booking
Every "Book Now" button opens https://go.mindbodyonline.com/book/widgets/appointments/view/8068777f5e/services in a new tab. The widget itself isn't embedded — clicking just navigates to MindBody's hosted booking flow. To change the booking URL globally, search/replace across components.

### URL renames preserved
Six URLs were renamed in Patch 36 for SEO (e.g. `/service/sports-massage/` → `/service/sports-massage-clapham-soft-tissue-therapy/`). The old URLs all 301-redirect to the new ones via `astro.config.mjs` so existing inbound links keep working. Don't change URL slugs unless you also add a redirect — search rankings depend on URL stability.

### `useCdn: false` in `src/lib/sanity.js`
Even though Sanity is disconnected, this setting is kept as `false`. If anyone re-enables Sanity, leave this as is — the CDN'd version of Sanity content has a delay that breaks the "publish appears immediately" expectation.

---

## 9. Gotchas — things that have bitten us

### Homepage doesn't use Layout.astro
This is the biggest one. `src/pages/index.astro` has its own `<style is:global>` block and renders the page wrapper directly — it does NOT use `src/layouts/Layout.astro`. So:

- CSS changes for the homepage must go in `index.astro`
- Global CSS changes for everything else go in `Layout.astro`
- A change to brand colours or shared styles needs to be applied to **both** files

This split exists because the homepage was iterated heavily early on with a custom hero/feature layout that didn't fit the Layout shell. Cleaning it up later would mean refactoring both the homepage and the shared Layout simultaneously, so it's been left.

### Astro's CSS scoping
Astro scopes component styles to a generated `data-astro-cid-XXX` attribute. If you write a selector like `.bp-page .team-photo-wrap` inside `Team.astro`, Astro emits `.bp-page[data-astro-cid-XXX] .team-photo-wrap[data-astro-cid-XXX]`. Both elements need to be inside Team's scope for it to match. **`.bp-page` is defined in `Layout.astro` so it carries Layout's CID, not Team's** — a selector starting with `.bp-page` from inside Team will silently fail to match.

This bit us twice (Patch 41 and Patch 42 documented it). The workaround: drop the `.bp-page` prefix, or hoist the rule to a global `<style is:global>` block.

### Header font on internal pages
The `<Header />` component is rendered outside `.bp-page`, so it doesn't inherit the page's `font-family`. The Header has an explicit `font-family: 'Inter', sans-serif` on its root. Don't "clean this up" by removing the explicit declaration or fonts break across all internal pages.

### Highlight word ordering in PageHero
`PageHero` renders the highlight word **first**, then the title:

```astro
<PageHero title="For Us" highlight="Work" />
```

This renders as **"Work For Us"** (highlight + title). If your heading reads in the wrong order, swap the props.

### JSX whitespace stripping
If you mix text and components in an Astro template:
```astro
<h2>Some {<span>highlight</span>} text</h2>
```
The whitespace between `Some` and `<span>` may be stripped at build. Use `{' '}` to force a space.

### Sanity rebuilds take ~90 seconds
If anyone re-enables Sanity in the future: content publishes don't appear instantly. The Sanity webhook triggers a Cloudflare rebuild, which takes about 90 seconds end to end. That's a constraint of the static-site setup, not a bug.

### Don't change `useCdn: false`
See "Architecture decisions" above. The setting is intentional.

---

## 10. Things you should NOT change without asking

- **The URL structure** (`/service/...`, `/condition/...`, `/team/...`) — tied to redirects from the old WordPress site. Breaking these breaks SEO.
- **The Cloudflare deploy hook URL** (if you find one referenced in Sanity or elsewhere) — would break the auto-deploy pipeline.
- **`useCdn: false` in `src/lib/sanity.js`** (even though Sanity is disconnected, in case it gets re-enabled).
- **`src/data/site-settings.js → siteUrl`** — this is `https://balancephysio.com`, used for canonical URLs and JSON-LD. Don't switch back to the workers.dev staging URL.
- **`astro.config.mjs` redirects map** — the WordPress-era redirects there preserve SEO equity from inbound links. Adding new entries is fine; removing old ones isn't.

---

## 11. Deploy pipeline

```
Local edit → git push → GitHub
                          ↓
            Cloudflare detects push (webhook)
                          ↓
            Build runs (`npm run build`) on Cloudflare's build infra
                          ↓
            Worker is deployed globally (~90 seconds total)
                          ↓
            Live at https://balancephysio.com
```

If a build fails, find it in Cloudflare → **Workers & Pages → balance-physio → Deployments** → click the failing build → read the build log. The most common failure is a syntax error in a recently edited `.astro` file — read the log to find the line number.

---

## 12. SEO / analytics

- **GA4 property:** `G-B8FXY93QVZ` (configured in `src/data/site-settings.js`)
- **GTM container:** `GTM-THZKT967` (same file)
- Both are **gated on cookie consent** via `CookiesBanner.astro`. Until a user clicks Accept, no analytics fires. If you need to test analytics, accept cookies on the site first.
- **Sitemap:** `https://balancephysio.com/sitemap.xml` (static file at `public/sitemap.xml` — not auto-generated). Submit to Google Search Console and Bing Webmaster Tools.
- **Canonical URLs and JSON-LD** are emitted automatically from `Layout.astro` based on `siteUrl` in `site-settings.js`.
- **301 redirects** for old WP URLs and the 6 SEO renames live in `astro.config.mjs` under `redirects:`.

---

## 13. When you're stuck

1. **Astro docs:** https://docs.astro.build (Astro's docs are excellent — start here for syntax questions)
2. **Cloudflare Workers docs:** https://developers.cloudflare.com/workers
3. **Build failing on Cloudflare?** Check the build log in **Workers & Pages → balance-physio → Deployments**
4. **Domain / DNS issues?** Check **Cloudflare → balancephysio.com zone → DNS**
5. **Site loads but wrong content?** Hard-refresh (Cmd+Shift+R / Ctrl+Shift+R) — Cloudflare caches HTML for a few minutes

---

## 14. Project history (high-level)

This site replaced an aging WordPress install in early 2026. Major milestones:

- **Patch 1–13:** Initial Astro build, content migration from WP, all service and condition pages drafted
- **Patch 14–22:** Trustindex testimonials, GDPR cookies banner, Sanity disconnect, sitemap, 404 page, content fixes
- **Patch 23–34:** Image overhauls per page, mobile fixes, Approach card sizing, team additions (Lucy Rowland), bio corrections
- **Patch 35–36:** SEO meta titles/descriptions for all 25 pages from Hannah's research sheet, 6 URL renames
- **Patch 37–42:** Final polish — News page (with Portia's marathon), Trustindex badge, sports physio image overhaul, mobile gradient fix, mobile team grid crop fix, Jose's headshot
- **Go-live:** May 2026, point `balancephysio.com` at the Cloudflare Worker

The repo's git history has the full story — every commit message describes what changed and why.

---

## 15. Contact / handover

For anything not covered here:
- **Repo issues:** open an issue on GitHub
- **Cloudflare/DNS:** that's all in the Cloudflare dashboard under Hannah's account
- **MindBody booking integration:** that's hosted by MindBody, separate from this site

---

*Last updated: May 2026, after Patch 42 and go-live.*
