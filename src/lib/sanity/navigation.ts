/**
 * Navigation resolution — turns the raw `navigation` singleton into ready-to-
 * render links, and falls back to the site's original hard-coded menus if
 * Sanity is unreachable or the document is empty.
 *
 * Runs at BUILD time inside the shared getGlobals() fetch, so:
 *   - there is no extra network request,
 *   - there is no client-side JavaScript,
 *   - the menu is fully present in the HTML (no layout shift, no loading delay).
 */
import {resolveHref} from './routes'
import {NAVIGATION_FALLBACK} from '../../data/navigation-fallback'
import type {
	HeaderEntry,
	NavGroup,
	NavGroupRaw,
	NavItemRaw,
	NavLink,
	NavigationQueryResult,
	ResolvedNavigation,
} from './types'

function str(v: unknown): string | null {
	if (typeof v !== 'string') return null
	const t = v.trim()
	return t.length ? t : null
}

/**
 * Resolve one item. Returns null when the link can't be built — a missing,
 * unpublished or slugless reference — so the caller drops it rather than
 * rendering a dead href.
 */
function link(item: NavItemRaw | null | undefined): NavLink | null {
	if (!item) return null

	const external = item.linkType === 'external'
	const href = external
		? str(item.externalUrl)
		: item.target?.published === false
			? null
			: resolveHref({_type: item.target?._type, slug: item.target?.slug})

	if (!href) return null

	// Label priority: explicit menu label -> referenced document title.
	// The SEO/meta title is never used (they are long and location-suffixed).
	const label = str(item.label)
	if (!label) return null

	return {
		label,
		href,
		external,
		newTab: item.openInNewTab === true,
		isPrimary: item.isPrimary === true,
	}
}

function group(g: NavGroupRaw | null | undefined): NavGroup | null {
	const title = str(g?.title)
	const items = (g?.items ?? []).map(link).filter((x): x is NavLink => x !== null)
	// A group with no resolvable items would render an empty dropdown column.
	if (!items.length) return null
	return {title: title ?? '', sublabel: str(g?.sublabel), column: g?.column ?? null, items}
}

export function resolveNavigation(data: NavigationQueryResult): ResolvedNavigation {
	const header: HeaderEntry[] = (data?.header ?? [])
		.map((e) => {
			const groups = (e?.groups ?? []).map(group).filter((x): x is NavGroup => x !== null)
			const direct = link(e?.link)
			const label = str(e?.label)
			// Nothing to click and nothing to open -> drop the whole entry.
			if (!label || (!direct && !groups.length)) return null
			return {
				label,
				link: direct,
				groups,
				showInHeader: e?.showInHeader !== false,
				showInMobile: e?.showInMobile !== false,
				// Presentation: which dropdown layout to render, plus the
				// feature-panel content. Defaults to 'simple' so an entry with
				// no style set still renders a normal dropdown.
				dropdownStyle: str(e?.dropdownStyle) ?? 'simple',
				introEyebrow: str(e?.introEyebrow),
				introText: str(e?.introText),
				cardImagePath: str(e?.cardImagePath),
				cardUsesBookingLink: e?.cardUsesBookingLink === true,
			}
		})
		.filter((x): x is HeaderEntry => x !== null)

	const footerGroups = (data?.footerGroups ?? []).map(group).filter((x): x is NavGroup => x !== null)
	const footerLegal = (data?.footerLegal ?? []).map(link).filter((x): x is NavLink => x !== null)

	const year = String(new Date().getFullYear())

	// SAFETY NET: if Sanity produced no header entries (unreachable, empty, or
	// a build host with no SANITY_PROJECT_ID) fall back to the generated
	// snapshot. Without this the site would deploy with no navigation at all.
	if (!header.length) {
		return {
			fromCms: false,
			...NAVIGATION_FALLBACK,
			copyrightText: NAVIGATION_FALLBACK.copyrightText.replace('{year}', year),
		}
	}

	const copyright = (str(data?.copyrightText) ?? NAVIGATION_FALLBACK.copyrightText).replace('{year}', year)

	return {fromCms: true, header, footerGroups, footerLegal, copyrightText: copyright}
}
