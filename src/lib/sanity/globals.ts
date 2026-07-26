/**
 * Global site data — the single entry point for CMS-driven site-wide settings.
 *
 * Design rules this file enforces:
 *  1. ONE fetch per build. The promise is memoised at module scope, so twenty
 *     components calling getGlobals() share a single network round trip.
 *  2. Never throws. If Sanity is unreachable, unconfigured, or a field is
 *     blank, the site falls back to the values it shipped with before the CMS
 *     existed. A CMS outage must not fail the build or blank the footer.
 *  3. Resolves to a flat, non-optional shape so components stay free of
 *     defensive optional-chaining.
 *
 * Ownership of duplicated fields (agreed with the client):
 *  - Visible/display content (header, footer, contact) -> `siteSettings`
 *  - schema.org / JSON-LD structured data              -> `seoSettings.localSeo`
 */
import {sanityClient, isSanityConfigured} from './client'
import {GLOBALS_QUERY} from './queries'
import {resolveNavigation} from './navigation'
import {siteSettings as fallback} from '../../data/site-settings.js'
import type {
	BookingCard,
	GlobalsQueryResult,
	ResolvedGlobals,
	ResolvedSocial,
	SanityImage,
} from './types'

/** Trim to a non-empty string, else null. Treats "   " as empty. */
function str(v: unknown): string | null {
	if (typeof v !== 'string') return null
	const t = v.trim()
	return t.length ? t : null
}

/** Allow only http(s) and protocol-relative URLs — blocks javascript: etc. */
function safeUrl(v: unknown): string | null {
	const s = str(v)
	if (!s) return null
	if (/^https?:\/\//i.test(s) || s.startsWith('//')) return s
	return null
}

/** Build a tel: href. Keeps a leading +, strips spaces and punctuation. */
function telHref(phone: string): string {
	const cleaned = phone.replace(/[^\d+]/g, '')
	return `tel:${cleaned}`
}

/** Basic email shape check before emitting a mailto:. */
function safeEmail(v: unknown): string | null {
	const s = str(v)
	return s && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) ? s : null
}

/**
 * Google Maps embeds are raw HTML from the CMS. The schema already rejects
 * <script>, but this is the render-time backstop: allow the value through only
 * if it looks like a bare iframe embed and carries no script or inline
 * event handler.
 */
function safeEmbed(v: unknown): string | null {
	const s = str(v)
	if (!s) return null
	if (/<script\b/i.test(s)) return null
	if (/\son\w+\s*=/i.test(s)) return null
	if (!/<iframe\b/i.test(s)) return null
	return s
}

function img(image: SanityImage) {
	const url = safeUrl(image?.url)
	if (!url) return null
	return {
		url,
		alt: str(image?.alt) ?? '',
		width: image?.width ?? null,
		height: image?.height ?? null,
	}
}

/**
 * The opening hours the footer displayed before the CMS existed. Used verbatim
 * when siteSettings has no rows, so an empty/unreachable CMS never blanks the
 * footer's hours block.
 */
/**
 * The MindBody booking link that was hard-coded in 27 Astro files before the
 * booking URL was consolidated into Sanity (Booking Links → Primary booking
 * URL). Kept as the last-resort fallback so every "Book Now" button still
 * works if the CMS is unreachable.
 */
const FALLBACK_BOOKING_URL =
	'https://go.mindbodyonline.com/book/widgets/appointments/view/8068777f5e/services'

const FALLBACK_HOURS = [
	{day: 'Monday - Wednesday', hours: '7:00am - 8:00pm'},
	{day: 'Thursday', hours: '8:00am - 7:00pm'},
	{day: 'Friday', hours: '7:00am - 6:00pm'},
	{day: 'Saturday', hours: '8:00am - 4:00pm'},
	{day: 'Sunday', hours: 'Studio hire events only'},
]

/** Memoised across the whole build — see rule 1 above. */
let cached: Promise<ResolvedGlobals> | null = null

async function fetchGlobals(): Promise<GlobalsQueryResult | null> {
	if (!isSanityConfigured || !sanityClient) return null
	try {
		return await sanityClient.fetch<GlobalsQueryResult>(GLOBALS_QUERY)
	} catch (err) {
		// Warn loudly in the build log, then degrade to fallbacks rather than
		// failing the build.
		console.warn('[sanity] Global settings fetch failed — using fallbacks.', err)
		return null
	}
}

function resolve(data: GlobalsQueryResult | null): ResolvedGlobals {
	const site = data?.site ?? null
	const seo = data?.seo ?? null
	const local = seo?.localSeo ?? null

	const siteName = str(seo?.siteName) ?? fallback.businessName
	const siteUrl = safeUrl(local?.websiteUrl) ?? fallback.siteUrl

	// --- Logo: Sanity first, else the local /logo.jpg the site already ships.
	const cmsLogo = img(site?.colouredLogo ?? null)
	const logo = cmsLogo
		? {...cmsLogo, alt: cmsLogo.alt || siteName, isLocal: false}
		: {url: '/logo.jpg', alt: siteName, width: 500, height: 176, isLocal: true}

	// White logo only counts when the editor ticked "Do you need a white logo?".
	const cmsWhite = site?.needWhiteLogo ? img(site?.whiteLogo ?? null) : null
	const whiteLogo = cmsWhite ? {...cmsWhite, alt: cmsWhite.alt || siteName} : null

	const phoneNumber = str(site?.phoneNumber) ?? fallback.phone
	const email = safeEmail(site?.email) ?? fallback.email

	const cmsHours = (site?.openingHours ?? [])
		.map((row) => ({day: str(row?.day) ?? '', hours: str(row?.hours) ?? ''}))
		.filter((row) => row.day || row.hours)
	const openingHours = cmsHours.length ? cmsHours : FALLBACK_HOURS

	const socials: ResolvedSocial[] = (local?.socialProfiles ?? [])
		.map((p) => ({platform: str(p?.platform) ?? '', url: safeUrl(p?.url) ?? ''}))
		.filter((p): p is ResolvedSocial => Boolean(p.url))

	// The one booking URL for the whole site. Falls back to the MindBody link
	// that was hard-coded across 27 files before this consolidation.
	const bookingUrl = safeUrl(data?.booking?.primaryUrl) ?? FALLBACK_BOOKING_URL
	const bookingLabel = str(data?.booking?.primaryLabel) ?? 'Book Now'

	// A card with a blank `url` INHERITS the primary booking URL — that's how
	// the single source of truth is preserved. Only a card that deliberately
	// points elsewhere (a class link, an internal path) carries its own.
	// Internal paths are allowed here, so this accepts more than safeUrl().
	const bookingCards: BookingCard[] = (data?.booking?.cards ?? [])
		.filter((c) => c?.active !== false)
		.sort((a, b) => (a?.displayOrder ?? 0) - (b?.displayOrder ?? 0))
		.map((c) => ({...c, url: str(c?.url) ?? bookingUrl}))

	return {
		fromCms: Boolean(site),

		siteName,
		defaultMetaTitle: str(seo?.defaultMetaTitle) ?? fallback.title,
		defaultMetaDescription: str(seo?.defaultMetaDescription) ?? fallback.description,
		titleTemplate: str(seo?.titleTemplate),
		siteUrl,
		twitterHandle: str(seo?.twitterHandle),
		defaultOgImageUrl: img(seo?.defaultOgImage ?? null)?.url ?? `${siteUrl}${fallback.ogImage}`,

		discourageSearchEngines: site?.discourageSearchEngines === true,
		robotsTxt: str(seo?.robotsTxt),

		verification: {
			google: str(seo?.googleSiteVerification),
			bing: str(seo?.bingVerification),
			baidu: str(seo?.baiduVerification),
			yandex: str(seo?.yandexVerification),
			pinterest: str(seo?.pinterestVerification),
			facebook: str(seo?.facebookDomainVerification),
			norton: str(seo?.nortonSafeWeb),
			custom: str(seo?.customWebmasterTags),
		},

		logo,
		whiteLogo,
		favicons: {
			ico: safeUrl(site?.faviconIcoUrl) ?? '/favicon.ico',
			svg: safeUrl(site?.faviconSvgUrl) ?? '/favicon.svg',
			// No local apple-touch-icon.png exists; the site has always pointed
			// this at favicon.svg, so keep that as the fallback.
			appleTouch: safeUrl(site?.appleTouchIconUrl) ?? '/favicon.svg',
		},

		phoneNumber,
		phoneHref: telHref(phoneNumber),
		email,
		address: str(site?.address) ?? `${fallback.streetAddress}, ${fallback.city} ${fallback.postalCode}`,
		googleMapEmbed: safeEmbed(site?.googleMapEmbed),
		openingHours,

		socials,

		business: {
			name: str(local?.businessName) ?? fallback.businessName,
			type: str(local?.businessType) ?? fallback.businessType,
			description: str(local?.businessDescription) ?? fallback.description,
			phone: str(local?.primaryPhone) ?? fallback.phone,
			email: safeEmail(local?.email) ?? fallback.email,
			priceRange: str(local?.priceRange) ?? fallback.priceRange,
			streetAddress: str(local?.streetAddress) ?? fallback.streetAddress,
			city: str(local?.city) ?? fallback.city,
			region: str(local?.county) ?? fallback.region,
			postalCode: str(local?.postcode) ?? fallback.postalCode,
			country: str(local?.countryCode) ?? fallback.country,
			latitude: typeof local?.latitude === 'number' ? local.latitude : fallback.latitude,
			longitude: typeof local?.longitude === 'number' ? local.longitude : fallback.longitude,

			// schema.org structured data, all from seoSettings.localSeo.
			openingHours: (local?.openingHours ?? [])
				.filter((h) => h && !h.closed && (h.open || h.close))
				.map((h) => ({
					days: [str(h?.day) ?? ''].filter(Boolean),
					opens: str(h?.open),
					closes: str(h?.close),
					closed: h?.closed === true,
				})),
			areasServed: (local?.areasServed ?? []).map((a) => str(a) ?? '').filter(Boolean),
			services: (local?.services ?? []).map((x) => str(x) ?? '').filter(Boolean),
			logoUrl: safeUrl(local?.logo?.url),
			imageUrl: safeUrl(local?.primaryImage?.url),
			aggregateRating: typeof local?.aggregateRating === 'number' ? local.aggregateRating : null,
			reviewCount: typeof local?.reviewCount === 'number' ? local.reviewCount : null,
			faq: (local?.faq ?? [])
				.map((f) => ({question: str(f?.question) ?? '', answer: str(f?.answer) ?? ''}))
				.filter((f) => f.question && f.answer),
		},

		bookingUrl,
		bookingLabel,
		bookingCards,

		// Header + footer menus, resolved from the `navigation` singleton.
		nav: resolveNavigation(data?.navigation ?? null),
	}
}

/**
 * Get the resolved global settings. Safe to call from any component — the
 * underlying fetch happens at most once per build.
 */
export function getGlobals(): Promise<ResolvedGlobals> {
	if (!cached) cached = fetchGlobals().then(resolve)
	return cached
}
