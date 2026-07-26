/**
 * General FAQs — one memoised build-time fetch for /faqs/.
 *
 * Answers are returned as Portable Text (not flattened), so <RichText> can
 * render the inline links and bold runs the page depends on.
 */
import {sanityClient, isSanityConfigured} from './client'
import {GENERAL_FAQS_QUERY} from './queries'
import type {Block} from './types'

export type Faq = {key: string; question: string; answer: Block[]}

/** The whole /faqs/ page — hero, SEO and the question list, from one document. */
export type GeneralFaqs = {
	heroHeading: string
	heroHighlight: string | null
	heroSubtitle: string | null
	breadcrumb: string | null
	heroImageUrl: string | null
	seoTitle: string | null
	seoDescription: string | null
	noIndex: boolean
	sectionTitle: string | null
	introText: string | null
	faqs: Faq[]
}

const EMPTY: GeneralFaqs = {
	heroHeading: 'FAQs',
	heroHighlight: null,
	heroSubtitle: null,
	breadcrumb: 'FAQs',
	heroImageUrl: null,
	seoTitle: null,
	seoDescription: null,
	noIndex: false,
	sectionTitle: null,
	introText: null,
	faqs: [],
}

function str(v: unknown): string | null {
	if (typeof v !== 'string') return null
	const t = v.trim()
	return t.length ? t : null
}

let cached: Promise<GeneralFaqs> | null = null

async function load(): Promise<GeneralFaqs> {
	if (!isSanityConfigured || !sanityClient) return EMPTY
	try {
		const r = await sanityClient.fetch<Record<string, any>>(GENERAL_FAQS_QUERY)
		const safeUrl = (v: unknown) => (str(v) && /^https?:\/\//i.test(String(v)) ? String(v).trim() : null)
		return {
			heroHeading: str(r?.heroHeading) ?? 'FAQs',
			heroHighlight: str(r?.heroHighlight),
			heroSubtitle: str(r?.heroSubtitle),
			breadcrumb: str(r?.breadcrumb) ?? 'FAQs',
			heroImageUrl: safeUrl(r?.heroImage?.url),
			seoTitle: str(r?.seo?.metaTitle),
			seoDescription: str(r?.seo?.metaDescription),
			noIndex: r?.seo?.noIndex === true,
			sectionTitle: str(r?.sectionTitle),
			introText: str(r?.introText),
			faqs: (r?.faqs ?? [])
				.map((f: any, i: number) => ({
					key: str(f?._key) ?? `faq${i}`,
					question: str(f?.question) ?? '',
					answer: Array.isArray(f?.answer) ? f.answer : [],
				}))
				.filter((f: Faq) => f.question && f.answer.length),
		}
	} catch (err) {
		console.warn('[sanity] General FAQs fetch failed.', err)
		return EMPTY
	}
}

export function getGeneralFaqs(): Promise<GeneralFaqs> {
	if (!cached) cached = load()
	return cached
}

/**
 * Flatten Portable Text to plain text for schema.org FAQPage JSON-LD, which
 * takes a string rather than markup.
 */
export function answerToText(blocks: Block[]): string {
	return blocks
		.filter((b) => b?._type === 'block')
		.map((b) => (b.children ?? []).map((c) => c?.text ?? '').join(''))
		.map((s) => s.trim())
		.filter(Boolean)
		.join(' ')
}

/** Guard: a CMS-driven FAQ list must never render empty. */
export async function getGeneralFaqsRequired(): Promise<GeneralFaqs> {
	const data = await getGeneralFaqs()
	if (!data.faqs.length) {
		throw new Error(
			'[sanity] No General FAQs returned — refusing to build. The /faqs/ page would render an empty list. ' +
				'Check the General FAQs document is published and SANITY_PROJECT_ID is set on the build host.',
		)
	}
	return data
}
