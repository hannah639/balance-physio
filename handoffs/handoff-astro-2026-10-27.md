# Handoff — 2026-10-27

| Field | Value |
| --- | --- |
| **Date** | 2026-10-27 |
| **GitHub username** | Unknown. `git config user.name` is `Dave` (`dave@hmdg.co.uk`); the remote `https://github.com/hannah639/balance-physio.git` is owned by `hannah639`. Neither is confirmed to be the committing GitHub account. |
| **AI agent used** | Claude Code (Opus 5, 1M context) |
| **Repository** | `hannah639/balance-physio` |
| **Branch** | `conversation-id`, cut from `main` at `6f18dad` (level with `origin/main`) |

## Objective

Add the Google Ads conversion ID `17788943816`, supplied as the environment
variable `PUBLIC_ADS_CONVERSION_ID`.

## Files modified

| File | Change |
| --- | --- |
| `src/layouts/Layout.astro` | Reads `PUBLIC_ADS_CONVERSION_ID`, normalises it to the `AW-` form, passes it to `CookiesBanner`. |
| `src/pages/index.astro` | The same, because the homepage builds its own `<html>` and does not use `Layout.astro`. |
| `src/components/CookiesBanner.astro` | Accepts `adsId` and configures it **inside the consented loader**, sharing one `gtag.js` load with GA. |
| `.env.example` | Documents the variable, its PUBLIC_ prefix, and the Cloudflare requirement. |
| `.env` | **Not committed** — git-ignored. The real value was written locally so the dev server and local builds pick it up. |

## Where the value lives, and why not `site-settings.js`

GA and GTM are hard-coded in `src/data/site-settings.js`, which §11 calls the
only source of those IDs. This one is **not** there, because the brief named an
environment variable. Both patterns now exist side by side in `Layout.astro`,
which is worth knowing before someone goes looking for the ads ID next to the
other two and does not find it.

The `PUBLIC_` prefix is correct rather than a slip. Astro exposes `PUBLIC_*` to
the browser bundle, which is exactly where a conversion tag has to run; a
conversion ID is a public identifier. This is the opposite of
`SANITY_API_READ_TOKEN`, which must never gain the prefix — see the note in
`src/lib/sanity/client.ts`.

Input is normalised, so `17788943816` and `AW-17788943816` both work:

```js
const adsId = rawAdsId ? (rawAdsId.startsWith('AW-') ? rawAdsId : `AW-${rawAdsId}`) : '';
```

## It fires only after cookie consent

GA and GTM already load from inside `loadAnalytics()` in `CookiesBanner.astro`,
which runs only once a visitor accepts. **The ads tag was put in the same
place.** A Google Ads conversion tag is not an essential cookie, and firing it on
page load would have undercut the consent banner the site already shows. There is
no `gtag.js` tag in any page's `<head>`; the script is injected at consent time.

### One `gtag.js` load, two products

The GA branch was widened rather than duplicated:

```js
if (gaId || adsId) {
  // load gtag.js once, using whichever id is present
  gtag('js', new Date());
  if (gaId) gtag('config', gaId);
  if (adsId) gtag('config', adsId);
}
```

Loading `gtag.js` a second time for the ads id would have double-counted
pageviews in GA. One library, one `config()` per product, which is Google's own
documented pattern.

## The homepage nearly shipped without it

The first build put the tag on **116 of 117** pages. The missing one was `/`.

`src/pages/index.astro` builds its **own `<html>`** instead of using
`Layout.astro` (§6 of the master file records this), so it carries its own copy
of the analytics wiring — and adding the ads id to `Layout.astro` did not reach
it. The homepage is the site's highest-traffic page and the most likely landing
page for a paid campaign, so this would have been the worst possible page to
miss.

It was caught by counting pages in the built output rather than by checking one
page and assuming. `index.astro` now has the same three lines, with a comment on
both sides pointing at the other.

> **Anything added to `Layout.astro`'s analytics block has to be added to
> `index.astro` too.** That is now stated in §12 of the master file.

## Components / schemas / wired fields / breaking changes

None. No component was added, no Sanity schema or query was touched, and
**nothing was written to Sanity**. No breaking changes — `adsId` defaults to `''`
and an unset variable simply means no tag.

## Performance / SEO / accessibility

- **Performance:** no change for a visitor who has not consented. After consent
  the ads id adds a `config()` call to a `gtag.js` request that GA already makes,
  so there is no additional network request.
- **SEO:** no markup, route, sitemap or `<head>` change. Page count unchanged.
- **Accessibility:** nothing rendered, nothing to test.

## Testing / QA

| Check | Result |
| --- | --- |
| `npm run build` | Succeeded, no errors. |
| Page count | **117**, unchanged. |
| Tag coverage | **117 / 117** pages carry `adsId = "AW-17788943816"` — up from 116/117 before the homepage fix. |
| Normalisation | `.env` holds the bare `17788943816`; the built HTML shows `AW-17788943816`. |
| **Consent gating** | No `<script src=".../gtag/js">` in any page `<head>`, and the `gtag('config', adsId)` call sits **inside** `loadAnalytics()`. Verified on the homepage and on a `Layout.astro` page, since the two have separate wiring. |
| Single library load | `gtag/js?id=' + (gaId \|\| adsId)` — one request serving both. |
| Secrets | `.env` is git-ignored (`git check-ignore` confirms); only the PUBLIC_ var is new. `SANITY_API_READ_TOKEN` remains empty and unused. |
| **Browser / live conversion test** | **NOT DONE.** No browser tooling here. The tag is present and correctly gated in the HTML; **nobody has accepted the banner and watched a conversion register in Google Ads.** That is the only test that proves it works end to end. |

## Known issues

1. ~~**The Cloudflare build needs `PUBLIC_ADS_CONVERSION_ID` set.**~~ **Done —
   the owner reported on 2026-10-28 that the variable has been added in
   Cloudflare → Workers & Pages → `balancephysio` → Settings → Environment
   variables.** Recorded as reported; it could not be verified from this repo,
   which has no Cloudflare access. The value is read at **build** time, so the
   first build after it was added is the one that carries the tag — a deploy that
   ran before it will still be serving pages without it.
2. **Not verified against Google Ads.** Presence in the HTML is not proof the
   conversion registers. Someone should accept cookies on the deployed site and
   confirm with the Google Tag Assistant or a real conversion.
3. **No conversion *event* is sent.** This change configures the account id, which
   covers remarketing and auto-tagged page views. A specific conversion action —
   a booking, a form submission — needs its own `gtag('event', 'conversion', …)`
   call with the conversion label, which was not supplied and was not invented.
4. **Two patterns for analytics IDs now coexist** (see above).
5. Open items from 2026-09-30 are unchanged: no `personal-training` Sanity
   document, so its menu item remains desktop-only; Alice Croucher and Agur
   Arrien still have no photos; `/about-us/` still says "27 professionals".

## Remaining tasks

- ~~Set `PUBLIC_ADS_CONVERSION_ID` in Cloudflare~~ — done 2026-10-28. **A
  rebuild is still needed** for it to take effect, and this change is not yet
  merged to `main`, so the next deploy covers both.
- Confirm a real conversion registers once deployed (issue 2).
- Supply the conversion label if a specific action should be tracked (issue 3).
- **Not committed and not pushed.**

## Recommendations

- Count pages, not check one. The homepage's separate `<html>` is a standing trap
  for anything sitewide, and one spot-check would have passed while the most
  important page was missing the tag.
- When adding a `PUBLIC_` variable, add the Cloudflare entry at the same time.
  A build-time variable that is absent fails silently and looks identical to a
  working deploy.
