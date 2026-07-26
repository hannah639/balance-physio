/**
 * The single place that turns a Sanity document into a website URL.
 *
 * Menu items store a REFERENCE, never a URL — so this map is the only thing
 * that knows the site's route structure. Anything that needs a link (header,
 * footer, related content, breadcrumbs) resolves it through here, which means
 * a route can only ever change in one place.
 *
 * These are the routes that ALREADY exist in the project; nothing here invents
 * or changes a URL structure.
 */
export const ROUTE_PREFIX: Record<string, string> = {
	page: '/',
	service: '/service/',
	condition: '/condition/',
	whoWeHelp: '/who-we-help/',
	clinicLocation: '/clinic/',
	// NOTE: the live route is /team/<slug>/ (src/pages/team/[slug].astro).
	// The brief said /meet-the-team/<slug>/, but /meet-the-team/ is the listing
	// page, and the established URL structure wins.
	teamMember: '/team/',
	blog: '/blog/',
}

/** Singletons live at a fixed path and have no slug. */
export const FIXED_ROUTES: Record<string, string> = {
	homepage: '/',
	pricing: '/pricing/',
	// General FAQs owns /faqs/ outright — there is no `page` document for it.
	generalFaqs: '/faqs/',
}

/**
 * Resolve a document to its URL. Returns null when the link can't be built —
 * missing document, no slug, unknown type — so callers can drop the item
 * instead of rendering a broken href.
 */
export function resolveHref(doc: {_type?: string | null; slug?: string | null} | null | undefined): string | null {
	if (!doc?._type) return null

	const fixed = FIXED_ROUTES[doc._type]
	if (fixed) return fixed

	const prefix = ROUTE_PREFIX[doc._type]
	if (!prefix || !doc.slug) return null

	// trailingSlash: 'always' is enforced in astro.config.mjs.
	return `${prefix}${doc.slug}/`
}

/** True when `href` is the page currently being rendered. */
export function isCurrent(href: string | null, pathname: string): boolean {
	if (!href) return false
	const norm = (p: string) => (p.endsWith('/') ? p : `${p}/`)
	return norm(href) === norm(pathname)
}
