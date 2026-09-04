// Upcoming events for the News & Events page. Rendered by
// src/pages/news-events.astro — that file is the only consumer. Add new events
// at the top; the page alternates the image side by array index.
//
// Fields:
//   slug           string   anchor id on the card
//   date           string   free text, rendered inside <time>
//   category       string   orange pill above the headline
//   headline       string   card <h2>
//   image          string   path under /public; .avif and .webp siblings must
//                           exist on disk (Picture.astro derives them)
//   imageAlt       string   required — describes the poster's own text
//   imageWidth     number   intrinsic pixel width; defaults to 800
//   imageHeight    number   intrinsic pixel height; defaults to 600. Give the
//                           real dimensions for a 'contain' poster — the
//                           stacked layout reserves space from this ratio
//   imageFit       'contain' shows the whole image (posters); default crops
//   imageBackdrop  string   letterbox colour behind a 'contain' image;
//                           defaults to #0d2438 when omitted
//   imagePosition  string   object-position when cropping
//   imageLayout    'bottom' full-width 16/9 image below the body
//   body           string[] one paragraph per entry
//   allowHtml      boolean  render body entries as HTML (trusted, local copy)
//   clinicians     string[] team.js slugs to show as profile cards
//   cta            {label, href, external}

/**
 * @typedef {Object} Event
 * @property {string} slug
 * @property {string} [date]
 * @property {string} [category]
 * @property {string} headline
 * @property {string} [image]
 * @property {string} [imageAlt]
 * @property {number} [imageWidth]
 * @property {number} [imageHeight]
 * @property {'contain'} [imageFit]
 * @property {string} [imageBackdrop]
 * @property {string} [imagePosition]
 * @property {'bottom'} [imageLayout]
 * @property {string[]} body
 * @property {boolean} [allowHtml]
 * @property {string[]} [clinicians]
 * @property {{label: string, href: string, external?: boolean}} [cta]
 */

/** @type {Event[]} */
export const events = [
	{
		slug: 'wellness-meet-the-team-october-2026',
		date: 'Thursday 8 October 2026, 12pm–1pm',
		category: 'Upcoming Event',
		headline: 'Save the date: our Meet The Team - Wellness Event',
		image: '/news/wellness-meet-the-team-october-2026.jpg',
		imageAlt:
			'Wellness Event: Meet the Team poster — Thursday 8 October, 12:00–1:00pm. Meet our Wellness & Performance Team: Sally McGinn, Chartered Sports Performance Psychologist; Richard Lepper, Clinical Hypnotherapy & Mental Health Practitioner; and Kat Johnson, Holistic Therapist. To register email admin@balancephysio.com. Attend in person or virtually.',
		imageWidth: 1414,
		imageHeight: 2000,
		imageFit: 'contain',
		// The poster's own paper colour, so the letterbox reads as part of it.
		imageBackdrop: '#fff2d7',
		body: [
			"Wellness is a continuum within performance — so how can you optimise your mental health and performance? Join us on 8th October at 12pm to meet our Wellness & Performance Team to find out.",
			"You'll hear from Sally McGinn, Chartered Sports Performance Psychologist; Richard Lepper, Clinical Hypnotherapy & Mental Health Practitioner; and Kat Johnson, Holistic Therapist.",
			"Because healing isn't just physical. All are welcome, and you can attend in person or virtually. To register your interest, please email admin@balancephysio.com.",
		],
	},
];
