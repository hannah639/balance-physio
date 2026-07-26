/**
 * /robots.txt — generated from Sanity (SEO Settings → Robots.txt).
 *
 * Replaces the former static public/robots.txt, which could only be changed by
 * a developer. Editors now own it in the Studio, and the Studio's
 * RobotsTxtEditor previews this exact endpoint.
 *
 * Precedence:
 *   1. Site Settings → "Discourage search engines"  — hard override, blocks all
 *   2. SEO Settings → Robots.txt content            — used verbatim when set
 *   3. Built-in default                             — allow all + sitemap
 *
 * Prerendered at build time, so it costs nothing at runtime and is served as a
 * plain static file by Cloudflare exactly as the old file was.
 */
import type {APIRoute} from 'astro'
import {getGlobals} from '../lib/sanity/globals'
import {getRobotsTxt} from '../lib/sanity/seo'

export const prerender = true

export const GET: APIRoute = async () => {
	const g = await getGlobals()
	const body = await getRobotsTxt(g.siteUrl, g.discourageSearchEngines)

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			// Same caching posture as the static file it replaces.
			'Cache-Control': 'public, max-age=3600',
		},
	})
}
