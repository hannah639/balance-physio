/**
 * Blog data — one memoised build-time fetch shared by the grid, the post
 * pages and the sitemap.
 *
 * Sanity is the single source of truth. Everything the site shows about a post
 * is derived here, so add / edit / publish / unpublish / delete in the Studio
 * all reach the site through one path:
 *
 *   • unpublished and slugless posts are filtered out in GROQ, so they cannot
 *     appear in the grid, generate a page, or enter the sitemap
 *   • related posts fall back to the same category, then to recent posts, so
 *     the section never renders empty or half-populated
 *   • previous / next come from the same ordered list the grid uses, so they
 *     can never disagree with it
 */
import {sanityClient, isSanityConfigured} from './client'
import {BLOG_LIST_QUERY, BLOG_BY_SLUG_QUERY, BLOG_CATEGORIES_QUERY} from './queries'
import type {Img, RichBlock} from './pageContent'

export type BlogCategory = {slug: string; title: string}

export type BlogAuthor = {slug: string; name: string; jobTitle: string | null; image: Img | null}

export type BlogCard = {
	slug: string
	url: string
	title: string
	excerpt: string | null
	publishedAt: string | null
	/** Preformatted date for display — month-only posts keep their wording. */
	dateLabel: string | null
	/** ISO date for <time datetime> and schema.org. */
	dateISO: string | null
	image: Img | null
	categories: BlogCategory[]
}

export type BlogPost = BlogCard & {
	updatedAt: string | null
	updatedLabel: string | null
	body: RichBlock[]
	authors: BlogAuthor[]
	related: BlogCard[]
	readingMinutes: number
	seoTitle: string | null
	seoDescription: string | null
	canonicalUrl: string | null
	noIndex: boolean
	ogTitle: string | null
	ogDescription: string | null
	ogImage: Img | null
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

/** "12 July 2026" — the format the news page has always used. */
function formatDate(iso: string | null): string | null {
	if (!iso) return null
	const d = new Date(iso)
	if (Number.isNaN(d.getTime())) return null
	return d.toLocaleDateString('en-GB', {day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'})
}

/** Words in the Portable Text body, at 200 wpm, floored at one minute. */
function readingMinutes(body: RichBlock[]): number {
	const words = body
		.flatMap((b) => b.children ?? [])
		.map((s) => s.text ?? '')
		.join(' ')
		.trim()
		.split(/\s+/)
		.filter(Boolean).length
	return Math.max(1, Math.round(words / 200))
}

function card(r: Record<string, any>): BlogCard | null {
	const slug = str(r?.slug)
	const title = str(r?.title)
	if (!slug || !title) return null
	const publishedAt = str(r.publishedAt)
	return {
		slug,
		url: `/news/${slug}/`,
		title,
		excerpt: str(r.excerpt),
		publishedAt,
		// displayDate wins so a month-only post reads "May 2026", not "1 May 2026".
		dateLabel: str(r.displayDate) ?? formatDate(publishedAt),
		dateISO: publishedAt ? publishedAt.slice(0, 10) : null,
		image: img(r.mainImage),
		categories: (r.categories ?? [])
			.map((x: any) => ({slug: str(x?.slug) ?? '', title: str(x?.title) ?? ''}))
			.filter((x: BlogCategory) => x.slug && x.title),
	}
}

let cachedList: Promise<BlogCard[]> | null = null

async function loadList(): Promise<BlogCard[]> {
	if (!isSanityConfigured) return []
	try {
		const rows = await sanityClient.fetch<Record<string, any>[]>(BLOG_LIST_QUERY)
		return (rows ?? []).map(card).filter((x): x is BlogCard => x !== null)
	} catch (error) {
		console.error('[sanity] blog: list fetch failed —', error)
		return []
	}
}

/** Every published post, newest first. */
export function getBlogPosts(): Promise<BlogCard[]> {
	if (!cachedList) cachedList = loadList()
	return cachedList
}

export async function getBlogCategories(): Promise<BlogCategory[]> {
	if (!isSanityConfigured) return []
	try {
		const rows = await sanityClient.fetch<Record<string, any>[]>(BLOG_CATEGORIES_QUERY)
		return (rows ?? [])
			.map((x) => ({slug: str(x?.slug) ?? '', title: str(x?.title) ?? ''}))
			.filter((x) => x.slug && x.title)
	} catch (error) {
		console.error('[sanity] blog: categories fetch failed —', error)
		return []
	}
}

/**
 * One post by slug, or null. Returns null rather than throwing so a slug that
 * disappears between builds 404s instead of failing the whole build — the
 * grid and sitemap are already derived from the same filtered list, so this
 * only happens if a post is unpublished mid-build.
 */
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
	if (!isSanityConfigured) return null
	let row: Record<string, any> | null = null
	try {
		row = await sanityClient.fetch<Record<string, any>>(BLOG_BY_SLUG_QUERY, {slug})
	} catch (error) {
		console.error(`[sanity] blog: fetch failed for "${slug}" —`, error)
		return null
	}
	const base = row ? card(row) : null
	if (!base || !row) return null

	const body: RichBlock[] = Array.isArray(row.body) ? row.body : []

	// Editor-chosen related posts win. Otherwise: same category, newest first,
	// topped up with recent posts so the row is never partly empty.
	const all = await getBlogPosts()
	const chosen = (row.relatedPosts ?? []).map(card).filter((x: BlogCard | null): x is BlogCard => x !== null)
	const catSlugs = new Set(base.categories.map((c) => c.slug))
	const sameCategory = all.filter(
		(p) => p.slug !== base.slug && p.categories.some((c) => catSlugs.has(c.slug)),
	)
	const recent = all.filter((p) => p.slug !== base.slug)
	const related: BlogCard[] = []
	for (const p of [...chosen, ...sameCategory, ...recent]) {
		if (p.slug === base.slug || related.some((r) => r.slug === p.slug)) continue
		related.push(p)
		if (related.length === 3) break
	}

	const updatedAt = str(row.updatedAt)
	return {
		...base,
		updatedAt,
		updatedLabel: formatDate(updatedAt),
		body,
		authors: (row.authors ?? [])
			.map((a: any) => ({
				slug: str(a?.slug) ?? '',
				name: str(a?.name) ?? '',
				jobTitle: str(a?.jobTitle),
				image: img(a?.image),
			}))
			.filter((a: BlogAuthor) => a.slug && a.name),
		related,
		readingMinutes: readingMinutes(body),
		seoTitle: str(row.seo?.metaTitle),
		seoDescription: str(row.seo?.metaDescription),
		canonicalUrl: str(row.seo?.canonicalUrl),
		noIndex: row.seo?.noIndex === true,
		ogTitle: str(row.seo?.ogTitle),
		ogDescription: str(row.seo?.ogDescription),
		ogImage: img(row.seo?.ogImage),
	}
}

/** Neighbours in the same order the grid uses, so the two cannot disagree. */
export async function getAdjacentPosts(slug: string): Promise<{prev: BlogCard | null; next: BlogCard | null}> {
	const all = await getBlogPosts()
	const i = all.findIndex((p) => p.slug === slug)
	if (i === -1) return {prev: null, next: null}
	// The list is newest-first: "previous" reads as the older post.
	return {prev: all[i + 1] ?? null, next: all[i - 1] ?? null}
}
