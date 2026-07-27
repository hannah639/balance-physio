# Deployment

## How deploys happen

There are two paths that trigger a live-site rebuild:

1. **`git push` to `main`** — Cloudflare detects the push, rebuilds, deploys. Takes ~60-90s.
2. **Publishing content in Sanity Studio** — Sanity webhook pings Cloudflare, which triggers a fresh build pulling the latest Sanity data.

Both paths deploy the SAME codebase — the difference is just what triggered the build.

## The full pipeline

```
Developer                                    Cloudflare
─────────                                    ──────────
git push ──────────────────────────────► GitHub ──► webhook ──► Build ──► Deploy
                                                                  │
Client editor                                                     │
─────────                                                         │
Sanity Studio ─► Publish ──► Sanity webhook ──► Cloudflare deploy hook
```

## Cloudflare setup

- Account: `Hannah@hmdg.co.uk`
- Project: `balance-physio` (in Workers & Pages)
- Build command: `npm run build`
- Build output: `dist/`
- Branch: `main`
- Deploy hook: **not recorded here.** The URL is an unauthenticated secret — anyone
  who can POST to it can trigger a production build — so it does not belong in a
  file that everyone with repo access can read.

  Find it in Cloudflare → Workers & Pages → `balance-physio` → Settings → Builds →
  Deploy hooks. Treat it like a password: if it has been shared or committed, delete
  the hook and create a new one, then update the Sanity webhook with the new URL.

## Sanity webhook config

In [sanity.io/manage](https://sanity.io/manage) → balance-physio project → API → Webhooks:

- **Name:** Cloudflare rebuild
- **URL:** the Cloudflare deploy hook URL above
- **Dataset:** production
- **Triggers:** Create / Update / Delete
- **HTTP method:** POST

When someone publishes anything in Sanity Studio, this fires and Cloudflare rebuilds within ~60s.

## Sanity Studio hosting

The Studio itself is deployed separately to `https://balance-physio.sanity.studio`. To redeploy the Studio (only needed when schemas change):

```bash
cd studio
npx sanity deploy
```

Pick the existing hostname `balance-physio` when prompted.

## Critical config: `useCdn: false`

In `src/lib/sanity.js`:

```js
export const sanityClient = createClient({
    projectId: 'da13xw8y',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: false,   // ← must stay false
})
```

`useCdn: true` caches Sanity responses for ~60s. This was the cause of an earlier bug where publishing in Studio didn't update the live site — the build was fetching stale cached data. Keep it `false` for static builds.

## Sanity project details

- Project ID: `da13xw8y`
- Dataset: `production`
- Studio URL: https://balance-physio.sanity.studio
- Manage URL: https://sanity.io/manage/project/da13xw8y

## Local dev

```bash
cd balance-physio
npm install
npm run dev
# → open http://localhost:4321
```

The dev server has hot-reload. Editing any file updates the browser automatically.

For the Sanity Studio:

```bash
cd studio
npm install
npm run dev
# → open http://localhost:3333
```

## Checking a deploy

1. Go to [Cloudflare dashboard](https://dash.cloudflare.com) → Workers & Pages → balance-physio → Deployments
2. Look for the latest deployment — green tick = success
3. Click into it to see build logs if something failed

## Rolling back

In Cloudflare Deployments tab, find a previous working version and click "Rollback to this deployment". The old version goes live within seconds.
