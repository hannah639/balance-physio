/**
 * Team data — one memoised build-time fetch shared by the homepage carousel,
 * the /meet-the-team/ listing and the /team/<slug>/ profile pages.
 *
 * Falls back to src/data/team.js if Sanity is unreachable or empty, so the
 * team pages can never disappear.
 */
import {sanityClient, isSanityConfigured} from './client'
import {TEAM_QUERY} from './queries'
import {team as fallbackTeam, initials, gradientFor} from '../../data/team.js'

export {initials, gradientFor}

export type TeamMember = {
	slug: string
	name: string
	jobTitle: string
	/** Bio as plain paragraphs — the design renders simple <p> blocks. */
	bio: string[]
	photo: {url: string; alt: string; width: number | null; height: number | null} | null
	qualifications: string | null
	specialistAreas: string[]
	email: string | null
	phone: string | null
	/** Wellness practitioners are excluded from the carousel and team grid. */
	wellnessOnly: boolean
	seoTitle: string | null
	seoDescription: string | null
}

function str(v: unknown): string | null {
	if (typeof v !== 'string') return null
	const t = v.trim()
	return t.length ? t : null
}

/**
 * Flatten Portable Text to plain paragraphs. The migrated bios are plain
 * prose — no marks, lists or embeds — so a text join is faithful and avoids
 * pulling a Portable Text renderer into the bundle for no benefit.
 */
function blocksToParagraphs(blocks: unknown): string[] {
	if (!Array.isArray(blocks)) return []
	return blocks
		.filter((b): b is {_type?: string; children?: {text?: string}[]} => Boolean(b))
		.filter((b) => b._type === 'block')
		.map((b) => (b.children ?? []).map((c) => c?.text ?? '').join('').trim())
		.filter(Boolean)
}

let cached: Promise<TeamMember[]> | null = null

function fromFallback(): TeamMember[] {
	return (fallbackTeam as {slug: string; name: string; role?: string; photo?: string; bio?: string[]}[]).map((m) => ({
		slug: m.slug,
		name: m.name,
		jobTitle: m.role ?? '',
		bio: m.bio ?? [],
		photo: m.photo ? {url: m.photo, alt: `${m.name}, ${m.role ?? 'team member'}`, width: 600, height: 800} : null,
		qualifications: null,
		specialistAreas: [],
		email: null,
		phone: null,
		wellnessOnly: (m as {wellness?: boolean}).wellness === true,
		seoTitle: null,
		seoDescription: null,
	}))
}

async function load(): Promise<TeamMember[]> {
	if (!isSanityConfigured || !sanityClient) return fromFallback()
	try {
		const rows = await sanityClient.fetch<Record<string, unknown>[]>(TEAM_QUERY)
		const mapped: TeamMember[] = (rows ?? [])
			.map((r) => {
				const img = r.image as {url?: string; alt?: string; width?: number; height?: number} | null
				const slug = str(r.slug)
				const name = str(r.name)
				// A member with no slug has no page — drop rather than link to /team//.
				if (!slug || !name) return null
				return {
					slug,
					name,
					jobTitle: str(r.jobTitle) ?? '',
					bio: blocksToParagraphs(r.bio),
					photo: img?.url ? {url: img.url, alt: str(img.alt) || `${name}, ${str(r.jobTitle) ?? 'team member'}`, width: img.width ?? null, height: img.height ?? null} : null,
					qualifications: str(r.qualifications),
					specialistAreas: Array.isArray(r.specialistAreas) ? (r.specialistAreas as string[]).filter(Boolean) : [],
					email: str(r.email),
					phone: str(r.phone),
					wellnessOnly: r.wellnessOnly === true,
					seoTitle: str((r.seo as {metaTitle?: string} | null)?.metaTitle),
					seoDescription: str((r.seo as {metaDescription?: string} | null)?.metaDescription),
				}
			})
			.filter((m): m is TeamMember => m !== null)
		return mapped.length ? mapped : fromFallback()
	} catch (err) {
		console.warn('[sanity] Team fetch failed — using the static roster.', err)
		return fromFallback()
	}
}

export function getTeam(): Promise<TeamMember[]> {
	if (!cached) cached = load()
	return cached
}
