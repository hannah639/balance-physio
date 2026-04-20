# TODO / Known Outstanding Items

As of April 2026. Update this as items are shipped or new ones come up.

## Content

- [ ] **Real team headshots** — all 27 members currently show initials placeholders. Add a `photo` field to each entry in `src/data/team.js` and update `Team.astro` + `src/pages/team/[slug].astro` to render `<img>` when present.
- [ ] **Verbatim WP copy on ~7 bios** — Dan Elias, Jonathan Lewis, Portia Morey, Sam Stringer, Steven Connor, Eli Ferracci, Alex Deif were slightly summarised during scraping rather than captured verbatim. Cross-check with live WP site and replace if needed.
- [ ] **Real clinic photography** — most service pages use a shared placeholder image set (`public/placeholders/`). Replace per page by adding a `marqueeImages` prop.
- [ ] **Acupuncture service page** — YouTube video exists for this but no page has been built yet.
- [ ] **Retail Products video** — YouTube video exists but not yet placed anywhere (could go on Our Clinic page's Reception Area & Shop section).

## SEO

- [ ] **Sitemap** — install `@astrojs/sitemap` and configure. Submit to Google Search Console.
- [ ] **`robots.txt`** — add to `public/robots.txt`.
- [ ] **Custom domain** — site currently lives at `balance-physio.hannah-9e0.workers.dev`. Point a real domain (e.g. `balancephysio.com`) at Cloudflare and add it in Cloudflare → Custom domains.
- [ ] **Redirects from old WP URLs** — once the custom domain goes live, set up `public/_redirects` to 301 any WP URL that changed.
- [ ] **Per-page SEO overrides** — currently all pages use the Sanity-driven site-wide SEO defaults. For richer per-page control, add `seo` object to each page front-matter and pass into Layout.
- [ ] **LocalBusiness schema fields** — once Site Settings is filled in (business name, address, opening hours, lat/long, social URLs), JSON-LD will be emitted. Confirm with Google Rich Results Test.

## Design polish

- [ ] **Bio page placeholders** — avatars on `/team/<slug>` pages use initials; real photos would look much better.
- [ ] **Testimonials section** currently shows 0 cards on homepage (Sanity has no testimonials populated). Add some via Studio.
- [ ] **Hero video on mobile** autoplays a 1080p file — could serve a smaller mobile version via `<source media="...">` for perf.
- [ ] **Team card hover state** is minimal — consider a richer hover treatment or tap animation.

## Accessibility

- [ ] **Alt text audit** — many images have generic alt text ("Skiing on the slope"). Review all images for meaningful alt descriptions.
- [ ] **Focus styles** — default browser focus rings are used. Could be replaced with branded focus states.
- [ ] **Skip-to-content link** — not present. Add for keyboard users.

## Technical debt

- [ ] **Two sources of truth for services list** — services appear in `src/components/Header.astro` (nav dropdown), `src/components/Footer.astro` (footer column), `src/components/Features.astro` (homepage slider), and `src/pages/services/index.astro` (index page). Consider extracting to `src/data/services.js`.
- [ ] **Same issue for conditions** — listed in header, footer, conditions index page. Extract to `src/data/conditions.js`.
- [ ] **Sanity Studio/Astro font mismatch** — Studio uses Sanity's default UI; the site uses Inter. No practical impact but worth noting.
- [ ] **The `Team.astro` Sanity integration is unused** — we scraped team data into a static file. Either remove the Sanity-fetching code path or re-wire to use it.

## Ideas / nice-to-have

- [ ] **Blog / News section** — if client ever wants to publish updates
- [ ] **Booking confirmation page** — currently booking takes users to MindBody; returning to the site could be nicer
- [ ] **Pre-launch checklist** — see `decisions.md` for pre-launch items when ready to point real domain
