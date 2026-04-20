# Balance Performance Physiotherapy — Project Docs

Internal documentation for the Balance Physio website. Start here.

## What this is

A website for Balance Performance Physiotherapy in Clapham, London. Built with Astro, hosted on Cloudflare, with an optional Sanity CMS for editable content (currently only Team members + Site Settings are wired up to Sanity — the rest of the content is in code).

## Live URLs

| What | Where |
|---|---|
| Live site | https://balance-physio.hannah-9e0.workers.dev/ |
| Code | https://github.com/hannah639/balance-physio |
| Hosting | Cloudflare Workers & Pages |
| CMS Studio | https://balance-physio.sanity.studio |
| Booking system | https://go.mindbodyonline.com/book/widgets/appointments/view/8068777f5e/services |

## Stack

- **Astro 6.1.7** — static site generator
- **Sanity CMS** — headless CMS (Team roster + Site Settings)
- **Cloudflare Workers** — hosting + auto-rebuild on git push or Sanity publish
- **GitHub** — source control

## Project layout

```
balance-physio/
├── docs/                     # You are here
├── public/                   # Static assets (images, logo, videos)
│   ├── about/                # About page photos
│   ├── lift/                 # LIFT service page photos
│   ├── placeholders/         # Default image set for service pages
│   └── sports-physio/        # Sports physio photos
├── src/
│   ├── components/           # Reusable Astro components
│   ├── data/
│   │   └── team.js           # Static team roster (27 members with bios)
│   ├── layouts/
│   │   └── Layout.astro      # Shared page wrapper (head, header, footer, styles)
│   ├── lib/
│   │   └── sanity.js         # Sanity client + image URL builder
│   └── pages/                # Each file = a URL
├── studio/                   # Sanity Studio config (CMS admin)
└── package.json
```

## Docs index

- [architecture.md](architecture.md) — how the codebase is organised
- [content-model.md](content-model.md) — where content lives, how to edit it
- [deployment.md](deployment.md) — hosting, webhooks, CI/CD
- [decisions.md](decisions.md) — key choices and why they were made
- [dev-handover.md](dev-handover.md) — onboarding a new developer
- [todo.md](todo.md) — known outstanding items
