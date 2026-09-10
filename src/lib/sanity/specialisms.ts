/**
 * Turns a team member's `specialistAreas` label into a link to the page that
 * covers it.
 *
 * `specialistAreas` is an array of FREE-TEXT strings in the CMS, not an array
 * of references, so there is no document to hand to `resolveHref()`. This
 * module bridges the two without storing a URL anywhere:
 *
 *     label  →  slug   (the alias table below, or the label slugified)
 *     slug   →  href   (resolveHref — still the only thing that knows routes)
 *
 * The slug is then checked against the ROUTE FILES that actually build the
 * pages — `src/pages/condition/*.astro` and `src/pages/service/*.astro` —
 * rather than against the CMS. Condition and service pages are static files,
 * one per document, so a document can exist without a page; checking the
 * documents instead would let a specialism link at a URL that 404s. This is
 * the link-side version of the sitemap rule in handoff-astro.md §8: the source
 * you link from must match the source that generates the page.
 *
 * A label that resolves to nothing renders as plain text, not a dead link.
 * Specialisms are not required to have a page — a technique or a class may not.
 */
import {resolveHref} from './routes'

/**
 * Route files, resolved by Vite at build time. Keys only — the modules are
 * never imported, so nothing is added to the bundle.
 */
function routeSlugs(modules: Record<string, unknown>): Set<string> {
	return new Set(
		Object.keys(modules).map((path) => (path.split('/').pop() ?? '').replace(/\.astro$/, '')),
	)
}

const CONDITION_SLUGS = routeSlugs(import.meta.glob('/src/pages/condition/*.astro'))
const SERVICE_SLUGS = routeSlugs(import.meta.glob('/src/pages/service/*.astro'))

/**
 * Labels whose wording does not slugify to their page.
 *
 * Only for genuine mismatches — anything that already matches its slug
 * ("Neck pain" → `neck-pain`) is resolved automatically and must NOT be listed
 * here. Keys are compared normalised (lowercased, punctuation stripped), so
 * "Women's Pelvic Health" and "womens pelvic health" both hit the same entry.
 *
 * Values are SLUGS, never URLs.
 */
const ALIASES: Record<string, {type: 'condition' | 'service'; slug: string}> = {
	// The page reads "Back Pain Treatment in Clapham" but lives at
	// /condition/lower-back-pain/, so no wording of it slugifies to its route.
	'spinal and lower back pain': {type: 'condition', slug: 'lower-back-pain'},
	'lower back pain': {type: 'condition', slug: 'lower-back-pain'},
	'back pain': {type: 'condition', slug: 'lower-back-pain'},
	// "Shoulder Pain Treatment in Clapham" at /condition/shoulder-specialist-physiotherapy/.
	'shoulder pain': {type: 'condition', slug: 'shoulder-specialist-physiotherapy'},
	// "Knee & ACL Injuries Treatment in Clapham" at /condition/acl-knee-specialist-london/.
	'knee pain': {type: 'condition', slug: 'acl-knee-specialist-london'},
	'knee injuries and acl': {type: 'condition', slug: 'acl-knee-specialist-london'},
	// The service page leads on the clinic location, which no label will contain.
	'soft tissue and sports massage': {type: 'service', slug: 'sports-massage-clapham-soft-tissue-therapy'},
	'sports massage': {type: 'service', slug: 'sports-massage-clapham-soft-tissue-therapy'},
	'soft tissue therapy': {type: 'service', slug: 'sports-massage-clapham-soft-tissue-therapy'},
}

/** Lowercase, drop apostrophes and punctuation, collapse whitespace. */
function normalise(label: string): string {
	return label
		.toLowerCase()
		.replace(/[\u2018\u2019']/g, "'")
		.replace(/&/g, 'and')
		.replace(/[^a-z0-9']+/g, ' ')
		.trim()
}

/**
 * Slug spellings to try for a label, most literal first.
 *
 * Route slugs are not consistent about connecting words: the site has
 * /condition/balance-and-dizziness/ (keeps "and") next to
 * /service/strength-conditioning/ and
 * /condition/childrens-neurological-developmental/ (both drop it). Rather than
 * an alias per case, try the literal slug and then the same slug with "and"
 * removed. Both are exact matches against a real route file, so the second
 * attempt cannot invent a link — it either hits a page or it does not.
 */
function slugCandidates(label: string): string[] {
	const words = normalise(label)
		.replace(/'/g, '')
		.split(/\s+/)
		.filter(Boolean)

	const literal = words.join('-')
	const withoutAnd = words.filter((w) => w !== 'and').join('-')

	return withoutAnd && withoutAnd !== literal ? [literal, withoutAnd] : [literal]
}

export type Specialism = {
	/** The label as the CMS holds it, trimmed. */
	label: string
	/** The page it covers, or null when no page does. */
	href: string | null
}

/**
 * Resolve one label. Alias table first, then each slug spelling from
 * slugCandidates() against the condition routes and then the service routes.
 *
 * Throws when an ALIASES entry points at a route that does not exist — that is
 * a typo in this file, not a content problem, and a silent dead link is worse
 * than a failed build.
 */
export function resolveSpecialism(rawLabel: string): Specialism {
	const label = rawLabel.trim()
	if (!label) return {label, href: null}

	const alias = ALIASES[normalise(label)]
	if (alias) {
		const known = alias.type === 'condition' ? CONDITION_SLUGS : SERVICE_SLUGS
		if (!known.has(alias.slug)) {
			throw new Error(
				`[specialisms] alias "${label}" points at ${alias.type} "${alias.slug}", ` +
					`but src/pages/${alias.type}/${alias.slug}.astro does not exist. ` +
					`Fix the slug in src/lib/sanity/specialisms.ts.`,
			)
		}
		return {label, href: resolveHref({_type: alias.type, slug: alias.slug})}
	}

	for (const slug of slugCandidates(label)) {
		if (CONDITION_SLUGS.has(slug)) return {label, href: resolveHref({_type: 'condition', slug})}
		if (SERVICE_SLUGS.has(slug)) return {label, href: resolveHref({_type: 'service', slug})}
	}

	// No page covers this label. Rendered as plain text by the template.
	return {label, href: null}
}

/** Resolve a whole `specialistAreas` array, dropping empty entries. */
export function resolveSpecialisms(labels: readonly string[] | null | undefined): Specialism[] {
	if (!Array.isArray(labels)) return []
	return labels
		.filter((l): l is string => typeof l === 'string' && l.trim().length > 0)
		.map(resolveSpecialism)
}
