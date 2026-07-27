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

/**
 * Hero + content-section shape shared by `page` and `whoWeHelp` (and reusable
 * for any future type built from the same blocks). Declared once so the two
 * cannot drift apart.
 */
const PAGE_SHAPE = `
	"slug": slug.current,
	pageUrl,
	title,
	heroHighlight, heroHeading, heroSubtitle, breadcrumb, heroCtaLabel, hideHeroCta,
	heroImage${IMAGE},
	"sections": sections[coalesce(visible, true) == true]{
		eyebrow, heading, headingHighlight, body,
		image${IMAGE},
		gallery[]${IMAGE},
		imageOnRight, altBackground, ctaLabel, ctaUrl
	},
	seo{metaTitle, metaDescription, canonicalUrl, noIndex, ogTitle, ogDescription, ogImage${IMAGE}}
`

/** Who We Help audience pages (/who-we-help/<slug>/). */
export const WHO_WE_HELP_QUERY = `*[_type == "whoWeHelp" && coalesce(published, true) == true]
	| order(coalesce(displayOrder, 999) asc){${PAGE_SHAPE},
	"relatedServices": relatedServices[]->{"slug": slug.current, title}
}`

/** Standard content pages (/<slug>/). Same shape as Who We Help. */
export const PAGES_QUERY = `*[_type == "page" && coalesce(published, true) == true]
	| order(coalesce(displayOrder, 999) asc){${PAGE_SHAPE},
	"openRoles": openRoles[]{title, meta, body},
	"outcomePanels": outcomePanels[]{
		tabLabel, panelId, heading, subheading, stats[]{number, label}, body,
		quotesLabel, quotes,
		chartImage${IMAGE}
	}
}`

/**
 * General FAQs — the shared question list shown on /faqs/.
 * Answers stay as raw Portable Text so links and bold survive to the renderer.
 */
export const GENERAL_FAQS_QUERY = `*[_type == "generalFaqs"][0]{
	heroHighlight, heroHeading, heroSubtitle, breadcrumb,
	heroImage${IMAGE},
	sectionTitle,
	introText,
	"faqs": faqs[]{_key, question, answer},
	seo{metaTitle, metaDescription, canonicalUrl, noIndex, ogTitle, ogDescription, ogImage${IMAGE}}
}`

/**
 * Service pages (/service/<slug>/). Same hero + content-section shape as Pages,
 * plus the photo band and the page's own FAQs.
 */
export const SERVICES_QUERY = `*[_type == "service" && coalesce(published, true) == true]
	| order(coalesce(displayOrder, 999) asc){${PAGE_SHAPE},
	category,
	summary,
	"photoGallery": photoGallery[]${IMAGE},
	"faqs": faqs[]{_key, question, answer}
}`

/**
 * Condition detail pages (/condition/<slug>/).
 *
 * Four fixed blocks — intro · symptoms · treatment · who we help — each with
 * its own heading and highlighted words, so none of them stay hard-coded in
 * ConditionPage.astro. Only the intro and "who" bands take an image.
 */
export const CONDITIONS_QUERY = `*[_type == "condition" && coalesce(published, true) == true]
	| order(coalesce(displayOrder, 999) asc){
	"slug": slug.current,
	title,
	heroHighlight, heroHeading, heroSubtitle, breadcrumb,
	body,
	introImage${IMAGE}, introImageAspect,
	whoImage${IMAGE}, whoImageAspect,
	symptomsHeading, symptomsHighlight, symptomsIntro, symptoms,
	treatmentHeading, treatmentHighlight, treatmentIntro, treatmentList,
	whoHeading, whoHighlight, whoIntro, whoList,
	"faqs": faqs[]{_key, question, answer},
	seo{metaTitle, metaDescription, canonicalUrl, noIndex, ogTitle, ogDescription, ogImage${IMAGE}}
}`

/**
 * Homepage singleton.
 *
 * The service cards and condition pills are CURATED lists, not listings of the
 * Service/Condition post types — the order is editorial and a few entries point
 * somewhere other than their own page. Each entry resolves its target inline so
 * the frontend receives `_type` + `slug` and never a stored URL, with `url` as
 * the escape hatch for the handful that need it.
 */
export const HOMEPAGE_QUERY = `*[_type == "homepage"][0]{
	heroEyebrow, heroTagline, heroSubtext, heroVideoPath, heroPoster${IMAGE},

	aboutEyebrow, aboutHeadingHighlight, aboutHeading, aboutLead, aboutBody,
	aboutStats[]{_key, number, label},
	aboutCtaLabel, aboutCtaUrl,

	activitiesEyebrow, activitiesHeading, activitiesIntro,
	activitiesSlides[]${IMAGE},

	approachHeadingHighlight, approachHeading, approachIntro,
	approachSteps[]{_key, tag, heading, bullets, icon, featured},

	servicesVisible, servicesEyebrow, servicesHeadingHighlight, servicesHeading, servicesIntro,
	"servicesCards": servicesCards[]{
		_key, title, url,
		"target": service->{_type, "slug": slug.current},
		background${IMAGE}
	},

	conditionsVisible, conditionsEyebrow, conditionsHeading, conditionsIntro,
	"conditionsLinks": conditionsLinks[]{
		_key, label, url,
		"target": target->{_type, "slug": slug.current}
	},

	teamVisible, teamEyebrow, teamHeading, teamIntro,

	facilitiesEyebrow, facilitiesHeading, facilitiesText,
	facilitiesImage${IMAGE}, facilitiesCtaLabel, facilitiesCtaUrl,

	quoteImage${IMAGE}, quoteText, quoteAttribution,

	bookingHeading, bookingText, bookingButtonLabel,
	seo{metaTitle, metaDescription, canonicalUrl, noIndex, ogTitle, ogDescription, ogImage${IMAGE}}
}`

/* ── Blog ────────────────────────────────────────────────────────────────── */

/**
 * Fields every blog listing needs. Kept to what a card renders — the body is
 * deliberately excluded so the grid does not download seven full articles.
 */
const BLOG_CARD = `
	"slug": slug.current,
	title,
	excerpt,
	publishedAt,
	displayDate,
	mainImage${IMAGE},
	"categories": categories[]->{"slug": slug.current, title}
`

/**
 * Published posts, newest first. `published == false` and unpublished drafts
 * are filtered here in GROQ, so an unpublished post cannot reach the grid, a
 * page, the sitemap or another post's related list.
 */
export const BLOG_LIST_QUERY = `*[_type == "blog" && !(_id in path("drafts.**")) && coalesce(published, true) == true && defined(slug.current)]
	| order(publishedAt desc){${BLOG_CARD}}`

/** One post, with everything its page renders. */
export const BLOG_BY_SLUG_QUERY = `*[_type == "blog" && !(_id in path("drafts.**")) && coalesce(published, true) == true && slug.current == $slug][0]{
	${BLOG_CARD},
	updatedAt,
	// Image blocks inside the body are resolved here; without this the
	// renderer only sees an asset reference and silently drops the picture.
	body[]{
		...,
		_type == "image" => {
			"url": asset->url,
			"alt": coalesce(alt, ""),
			"width": asset->metadata.dimensions.width,
			"height": asset->metadata.dimensions.height,
			caption
		}
	},
	"authors": authors[]->{"slug": slug.current, name, jobTitle, image${IMAGE}},
	"relatedPosts": relatedPosts[]->{${BLOG_CARD}},
	seo{metaTitle, metaDescription, canonicalUrl, noIndex, ogTitle, ogDescription, ogImage${IMAGE}}
}`

/** Categories that actually have a published post behind them. */
export const BLOG_CATEGORIES_QUERY = `*[_type == "category" && count(*[_type == "blog" && coalesce(published, true) == true && references(^._id)]) > 0]
	| order(title asc){"slug": slug.current, title}`
