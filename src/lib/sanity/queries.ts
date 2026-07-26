/**
 * Central GROQ for global (site-wide) data.
 *
 * ONE query, ONE network round trip per build. Every component reads the
 * result via `getGlobals()` in ./globals.ts — no component fetches on its own.
 *
 * Projections are explicit (no `...` spreads) so the data contract is visible
 * here and stays aligned with the TypeScript types in ./types.ts.
 */

/** Reusable image projection: URL + dimensions for width/height attrs. */
const IMAGE = `{
	"url": asset->url,
	"alt": coalesce(alt, ""),
	"mimeType": asset->mimeType,
	"width": asset->metadata.dimensions.width,
	"height": asset->metadata.dimensions.height
}`

/**
 * /pricing/ page content. Ordering and active-filtering happen here in GROQ so
 * the component receives a ready-to-render list. Rows stay nested under their
 * group (the group's optional sub-heading is part of the design); the resolver
 * flattens them for the card layout.
 */
export const PRICING_QUERY = `*[_type == "pricing"][0]{
	heroHeading,
	heroHighlight,
	heroSubtitle,
	breadcrumb,
	heroImage${IMAGE},
	eyebrow,
	sectionHeading,
	introText,
	insuranceNotice{
		enabled, eyebrow, heading, headingHighlight, body, phone, whatsapp, whatsappUrl, email
	},
	seo{
		metaTitle,
		metaDescription,
		canonicalUrl,
		noIndex,
		ogTitle,
		ogDescription,
		ogImage${IMAGE}
	},
	"categories": categories[coalesce(active, true) == true] | order(coalesce(displayOrder, 999) asc){
		"id": slug.current,
		label,
		title,
		description,
		"groups": groups[]{
			heading,
			"rows": rows[coalesce(active, true) == true] | order(coalesce(displayOrder, 999) asc){
				"name": title, price, secondaryPrice, note, badge
			}
		},
		"plans": plans[coalesce(active, true) == true] | order(coalesce(displayOrder, 999) asc){
			name, price, period, notes, features
		}
	}
}`

/**
 * Clinic location pages (/clinic/<slug>/).
 *
 * Each on-page section is a tab in the Studio (Location Details, Opening
 * Hours, What's Here) and carries its OWN eyebrow + <h2> + highlighted word,
 * so every heading is editable rather than hard-coded in the template.
 */
export const CLINIC_LOCATIONS_QUERY = `*[_type == "clinicLocation" && coalesce(published, true) == true]
	| order(coalesce(displayOrder, 999) asc){
	"slug": slug.current,
	pageUrl,
	title,
	isPrimary,
	listImage${IMAGE},

	heroHighlight, heroHeading, heroSubtitle, breadcrumb, heroCtaLabel, hideHeroCta,
	heroImage${IMAGE},

	"location": {
		"eyebrow": locationEyebrow,
		"heading": locationHeading,
		"highlight": locationHeadingHighlight,
		"address": address,
		"phoneNumber": phoneNumber,
		"email": email,
		"mapsUrl": mapsUrl,
		"mapEmbed": googleMapEmbed,
		"directions": directions,
		"note": locationNote
	},

	"hours": {
		"eyebrow": hoursEyebrow,
		"heading": hoursHeading,
		"highlight": hoursHeadingHighlight,
		"rows": openingHours[]{_key, day, hours},
		"notes": hoursNotes,
		"image": hoursImage${IMAGE}
	},

	"whatsHere": {
		"eyebrow": facilitiesEyebrow,
		"heading": facilitiesHeading,
		"highlight": facilitiesHeadingHighlight,
		"items": facilities,
		"gallery": facilitiesGallery[]${IMAGE},
		"services": servicesAvailable[]->{"slug": slug.current, title}
	},

	seo{metaTitle, metaDescription, canonicalUrl, noIndex, ogTitle, ogDescription, ogImage${IMAGE}}
}`

const NAV_ITEM = `{
	"label": coalesce(label, reference->title, reference->name),
	linkType,
	openInNewTab,
	isPrimary,
	"target": reference->{
		_type,
		"slug": slug.current,
		"published": coalesce(published, true)
	},
	externalUrl
}`

const NAV_ITEMS = `[coalesce(disabled, false) == false]${NAV_ITEM}[
	linkType == "external" && defined(externalUrl)
	|| (defined(target) && target.published == true)
]`

const NAV_GROUP = `{
	title,
	sublabel,
	column,
	"items": items${NAV_ITEMS}
}`

export const GLOBALS_QUERY = `{
	"site": *[_type == "siteSettings"][0]{
		discourageSearchEngines,
		colouredLogo${IMAGE},
		needWhiteLogo,
		whiteLogo${IMAGE},
		"faviconIcoUrl": faviconIco.asset->url,
		"appleTouchIconUrl": appleTouchIcon.asset->url,
		"faviconSvgUrl": faviconSvg.asset->url,
		phoneNumber,
		email,
		address,
		googleMapEmbed,
		openingHours[]{_key, day, hours}
	},
	"seo": *[_type == "seoSettings"][0]{
		siteName,
		titleTemplate,
		defaultMetaTitle,
		defaultMetaDescription,
		twitterHandle,
		organizationName,
		defaultOgImage${IMAGE},
		googleSiteVerification,
		bingVerification,
		baiduVerification,
		yandexVerification,
		pinterestVerification,
		facebookDomainVerification,
		nortonSafeWeb,
		customWebmasterTags,
		robotsTxt,
		localSeo{
			businessName,
			businessType,
			businessDescription,
			websiteUrl,
			primaryPhone,
			secondaryPhone,
			email,
			priceRange,
			streetAddress,
			city,
			county,
			postcode,
			country,
			countryCode,
			latitude,
			longitude,
			mapsUrl,
			socialProfiles[]{_key, platform, url},
			openingHours[]{_key, day, closed, open, close},
			services,
			areasServed,
			aggregateRating,
			reviewCount,
			faq[]{_key, question, answer},
			logo{"url": asset->url, "alt": coalesce(alt, "")},
			primaryImage{"url": asset->url, "alt": coalesce(alt, "")}
		}
	},
	"navigation": *[_type == "navigation"][0]{
		"header": headerEntries[coalesce(showInHeader, true) == true || coalesce(showInMobile, true) == true]{
			label,
			showInHeader,
			showInMobile,
			dropdownStyle,
			introEyebrow,
			introText,
			cardImagePath,
			cardUsesBookingLink,
			"link": link${NAV_ITEMS}[0],
			"groups": groups[]${NAV_GROUP}
		},
		"footerGroups": footerGroups[]${NAV_GROUP},
		"footerLegal": footerLegalItems${NAV_ITEMS},
		copyrightText
	},
	"booking": *[_type == "bookingLinks"][0]{
		primaryUrl,
		primaryLabel,
		cards[]{
			_key, eyebrow, title, text, url, ctaLabel, ariaLabel, displayOrder, active,
			bgImage${IMAGE}
		}
	}
}`

/**
 * Navigation — header and footer, from the `navigation` singleton.
 *
 * Every item resolves its target inline so the frontend receives `_type` +
 * `slug` and never a stored URL. Items are filtered here in GROQ:
 *   - `disabled` items are dropped
 *   - internal items whose reference is missing/unpublished/slugless are
 *     dropped, so a deleted document can never render a broken link
 */
export const NAVIGATION_QUERY = `*[_type == "navigation"][0]{
	"header": headerEntries[coalesce(showInHeader, true) == true || coalesce(showInMobile, true) == true]{
		label,
		showInHeader,
		showInMobile,
		"link": link${NAV_ITEMS}[0],
		"groups": groups[]${NAV_GROUP}
	},
	"footerGroups": footerGroups[]${NAV_GROUP},
	"footerLegal": footerLegalItems${NAV_ITEMS},
	copyrightText
}`

/**
 * Team members — powers the homepage carousel, /meet-the-team/ and every
 * /team/<slug>/ profile page. Ordered and published-filtered here so the
 * components receive a ready list.
 */
export const TEAM_QUERY = `*[_type == "teamMember" && coalesce(published, true) == true]
	| order(coalesce(displayOrder, 999) asc){
	"slug": slug.current,
	name,
	jobTitle,
	wellnessOnly,
	image${IMAGE},
	bio,
	qualifications,
	specialistAreas,
	email,
	phone,
	seo{metaTitle, metaDescription, noIndex, ogImage${IMAGE}}
}`
