# Handoff — 2026-10-28

| Field | Value |
| --- | --- |
| **Date** | 2026-10-28 |
| **GitHub username** | Unknown. `git config user.name` is `Dave` (`dave@hmdg.co.uk`); the remote `https://github.com/hannah639/balance-physio.git` is owned by `hannah639`. |
| **AI agent used** | Claude Code (Opus 5, 1M context) |
| **Branch** | `conversation-id`, cut from `main` at `6f18dad` |

## Objective

Follow-up to the Google Ads work of 2026-10-27: confirm deployment state, record
the conversion labels the owner supplied, and establish what the site needs to
provide for them.

## No code was written this session

The conversion labels are marked **"GTM setup only"** by the owner, and that is
where they belong — the Google Ads conversion tags are built in the GTM web UI
and the labels pasted in there. **Hardcoding `gtag('event', 'conversion', …)`
calls for them in the site would fire each conversion twice**, once from the page
and once from GTM. Nothing was added.

The session was therefore: verification, and one significant finding.

## Conversion labels (for the GTM container, not this repo)

Recorded here so they are not lost. Account: `AW-17788943816`.

| Conversion name | Label | `send_to` |
| --- | --- | --- |
| Contact Form Submission | `xmFuCPjMkagcEMj7tqJC` | `AW-17788943816/xmFuCPjMkagcEMj7tqJC` |
| Email Button Click | `BV2lCNCo-KccEMj7tqJC` | `AW-17788943816/BV2lCNCo-KccEMj7tqJC` |
| Book Now Button Clicks | `PidwCPehh-MbEMj7tqJC` | `AW-17788943816/PidwCPehh-MbEMj7tqJC` |
| Calls From Website | `WwLuCMP-79IbEMj7tqJC` | `AW-17788943816/WwLuCMP-79IbEMj7tqJC` |

GTM container is `GTM-THZKT967` (`src/data/site-settings.js`).

## What the site offers each trigger

Checked against the built output and the live site, not assumed.

| Conversion | Trigger surface | State |
| --- | --- | --- |
| Email Button Click | `href="mailto:admin@balancephysio.com"` | Present, 3 occurrences in source, sitewide via header/footer. A GTM click trigger on `Click URL contains mailto:` will work. |
| Book Now Button Clicks | `go.mindbodyonline.com` links — **5** on the homepage, **6** on `/contact-us/` | Present. Trigger on `Click URL contains go.mindbodyonline.com`. The URL comes from Sanity → Booking Links → `primaryUrl`, so it can change in the CMS; trigger on the domain, not the full URL. |
| Calls From Website | `href="tel:…"` — 3 distinct numbers (`02076272308`, and two mobiles) | Present. Trigger on `Click URL contains tel:`. |
| **Contact Form Submission** | thank-you page | **Broken for attribution — see below.** |

## The form conversion will not attribute

Both web3forms forms — `src/pages/contact-us.astro:53` and
`src/pages/clinic/clapham.astro:44` — carry:

```html
<input type="hidden" name="redirect" value="https://balance-physio.hannah-9e0.workers.dev/thank-you" />
```

**Confirmed live**, not just in the repo: `https://www.balancephysio.com/contact-us/`
serves that exact value today.

After submitting, the visitor is sent to **`balance-physio.hannah-9e0.workers.dev`
— a different domain from `balancephysio.com`**. Google Ads attribution depends
on the click id and cookies set on the original domain, and none of them exist on
`workers.dev`. A thank-you-page trigger there has nothing to attribute against,
so **Contact Form Submission will record nothing** even once GTM is configured
correctly.

Two lesser faults in the same string:

- The visitor sees a `workers.dev` URL after contacting the clinic, which reads
  as broken.
- The path omits the trailing slash. `trailingSlash: 'always'`, so
  `.../thank-you` returns **307** before resolving, while
  `https://balancephysio.com/thank-you/` returns **200** directly.

**Fixed later the same day, on the owner's instruction.** Rather than hardcode
the URL twice, both forms now derive it from `settings.siteUrl`:

```js
const formRedirect = `${settings.siteUrl}/thank-you/`;
```

So the two forms cannot disagree with each other, and neither can drift from the
live domain again. Each carries a comment explaining why, so it does not get
"tidied" back into a literal. Both files now import `site-settings.js`, which
neither did before.

Verified in the built output: both forms redirect to
`https://balancephysio.com/thank-you/`, **zero** pages contain
`hannah-9e0.workers.dev`, and `/thank-you/` exists. Both `balancephysio.com` and
`www.balancephysio.com` serve it with a **200** and no redirect hop, so the
visitor lands on the origin that set the ad cookies.

This is the same item listed in `handoff-astro-2026-08-05.md` as "hard-coded
workers.dev form redirects". It has stopped being cosmetic now that a paid
campaign depends on it.

## Consent gating reduces reported conversions

GTM loads from inside `loadAnalytics()` in `CookiesBanner.astro`, after the
visitor accepts cookies. **All four conversions therefore fire only for
consenting visitors.** That is the correct privacy behaviour and matches GA, but
Google Ads will report fewer conversions than actually occur. Worth knowing
before the numbers are judged against spend.

## Deployment state

| Check | Result |
| --- | --- |
| `PUBLIC_ADS_CONVERSION_ID` in Cloudflare | Added by the owner 2026-10-28. Recorded as reported — not verifiable from this repo. |
| Tag live on `balancephysio.com` | **No.** Fetched the production homepage and `/service/personal-training/`: `AW-17788943816` absent from both, while the existing GA id `G-B8FXY93QVZ` is present. |
| Why | **The code is not on `main`.** `origin/main` is still `6f18dad`; the 2026-10-27 changes are uncommitted on `conversation-id`. A Cloudflare rebuild with the variable set would still ship no tag, because the code that reads it is not in the branch being built. |

The 30 September work *is* live (`/service/personal-training/` returns 200), so
the deploy pipeline itself is healthy.

## Files modified

| File | Change |
| --- | --- |
| `handoffs/handoff-astro-2026-10-27.md` | Known issue 1 and its task struck through — Cloudflare variable recorded as added. |
| `handoffs/handoff-astro-2026-10-28.md` | This log. |
| `handoffs/handoff-astro-2026-07-28.md` | **Deleted** — rolling retention. This is the 11th dated log, so the oldest goes (CLAUDE.md §retention / master §16). |

Plus, after the owner approved the fix:

| File | Change |
| --- | --- |
| `src/pages/contact-us.astro` | Imports `site-settings.js`; form redirect derived from `siteUrl`. |
| `src/pages/clinic/clapham.astro` | The same. |

**Nothing was written to Sanity.**

## Known issues

1. ~~**The contact form redirect breaks its own conversion.**~~ Fixed 2026-10-28
   (above). Untested end to end: nobody has submitted the live form and watched
   the conversion register — only the built HTML has been checked.
2. **Nothing is deployed.** The ads tag is still uncommitted.
3. **No conversion fires from the site itself** — by design. Everything depends
   on the GTM container being configured with the four labels. If GTM is not set
   up, adding the account id achieves remarketing and page views only.
4. **Possible duplicate remarketing hits.** The site now calls
   `gtag('config', 'AW-17788943816')` directly *and* GTM may carry its own Google
   Ads remarketing tag for the same account. Conversions will not double (the
   site sends no conversion events) but page-level remarketing might. Worth a
   look in GTM; harmless enough to leave if the container has no separate
   remarketing tag.
5. Open items from 2026-09-30 are unchanged.

## Remaining tasks

- ~~Decide on the form redirect~~ — done. After deploying, submit the live form
  once and confirm the conversion registers.
- Commit, merge to `main`, push. That deploy picks up both the code and the
  Cloudflare variable.
- Configure the four conversion tags in GTM `GTM-THZKT967` with the labels above.
- After deploying, accept cookies on the live site and confirm `AW-17788943816`
  fires in Google Tag Assistant.

## Recommendations

- Trigger the Book Now conversion on the **domain** `go.mindbodyonline.com`
  rather than the full URL: that link comes from Sanity and an editor can change
  it without anyone telling GTM.
- Fix the redirect before launching the campaign rather than after. Conversions
  missed in the first weeks cannot be backfilled, and the form is the one
  conversion with genuine intent behind it.
