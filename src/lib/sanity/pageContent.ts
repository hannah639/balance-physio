/**
 * Shared resolver for hero + content-section pages (`whoWeHelp`, and `page`
 * once it is wired). One memoised fetch per type, and a flat non-optional
 * shape so templates stay free of defensive checks.
 *
 * Body copy is flattened from Portable Text to paragraph/bullet items: the
 * migrated content is plain prose and simple lists, so this renders faithfully
 * without pulling a Portable Text renderer into the bundle.
 */
import {sanityClient, isSanityConfigured} from './client'

export type Img = {url: string; alt: string; width: number | null; height: number | null}

/** A paragraph, or a group of bullet points, in document order. */
export type BodyBlock = {kind: 'p'; text: string} | {kind: 'ul'; items: string[]}

export type PageSection = {
	eyebrow: string | null
	heading: string | null
	headingHighlight: string | null
	body: BodyBlock[]
	image: Img | null
	gallery: Img[]
	imageOnRight: boolean
	altBackground: boolean
	ctaLabel: string | null
}

export type OpenRole = {title: string; meta: string | null; body: BodyBlock[]}

export type OutcomeStat = {number: string; label: string}

export type OutcomePanel = {
	tabLabel: string
	panelId: string
	heading: string | null
	subheading: string | null
	stats: OutcomeStat[]
	body: BodyBlock[]
	chart: Img | null
	quotesLabel: string | null
	quotes: string[]
}

export type PageDoc = {
	slug: string
	title: string
	heroHeading: string
	heroHighlight: string | null
	heroSubtitle: string | null
	breadcrumb: string | null
	heroCtaLabel: string | null
	hideHeroCta: boolean
	heroImageUrl: string | null
	seoTitle: string | null
	seoDescription: string | null
	noIndex: boolean
	sections: PageSection[]
	relatedServices: {slug: string; title: string}[]
	/** Work For Us vacancies — empty on every other page. */
	openRoles: OpenRole[]
	/** Outcomes tabbed panels — empty on every other page. */
	outcomePanels: OutcomePanel[]
}

function str(v: unknown): string | null {
	if (typeof v !== 'string') return null
	const t = v.trim()
	return t.length ? t : null
}
const safeUrl = (v: unknown) => (str(v) && /^https?:\/\//i.test(String(v)) ? String(v).trim() : null)

function img(o: unknown): Img | null {
	const i = o as {url?: string; alt?: string; width?: number; height?: number} | null
	const url = safeUrl(i?.url)
	return url ? {url, alt: str(i?.alt) ?? '', width: i?.width ?? null, height: i?.height ?? null} : null
}

/**
 * Portable Text -> ordered paragraphs and bullet groups. Consecutive bullet
 * blocks are merged into one <ul> so lists don't render as separate lists.
 */
export function toBodyBlocks(blocks: unknown): BodyBlock[] {
	if (!Array.isArray(blocks)) return []
	const out: BodyBlock[] = []
	for (const raw of blocks) {
		const b = raw as {_type?: string; listItem?: string; children?: {text?: string}[]} | null
		if (!b || b._type !== 'block') continue
		const text = (b.children ?? []).map((c) => c?.text ?? '').join('').trim()
		if (!text) continue
		if (b.listItem) {
			const last = out[out.length - 1]
			if (last && last.kind === 'ul') last.items.push(text)
			else out.push({kind: 'ul', items: [text]})
		} else {
			out.push({kind: 'p', text})
		}
	}
	return out
}

function section(s: Record<string, unknown>): PageSection {
	return {
		eyebrow: str(s.eyebrow),
		heading: str(s.heading),
		headingHighlight: str(s.headingHighlight),
		body: toBodyBlocks(s.body),
		image: img(s.image),
		gallery: Array.isArray(s.gallery) ? s.gallery.map(img).filter((x): x is Img => x !== null) : [],
		imageOnRight: s.imageOnRight === true,
		altBackground: s.altBackground === true,
		ctaLabel: str(s.ctaLabel),
	}
}

export function mapPageDoc(r: Record<string, any>): PageDoc | null {
	const slug = str(r.slug)
	if (!slug) return null
	return {
		slug,
		title: str(r.title) ?? slug,
		heroHeading: str(r.heroHeading) ?? str(r.title) ?? slug,
		heroHighlight: str(r.heroHighlight),
		heroSubtitle: str(r.heroSubtitle),
		breadcrumb: str(r.breadcrumb),
		heroCtaLabel: str(r.heroCtaLabel),
		hideHeroCta: r.hideHeroCta === true,
		heroImageUrl: img(r.heroImage)?.url ?? null,
		seoTitle: str(r.seo?.metaTitle),
		seoDescription: str(r.seo?.metaDescription),
		noIndex: r.seo?.noIndex === true,
		sections: (r.sections ?? []).map(section),
		relatedServices: (r.relatedServices ?? [])
			.map((x: any) => ({slug: str(x?.slug) ?? '', title: str(x?.title) ?? ''}))
			.filter((x: {slug: string}) => x.slug),

		openRoles: (r.openRoles ?? [])
			.map((x: any) => ({title: str(x?.title) ?? '', meta: str(x?.meta), body: toBodyBlocks(x?.body)}))
			.filter((x: OpenRole) => x.title),

		outcomePanels: (r.outcomePanels ?? [])
			.map((x: any) => ({
				tabLabel: str(x?.tabLabel) ?? '',
				panelId: str(x?.panelId) ?? '',
				heading: str(x?.heading),
				subheading: str(x?.subheading),
				stats: (x?.stats ?? [])
					.map((st: any) => ({number: str(st?.number) ?? '', label: str(st?.label) ?? ''}))
					.filter((st: OutcomeStat) => st.number && st.label),
				body: toBodyBlocks(x?.body),
				chart: img(x?.chartImage),
				quotesLabel: str(x?.quotesLabel),
				quotes: Array.isArray(x?.quotes) ? x.quotes.map((q: unknown) => str(q) ?? '').filter(Boolean) : [],
			}))
			.filter((x: OutcomePanel) => x.tabLabel && x.panelId),
	}
}

/**
 * Memoised loader factory — one fetch per query, shared across all pages.
 *
 * `routes()` is for getStaticPaths and deliberately THROWS if the query yields
 * nothing. A silent empty result would build "successfully" while dropping
 * every URL of that type — 10 live pages turning into 404s with a green build.
 * Failing loudly instead means Cloudflare keeps serving the previous, working
 * deployment.
 */
export function makeLoader(query: string, label: string) {
	let cached: Promise<PageDoc[]> | null = null
	const load = async (): Promise<PageDoc[]> => {
		if (!isSanityConfigured || !sanityClient) return []
		try {
			const rows = await sanityClient.fetch<Record<string, any>[]>(query)
			return (rows ?? []).map(mapPageDoc).filter((d): d is PageDoc => d !== null)
		} catch (err) {
			console.warn('[sanity] Page content fetch failed.', err)
			return []
		}
	}
	return {
		all: () => (cached ??= load()),
		bySlug: async (slug: string) => (await (cached ??= load())).find((d) => d.slug === slug) ?? null,

		/**
		 * For a page whose whole body now comes from the CMS. Throws if the
		 * document is missing, rather than rendering a blank page — a page that
		 * exists but is empty is worse than a build that fails, because
		 * Cloudflare would replace working content with nothing.
		 */
		required: async (slug: string): Promise<PageDoc> => {
			const doc = (await (cached ??= load())).find((d) => d.slug === slug)
			if (!doc) {
				throw new Error(
					`[sanity] ${label}: no document for "${slug}" — refusing to build. ` +
						`Its page body comes from the CMS and would render empty. Check the ` +
						`document exists, is published, and that SANITY_PROJECT_ID is set on the build host.`,
				)
			}
			return doc
		},

		/** Use for getStaticPaths — throws rather than silently dropping routes. */
		routes: async (): Promise<PageDoc[]> => {
			const docs = await (cached ??= load())
			if (!docs.length) {
				throw new Error(
					`[sanity] No ${label} documents returned — refusing to build. ` +
						`Every /${label}/ URL would 404. Check SANITY_PROJECT_ID / SANITY_DATASET ` +
						`are set on the build host and that the documents are published.`,
				)
			}
			return docs
		},
	}
}

import {WHO_WE_HELP_QUERY, PAGES_QUERY} from './queries'

/** Who We Help audience pages. */
export const whoWeHelp = makeLoader(WHO_WE_HELP_QUERY, 'who-we-help')

/**
 * Standard content pages. Wired IN PLACE rather than through one dynamic
 * template: these 14 pages are genuinely heterogeneous (a 43-question FAQ
 * list, 35 paragraphs of legal text, the team grid, an enquiry form), so each
 * keeps its own file and reads its hero + SEO — and its sections where the
 * migration reached parity — from here.
 */
export const pages = makeLoader(PAGES_QUERY, 'pages')
