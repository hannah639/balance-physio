# Handoff — 2026-09-10

| Field | Value |
| --- | --- |
| **Date** | 2026-09-10 |
| **GitHub username** | Unknown. `git config user.name` is `Dave` (`dave@hmdg.co.uk`); the remote `https://github.com/hannah639/balance-physio.git` is owned by `hannah639`. Neither is confirmed to be the committing GitHub account. |
| **AI agent used** | Claude Code (Opus 5, 1M context) |
| **Repository** | `hannah639/balance-physio` |
| **Branch** | `team-updates`, cut from `main` at `bf7ff9d` (level with `origin/main`; `git pull` reported "Already up to date") |

## Objective

Silence the one actionable warning printed by `npm run dev`:

```
[WARN] [vite] The default export of @sanity/image-url has been deprecated.
Use the named export `createImageUrlBuilder` instead.
```

The branch was created for team-page work; this fix was done first because the
warning fires on every dev start and every build, and hides genuine warnings
behind noise.

## Files created

| File | Purpose |
| --- | --- |
| `handoffs/handoff-astro-2026-09-10.md` | This log. |

## Files modified

| File | Change |
| --- | --- |
| `src/lib/sanity/client.ts` | Two lines. L13 `import imageUrlBuilder from '@sanity/image-url'` → `import {createImageUrlBuilder} from '@sanity/image-url'`; L54 `imageUrlBuilder(sanityClient)` → `createImageUrlBuilder(sanityClient)`. |
| `handoffs/handoff-astro.md` | §7 `client.ts` row: added `urlFor` to its exports (it was omitted) and recorded that the named `createImageUrlBuilder` export is the one to use. |

## Files removed

None.

## The warning — what it was, and why the fix is exactly two lines

`@sanity/image-url` 2.1.1 ships both forms. Read from
`node_modules/@sanity/image-url/lib/index.js`:

```js
import { defineDeprecated, createImageUrlBuilder } from "./_chunks-es/compat.js";
const deprecatedcreateImageUrlBuilder = defineDeprecated(createImageUrlBuilder);
export { createImageUrlBuilder, deprecatedcreateImageUrlBuilder as default };
```

The default export is the *same function* wrapped in `defineDeprecated`, which
does nothing but log. `lib/index.d.ts:37` carries the matching
`@deprecated Use the named export createImageUrlBuilder instead of the default
export`. So the named export is not a new API to migrate to — it is the same
callable, minus the warning wrapper. Behaviour of `urlFor()` is unchanged.

`src/lib/sanity/client.ts` was the only importer: `grep -rn "image-url" src/`
returns one line. No other module, component or page touches the package.

## Components added / schemas added or updated / wired and fetched fields

None. No component, template, CSS, GROQ query, loader or schema was touched.

## Bug fixes

One, if a deprecation warning counts as a bug: the deprecated import path in
`client.ts`. Nothing was rendering wrongly — the wrapper still returned a working
builder — so this is a warning removal and a guard against the day the default
export is deleted, not a rendering fix.

## Refactoring / performance / SEO / accessibility

- **Refactoring:** none beyond the two-line import change.
- **Performance:** unchanged. Same builder function, same URLs, same request
  count. Confirmed by the identical Sanity CDN URL counts below.
- **SEO:** unchanged. `dist/client/sitemap.xml` still lists **103** URLs;
  page count still **114**.
- **Accessibility:** untouched. No markup change.

## Breaking changes

None.

## Testing / QA

| Check | Result |
| --- | --- |
| `npm run dev` | Running throughout on `http://localhost:4321`. After the edit Vite reloaded the module and served `/` → **200** and `/news-events/` → **200** with **no deprecation warning** in the log. |
| `npm run build` | Succeeded, server built in 61.19 s, no errors. The "file not created, response body was empty" lines are the 193 legacy redirects and are pre-existing. |
| Build warnings after the fix | Re-ran the build filtering for `deprecat|WARN|error`: the only remaining line is `[vite] Default inspector port 9229 not available, using 9230 instead`, which is unrelated to this change. The `@sanity/image-url` warning is gone. |
| Page count | **114** `index.html` under `dist/client` — matches `handoff-astro.md` §1. |
| Sitemap | **103** `<loc>` entries — matches the 2026-09-08 log. |
| Images still resolve through `urlFor()` | **1 097** `cdn.sanity.io/images/…` URLs across the built HTML, **346** distinct, all under project `3po4zrtd/production`. A broken builder would have produced zero. |
| Content of the two `/news-events/` cards | Not re-verified this session; the page returns 200 and no markup changed. |
| **Browser / visual QA** | **NOT DONE.** No screenshot or browser-automation tool in this session, as on 2026-09-03, -09-04 and -09-08. Every claim above comes from built HTML, dev-server logs and HTTP status codes. |
| Responsive / keyboard / screen reader / real device | **Not tested.** Not applicable to this change — no markup or CSS was touched. |

### The other dev-server warning was deliberately left alone

`npm run dev` also prints `[WARN] [content] Content config not loaded`. There is
no `src/content/` directory and the project uses no content collections — all
content comes from Sanity at build time. The warning is Astro noting the absence,
not a fault. Adding a stub `src/content/config.ts` purely to silence it would
introduce an unused subsystem, so it stays.

## Known issues

Nothing new. Every open item from `handoff-astro-2026-09-08.md` is untouched and
still open:

1. The `/news-events/` sponsorship PDF is a draft (`/Title` "Balance report draft").
2. St Paul's Opera poster is 435 × 664 px — soft on a 2× display.
3. **Neither event card has ever been viewed in a browser**, at any width.
4. `public/news/wellness-event-2026.{jpg,webp,avif}` (517 KB) still orphaned.
5. `scripts/gen-image-variants.sh` still does not run on this machine.
6. Pre-existing items from `handoff-astro-2026-08-05.md` — two Sanity project IDs,
   stale `docs/deployment.md`, hard-coded `workers.dev` form redirects,
   un-rotated deploy hook, unresolved `studio/` folder.

`handoff-astro.md`'s "Last verified" header still reads **28 July 2026** and was
deliberately not advanced. This session verified the page count, the sitemap
count, the dependency version and the Sanity client — not the whole document.

## Remaining tasks

- **Nothing has been committed or pushed this session.** The working tree holds
  this fix plus the two handoff files. `team-updates` is still at `bf7ff9d`.
- The team work the branch was cut for has not been started.
- Everything under Known issues above, all carried from 2026-09-08.

## Recommendations

- Commit this on `team-updates` before starting the team work, so a one-line
  dependency fix does not end up mixed into a content change.
- When any dependency next prints a deprecation warning, check whether the named
  export is the same function first — here it was, which is what made the fix
  safe rather than a migration.
