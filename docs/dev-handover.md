# Developer Handover

**If you're a new developer picking up this project, read this first.** It'll get you from "never seen it" to "making changes" in about 30 minutes.

## Step 1 — Get access to the three services

Ask the project owner for:

1. **GitHub** — collaborator access on `hannah639/balance-physio`
2. **Cloudflare** — team member invite to the Balance Physio project (so you can view builds and the deploy hook URL)
3. **Sanity** — member invite to the `balance-physio` project (project ID `da13xw8y`)

You don't strictly need all three to start — GitHub alone lets you contribute code. Cloudflare is for debugging deploy failures. Sanity is for editing CMS content or changing schemas.

## Step 2 — Install prerequisites

You need:

- **Node.js 22.12 or newer** — [download here](https://nodejs.org)
- **Git**
- A code editor (VS Code, Cursor, whatever)

Verify:
```bash
node --version    # should be v22.12.0 or higher
npm --version
git --version
```

## Step 3 — Clone and run locally

```bash
git clone https://github.com/hannah639/balance-physio.git
cd balance-physio
npm install
npm run dev
```

Open http://localhost:4321 in your browser. You should see the site. Edit any file in `src/` and the browser auto-reloads.

## Step 4 — Understand the shape of the project

Read these docs in order:

1. **[README.md](README.md)** (5 min) — project overview, live URLs, stack
2. **[architecture.md](architecture.md)** (10 min) — how files are organised, how routing works
3. **[content-model.md](content-model.md)** (5 min) — where each piece of content lives

Skim **[decisions.md](decisions.md)** to understand *why* things are the way they are before changing anything fundamental.

## Step 5 — Make your first change

Try this as a warm-up — it confirms your setup works end to end:

1. Open `src/pages/about-us.astro` in your editor
2. Change one word in the body copy
3. Save
4. Check http://localhost:4321/about-us — your change should appear instantly
5. Commit and push:
   ```bash
   git add .
   git commit -m "Test change"
   git push
   ```
6. Watch the Cloudflare dashboard — a new deploy should start within 30s and finish in ~90s
7. Visit the live site to confirm — https://balance-physio.hannah-9e0.workers.dev/about-us

If that worked, you're fully set up.

## Common edits — where to go

| Task | File to edit |
|---|---|
| Change homepage hero copy | `src/components/VideoHero.astro` or `src/components/Hero.astro` |
| Change service page copy (e.g. Physiotherapy) | `src/pages/service/physiotherapy.astro` |
| Change condition page copy (e.g. Back Pain) | `src/pages/condition/lower-back-pain.astro` |
| Add/remove/edit a team member | `src/data/team.js` |
| Change brand colours | CSS variables in `src/layouts/Layout.astro` (top of `<style is:global>`) |
| Add a new service page | Copy an existing `src/pages/service/*.astro`, update `src/pages/services/index.astro` + `src/components/Header.astro` |
| Update header nav dropdowns | `src/components/Header.astro` — the `about`, `services`, `conditions` arrays at the top |
| Update footer links or hours | `src/components/Footer.astro` |
| Update the Google Map | `src/components/Footer.astro` — the `<iframe>` in `.footer-map` |
| Change the booking button URL | Search/replace `https://go.mindbodyonline.com/...` across components |
| Update SEO meta / Google Analytics / GTM | Sanity Studio → Site Settings (no code change needed) |

## Workflow conventions

### Commit messages
Short and in the imperative mood. Examples from this repo:
- `Fix sticky header on secondary pages`
- `Add verbatim bios scraped from WP for all 27 team members`
- `Point all booking buttons to MindBody booking widget in new tab`

### Pushing straight to main
This is a small project with one deploy target, so we push directly to `main`. For bigger changes, feel free to branch and open a PR.

### After pushing
Check Cloudflare → Deployments tab to confirm the build succeeded. If it fails, click into the build to see logs.

### Images
- Put them in `public/<folder>/` and reference with absolute paths (`/folder/image.jpg`)
- Resize before committing: `sips -Z 1400 image.jpg --setProperty formatOptions 82`
- Target under 500KB each

## Common gotchas

- **Content in Sanity takes ~90s to appear** after publish — that's the Cloudflare rebuild time, not a bug.
- **Header font looks wrong on internal pages** — the Header is outside `.bp-page`, so it needs an explicit `font-family`. Don't "clean this up" or fonts break.
- **Text wrap order in headings** — `PageHero` renders highlight word FIRST, then title. So `title="For Us" highlight="Work"` renders as "Work For Us". If your heading reads in the wrong order, swap these props.
- **`useCdn: false`** in `src/lib/sanity.js` is intentional. Do NOT change it — see [decisions.md](decisions.md).
- **JSX whitespace** — if you're mixing text and components in Astro templates, whitespace between them may be stripped. Use `{' '}` to force a space.

## Editing the CMS (Sanity Studio)

Non-developers should use Studio to edit:
- Site Settings (SEO, GA, GTM, business info)
- Testimonials

URL: https://balance-physio.sanity.studio
Log in with the email address you were invited with.

Changes publish immediately, triggering a Cloudflare rebuild. The live site updates within ~90 seconds.

## When you're blocked

1. Check [todo.md](todo.md) for known issues
2. Read the Astro docs: https://docs.astro.build
3. Read the Sanity docs: https://www.sanity.io/docs
4. For Cloudflare deploy issues: dash.cloudflare.com → project → Deployments → click the failing build → read logs

## What you should NOT change without asking

- The `useCdn: false` setting in `src/lib/sanity.js`
- The URL structure (`/service/...`, `/condition/...`, `/team/...`) — it's tied to potential redirects from the old WP site
- The Cloudflare deploy hook URL hardcoded into Sanity's webhook
- The Sanity project ID in `src/lib/sanity.js`
