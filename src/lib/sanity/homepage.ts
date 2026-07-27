/**
 * Homepage content — one memoised build-time fetch shared by every section
 * component on `/`.
 *
 * The homepage is composed of nine sibling components rather than one page
 * template, so each reads this loader directly. The promise is cached, so the
 * build still makes a single request no matter how many of them ask.
 *
 * Links are resolved through resolveHref() from the referenced document's type
 * and slug, exactly like navigation — a curated card can never point at a URL
 * that no longer exists.
 */
import {sanityClient, isSanityConfigured} from './client'
import {HOMEPAGE_QUERY} from './queries'
import {resolveHref} from './routes'
import type {Img, RichBlock} from './pageContent'

export type Stat = {key: string; number: string; label: string}

export type ApproachStep = {
	key: string
	tag: string
	heading: string
	bullets: string[]
	icon: string | null
	featured: boolean
}

export type LinkCard = {key: string; label: string; href: string; image: Img | null}

export type Homepage = {
	heroEyebrow: string | null
	heroTagline: string | null
	heroSubtext: string | null

	aboutEyebrow: string | null
	aboutHeadingHighlight: string | null
	aboutHeading: string | null
	aboutLead: string | null
	aboutBody: string | null
	aboutStats: Stat[]
	aboutCtaLabel: string | null
	aboutCtaUrl: string | null

	activitiesEyebrow: string | null
	activitiesHeading: string | null
	activitiesIntro: string | null
	activitiesSlides: Img[]

	approachHeadingHighlight: string | null
	approachHeading: string | null
	approachIntro: string | null
	approachSteps: ApproachStep[]

	servicesVisible: boolean
	servicesEyebrow: string | null
	servicesHeadingHighlight: string | null
	servicesHeading: string | null
	servicesIntro: string | null
	servicesCards: LinkCard[]

	conditionsVisible: boolean
	conditionsEyebrow: string | null
	conditionsHeading: string | null
	conditionsIntro: RichBlock[]
	conditionsLinks: LinkCard[]

	teamVisible: boolean
	teamEyebrow: string | null
	teamHeading: string | null
	teamIntro: string | null

	facilitiesEyebrow: string | null
	facilitiesHeading: string | null
	facilitiesText: string | null
	facilitiesImage: Img | null
	facilitiesCtaLabel: string | null
	facilitiesCtaUrl: string | null

	quoteImage: Img | null
	quoteText: string | null
	quoteAttribution: string | null

	seoTitle: string | null
	seoDescription: string | null
}

function str(v: unknown): string | null {
	if (typeof v !== 'string') return null
	const t = v.trim()
	return t.length ? t : null
}

function img(o: unknown): Img | null {
	const v = o as {url?: unknown; alt?: unknown; width?: unknown; height?: unknown} | null
	const url = str(v?.url)
	if (!url) return null
	return {
		url,
		alt: str(v?.alt) ?? '',
		width: typeof v?.width === 'number' ? v.width : null,
		height: typeof v?.height === 'number' ? v.height : null,
	}
}

const imgs = (v: unknown): Img[] =>
	Array.isArray(v) ? v.map(img).filter((x): x is Img => x !== null) : []

const list = (v: unknown): string[] =>
	Array.isArray(v) ? v.map((x) => str(x)).filter((x): x is string => x !== null) : []

/**
 * A curated card. Cards whose reference has been deleted and that carry no
 * fallback URL are dropped rather than rendered as a dead link.
 */
function card(r: any, i: number): LinkCard | null {
	const label = str(r?.label) ?? str(r?.title)
	if (!label) return null
	const href = r?.target ? resolveHref(r.target) : str(r?.url)
	if (!href) return null
	return {key: str(r?._key) ?? `card${i}`, label, href, image: img(r?.background)}
}

function map(r: Record<string, any>): Homepage | null {
	if (!r) return null
	return {
		heroEyebrow: str(r.heroEyebrow),
		heroTagline: str(r.heroTagline),
		heroSubtext: str(r.heroSubtext),

		aboutEyebrow: str(r.aboutEyebrow),
		aboutHeadingHighlight: str(r.aboutHeadingHighlight),
		aboutHeading: str(r.aboutHeading),
		aboutLead: str(r.aboutLead),
		aboutBody: str(r.aboutBody),
		aboutStats: (r.aboutStats ?? [])
			.map((s: any, i: number) => ({
				key: str(s?._key) ?? `stat${i}`,
				number: str(s?.number) ?? '',
				label: str(s?.label) ?? '',
			}))
			.filter((s: Stat) => s.number && s.label),
		aboutCtaLabel: str(r.aboutCtaLabel),
		aboutCtaUrl: str(r.aboutCtaUrl),

		activitiesEyebrow: str(r.activitiesEyebrow),
		activitiesHeading: str(r.activitiesHeading),
		activitiesIntro: str(r.activitiesIntro),
		activitiesSlides: imgs(r.activitiesSlides),

		approachHeadingHighlight: str(r.approachHeadingHighlight),
		approachHeading: str(r.approachHeading),
		approachIntro: str(r.approachIntro),
		approachSteps: (r.approachSteps ?? [])
			.map((s: any, i: number) => ({
				key: str(s?._key) ?? `step${i}`,
				tag: str(s?.tag) ?? '',
				heading: str(s?.heading) ?? '',
				bullets: list(s?.bullets),
				icon: str(s?.icon),
				featured: s?.featured === true,
			}))
			.filter((s: ApproachStep) => s.tag || s.heading),

		servicesVisible: r.servicesVisible !== false,
		servicesEyebrow: str(r.servicesEyebrow),
		servicesHeadingHighlight: str(r.servicesHeadingHighlight),
		servicesHeading: str(r.servicesHeading),
		servicesIntro: str(r.servicesIntro),
		servicesCards: (r.servicesCards ?? []).map(card).filter((x: LinkCard | null): x is LinkCard => x !== null),

		conditionsVisible: r.conditionsVisible !== false,
		conditionsEyebrow: str(r.conditionsEyebrow),
		conditionsHeading: str(r.conditionsHeading),
		conditionsIntro: Array.isArray(r.conditionsIntro) ? (r.conditionsIntro as RichBlock[]) : [],
		conditionsLinks: (r.conditionsLinks ?? []).map(card).filter((x: LinkCard | null): x is LinkCard => x !== null),

		teamVisible: r.teamVisible !== false,
		teamEyebrow: str(r.teamEyebrow),
		teamHeading: str(r.teamHeading),
		teamIntro: str(r.teamIntro),

		facilitiesEyebrow: str(r.facilitiesEyebrow),
		facilitiesHeading: str(r.facilitiesHeading),
		facilitiesText: str(r.facilitiesText),
		facilitiesImage: img(r.facilitiesImage),
		facilitiesCtaLabel: str(r.facilitiesCtaLabel),
		facilitiesCtaUrl: str(r.facilitiesCtaUrl),

		quoteImage: img(r.quoteImage),
		quoteText: str(r.quoteText),
		quoteAttribution: str(r.quoteAttribution),

		seoTitle: str(r.seo?.metaTitle),
		seoDescription: str(r.seo?.metaDescription),
	}
}

let cached: Promise<Homepage | null> | null = null

async function load(): Promise<Homepage | null> {
	if (!isSanityConfigured) return null
	try {
		return map(await sanityClient.fetch<Record<string, any>>(HOMEPAGE_QUERY))
	} catch (error) {
		console.error('[sanity] homepage: fetch failed —', error)
		return null
	}
}

export function getHomepage(): Promise<Homepage | null> {
	if (!cached) cached = load()
	return cached
}

/**
 * Fetch the homepage, or fail the build. Every section on `/` renders from
 * this document, so a missing one would ship a homepage that is a video and
 * nothing else.
 */
export async function requireHomepage(): Promise<Homepage> {
	const doc = await getHomepage()
	if (!doc) {
		throw new Error(
			`[sanity] homepage: no document found — refusing to build. The whole of / ` +
				`renders from it and would come out empty. Check the document exists and ` +
				`that SANITY_PROJECT_ID is set on the build host.`,
		)
	}
	return doc
}
