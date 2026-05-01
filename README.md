# Balance Performance Physiotherapy

The website for [Balance Performance Physiotherapy](https://balancephysio.com) in Clapham, London.

Built with [Astro](https://astro.build) + [Cloudflare Workers](https://developers.cloudflare.com/workers).

## Quick start

```bash
git clone https://github.com/hannah639/balance-physio.git
cd balance-physio
npm install
npm run dev
```

Open http://localhost:4321 — the site will hot-reload as you edit files in `src/`.

## Documentation

**Read [PROJECT_HANDOVER.md](./PROJECT_HANDOVER.md) for the full project guide** — covers everything from "I want to update some text" through to "I'm picking up the codebase from scratch":

- How non-developers can flag content changes
- Setting up your computer to work on the site
- Common edits (and where to make them)
- Deploy pipeline and patch workflow
- Architecture decisions and gotchas
- SEO, analytics, and redirects

The `docs/` folder contains additional reference material — architecture notes, content model, deployment specifics, and the to-do list.

## Commands

| Command | What it does |
|---|---|
| `npm install` | Install dependencies (run once after cloning) |
| `npm run dev` | Start the dev server at http://localhost:4321 |
| `npm run build` | Build the production site to `./dist/` |
| `npm run preview` | Preview the production build locally |

## Deployment

Every push to `main` auto-deploys to Cloudflare. The build runs `npm run build` and pushes to the `balance-physio` worker — typically live within ~90 seconds.
