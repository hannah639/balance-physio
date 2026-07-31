# Astro — Master Handoff Documentation

**Read this file completely before any Astro development work.** It is the permanent master documentation for the website.

The companion document for the CMS is `handoffs/handoff-sanity.md` in the **balance-physio-sanity** repo. Schemas, fields, validation and Studio config live there.

| | |
| --- | --- |
| Last verified | 28 July 2026 |
| Repository | `hannah639/balance-physio`, branch `main` |
| Framework | Astro 6.1.7, static output |
| Adapter | `@astrojs/cloudflare` 13.2.1 |
| Local | http://localhost:4321 |
| Site | **67** route files → **114** built pages |
| Dependencies | 5 total (see §2) |

---

## 1. Project overview

A static marketing site for a Clapham physiotherapy clinic, built by Astro at build time from a Sanity CMS and served by Cloudflare.

Three facts that shape everything else:

1. **All content comes from Sanity, fetched at build time.** The browser never contacts Sanity. There is no client-side CMS call and no Sanity token in any browser-served file.
2. **A content change requires a rebuild.** Publishing in the Studio triggers a webhook → Cloudflare deploy hook → build. If the site looks stale, ask "did the build run?" before suspecting a query.
3. **The build fails loudly rather than shipping an empty page.** `requireHomepage()`, `requireCondition()` and `services.required()` throw when a document is missing. This is deliberate.

---

## 2. Dependencies — deliberately minimal

```json
"@astrojs/cloudflare": "^13.2.1"
"@sanity/client":      "^7.21.0"
"@sanity/image-url":   "^2.1.1"
"astro":               "^6.1.7"
"wrangler":            "^4.84.1"
```

That is the whole list. No UI framework, no CSS framework, no component library.

> ### There is NO Tailwind in this project
>
> No `tailwindcss` dependency, no `tailwind.config.*`, no PostCSS config, no Astro Tailwind integration. Styling is hand-written CSS (§4).
>
> If a brief mentions "Tailwind standards" for this project, it is mistaken. **Do not install Tailwind to satisfy it** — that would create a second styling system alongside 587 lines of existing CSS and a design-token set already used by every component.

---

## 3. Folder architecture

```
src/
  pages/            routes — file-based (see §6)
    condition/      19 static condition pages
    service/        24 static service pages
    clinic/         2 clinic pages
    news/           blog grid, [slug] post page, page/[page] pagination
    team/[slug]     35 generated profiles
    who-we-help/    10 generated audience pages
    robots.txt.ts · sitemap.xml.ts · api/seo/sitemaps.json.ts
  components/       25 components (see §5)
  layouts/
    Layout.astro    the ONE layout: head + header + .bp-page + footer + global CSS
  lib/
    sanity/         16 modules — queries + typed loaders (see §7)
    bgImage.js      CSS background-image with AVIF/WebP negotiation
  data/             legacy fallbacks — see §11
public/             images, videos, fonts
docs/               deployment.md, sanity-integration.md
handoffs/           THIS DOCUMENTATION
```

---

## 4. Design system

### Tokens

CSS custom properties declared once on `.bp-page` in `src/layouts/Layout.astro`. Never hardcode these values in a component — use the variable.

| Token | Value | Use |
| --- | --- | --- |
| `--primary` | `#3d5a6e` | Brand blue-grey; headings on tinted panels |
| `--primary-dark` | `#2c4356` | Hero backgrounds |
| `--primary-light` | `#5a7d8f` | Secondary accents |
| `--accent` | `#e87722` | Orange — highlighted words, links, hover |
| `--accent-hover` | `#d06618` | Accent hover |
| `--cta` | `#3EBEDF` | Cyan — primary buttons |
| `--cta-hover` | `#32a8c6` | Button hover |
| `--primary-bg` | `#f4f6f7` | Tinted section background |
| `--primary-bg-gradient` | `#e8edef` | Gradient partner |
| `--accent-glow` | `rgba(44,197,190,0.25)` | Hero radial glow |
| `--text` | `#1a1a1a` | Body text |
| `--text-muted` | `#555555` | Secondary text |
| `--border` | `#d8dee2` | Card and divider borders |
| `--card-shadow` | `0 0 10px rgba(0,0,0,0.11)` | Card elevation |
| `--radius` | `15px` | Standard corner radius |
| `--white / --black` | `#ffffff / #000000` | Absolutes |

Typography: **Inter** (400–800) from Google Fonts, preconnected in the head. Body line-height 1.6.

### CSS conventions

- **Everything is scoped under `.bp-page`.** Global rules are written `.bp-page .thing { }` in the `<style is:global>` block in `Layout.astro`. The wrapper exists so the site's CSS cannot leak into anything embedded alongside it.
- **Component-specific CSS lives in that component's `<style>` block** (Astro scopes it automatically, adding a `data-astro-cid-*` attribute). Reach for a global rule only when two or more components genuinely share it.
- **Class naming is `block-element` kebab-case**, no BEM double underscores: `.news-card`, `.news-card-title`, `.feature-card-overlay`, `.hero-stats`.
- **Layout container:** `.container` — `max-width: 1200px`, `padding: 0 24px`, centred. Narrower reading measures set their own `max-width` (e.g. the blog post body at 820px).

> When targeting a scoped class from a parent, use `:global()`. Astro will not rewrite a selector it cannot see in the template.

### Global class families

`btn-primary` · `btn-primary-lg` · `btn-book` · `btn-outline-white` · `btn-outline-dark` · `container` · `section-header` · `eyebrow` · `hero-badge` · `highlight` · `page-hero` · `image-text-content` · `text-grid` / `text-grid-cell` · `faq-section` / `faq-item` / `faq-list` · `feature-card` · `clinic-tag` · `problem-card` · `rich-content` · `inline-link` · `section-link`

### Responsive breakpoints

Mobile-first content, `max-width` queries for overrides. Four breakpoints, in this order of frequency:

| Breakpoint | Used for |
| --- | --- |
| `768px` | The main mobile switch — hero type scale, stacked grids, nav |
| `900px` | Tablet: 3-column grids → 2 |
| `600px` | Small mobile: 2-column grids → 1 |
| `480px` | Fine type adjustments |

Stick to these four. A fifth arbitrary breakpoint makes the system harder to reason about.

---

## 5. Components

25 components in `src/components/`. All are `.astro` — **there are no framework islands and no client-side hydration anywhere.** The only JavaScript shipped is a handful of inline `<script is:inline>` blocks for the video lightbox, FAQ accordions and the activities slider.

| Component | Purpose | Data source | Reusable |
| --- | --- | --- | --- |
| `SiteHead` | The one `<head>`: meta, OG, Twitter, favicons, verification, JSON-LD. Accepts a `head` slot for per-page tags. | `getGlobals()` | Yes — Layout + index.astro |
| `Layout` | Page shell: SiteHead, Header, `.bp-page`, slot, Footer, CookiesBanner, global CSS. | `site-settings.js` (GA/GTM only) | Yes — 44 pages |
| `Header` | Sticky nav with mega-menu dropdowns and mobile drawer. | `getGlobals().nav` | Yes |
| `Footer` | Footer columns, legal links, copyright. | `getGlobals().nav` | Yes |
| `PageHero` | Internal page hero. Renders `highlight` + `title` — **highlight comes FIRST**, in orange. | props | Yes |
| `ImageText` | Image-and-text band. Supports `reverse`, `altBg`, `collage`, `imageAspect`, `youtubeId`. | props | Yes — the workhorse |
| `RichText` | Portable Text renderer: headings, lists, quotes, links, strong/em/code, `<br>`, body images. | props (`blocks`) | Yes |
| `RichTextSpans` | Inline span renderer used by RichText. | props | Internal |
| `ServicePage` | Wrapper for the 3 services using the intro/when/how/who shape. Takes a `sections` array. | `services` | Limited |
| `ConditionPage` | Renders an entire condition document. Takes `doc`, not ~20 props. | `requireCondition()` | Yes — all 19 |
| `BlogCard` | News grid card. | props | Yes |
| `BlogGrid` | News grid + pagination. | props | Yes |
| `Team` | Team carousel, listing row and profile blocks. | `getTeam()` | Yes |
| `BookingCTA` | Site-wide booking banner. | `getGlobals().bookingUrl` | Yes |
| `Picture` | Responsive `<picture>` with AVIF/WebP negotiation and explicit width/height. | props | Yes — use for every image |
| `PhotoMarquee` | Scrolling photo band on service pages. | props | Yes |
| `VideoHero` | Homepage video hero. | `requireHomepage()` | Homepage only |
| `Hero` | Homepage "We're Different" band with stats. | `requireHomepage()` | Homepage only |
| `ActivitiesSlider` | Homepage scrolling activities band. | `requireHomepage()` | Homepage only |
| `Features` | Homepage services carousel. | `requireHomepage()` | Homepage only |
| `Conditions` | Homepage condition pills. | `requireHomepage()` | Homepage only |
| `Approach` | Homepage 3-step approach cards. | `requireHomepage()` | Homepage only |
| `FacilitiesBanner` | Homepage facilities image banner. | `requireHomepage()` | Homepage only |
| `QuoteBanner` | Homepage testimonial quote banner. | `requireHomepage()` | Homepage only |
| `Testimonials` | Testimonials list. | **`src/data/testimonials.js`** — the one component still on legacy data | Yes |
| `CookiesBanner` | GA/GTM consent banner. | `site-settings.js` | Yes |

---

## 6. Routes

67 route files. Every one reads from Sanity.

| Route | File | Layout | Sanity source |
| --- | --- | --- | --- |
| `/404/` | `404.astro` | Layout | `pageContent`, `pages`, `services` |
| `/about-us/` | `about-us.astro` | Layout | `pageContent`, `pages` |
| `/clinic/clapham-south-hydrotherapy/` | `clinic/clapham-south-hydrotherapy.astro` | Layout | `clinics`, `getClinic` |
| `/clinic/clapham/` | `clinic/clapham.astro` | Layout | `clinics`, `getClinic` |
| `/condition/acl-knee-specialist-london/` | `condition/acl-knee-specialist-london.astro` | ConditionPage | `conditions`, `requireCondition` |
| `/condition/ankle-pain/` | `condition/ankle-pain.astro` | ConditionPage | `conditions`, `requireCondition` |
| `/condition/balance-and-dizziness/` | `condition/balance-and-dizziness.astro` | ConditionPage | `conditions`, `requireCondition` |
| `/condition/childrens-neurological-developmental/` | `condition/childrens-neurological-developmental.astro` | ConditionPage | `conditions`, `requireCondition` |
| `/condition/cycling-injuries/` | `condition/cycling-injuries.astro` | ConditionPage | `conditions`, `requireCondition` |
| `/condition/elbow-pain/` | `condition/elbow-pain.astro` | ConditionPage | `conditions`, `requireCondition` |
| `/condition/foot-pain/` | `condition/foot-pain.astro` | ConditionPage | `conditions`, `requireCondition` |
| `/condition/hip-pain/` | `condition/hip-pain.astro` | ConditionPage | `conditions`, `requireCondition` |
| `/condition/ingrown-toenails/` | `condition/ingrown-toenails.astro` | ConditionPage | `conditions`, `requireCondition` |
| `/condition/lower-back-pain/` | `condition/lower-back-pain.astro` | ConditionPage | `conditions`, `requireCondition` |
| `/condition/mens-pelvic-health/` | `condition/mens-pelvic-health.astro` | ConditionPage | `conditions`, `requireCondition` |
| `/condition/multiple-sclerosis/` | `condition/multiple-sclerosis.astro` | ConditionPage | `conditions`, `requireCondition` |
| `/condition/neck-pain/` | `condition/neck-pain.astro` | ConditionPage | `conditions`, `requireCondition` |
| `/condition/parkinsons/` | `condition/parkinsons.astro` | ConditionPage | `conditions`, `requireCondition` |
| `/condition/running-injuries/` | `condition/running-injuries.astro` | ConditionPage | `conditions`, `requireCondition` |
| `/condition/shoulder-specialist-physiotherapy/` | `condition/shoulder-specialist-physiotherapy.astro` | ConditionPage | `conditions`, `requireCondition` |
| `/condition/stroke/` | `condition/stroke.astro` | ConditionPage | `conditions`, `requireCondition` |
| `/condition/verrucas/` | `condition/verrucas.astro` | ConditionPage | `conditions`, `requireCondition` |
| `/condition/womens-pelvic-health/` | `condition/womens-pelvic-health.astro` | ConditionPage | `conditions`, `requireCondition` |
| `/contact-us/` | `contact-us.astro` | Layout | `getGlobals`, `globals`, `pageContent`, `pages` |
| `/faqs/` | `faqs.astro` | Layout | `faqs`, `getGeneralFaqs` |
| `/` | `index.astro` | own <html> | `homepage`, `requireHomepage` |
| `/meet-the-team/` | `meet-the-team.astro` | Layout | `pageContent`, `pages` |
| `/news-events/` | `news-events.astro` | Layout | `pageContent`, `pages` |
| `/news/[slug]/` | `news/[slug].astro` | Layout | `blog`, `getBlogPost`, `getGlobals`, `globals` |
| `/news/` | `news/index.astro` | Layout | `blog`, `blogPaging`, `getBlogPost`, `pageContent`, `pages` |
| `/news/page/[page]/` | `news/page/[page].astro` | Layout | `blog`, `blogPaging`, `getBlogPost`, `pageContent`, `pages` |
| `/our-clinic/` | `our-clinic.astro` | Layout | `pageContent`, `pages` |
| `/our-studios/` | `our-studios.astro` | Layout | `pageContent`, `pages` |
| `/outcomes/` | `outcomes.astro` | Layout | `pageContent`, `pages` |
| `/pricing/` | `pricing.astro` | Layout | `getGlobals`, `getPricing`, `globals`, `pricing` |
| `/privacy-policy/` | `privacy-policy.astro` | Layout | `pageContent`, `pages` |
| `/service/alterg-anti-gravity-treadmill-london/` | `service/alterg-anti-gravity-treadmill-london.astro` | Layout | `getGlobals`, `globals`, `pageContent`, `services` |
| `/service/bike-fitting-cycling-analysis/` | `service/bike-fitting-cycling-analysis.astro` | Layout | `getGlobals`, `globals`, `pageContent`, `services` |
| `/service/ergonomics/` | `service/ergonomics.astro` | Layout | `getGlobals`, `globals`, `pageContent`, `services` |
| `/service/hydrotherapy/` | `service/hydrotherapy.astro` | Layout | `getGlobals`, `globals`, `pageContent`, `services` |
| `/service/lift-weight-training-club/` | `service/lift-weight-training-club.astro` | Layout | `getGlobals`, `globals`, `pageContent`, `services` |
| `/service/mens-health/` | `service/mens-health.astro` | Layout | `getGlobals`, `globals`, `pageContent`, `services` |
| `/service/mummy-mot/` | `service/mummy-mot.astro` | Layout | `getGlobals`, `globals`, `pageContent`, `services` |
| `/service/osteopathy/` | `service/osteopathy.astro` | Layout | `getGlobals`, `globals`, `pageContent`, `services` |
| `/service/outcome-measures/` | `service/outcome-measures.astro` | Layout | `getGlobals`, `globals`, `pageContent`, `services` |
| `/service/paediatric-sports-physiotherapy/` | `service/paediatric-sports-physiotherapy.astro` | ServicePage | `pageContent`, `services` |
| `/service/physiotherapy-prescribing/` | `service/physiotherapy-prescribing.astro` | Layout | `getGlobals`, `globals`, `pageContent`, `services` |
| `/service/physiotherapy/` | `service/physiotherapy.astro` | Layout | `getGlobals`, `globals`, `pageContent`, `services` |
| `/service/pilates/` | `service/pilates.astro` | ServicePage | `pageContent`, `services` |
| `/service/podiatry/` | `service/podiatry.astro` | Layout | `getGlobals`, `globals`, `pageContent`, `services` |
| `/service/prehab-class/` | `service/prehab-class.astro` | Layout | `getGlobals`, `globals`, `pageContent`, `services` |
| `/service/psychological-wellness/` | `service/psychological-wellness.astro` | Layout | `pageContent`, `services` |
| `/service/shockwave-therapy/` | `service/shockwave-therapy.astro` | Layout | `getGlobals`, `globals`, `pageContent`, `services` |
| `/service/specialist-neuro-physio-london/` | `service/specialist-neuro-physio-london.astro` | Layout | `getGlobals`, `globals`, `pageContent`, `services` |
| `/service/sports-massage-clapham-soft-tissue-therapy/` | `service/sports-massage-clapham-soft-tissue-therapy.astro` | Layout | `getGlobals`, `globals`, `pageContent`, `services` |
| `/service/sports-physiotherapy/` | `service/sports-physiotherapy.astro` | Layout | `getGlobals`, `globals`, `pageContent`, `services` |
| `/service/strength-conditioning/` | `service/strength-conditioning.astro` | Layout | `getGlobals`, `globals`, `pageContent`, `services` |
| `/service/tmj-and-jaw-pain/` | `service/tmj-and-jaw-pain.astro` | ServicePage | `pageContent`, `services` |
| `/service/vojta-therapy/` | `service/vojta-therapy.astro` | Layout | `getGlobals`, `globals`, `pageContent`, `services` |
| `/service/womens-health/` | `service/womens-health.astro` | Layout | `getGlobals`, `globals`, `pageContent`, `services` |
| `/shop/` | `shop.astro` | Layout | `pageContent`, `pages` |
| `/team/[slug]/` | `team/[slug].astro` | Layout | `getTeam`, `team` |
| `/terms-conditions/` | `terms-conditions.astro` | Layout | `pageContent`, `pages` |
| `/testimonials/` | `testimonials.astro` | Layout | `pageContent`, `pages` |
| `/thank-you/` | `thank-you.astro` | Layout | `pageContent`, `pages` |
| `/who-we-help/[slug]/` | `who-we-help/[slug].astro` | Layout | `pageContent`, `whoWeHelp` |
| `/work-for-us/` | `work-for-us.astro` | Layout | `pageContent`, `pages` |

### Dynamic routes

| Route | Generated from | On unpublish |
| --- | --- | --- |
| `/team/<slug>/` | `getStaticPaths` → `getTeam()` | Page and sitemap entry both disappear |
| `/who-we-help/<slug>/` | `getStaticPaths` → `whoWeHelp` | Page stops generating |
| `/news/<slug>/` | `getStaticPaths` → `getBlogPosts()` | Page, grid card, sitemap entry and related links disappear |
| `/news/page/<n>/` | Post count ÷ `PAGE_SIZE` (9) | Fewer pages |

The 24 service and 19 condition pages are **static files**, one per document, not a dynamic route. They keep bespoke per-page markup that a single template could not express.

> **Why `/news/page/<n>/` and not `/news/<n>/`:** a catch-all directly under `/news/` would also match post slugs, and the two routes would collide.

### Build configuration (`astro.config.mjs`)

| Setting | Value | Why it matters |
| --- | --- | --- |
| `adapter` | `cloudflare()` | Cloudflare Workers/Pages output |
| `trailingSlash` | `always` | **Every internal link must end in `/`** or Cloudflare redirects |
| `build.format` | `directory` | Each page becomes `<route>/index.html` |
| `redirects` | **193 entries** | Legacy URL map from the previous site — do not remove without checking analytics |

---

## 7. Sanity integration (`src/lib/sanity/`)

| Module | Exports | Notes |
| --- | --- | --- |
| `client.ts` | `sanityClient`, `isSanityConfigured` | **Token-less by design.** Referencing `SANITY_API_READ_TOKEN` would inline it into the server bundle. The dataset is public. |
| `queries.ts` | All GROQ | Single home for every query. Explicit projections — no `...` spreads. |
| `globals.ts` | `getGlobals()` | siteSettings + seoSettings + navigation + bookingLinks in ONE query. Never throws; falls back to `data/site-settings.js`. |
| `pageContent.ts` | `pages`, `services`, `whoWeHelp`, `toBodyBlocks`, types | `makeLoader()` gives each `.all` / `.bySlug` / `.required` / `.routes`. |
| `conditions.ts` | `getConditions`, `requireCondition` | Named-field model, not `sections`. |
| `homepage.ts` | `getHomepage`, `requireHomepage` | Read by 9 sibling components; memoised to one request. |
| `blog.ts` | `getBlogPosts`, `getBlogPost`, `getAdjacentPosts`, `getBlogCategories` | Related posts fall back category → recent. Prev/next derive from the same list as the grid. |
| `team.ts` | `getTeam` | Falls back to `data/team.js`. |
| `clinics.ts` | `getClinics`, `getClinic` | Contact details fall back to Site Settings. |
| `faqs.ts` | `getGeneralFaqsRequired`, `answerToText` | `answerToText` flattens Portable Text for FAQPage JSON-LD. |
| `pricing.ts` | `getPricing` | Falls back to `data/pricing.js`. |
| `navigation.ts` | `resolveNavigation` | Falls back to `data/navigation-fallback.ts`. |
| `routes.ts` | `resolveHref`, `ROUTE_PREFIX`, `FIXED_ROUTES` | **The only place that knows the URL structure.** Takes a whole document, not `(type, slug)`. |
| `seo.ts` | `getSitemapEntries`, `absoluteUrl` | Sitemap sources must match the sources that generate pages. |
| `blogPaging.ts` | `PAGE_SIZE` | Declared once so grid and routes agree. |
| `types.ts` | Shared types |  |

**Every loader memoises its promise** for the build's lifetime. Nine components asking for the homepage produce one HTTP request.

### Adding a field — four coordinated edits

```
1. schema      balance-physio-sanity/schemaTypes/<type>Type.ts
2. query       src/lib/sanity/queries.ts        ← forget this and the field is invisible
3. loader      src/lib/sanity/<module>.ts       ← forget this and the field renders blank
4. component   src/components/… or src/pages/…
```

**Steps 2 and 3 are the ones people miss.** A field can exist in the schema *and* the document and still render blank because nothing selected or mapped it. There is no error — the value is simply `undefined`. This happened three times during the migration.

---

## 8. SEO implementation

All of it flows through `SiteHead.astro`:

- `<title>` / description with a three-level fallback: page prop → Sanity global default → `data/site-settings.js`.
- Canonical, Open Graph, Twitter card, `og:site_name`, `twitter:site`.
- Webmaster verification tags (7 supported), emitted only when filled in — all are currently empty.
- `robots: noindex, nofollow` site-wide when Site Settings "discourage search engines" is on.
- LocalBusiness / Physiotherapist JSON-LD built from `seoSettings.localSeo`.
- Per-page extras via `<Fragment slot="head">` — the blog post page uses it for `og:type=article`, BlogPosting and BreadcrumbList JSON-LD.

`sitemap.xml.ts` and `robots.txt.ts` are dynamic endpoints driven by `seoSettings`.

> **Sitemap rule:** entries must come from the **same source that generates the pages**. A mismatch here shipped a live bug — team URLs came from `data/team.js` while the pages came from Sanity, so an unpublished member kept a sitemap entry pointing at a 404.

---

## 9. Performance

What the build actually does:

- **Fully static.** No SSR, no client-side data fetching, no hydration.
- **AVIF/WebP only**, enforced at the CMS. `Picture.astro` emits a `<picture>` with format negotiation; `bgImage.js` does the same for CSS backgrounds via `image-set()`.
- **Explicit `width`/`height` on images** to reserve space and avoid layout shift.
- `loading="lazy"` / `decoding="async"` below the fold; `eager` for the blog post hero.
- **One Sanity request per document type per build**, via memoised loaders.
- Fonts preconnected; Inter loaded from Google Fonts.

> **Not measured.** No PSI or LCP figures exist for this build. The list above describes implementation, not results. A Lighthouse run against a deployed URL is still outstanding — do not claim performance targets are met until it has been done.

---

## 10. Accessibility

Implemented: semantic landmarks (`<header>`, `<nav>`, `<main>`-equivalent sections, `<footer>`), ordered headings with one `<h1>` per page, alt text on **all 478 images**, `aria-label` on icon-only and card links, `aria-current="page"` on the active breadcrumb and pagination item, `<time datetime>` on dates, native `<details>` for FAQ accordions (keyboard-accessible for free), and `rel="noopener"` on external links.

**Never** `set:html` on CMS content — that is why `RichText` exists.

> **Reviewed in code only.** Not tested with a screen reader or on real devices.

---

## 11. Legacy `src/data/` files

Mostly **deliberate build-time fallbacks**, not dead code. Check the importer before deleting.

| File | Status |
| --- | --- |
| `site-settings.js` | Fallback for `getGlobals()`; **only** source of the GA/GTM IDs. Keep. |
| `team.js` | Fallback for `getTeam()`. Keep. |
| `pricing.js` | Fallback for `getPricing()`. Keep. |
| `navigation-fallback.ts` | Fallback for `resolveNavigation()`. Without it a credential-less build renders 2 header links instead of 78. Keep. |
| `testimonials.js` | Live source for `/testimonials/`. Not migrated, by instruction. |
| `events.js` | Live source for `/news-events/` (1 event). Not migrated, by instruction. |

---

## 12. Build, environment and deployment

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static build into dist/
npm run preview  # build + wrangler dev
```

### Environment variables (`.env`)

| Variable | Value | Notes |
| --- | --- | --- |
| `SANITY_PROJECT_ID` | `3po4zrtd` | Required |
| `SANITY_DATASET` | `production` | Required |
| `SANITY_API_VERSION` | `2025-02-19` | Required |
| `SANITY_API_READ_TOKEN` | — | **Not used by the build.** Reserved for future draft/preview work. |

The first three must also exist in Cloudflare → Workers & Pages → `balance-physio` → Settings → Environment variables. Without them the build produces a site with no content.

> `npm run build` copies `.env` into `dist/server/.dev.vars` for local `wrangler dev`. That file contains the token. `dist/` is gitignored and the token never reaches `dist/client/`, but never commit or upload `dist/` wholesale.

### Deployment

Push to `main` → Cloudflare builds and deploys. Publishing in Sanity triggers the same build through a webhook → deploy hook.

The deploy hook URL is **not recorded in this repo** — it is an unauthenticated secret. Find it in the Cloudflare dashboard. It was previously committed in `docs/deployment.md`, so **it should be rotated.**

### Git workflow

1. Pull and merge before starting — always.
2. Develop against `localhost`, never production.
3. Build and QA before committing.
4. **Never push or deploy without being asked.** Standing project rule.

---

## 13. QA checklist

```
[ ] npm run build — no errors
[ ] Page count as expected (114)
[ ] Diff affected pages vs previous build: rendered TEXT and element counts
[ ] No broken imports, links, images or queries
[ ] Wired data renders — check the actual HTML, not just that the build passed
[ ] Round-trip: edit in Sanity → rebuild → confirm change → restore
[ ] Unpublish test: page, grid card, sitemap entry, related refs all gone; build still succeeds
[ ] Responsive at 768 / 900 / 600
[ ] Keyboard focus visible; heading order intact; alt text present
[ ] SEO unchanged unless intentional — diff the <head>
[ ] No console errors
```

**Diff rendered text, not just element counts.** Element counts alone have missed real content loss on this project more than once — a paragraph can disappear while the count stays the same because something else took its place.

---

## 14. Coding standards

- **Astro components by default.** Hydrate only for genuine interaction — nothing does today.
- **Portable Text through `<RichText>`.** Never `set:html` on CMS content.
- **Images through `Picture.astro`** with explicit width/height.
- **Links resolve through `resolveHref()`** from a reference. Never store a URL in the CMS.
- **Loaders memoise; components never fetch independently.**
- **Guard empty CMS:** throw rather than render an empty page.
- **Internal links end in `/`** (`trailingSlash: 'always'`).
- **Use design tokens**, not literal colours.
- Component CSS stays in the component; global CSS is for genuinely shared rules.

---

## 15. Current state and known issues

**Complete:** every page renders from Sanity — homepage, 24 services, 19 conditions, 15 pages, 10 who-we-help, 2 clinics, 35 team profiles, 7 blog posts, FAQs, pricing, navigation, SEO, sitemap, robots.

| Issue | Detail |
| --- | --- |
| Performance never measured | No PSI/LCP figures. Needs Lighthouse against a deployed URL. |
| Responsive / a11y code-reviewed only | Not verified on real devices or with a screen reader. |
| Deploy hook in git history | Rotate it in Cloudflare. Removing the doc line does not undo exposure. |
| Cloudflare managed robots.txt | Injects a second `User-agent: *` block ahead of the Sanity-controlled one. Dashboard setting. |
| `/testimonials/`, `/news-events/` | Still on `src/data/` files, by instruction. |
| Blog post "Royal Society of Medicine event" | Date is **assumed** (1 June 2026); source had none. |

---

## 16. Documentation workflow (mandatory)

Before any Astro work: read this file, then the newest `handoffs/handoff-astro-YYYY-MM-DD.md`.

After any Astro work:

1. Update this file if architecture, design system, components, routes, build or deployment changed.
2. Create or update `handoffs/handoff-astro-<YYYY-MM-DD>.md` for today.
3. Keep only the newest **10** dated files; delete the oldest when adding an 11th. Never delete this file.

Dated files must record: date · GitHub username · AI agent used · branch · objective · files created / modified / removed · components added · schemas added or updated · wired and fetched fields · bug fixes · refactoring · performance · SEO · accessibility · breaking changes · testing · QA · remaining tasks · known issues · recommendations. Use `Unknown` where a value cannot be determined; never leave a field blank.
