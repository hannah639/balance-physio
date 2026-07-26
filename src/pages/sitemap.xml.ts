/**
 * /sitemap.xml — generated from the site's real routes at build time.
 *
 * Replaces the hand-maintained public/sitemap.xml (106 lines), which had to be
 * edited by a developer whenever a page was added and could silently drift out
 * of sync with the actual routes.
 *
 * Respects Sanity → Site Settings → "Discourage search engines": when that is
 * on, the sitemap is emitted empty rather than advertising pages we're asking
 * crawlers to ignore.
 */
import type {APIRoute} from 'astro'
import {getSitemapEntries} from '../lib/sanity/seo'

export const prerender = true

export const GET: APIRoute = async () => {
	const entries = await getSitemapEntries()

	const body = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
		...entries.map((e) => `\t<url><loc>${e.loc}</loc></url>`),
		'</urlset>',
		'',
	].join('\n')

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600',
		},
	})
}
