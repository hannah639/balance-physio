/**
 * Clinic location data — one memoised build-time fetch for the /clinic/<slug>/
 * pages.
 *
 * Each on-page section is a tab in the Studio (Location Details, Opening Hours,
 * What's Here) and carries its own eyebrow + H2 + highlighted word, so every
 * heading is editable rather than hard-coded in the template.
 *
 * Contact details fall back to Site Settings: a clinic only overrides them when
 * it genuinely differs from the main clinic.
 */
import {sanityClient, isSanityConfigured} from './client'
import {CLINIC_LOCATIONS_QUERY} from './queries'
import {getGlobals} from './globals'

type Img = {url: string; alt: string; width: number | null; height: number | null}

export type ClinicSection = {
	eyebrow: string | null
	heading: string | null
	highlight: string | null
}

export type Clinic = {
	slug: string
	title: string
	isPrimary: boolean
	heroHeading: string
	heroHighlight: string | null
	heroSubtitle: string | null
	breadcrumb: string | null
	heroImageUrl: string | null
	seoTitle: string | null
	seoDescription: string | null

	location: ClinicSection & {
		address: string
		phoneNumber: string
		phoneHref: string
		email: string
		mapsUrl: string | null
		mapEmbed: string | null
		directions: string[]
		note: string | null
	}
	hours: ClinicSection & {
		rows: {day: string; hours: string}[]
		notes: string[]
		image: Img | null
	}
	whatsHere: ClinicSection & {items: string[]; gallery: Img[]}
}

function str(v: unknown): string | null {
	if (typeof v !== 'string') return null
	const t = v.trim()
	return t.length ? t : null
}
const safeUrl = (v: unknown) => (str(v) && /^https?:\/\//i.test(String(v)) ? String(v).trim() : null)
const telHref = (p: string) => `tel:${p.replace(/[^\d+]/g, '')}`

/** iframe-only backstop, mirroring globals.ts — never trust raw CMS HTML. */
function safeEmbed(v: unknown): string | null {
	const s = str(v)
	if (!s) return null
	if (/<script\b/i.test(s) || /\son\w+\s*=/i.test(s) || !/<iframe\b/i.test(s)) return null
	return s
}

function img(o: unknown): Img | null {
	const i = o as {url?: string; alt?: string; width?: number; height?: number} | null
	const url = safeUrl(i?.url)
	return url ? {url, alt: str(i?.alt) ?? '', width: i?.width ?? null, height: i?.height ?? null} : null
}

const list = (v: unknown): string[] =>
	Array.isArray(v) ? v.map((x) => str(x) ?? '').filter(Boolean) : []

let cached: Promise<Clinic[]> | null = null

async function load(): Promise<Clinic[]> {
	if (!isSanityConfigured || !sanityClient) return []
	const g = await getGlobals()
	try {
		const rows = await sanityClient.fetch<Record<string, any>[]>(CLINIC_LOCATIONS_QUERY)
		return (rows ?? [])
			.map((r) => {
				const slug = str(r.slug)
				if (!slug) return null
				const loc = r.location ?? {}
				const hrs = r.hours ?? {}
				const wh = r.whatsHere ?? {}
				const phone = str(loc.phoneNumber) ?? g.phoneNumber
				return {
					slug,
					title: str(r.title) ?? slug,
					isPrimary: r.isPrimary === true,
					heroHeading: str(r.heroHeading) ?? str(r.title) ?? slug,
					heroHighlight: str(r.heroHighlight),
					heroSubtitle: str(r.heroSubtitle),
					breadcrumb: str(r.breadcrumb),
					heroImageUrl: img(r.heroImage)?.url ?? null,
					seoTitle: str(r.seo?.metaTitle),
					seoDescription: str(r.seo?.metaDescription),

					location: {
						eyebrow: str(loc.eyebrow),
						heading: str(loc.heading),
						highlight: str(loc.highlight),
						// Blank overrides inherit the global Site Settings value.
						address: str(loc.address) ?? g.address,
						phoneNumber: phone,
						phoneHref: telHref(phone),
						email: str(loc.email) ?? g.email,
						mapsUrl: safeUrl(loc.mapsUrl),
						mapEmbed: safeEmbed(loc.mapEmbed),
						directions: list(loc.directions),
						note: str(loc.note),
					},
					hours: {
						eyebrow: str(hrs.eyebrow),
						heading: str(hrs.heading),
						highlight: str(hrs.highlight),
						rows: (hrs.rows ?? [])
							.map((x: any) => ({day: str(x?.day) ?? '', hours: str(x?.hours) ?? ''}))
							.filter((x: {day: string; hours: string}) => x.day || x.hours),
						notes: list(hrs.notes),
						image: img(hrs.image),
					},
					whatsHere: {
						eyebrow: str(wh.eyebrow),
						heading: str(wh.heading),
						highlight: str(wh.highlight),
						items: list(wh.items),
						gallery: (wh.gallery ?? []).map(img).filter((x: Img | null): x is Img => x !== null),
					},
				}
			})
			.filter((c): c is Clinic => c !== null)
	} catch (err) {
		console.warn('[sanity] Clinic locations fetch failed.', err)
		return []
	}
}

export function getClinics(): Promise<Clinic[]> {
	if (!cached) cached = load()
	return cached
}

export async function getClinic(slug: string): Promise<Clinic | null> {
	return (await getClinics()).find((c) => c.slug === slug) ?? null
}
