// News and team achievements. Add new items at the top of the array so the
// most recent appears first on the News page.
//
// Fields:
//   slug:          URL-friendly id (used as a key, not yet routed individually)
//   date:          Display date — keep it short and human, e.g. "27 April 2026"
//   category:      Optional badge label, e.g. "Team Achievement", "Clinic Update"
//   headline:      Short, sentence-case title
//   image:         Path under /public, optional
//   imageAlt:      Description of the image for accessibility
//   imagePosition: Optional object-position for the photo crop (default "center top")
//   imageFit:      Optional "contain" to show the whole image uncropped (default crops to fill)
//   body:          Array of paragraph strings (rendered as <p>...</p>)

export const news = [
	{
		slug: 'wellness-event-september-2026',
		date: '8 September 2026',
		category: 'Upcoming Event',
		headline: 'Save the date: our Wellness & Performance evening',
		image: '/news/wellness-event-2026.jpg',
		imageAlt: 'Wellness & Performance event poster — meet Sally McGinn, Richard Lepper and Kat Johnson. Date to be confirmed. Email admin@balancephysio.com to register.',
		imageFit: 'contain',
		body: [
			"Wellness is a continuum within performance — so how can you optimise your mental health and performance? Join us on 8 September 2026 (time to be confirmed) to meet our Wellness & Performance Team and find out.",
			"You'll hear from Sally McGinn, Chartered Sports Performance Psychologist; Richard Lepper, Clinical Hypnotherapy & Mental Health Practitioner; and Kat Johnson, Holistic Therapist.",
			"Because healing isn't just physical. All are welcome, and you can attend in person or virtually. To register your interest, please email admin@balancephysio.com.",
		],
	},
	{
		slug: 'jonathan-medical-tennis-conference-2026',
		date: 'May 2026',
		category: 'Team Achievement',
		headline: 'Jonathan Zulueta speaks at the Medical Tennis Conference',
		image: '/news/jonathan-tennis-conference.jpg',
		imageAlt: 'Jonathan Zulueta presenting on tennis, vestibular function and balance at the Medical Tennis Conference',
		imagePosition: 'center',
		body: [
			"Jon had the opportunity to speak to medical professionals at the Medical Tennis Conference on the topic of tennis, vestibular function and balance.",
			"His talk and training session were received with universal acclaim — an incredible achievement and a brilliant reflection of the expertise within our team.",
		],
	},
	{
		slug: 'jo-utmb-snowdonia-2026',
		date: '17 May 2026',
		category: 'Team Achievement',
		headline: 'Jo takes on UTMB Snowdonia — Eryri',
		image: '/news/jo-utmb-snowdonia.jpg',
		imageAlt: 'Jo crossing the finish line at the UTMB Ultra-Trail Snowdonia Eryri 25k',
		body: [
			"On 17 May 2026, Jo Sullivan tackled the 25k at UTMB Snowdonia — Eryri, challenging herself in the Welsh mountains to build endurance and get out of her comfort zone.",
			"In the lead-up to the event, Jo focused on leg strengthening and hill climbs. If you're inclined (excuse the pun) to sign up for an event like this, book in with Jo for some expert advice.",
		],
	},
	{
		slug: 'alex-dorney-triathlon-2026',
		date: '2 May 2026',
		category: 'Team Achievement',
		headline: 'Alex completes the Dorney Lake Sprint Triathlon',
		image: '/news/alex-triathlon.jpg',
		imageAlt: 'Alex Deif celebrating with his finisher medal at the Dorney Lake Sprint Triathlon',
		imagePosition: 'center',
		body: [
			"On 2 May 2026, Alex Deif completed the Sprint Triathlon at Dorney Lake, Windsor — a 750m swim, 20k cycle and 5k run — in a time of 1 hour 31 minutes.",
			"As our S&C coach, Alex is more likely to be found on the ski slopes than in a swimming pool, so the swim was his big focus going in. His advice: work on your weaknesses, get used to swimming in open water, and keep strength training.",
		],
	},
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
