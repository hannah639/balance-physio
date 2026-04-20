# Architecture

## Core pattern: file-based routing

Astro generates a URL for every `.astro` file in `src/pages/`. The file path IS the URL.

| File | URL |
|---|---|
| `src/pages/index.astro` | `/` |
| `src/pages/about-us.astro` | `/about-us` |
| `src/pages/service/physiotherapy.astro` | `/service/physiotherapy` |
| `src/pages/service/index.astro` | `/service` |
| `src/pages/team/[slug].astro` | `/team/dr-lucy-goldby`, `/team/alex-deif`, etc. (dynamic) |

To add a new page, create a new `.astro` file. No route config needed.

## Page structure

Every page follows this shape:

```astro
---
import Layout from '../layouts/Layout.astro';
import PageHero from '../components/PageHero.astro';
// ...other components
---
<Layout title="Page Title" description="SEO description">
    <PageHero title="..." highlight="..." subtitle="..." breadcrumb="..." />
    <!-- Content sections -->
    <BookingCTA />
</Layout>
```

## Layout wrapper — `src/layouts/Layout.astro`

This is the master shell for every page. It renders:

1. `<html>` + `<head>` (SEO meta tags, OG tags, JSON-LD structured data, Google Analytics, Google Tag Manager)
2. `<body>` with the fixed `<Header />` at the top
3. `<slot />` — your page content goes here
4. `<Footer />`
5. Global styles scoped under `.bp-page`
6. Video lightbox modal (for YouTube embeds)

It also fetches `siteSettings` from Sanity on build and uses those for SEO defaults, LocalBusiness schema, GA/GTM tracking codes.

Props: `title` (page-specific page title), `description` (meta description). Both optional — falls back to Sanity siteSettings.

## CSS approach

**Global styles live in `Layout.astro` inside a `<style is:global>` block.** Everything is scoped under `.bp-page` (e.g. `.bp-page .hero h2`) to prevent collisions.

CSS variables at the top define the brand:
```css
.bp-page {
  --primary: #3d5a6e;
  --primary-dark: #2c4356;
  --accent: #e87722;
  --cta: #3EBEDF;
  /* ...etc */
}
```

**Changing brand colours = edit these 6-10 variables only.**

Some components use scoped `<style>` blocks (default Astro behaviour) for component-specific CSS (Header, Team, BookingCTA, PhotoMarquee, bio pages). These don't need `.bp-page` prefix.

## Reusable components (src/components/)

### Layout primitives
- `Header.astro` — fixed top nav with logo, dropdowns, Book Now button, mobile hamburger menu. Outside `.bp-page` wrapper.
- `Footer.astro` — 4-column grid on desktop, stacks to 1 column on mobile. Includes Google Maps embed.
- `PageHero.astro` — dark hero banner for internal pages. Props: `title`, `highlight` (orange word), `subtitle`, `breadcrumb`, `ctaText`, `ctaHref`.

### Content blocks
- `ImageText.astro` — alternating image/text section. Props: `eyebrow`, `heading`, `highlight`, `reverse` (image on right), `altBg` (light grey background), `image`, `imageAlt`, `placeholderLabel`, `youtubeId` (optional lightbox trigger).
- `PhotoMarquee.astro` — auto-scrolling horizontal photo band. Props: `images` (array of `{src, alt}`), `heightPx`, `speedSeconds`.
- `BookingCTA.astro` — "Ready to Book?" banner with booking button + contact link.
- `Testimonials.astro` — 3-column testimonial grid. Pulls from Sanity.
- `Team.astro` — team grid or horizontal slider (prop: `sliderRow={true}` for homepage). Pulls from static data file.

### Page-type templates
- `ServicePage.astro` — renders a full service page from props (title, intro, when/how/who lists, FAQs, images, YouTube video). Used by all 21 service pages to avoid duplication.
- `ConditionPage.astro` — same pattern for the 19 condition pages.

### Homepage-specific
- `VideoHero.astro`, `Hero.astro`, `Features.astro` (services slider), `Approach.astro`, `Conditions.astro`, `ActivitiesSlider.astro`, `FacilitiesBanner.astro`, `QuoteBanner.astro` — all used only in `index.astro`.

## Data files

- `src/data/team.js` — 27 team members with name, slug, role, bio (array of paragraphs). Used by `Team.astro` (homepage + /meet-the-team) and `/team/[slug].astro` (bio pages).
- `src/lib/sanity.js` — Sanity client + image URL builder. Imports where Sanity content is needed.

## Routing notes

- `useCdn: false` in the Sanity client — so every build fetches fresh data
- Dynamic routes: `src/pages/team/[slug].astro` generates bio pages from the team array via `getStaticPaths()`
- Every route is statically generated at build time (no SSR)
