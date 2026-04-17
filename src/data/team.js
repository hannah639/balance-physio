// Team roster. Each member has a slug which generates their bio page URL at /team/<slug>.
// Add a `bio` field (array of paragraphs) when real bio content is available.

export const team = [
	{ slug: 'dr-lucy-goldby', name: 'Dr. Lucy Goldby', role: 'Consultant Spinal Physiotherapist' },
	{ slug: 'caroline-curtis', name: 'Caroline Curtis', role: 'Consultant Spinal Physiotherapist' },
	{ slug: 'sophia-busfield', name: 'Sophia Busfield', role: 'Consultant Physiotherapist' },
	{ slug: 'graham-anderson', name: 'Graham Anderson', role: 'Consultant Physiotherapist' },
	{ slug: 'jonathan-zulueta', name: 'Jonathan Zulueta', role: 'Consultant Neurological & Vestibular Physiotherapist' },
	{ slug: 'jo-fordyce', name: 'Jo Fordyce', role: "Consultant Women's & Men's Health Physiotherapist" },
	{ slug: 'dr-jose-sanz-mengibar', name: 'Dr. Jose Sanz Mengibar', role: 'Consultant Neurological Physiotherapist, Vojta Therapist' },
	{ slug: 'dan-elias', name: 'Dan Elias', role: 'Consultant Youth & Sports Injury Physiotherapist' },
	{ slug: 'jonathan-lewis', name: 'Jonathan Lewis', role: 'Physiotherapist, Soft Tissue & S&C Coach' },
	{ slug: 'joanne-coates', name: 'Joanne Coates', role: 'Physiotherapist' },
	{ slug: 'anthony-adesanmi', name: 'Anthony Adesanmi', role: 'Physiotherapist' },
	{ slug: 'jarryd-ferreira', name: 'Jarryd Ferreira', role: 'Physiotherapist' },
	{ slug: 'joanne-sullivan', name: 'Joanne Sullivan', role: 'Physiotherapist' },
	{ slug: 'sam-stringer', name: 'Sam Stringer', role: 'Physiotherapist' },
	{ slug: 'portia-morey', name: 'Portia Morey', role: 'Physiotherapist' },
	{ slug: 'claire-speer', name: 'Claire Speer', role: 'Physiotherapist' },
	{ slug: 'maxine-baillie-harland', name: 'Maxine Baillie-Harland', role: 'Neurological Physiotherapist' },
	{ slug: 'steven-connor', name: 'Steven Connor', role: 'Podiatrist' },
	{ slug: 'eli-ferracci', name: 'Eli Ferracci', role: 'Nutritional Therapist & Osteopath' },
	{ slug: 'deri-wilson', name: 'Deri Wilson', role: 'Soft Tissue Massage Therapist' },
	{ slug: 'kellie-collar', name: 'Kellie Collar', role: 'Soft Tissue Massage Therapist' },
	{ slug: 'claire-benson', name: 'Claire Benson', role: 'Soft Tissue Massage Therapist' },
	{ slug: 'alex-deif', name: 'Alex Deif', role: 'Strength & Conditioning Coach' },
	{ slug: 'ron-burnett', name: 'Ron Burnett', role: 'Strength & Conditioning Coach' },
	{ slug: 'pat-leahy', name: 'Pat Leahy', role: 'Bike Fitting Specialist' },
	{ slug: 'alice-croucher', name: 'Alice Croucher', role: 'Pilates Teacher' },
	{ slug: 'agur-arrien', name: 'Agur Arrien', role: 'Pilates Teacher' },
];

// Initials helper for placeholder avatars
export function initials(name) {
	return name
		.replace(/^(Dr|Mr|Ms|Mrs)\.?\s+/i, '')
		.split(' ')
		.filter(Boolean)
		.map((w) => w[0])
		.join('')
		.slice(0, 2)
		.toUpperCase();
}

// Deterministic gradient per name so avatar cards feel unique
export function gradientFor(name) {
	var hash = 0;
	for (var i = 0; i < name.length; i++) hash = (hash << 5) - hash + name.charCodeAt(i);
	var hue = Math.abs(hash) % 360;
	return `linear-gradient(135deg, hsl(${hue}, 45%, 42%) 0%, hsl(${(hue + 40) % 360}, 40%, 28%) 100%)`;
}
