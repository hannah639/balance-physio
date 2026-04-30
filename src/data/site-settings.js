// Site-wide settings — single source of truth.
// Used to be fetched from Sanity; now hardcoded here for simplicity.
export const siteSettings = {
	// Branding & meta
	title: 'Balance Performance Physiotherapy',
	description: "Award-winning physiotherapy clinic in Clapham, London. Expert sports injury, rehabilitation, and bike fitting services from a team of 25 specialists.",
	siteUrl: 'https://balancephysio.com',
	ogImage: '/booking-banner.jpg', // default social-share image (1200x630 recommended)

	// Analytics
	gaId: 'G-B8FXY93QVZ',
	gtmId: 'GTM-THZKT967',

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
