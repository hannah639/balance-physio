# Content Model — where does each thing live?

Content is split across three places. This table maps every piece of content to its source so you know where to edit.

## Quick reference

| Content | Lives in | Who can edit | How |
|---|---|---|---|
| Site title, SEO defaults, social share image | Sanity Studio → Site Settings | Anyone with Studio access | Publish in Studio → site rebuilds |
| Google Analytics ID, GTM ID | Sanity Studio → Site Settings | Studio access | Publish → site rebuilds |
| Business contact info + opening hours (schema.org) | Sanity Studio → Site Settings | Studio access | Publish → site rebuilds |
| Team members (names, roles, bios) | `src/data/team.js` | Developers | Edit file, git push |
| Team member photos | Currently placeholder initials | — | Add `photo` field in team.js + upload images to `public/` |
| Testimonials | Sanity Studio → Testimonial | Studio access | Publish → site rebuilds |
| Service page copy (Physiotherapy, Osteopathy, etc.) | `src/pages/service/*.astro` | Developers | Edit file, git push |
| Condition page copy (Back Pain, Neck Pain, etc.) | `src/pages/condition/*.astro` | Developers | Edit file, git push |
| Homepage copy (hero, stats, About block) | `src/pages/index.astro` + `src/components/Hero.astro` + `src/components/VideoHero.astro` | Developers | Edit file, git push |
| About page copy | `src/pages/about-us.astro` | Developers | Edit file, git push |
| Meet the Team page | `src/pages/meet-the-team.astro` | Developers | Edit file, git push |
| Pricing table | `src/pages/pricing.astro` | Developers | Edit file, git push |
| FAQs | `src/pages/faqs.astro` | Developers | Edit file, git push |
| Images | `public/` folder | Developers | Drop file in `public/<folder>/`, reference with `/folder/file.jpg` |

## Sanity Studio content types

Three schemas, all in `studio/schemaTypes/`:

### `siteSettings` (singleton — only create ONE)
Used by: every page's `<head>` and footer
- `title` (string) — default browser tab title
- `description` (text) — default meta description for SEO
- `ogImage` (image) — default social share preview
- `gaId` (string) — Google Analytics measurement ID (e.g. `G-XXXXXXX`)
- `gtmId` (string) — Google Tag Manager ID (e.g. `GTM-XXXXXXX`)
- `businessType` (string) — Schema.org type (LocalBusiness, Physiotherapy, etc.)
- `businessName`, `phone`, `email` (string)
- `streetAddress`, `city`, `region`, `postalCode`, `country` (string)
- `latitude`, `longitude` (number) — for Google Maps rich result
- `priceRange` (string) — e.g. "££"
- `openingHours` (array of `{days, opens, closes}`)
- `sameAs` (array of URLs) — social profiles

### `teamMember` (not currently used on the live site)
The live site uses the static `src/data/team.js` file. The Sanity schema is still there if we ever migrate back.

### `testimonial`
- `quote` (text)
- `name` (string)
- `description` (string) — e.g. "Back pain client"
- `avatar` (image)
- `order` (number)

## Editing the team roster

`src/data/team.js` exports an array. To add a new member:

```js
{
    slug: 'firstname-lastname',   // URL slug — becomes /team/firstname-lastname
    name: 'First Last',
    role: 'Consultant Physiotherapist',
    bio: [
        "First paragraph of bio...",
        "Second paragraph...",
    ],
    // Optional: photo URL (currently everyone uses initials placeholder)
    // photo: '/team-photos/firstname.jpg',
},
```

To remove a member: delete their entry from the array.

To reorder: move the entry up/down in the array (homepage shows first 8, so put top people at the top).

## Editing service/condition page copy

Each service page is a small file that passes props to `ServicePage.astro`. Example from `src/pages/service/physiotherapy.astro`:

```astro
---
import ServicePage from '../../components/ServicePage.astro';
---
<ServicePage
    title="in Clapham"
    highlight="Physiotherapy"
    heroSubtitle="..."
    intro={["First paragraph...", "Second paragraph..."]}
    whenList={["Symptom 1", "Symptom 2", ...]}
    howList={["Treatment 1", "Treatment 2", ...]}
    whoList={["Who 1", "Who 2", ...]}
    faqs={[
        { q: "Question?", a: "Answer." },
    ]}
/>
```

Just edit the string values. No CSS knowledge needed.

## Adding a new service or condition page

1. Create `src/pages/service/new-service-slug.astro` — copy an existing service file as a starting point
2. Update `src/pages/services/index.astro` — add the new service to the `services` array so it appears on the /services index
3. Update `src/components/Header.astro` — add to the `services` array so it appears in the nav dropdown
4. Update `src/components/Footer.astro` if you want it in the footer services column
5. Update `src/components/Features.astro` if you want it in the homepage slider

## Images

All live under `public/` and are referenced by absolute path:

```astro
<img src="/about/clinic-exterior.jpg" alt="..." />
```

Resize large photos before committing (Cloudflare has a per-file limit and big images slow the site). On Mac:

```bash
sips -Z 1400 image.jpg --setProperty formatOptions 82
```

This caps the longest edge at 1400px and sets 82% JPEG quality. Most photos end up under 500KB.
