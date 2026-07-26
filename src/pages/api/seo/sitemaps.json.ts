/**
 * /api/seo/sitemaps.json — status feed consumed by the Sanity Studio's
 * SitemapViewer component (SEO Settings → Sitemap.xml tab).
 *
 * The Studio component already expected this endpoint
 * (schemaTypes/components/SitemapViewer.tsx fetches
 * `${ASTRO_BASE_URL}/api/seo/sitemaps.json`) but it had never been built on the
 * Astro side, so the tab could not show anything. This implements that
 * contract: the list of sitemaps and the URLs each contains.
 *
 * Prerendered — it reflects the last build, which is exactly what the sitemap
 * itself reflects.
 */
import type {APIRoute} from 'astro'
import {getGlobals} from '../../../lib/sanity/globals'
import {getSitemapEntries, absoluteUrl} from '../../../lib/sanity/seo'

export const prerender = true

export const GET: APIRoute = async () => {
	const g = await getGlobals()
	const entries = await getSitemapEntries()

	const payload = {
		generatedBy: 'astro',
		siteUrl: g.siteUrl,
		discourageSearchEngines: g.discourageSearchEngines,
		sitemaps: [
			{
				url: absoluteUrl(g.siteUrl, '/sitemap.xml').replace(/\/$/, ''),
				count: entries.length,
				urls: entries.map((e) => e.loc),
			},
		],
		robotsTxt: absoluteUrl(g.siteUrl, '/robots.txt').replace(/\/$/, ''),
	}

	return new Response(JSON.stringify(payload, null, 2), {
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			// The Studio runs on a different origin (localhost:3333).
			'Access-Control-Allow-Origin': '*',
			'Cache-Control': 'no-store',
		},
	})
}
