// Fallback pricing content — the exact list the page shipped with before the
// CMS was wired. Used only when Sanity is unreachable or the pricing document
// is empty, so /pricing/ can never render blank.
//
// The live source of truth is the Sanity `pricing` singleton. Edit prices
// THERE, not here.
export const pricingCategories = [
	{
		anchor: 'sports-physiotherapy',
		title: 'Sports Physiotherapy',
		items: [
			{ name: 'Initial Assessment', price: '£110', note: '45 min' },
			{ name: 'Follow Up', price: '£100', note: '30 min' },
			{ name: 'Longer Follow Up', price: '£168', note: '60 min' },
			{ name: 'Virtual Initial Assessment', price: '£95', note: '45 min · Zoom' },
			{ name: 'Virtual Follow Up', price: '£85', note: '30 min · Zoom' },
		],
	},
	{
		anchor: 'consultant-physiotherapy',
		title: 'Consultant Physiotherapy',
		items: [
			{ name: 'Initial Assessment', price: '£155', note: '45 min' },
			{ name: 'Follow Up', price: '£120', note: '30 min' },
			{ name: 'Longer Follow Up', price: '£240', note: '60 min' },
			{ name: 'Virtual Initial Assessment', price: '£120', note: '45 min · Zoom' },
			{ name: 'Virtual Follow Up', price: '£110', note: '30 min' },
		],
	},
	{
		anchor: 'womens-health',
		title: "Consultant Women's Health Physiotherapy",
		items: [
			{ name: 'Initial Assessment', price: '£155', note: '60 min' },
			{ name: 'Follow Up', price: '£120', note: '30 min' },
			{ name: 'Mummy MOT Initial', price: '£135', note: '60 min' },
			{ name: 'Mummy MOT Follow Up', price: '£105', note: '30 min' },
			{ name: 'Mummy MOT Virtual Initial', price: '£99', note: '60 min · Zoom' },
			{ name: 'Mummy MOT Virtual Follow Up', price: '£85', note: '30 min · Zoom' },
		],
	},
	{
		anchor: 'mens-health',
		title: "Consultant Men's Health Physiotherapy",
		items: [
			{ name: 'Initial Assessment', price: '£155', note: '60 min' },
			{ name: 'Follow Up', price: '£120', note: '30 min' },
		],
	},
	{
		anchor: 'youth-physiotherapy',
		title: 'Consultant Youth Physiotherapy',
		items: [
			{ name: 'Initial Assessment', price: '£155', note: '60 min' },
			{ name: 'Follow Up', price: '£120', note: '30 min' },
		],
	},
	{
		anchor: 'neurological-rehabilitation',
		title: 'Consultant Neuro, Vestibular & Vojta',
		items: [
			{ name: 'Neuro Initial', price: '£155', note: '60 min' },
			{ name: 'Neuro Follow Up', price: '£120', note: '30 min' },
			{ name: 'Vestibular Initial', price: '£155', note: '60 min' },
			{ name: 'Vestibular Follow Up', price: '£120', note: '45 min' },
			{ name: 'Vojta Initial', price: '£155', note: '60 min' },
			{ name: 'Vojta Follow Up', price: '£120', note: '60 min' },
		],
	},
	{
		anchor: 'hydrotherapy',
		title: 'Hydrotherapy',
		items: [
			{ name: 'Initial Consultation', price: '£155', note: '60 min' },
			{ name: 'Follow Up', price: '£135', note: '30 min' },
			{ name: 'Longer Follow Up', price: '£155', note: '45 min' },
		],
	},
	{
		anchor: 'additional-physio',
		title: 'Additional Physio Services',
		items: [
			{ name: 'Dry Needling Add-On', price: '£6', note: 'Limited availability' },
			{ name: 'Shockwave Initial', price: '£150', note: '' },
			{ name: 'Shockwave Follow Up', price: '£95', note: '' },
			{ name: 'Running Analysis Initial', price: '£175', note: '60 min' },
			{ name: 'Running Analysis Follow Up', price: '£105', note: '30 min' },
			{ name: 'Ergonomics Assessment Only', price: '£125', note: '60 min' },
			{ name: 'Ergonomics Full Report', price: '£175', note: '60 min' },
		],
	},
	{
		anchor: 'osteopathy',
		title: 'Osteopathy and Nutrition',
		items: [
			{ name: 'Initial Assessment', price: '£105', note: '60 min' },
			{ name: 'Follow Up', price: '£95', note: '30 min' },
		],
	},
	{
		anchor: 'podiatry',
		title: 'Podiatry & Ultrasound Scans',
		items: [
			{ name: 'Musculoskeletal Initial', price: '£125', note: '60 min' },
			{ name: 'Musculoskeletal Follow Up', price: '£75', note: '30 min' },
			{ name: 'Chiropody Assessment', price: '£75', note: '30 min' },
			{ name: 'Monthly MSK Follow Up', price: '£100', note: '45 min' },
			{ name: 'Podiatry + Ultrasound', price: '£175', note: '30 min · Includes scan report' },
			{ name: 'Add-On Ultrasound (Foot/Ankle)', price: '£80', note: '' },
		],
	},
	{
		anchor: 'sports-massage',
		title: 'Soft Tissue Therapy',
		items: [
			{ name: '30 Minutes', price: '£55', note: '' },
			{ name: '45 Minutes', price: '£73', note: '' },
			{ name: '60 Minutes', price: '£90', note: '' },
			{ name: '90 Minutes', price: '£130', note: '' },
			{ name: '45-Minute Package', price: '£511', note: '8 for the price of 7' },
			{ name: '60-Minute Package', price: '£630', note: '8 for the price of 7' },
			{ name: 'Lymphatic Drainage', price: '£100', note: '60 min' },
			{ name: 'Lymphatic Drainage Package', price: '£280', note: '3 sessions' },
		],
	},
	{
		anchor: 'strength-conditioning',
		title: 'Strength & Conditioning',
		items: [
			{ name: '30 Minutes', price: '£60', note: '' },
			{ name: '45 Minutes', price: '£75', note: '' },
			{ name: '60 Minutes', price: '£100', note: '' },
			{ name: '30-Minute Package', price: '£300', note: '6 for the price of 5' },
			{ name: '45-Minute Package', price: '£390', note: '6 for the price of 5' },
			{ name: '60-Minute Package', price: '£500', note: '6 for the price of 5' },
		],
	},
	{
		anchor: 'anti-gravity-treadmill',
		title: 'Alter G Anti-Gravity Treadmill',
		items: [
			{ name: 'Induction', price: '£50', note: '' },
			{ name: '30-Minute Single', price: '£30', note: '' },
			{ name: '60-Minute Single', price: '£51', note: '' },
			{ name: '4 × 30-Minute Package', price: '£90', note: '' },
			{ name: '8 × 30-Minute Package', price: '£150', note: '' },
			{ name: '20 × 30-Minute Package', price: '£250', note: '' },
		],
	},
	{
		anchor: 'report-writing',
		title: 'Report Writing',
		items: [
			{ name: 'Per 15 Minutes', price: '£40', note: 'For employers, schools or insurers' },
		],
	},
	{
		anchor: 'physiotherapy-prescribing',
		title: 'Physiotherapy Prescribing',
		items: [
			{ name: 'Physiotherapy Prescribing', price: '£30', note: 'For those who are not self paying' },
		],
	},
];
