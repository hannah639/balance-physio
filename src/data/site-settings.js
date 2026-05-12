// Site-wide settings — single source of truth.
// Used to be fetched from Sanity; now hardcoded here for simplicity.
export const siteSettings = {
	// Branding & meta
	title: 'Physiotherapy in Clapham | Balance Performance Physiotherapy',
	description: "Expert physiotherapy in Clapham, London. Treat pain, recover from injury, and improve performance with personalised rehab at Balance Performance Physiotherapy.",
	siteUrl: 'https://balancephysio.com',
	ogImage: '/booking-banner.jpg', // default social-share image (1200x630 recommended)

	// Analytics
	// Disabled in site code — GA4 is now loaded server-side via Cloudflare Zaraz
	// (Measurement ID G-B8FXY93QVZ, configured in the Cloudflare dashboard).
	// Leave these blank to prevent double-counting. To re-enable client-side
	// loading, restore the IDs below and the CookiesBanner will load them after
	// consent.
	gaId: '',
	gtmId: '',

	// Business info — drives JSON-LD LocalBusiness structured data for SEO
	businessType: 'MedicalBusiness',
	businessName: 'Balance Performance Physiotherapy',
	phone: '+44 20 7627 4808',
	email: 'admin@balancephysio.com',
	streetAddress: '113 Gauden Road',
	city: 'London',
	region: 'England',
	postalCode: 'SW4 6LE',
	country: 'GB',
	latitude: 51.4644,
	longitude: -0.1383,
	priceRange: '££',

	// Hours: array of OpeningHoursSpecification entries
	openingHours: [
		{ dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '07:00', closes: '21:00' },
		{ dayOfWeek: ['Saturday'], opens: '08:00', closes: '14:00' },
	],

	// Social profiles (sameAs in JSON-LD)
	sameAs: [
		'https://www.facebook.com/BalancePerformance',
		'https://www.instagram.com/balanceperformancephysio/',
	],
};
