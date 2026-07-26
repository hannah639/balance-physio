/**
 * Sanity client — Balance Physio (project 3po4zrtd).
 *
 * Replaces the old `src/lib/sanity.js`, which pointed at the abandoned project
 * `da13xw8y` and was imported by nothing.
 *
 * Connection values come from `.env` (see `.env.example`). None are PUBLIC_-
 * prefixed, so Astro keeps them server-only: these are read at BUILD time
 * during SSG, never in the browser. The read token must never reach the client
 * bundle.
 */
import {createClient} from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const projectId = import.meta.env.SANITY_PROJECT_ID
const dataset = import.meta.env.SANITY_DATASET ?? 'production'
const apiVersion = import.meta.env.SANITY_API_VERSION ?? '2025-02-19'

/**
 * NOTE ON THE READ TOKEN — deliberately not used here.
 *
 * The `production` dataset is PUBLIC, so published content reads fine
 * unauthenticated. Referencing `import.meta.env.SANITY_API_READ_TOKEN` would
 * make Vite statically inline the secret into the server bundle
 * (dist/server/chunks/*.mjs), shipping it inside the deployed Cloudflare Worker
 * artifact instead of keeping it a managed secret. Verified: with this client
 * token-free, `grep -r "<token>" dist/` returns nothing.
 *
 * SANITY_API_READ_TOKEN stays in .env for future draft/preview work. If drafts
 * are ever needed, create a SEPARATE server-only client for that path, read the
 * token from the Cloudflare runtime (`Astro.locals.runtime.env`) rather than
 * `import.meta.env`, and set `useCdn: false` + `perspective: 'drafts'`.
 */

/**
 * True when the project is configured. When false the whole Sanity layer is
 * skipped and the site renders from its hard-coded fallbacks — so a missing
 * .env degrades to the pre-CMS site rather than a build failure.
 */
export const isSanityConfigured = Boolean(projectId)

export const sanityClient = isSanityConfigured
	? createClient({
			projectId,
			dataset,
			apiVersion,
			// Must stay false: the CDN caches responses for ~60s, which makes a
			// publish look like it "didn't take" on an immediately-following build.
			useCdn: false,
			perspective: 'published',
		})
	: null

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null

/**
 * Build a Sanity CDN image URL. Returns null when Sanity isn't configured or
 * the source is empty, so callers can fall back to a local asset.
 */
export function urlFor(source: unknown) {
	if (!builder || !source) return null
	return builder.image(source as never)
}
