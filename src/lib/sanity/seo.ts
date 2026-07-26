/**
 * SEO helpers shared by the robots.txt, sitemap.xml and sitemap-status
 * endpoints. All of it runs at BUILD time (the endpoints are prerendered), so
 * nothing here touches the browser or affects runtime performance.
 */
import {getGlobals} from './globals'

/** Routes that must never appear in the sitemap or be indexed. */
const EXCLUDED = new Set(['/404/', '/thank-you/'])

/**
 * Every URL the site publishes, derived from the real Astro page files so the
 * sitemap can't drift from the routes that actually exist.
 *
 * `import.meta.glob` is resolved by Vite at build time — this is a static list
 * baked into the build, not a filesystem read at runtime (which would not work
 * on Cloudflare Workers).
 */
export function getStaticRoutes(): string[] {
	const files = import.meta.glob('/src/pages/**/*.astro', {eager: false})

	const routes = Object.keys(files)
		.map((file) =>
			file
				.replace('/src/pages', '')
				.replace(/\.astro$/, '')
				.replace(/\/index$/, '/'),
		)
		// Dynamic routes ([slug]) are expanded separately by their own data source.
		.filter((route) => !route.includes('['))
		.map((route) => (route.endsWith('/') ? route : `${route}/`))
		.filter((route) => !EXCLUDED.has(route))

	return [...new Set(routes)].sort()
}

/** Absolute, trailing-slashed URL for a path. */
export function absoluteUrl(siteUrl: string, path: string): string {
	const base = siteUrl.replace(/\/$/, '')
	const p = path.startsWith('/') ? path : `/${path}`
	return `${base}${p.endsWith('/') ? p : `${p}/`}`
}

/**
 * The robots.txt body.
 *
 * The global "Discourage search engines" switch wins over any custom content —
 * if an editor turns it on, we must not serve a robots.txt that invites
 * crawling, whatever the Robots.txt tab says.
 */
export async function getRobotsTxt(siteUrl: string, discourage: boolean): Promise<string> {
	const g = await getGlobals()
	const sitemapUrl = absoluteUrl(siteUrl, '/sitemap.xml').replace(/\/$/, '')

	if (discourage) {
		return [
			'# "Discourage search engines" is switched ON in Sanity → Site Settings.',
			'# Turn it off there to allow indexing.',
			'User-agent: *',
			'Disallow: /',
			'',
		].join('\n')
	}

	const custom = g.robotsTxt?.trim()
	if (custom) {
		// Make sure a Sitemap directive is present even if the editor omitted it.
		return /^\s*sitemap\s*:/im.test(custom) ? `${custom}\n` : `${custom}\n\nSitemap: ${sitemapUrl}\n`
	}

	return ['User-agent: *', 'Allow: /', '', `Sitemap: ${sitemapUrl}`, ''].join('\n')
}

export type SitemapEntry = {loc: string}

/** Every indexable URL, ready for sitemap.xml. */
export async function getSitemapEntries(): Promise<SitemapEntry[]> {
	const g = await getGlobals()
	// Nothing should be listed when the site is set to discourage indexing.
	if (g.discourageSearchEngines) return []

	const {team} = await import('../../data/team.js')
	const teamRoutes = (team as {slug: string}[]).map((m) => `/team/${m.slug}/`)

	const all = [...getStaticRoutes(), ...teamRoutes]
	return [...new Set(all)].sort().map((path) => ({loc: absoluteUrl(g.siteUrl, path)}))
}
