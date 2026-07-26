/**
 * /pricing/ page data.
 *
 * Same contract as globals.ts: one memoised build-time fetch, never throws,
 * and resolves to a flat non-optional shape with the pre-CMS content as the
 * fallback (src/data/pricing.js), so the page can never render an empty price
 * list.
 */
import {sanityClient, isSanityConfigured} from './client'
import {PRICING_QUERY} from './queries'
import {pricingCategories as fallbackCategories} from '../../data/pricing.js'
import type {PricingQueryResult, ResolvedPricing, ResolvedPricingCategory} from './types'

/** The values the page shipped with, used when a CMS field is blank. */
const FALLBACK = {
	heroHeading: '& Insurance',
	heroHighlight: 'Pricing',
	heroSubtitle:
		'Transparent fees that reflect our clinical expertise. Recognised by all major insurance providers including Bupa and AXA PPP.',
	breadcrumb: 'Pricing',
	seoTitle: 'Pricing',
	seoDescription:
		'Transparent pricing for physiotherapy, osteopathy, sports massage, strength & conditioning, podiatry and more at Balance Performance Physiotherapy in Clapham.',
	insuranceNotice: {
		eyebrow: 'Insurance bookings',
		heading: 'Booking with',
		headingHighlight: 'insurance?',
		body: 'Our online booking system cannot process insurance bookings (Bupa, AXA, Bupa Global, AXA Global). To book using your insurance, please contact us directly with your membership number and pre-authorisation code to hand.',
		phone: '020 7627 2308',
		whatsapp: '07749 932065',
		whatsappUrl: 'https://wa.me/447749932065',
		email: 'admin@balancephysio.com',
	},
}

function str(v: unknown): string | null {
	if (typeof v !== 'string') return null
	const t = v.trim()
	return t.length ? t : null
}

function safeUrl(v: unknown): string | null {
	const s = str(v)
	if (!s) return null
	return /^https?:\/\//i.test(s) ? s : null
}

/** Turn the fallback JS array into the resolved shape. */
function fallbackToResolved(): ResolvedPricingCategory[] {
	return (fallbackCategories as {anchor: string; title: string; items: {name: string; price: string; note?: string}[]}[]).map(
		(cat) => ({
			anchor: cat.anchor,
			title: cat.title,
			description: null,
			sections: [
				{
					heading: null,
					items: cat.items.map((i) => ({
						name: i.name,
						price: i.price,
						note: str(i.note),
						badge: null,
					})),
				},
			],
		}),
	)
}

let cached: Promise<ResolvedPricing> | null = null

async function fetchPricing(): Promise<PricingQueryResult> {
	if (!isSanityConfigured || !sanityClient) return null
	try {
		return await sanityClient.fetch<PricingQueryResult>(PRICING_QUERY)
	} catch (err) {
		console.warn('[sanity] Pricing fetch failed — using fallback price list.', err)
		return null
	}
}

function resolve(data: PricingQueryResult): ResolvedPricing {
	// Map CMS categories into the card shape. A category with no renderable
	// rows is dropped rather than rendered as an empty card.
	const cmsCategories: ResolvedPricingCategory[] = (data?.categories ?? [])
		.map((cat) => {
			const sections = (cat?.groups ?? [])
				.map((grp) => ({
					heading: str(grp?.heading),
					items: (grp?.rows ?? [])
						.map((row) => ({
							name: str(row?.name) ?? '',
							price: str(row?.price) ?? '',
							note: str(row?.note),
							badge: str(row?.badge),
						}))
						.filter((row) => row.name),
				}))
				.filter((section) => section.items.length)

			return {
				anchor: str(cat?.id) ?? '',
				title: str(cat?.title) ?? str(cat?.label) ?? '',
				description: str(cat?.description),
				sections,
			}
		})
		.filter((cat) => cat.anchor && cat.title && cat.sections.length)

	const categories = cmsCategories.length ? cmsCategories : fallbackToResolved()

	const notice = data?.insuranceNotice
	// enabled defaults to true when the field has never been touched.
	const noticeOn = notice ? notice.enabled !== false : true
	const n = notice ?? null

	return {
		fromCms: Boolean(data),

		heroHeading: str(data?.heroHeading) ?? FALLBACK.heroHeading,
		heroHighlight: str(data?.heroHighlight) ?? FALLBACK.heroHighlight,
		heroSubtitle: str(data?.heroSubtitle) ?? FALLBACK.heroSubtitle,
		breadcrumb: str(data?.breadcrumb) ?? FALLBACK.breadcrumb,
		heroImageUrl: safeUrl(data?.heroImage?.url),
		heroImageAlt: str(data?.heroImage?.alt) ?? '',

		// Page-level SEO: the pricing document's own seo object wins, then the
		// values the page already used. Global seoSettings defaults apply below
		// this in Layout.astro.
		seoTitle: str(data?.seo?.metaTitle) ?? FALLBACK.seoTitle,
		seoDescription: str(data?.seo?.metaDescription) ?? FALLBACK.seoDescription,
		noIndex: data?.seo?.noIndex === true,

		insuranceNotice: noticeOn
			? {
					eyebrow: str(n?.eyebrow) ?? FALLBACK.insuranceNotice.eyebrow,
					heading: str(n?.heading) ?? FALLBACK.insuranceNotice.heading,
					headingHighlight: str(n?.headingHighlight) ?? FALLBACK.insuranceNotice.headingHighlight,
					body: str(n?.body) ?? FALLBACK.insuranceNotice.body,
					phone: str(n?.phone) ?? FALLBACK.insuranceNotice.phone,
					whatsapp: str(n?.whatsapp) ?? FALLBACK.insuranceNotice.whatsapp,
					whatsappUrl: safeUrl(n?.whatsappUrl) ?? FALLBACK.insuranceNotice.whatsappUrl,
					email: str(n?.email) ?? FALLBACK.insuranceNotice.email,
				}
			: null,

		categories,
	}
}

export function getPricing(): Promise<ResolvedPricing> {
	if (!cached) cached = fetchPricing().then(resolve)
	return cached
}
