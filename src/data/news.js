// News and team achievements. Add new items at the top of the array so the
// most recent appears first on the News page.
//
// Fields:
//   slug:        URL-friendly id (used as a key, not yet routed individually)
//   date:        Display date — keep it short and human, e.g. "27 April 2026"
//   category:    Optional badge label, e.g. "Team Achievement", "Clinic Update"
//   headline:    Short, sentence-case title
//   image:       Path under /public, optional
//   imageAlt:    Description of the image for accessibility
//   body:        Array of paragraph strings (rendered as <p>...</p>)

export const news = [
	{
		slug: 'portia-london-marathon-2026',
		date: '27 April 2026',
		category: 'Team Achievement',
		headline: 'Huge congratulations to Portia on completing the TCS London Marathon!',
		image: '/news/portia-marathon.jpg',
		imageAlt: 'Portia from the Balance Physio team wearing her TCS London Marathon 2026 finisher medal',
		body: [
			"Last Sunday, our brilliant Portia took on the iconic TCS London Marathon — and crossed the finish line in style. From the Greenwich start through Tower Bridge to The Mall, that's 26.2 miles of grit, training and fundraising rolled into one unforgettable day.",
			"Portia trained for months around her work at the clinic and we couldn't be prouder of her. Smiles, sore legs, and a very well-earned medal — she's living proof of everything we tell our patients about preparation, consistency and trusting the process.",
			"From everyone at Balance Performance Physiotherapy: amazing work, Portia. Now go and put your feet up.",
		],
	},
];
