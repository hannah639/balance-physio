/**
 * TypeScript contract for the global GROQ result in ./queries.ts.
 *
 * Everything Sanity returns is optional/nullable by design: the singletons are
 * editor-managed and any field can be blank. Callers are forced to handle the
 * empty case, which is what keeps the site from breaking on an unpopulated
 * field. `getGlobals()` resolves these into the non-optional `ResolvedGlobals`.
 */

export type SanityImage = {
	url: string | null
	alt: string | null
	mimeType: string | null
	width: number | null
	height: number | null
} | null

export type OpeningHoursRow = {
	_key: string
	day: string | null
	hours: string | null
}

export type SocialProfile = {
	_key: string
	platform: string | null
	url: string | null
}

export type SiteSettings = {
	discourageSearchEngines: boolean | null
	colouredLogo: SanityImage
	needWhiteLogo: boolean | null
	whiteLogo: SanityImage
	faviconIcoUrl: string | null
	appleTouchIconUrl: string | null
	faviconSvgUrl: string | null
	phoneNumber: string | null
	email: string | null
	address: string | null
	googleMapEmbed: string | null
	openingHours: OpeningHoursRow[] | null
} | null

export type LocalSeo = {
	businessName: string | null
	businessType: string | null
	businessDescription: string | null
	websiteUrl: string | null
	primaryPhone: string | null
	secondaryPhone: string | null
	email: string | null
	priceRange: string | null
	streetAddress: string | null
	city: string | null
	county: string | null
	postcode: string | null
	country: string | null
	countryCode: string | null
	latitude: number | null
	longitude: number | null
	mapsUrl: string | null
	socialProfiles: SocialProfile[] | null
	openingHours: {_key: string; day: string | null; closed: boolean | null; open: string | null; close: string | null}[] | null
	services: string[] | null
	areasServed: string[] | null
	aggregateRating: number | null
	reviewCount: number | null
	faq: {_key: string; question: string | null; answer: string | null}[] | null
	logo: {url: string | null; alt: string | null} | null
	primaryImage: {url: string | null; alt: string | null} | null
} | null

export type SeoSettings = {
	siteName: string | null
	titleTemplate: string | null
	defaultMetaTitle: string | null
	defaultMetaDescription: string | null
	twitterHandle: string | null
	organizationName: string | null
	defaultOgImage: SanityImage
	googleSiteVerification: string | null
	bingVerification: string | null
	baiduVerification: string | null
	yandexVerification: string | null
	pinterestVerification: string | null
	facebookDomainVerification: string | null
	nortonSafeWeb: string | null
	customWebmasterTags: string | null
	robotsTxt: string | null
	localSeo: LocalSeo
} | null

export type BookingCard = {
	_key: string
	eyebrow: string | null
	title: string | null
	text: string | null
	url: string | null
	ctaLabel: string | null
	ariaLabel: string | null
	displayOrder: number | null
	active: boolean | null
	bgImage: SanityImage
}

export type BookingLinks = {
	/** The single booking URL used by every "Book Now" button site-wide. */
	primaryUrl: string | null
	primaryLabel: string | null
	cards: BookingCard[] | null
} | null

// ── Pricing page ─────────────────────────────────────────────────────────

export type PriceRow = {
	name: string | null
	price: string | null
	secondaryPrice: string | null
	note: string | null
	badge: string | null
}

export type PriceGroup = {
	heading: string | null
	rows: PriceRow[] | null
}

export type PricePlan = {
	name: string | null
	price: string | null
	period: string | null
	notes: string[] | null
	features: string[] | null
}

export type PricingCategory = {
	id: string | null
	label: string | null
	title: string | null
	description: string | null
	groups: PriceGroup[] | null
	plans: PricePlan[] | null
}

export type InsuranceNotice = {
	enabled: boolean | null
	eyebrow: string | null
	heading: string | null
	headingHighlight: string | null
	body: string | null
	phone: string | null
	whatsapp: string | null
	whatsappUrl: string | null
	email: string | null
} | null

export type PricingSeo = {
	metaTitle: string | null
	metaDescription: string | null
	canonicalUrl: string | null
	noIndex: boolean | null
	ogTitle: string | null
	ogDescription: string | null
	ogImage: SanityImage
} | null

/** Raw shape returned by PRICING_QUERY. */
export type PricingQueryResult = {
	heroHeading: string | null
	heroHighlight: string | null
	heroSubtitle: string | null
	breadcrumb: string | null
	heroImage: SanityImage
	eyebrow: string | null
	sectionHeading: string | null
	introText: string | null
	insuranceNotice: InsuranceNotice
	seo: PricingSeo
	categories: PricingCategory[] | null
} | null

/** A category flattened for the card grid. */
export type ResolvedPricingCategory = {
	anchor: string
	title: string
	description: string | null
	/** Group sub-heading (rendered only when the editor set one). */
	sections: {heading: string | null; items: {name: string; price: string; note: string | null; badge: string | null}[]}[]
}

/** Fallback-applied pricing content the page renders. */
export type ResolvedPricing = {
	fromCms: boolean
	heroHeading: string
	heroHighlight: string
	heroSubtitle: string
	breadcrumb: string
	heroImageUrl: string | null
	heroImageAlt: string
	seoTitle: string
	seoDescription: string
	noIndex: boolean
	insuranceNotice: {
		eyebrow: string
		heading: string
		headingHighlight: string
		body: string
		phone: string | null
		whatsapp: string | null
		whatsappUrl: string | null
		email: string | null
	} | null
	categories: ResolvedPricingCategory[]
}

/** Raw shape returned by GLOBALS_QUERY. */
export type GlobalsQueryResult = {
	site: SiteSettings
	seo: SeoSettings
	booking: BookingLinks
	navigation: NavigationQueryResult
}

/** A social link resolved to something renderable. */
export type ResolvedSocial = {
	platform: string
	url: string
}

/**
 * The merged, fallback-applied shape every component consumes. No optional
 * chaining needed downstream — if Sanity is empty, these hold the site's
 * pre-CMS hard-coded values.
 */
export type ResolvedGlobals = {
	/** True when a live siteSettings document was fetched. */
	fromCms: boolean

	// Identity / SEO defaults
	siteName: string
	defaultMetaTitle: string
	defaultMetaDescription: string
	titleTemplate: string | null
	siteUrl: string
	twitterHandle: string | null
	defaultOgImageUrl: string | null

	// Global search-engine visibility
	discourageSearchEngines: boolean
	/** Raw robots.txt body from SEO Settings; null = use the built-in default. */
	robotsTxt: string | null

	// Verification tokens (only rendered when non-empty)
	verification: {
		google: string | null
		bing: string | null
		baidu: string | null
		yandex: string | null
		pinterest: string | null
		facebook: string | null
		norton: string | null
		custom: string | null
	}

	// Branding
	logo: {url: string; alt: string; width: number | null; height: number | null; isLocal: boolean}
	whiteLogo: {url: string; alt: string; width: number | null; height: number | null} | null
	favicons: {ico: string | null; svg: string | null; appleTouch: string | null}

	// Contact (display — sourced from siteSettings)
	phoneNumber: string
	phoneHref: string
	email: string
	address: string
	googleMapEmbed: string | null
	openingHours: {day: string; hours: string}[]

	// Social
	socials: ResolvedSocial[]

	// Structured data (sourced from seoSettings.localSeo)
	business: {
		name: string
		type: string
		description: string | null
		phone: string | null
		email: string | null
		priceRange: string | null
		streetAddress: string | null
		city: string | null
		region: string | null
		postalCode: string | null
		country: string | null
		latitude: number | null
		longitude: number | null
		/** schema.org openingHoursSpecification rows, from localSeo. */
		openingHours: {days: string[]; opens: string | null; closes: string | null; closed: boolean}[]
		areasServed: string[]
		services: string[]
		logoUrl: string | null
		imageUrl: string | null
		aggregateRating: number | null
		reviewCount: number | null
		faq: {question: string; answer: string}[]
	}

	/** Header + footer menus, fully resolved. */
	nav: ResolvedNavigation

	// Booking — single source of truth (Sanity: Booking Links)
	bookingUrl: string
	bookingLabel: string
	bookingCards: BookingCard[]
}

// ── Navigation ───────────────────────────────────────────────────────────

/** A link target as returned by NAVIGATION_QUERY (never a stored URL). */
export type NavTarget = {_type: string | null; slug: string | null; published: boolean | null} | null

export type NavItemRaw = {
	label: string | null
	linkType: string | null
	openInNewTab: boolean | null
	isPrimary: boolean | null
	target: NavTarget
	externalUrl: string | null
}

export type NavGroupRaw = {
	title: string | null
	sublabel: string | null
	column: number | null
	items: NavItemRaw[] | null
}

export type HeaderEntryRaw = {
	label: string | null
	showInHeader: boolean | null
	showInMobile: boolean | null
	dropdownStyle: string | null
	introEyebrow: string | null
	introText: string | null
	cardImagePath: string | null
	cardUsesBookingLink: boolean | null
	link: NavItemRaw | null
	groups: NavGroupRaw[] | null
}

export type NavigationQueryResult = {
	header: HeaderEntryRaw[] | null
	footerGroups: NavGroupRaw[] | null
	footerLegal: NavItemRaw[] | null
	copyrightText: string | null
} | null

/** A menu link with its URL already resolved — safe to render directly. */
export type NavLink = {
	label: string
	href: string
	external: boolean
	newTab: boolean
	isPrimary: boolean
}

export type NavGroup = {
	title: string
	sublabel: string | null
	column: number | null
	items: NavLink[]
}

export type HeaderEntry = {
	label: string
	/** Set when the top-level label itself is a link. */
	link: NavLink | null
	groups: NavGroup[]
	showInHeader: boolean
	showInMobile: boolean
	/** Layout variant: 'simple' | 'wide' | 'columns' | 'feature'. */
	dropdownStyle: string
	introEyebrow: string | null
	introText: string | null
	cardImagePath: string | null
	cardUsesBookingLink: boolean
}

export type ResolvedNavigation = {
	/** True when the menu came from Sanity rather than the hard-coded fallback. */
	fromCms: boolean
	header: HeaderEntry[]
	footerGroups: NavGroup[]
	footerLegal: NavLink[]
	copyrightText: string
}
