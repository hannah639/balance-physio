/**
 * Condition page data — one memoised build-time fetch for /condition/<slug>/.
 *
 * Conditions keep a named-field model rather than the free-form `sections`
 * array used by pages and services: every condition page is exactly four
 * fixed blocks (intro · symptoms · treatment · who we help) in a fixed
 * layout, so named fields describe the content better and give editors a
 * clearer Studio form than an ordered list would.
 *
 * Each block owns its heading and highlighted words. Those used to be
 * hard-coded in ConditionPage.astro, which meant an editor could change the
 * bullets but not the heading above them.
 */
import {sanityClient, isSanityConfigured} from './client'
import {CONDITIONS_QUERY} from './queries'
import type {Img, RichBlock} from './pageContent'

export type ConditionFaq = {key: string; question: string; answer: RichBlock[]}

export type Condition = {
	slug: string
	title: string

	heroHeading: string
	heroHighlight: string | null
	heroSubtitle: string | null
	breadcrumb: string | null

	/** The opening "Expert clinical care" copy, beside the intro image. */
	body: RichBlock[]
	introImage: Img | null
	introImageAspect: string | null
	whoImage: Img | null
	whoImageAspect: string | null

	symptomsHeading: string | null
	symptomsHighlight: string | null
	symptomsIntro: string | null
	symptoms: string[]

	treatmentHeading: string | null
	treatmentHighlight: string | null
	treatmentIntro: string | null
	treatmentList: string[]

	whoHeading: string | null
	whoHighlight: string | null
	whoIntro: string | null
	whoList: string[]

	faqs: ConditionFaq[]
	seoTitle: string | null
	seoDescription: string | null
	noIndex: boolean
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

const list = (v: unknown): string[] =>
	Array.isArray(v) ? v.map((x) => str(x)).filter((x): x is string => x !== null) : []

const blocks = (v: unknown): RichBlock[] => (Array.isArray(v) ? (v as RichBlock[]) : [])

function map(r: Record<string, any>): Condition | null {
	const slug = str(r?.slug)
	const title = str(r?.title)
	if (!slug || !title) return null
	return {
		slug,
		title,
		heroHeading: str(r.heroHeading) ?? title,
		heroHighlight: str(r.heroHighlight),
		heroSubtitle: str(r.heroSubtitle),
		breadcrumb: str(r.breadcrumb),

		body: blocks(r.body),
		introImage: img(r.introImage),
		introImageAspect: str(r.introImageAspect),
		whoImage: img(r.whoImage),
		whoImageAspect: str(r.whoImageAspect),

		symptomsHeading: str(r.symptomsHeading),
		symptomsHighlight: str(r.symptomsHighlight),
		symptomsIntro: str(r.symptomsIntro),
		symptoms: list(r.symptoms),

		treatmentHeading: str(r.treatmentHeading),
		treatmentHighlight: str(r.treatmentHighlight),
		treatmentIntro: str(r.treatmentIntro),
		treatmentList: list(r.treatmentList),

		whoHeading: str(r.whoHeading),
		whoHighlight: str(r.whoHighlight),
		whoIntro: str(r.whoIntro),
		whoList: list(r.whoList),

		faqs: (r.faqs ?? [])
			.map((f: any, i: number) => ({
				key: str(f?._key) ?? `faq${i}`,
				question: str(f?.question) ?? '',
				answer: blocks(f?.answer),
			}))
			.filter((f: ConditionFaq) => f.question && f.answer.length),

		seoTitle: str(r.seo?.metaTitle),
		seoDescription: str(r.seo?.metaDescription),
		noIndex: r.seo?.noIndex === true,
	}
}

let cached: Promise<Condition[]> | null = null

async function load(): Promise<Condition[]> {
	if (!isSanityConfigured) return []
	try {
		const rows = await sanityClient.fetch<Record<string, any>[]>(CONDITIONS_QUERY)
		return (rows ?? []).map(map).filter((c): c is Condition => c !== null)
	} catch (error) {
		console.error('[sanity] conditions: fetch failed —', error)
		return []
	}
}

export function getConditions(): Promise<Condition[]> {
	if (!cached) cached = load()
	return cached
}

/**
 * Fetch one condition, or fail the build. These pages render entirely from the
 * CMS, so a missing document would otherwise produce a page with a hero and
 * nothing else — worse than a build error, because it ships silently.
 */
export async function requireCondition(slug: string): Promise<Condition> {
	const doc = (await getConditions()).find((c) => c.slug === slug)
	if (!doc) {
		throw new Error(
			`[sanity] condition: no document for "${slug}" — refusing to build. ` +
				`Its page content comes from the CMS and would render empty. Check the ` +
				`document exists, is published, and that SANITY_PROJECT_ID is set on the build host.`,
		)
	}
	return doc
}
