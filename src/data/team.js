// Team roster — placeholder photos use CSS initials until real headshots are added.
// Each member can optionally have a `photo` URL when real images are available.

export const team = [
	{ name: 'Dr. Lucy Goldby', role: 'Consultant Spinal Physiotherapist', profileUrl: 'https://balancephysio.wpenginepowered.com/team/dr-lucy-goldby/' },
	{ name: 'Caroline Curtis', role: 'Consultant Spinal Physiotherapist', profileUrl: 'https://balancephysio.wpenginepowered.com/team/caroline-curtis/' },
	{ name: 'Sophia Busfield', role: 'Consultant Physiotherapist', profileUrl: 'https://balancephysio.wpenginepowered.com/team/sophia-busfield/' },
	{ name: 'Graham Anderson', role: 'Consultant Physiotherapist', profileUrl: 'https://balancephysio.wpenginepowered.com/team/graham-anderson/' },
	{ name: 'Jonathan Zulueta', role: 'Consultant Neurological & Vestibular Physiotherapist', profileUrl: 'https://balancephysio.wpenginepowered.com/team/jonathan-zulueta/' },
	{ name: 'Jo Fordyce', role: "Consultant Women's & Men's Health Physiotherapist", profileUrl: 'https://balancephysio.wpenginepowered.com/team/jo-fordyce/' },
	{ name: 'Dr. Jose Sanz Mengibar', role: 'Consultant Neurological Physiotherapist, Vojta Therapist', profileUrl: 'https://balancephysio.wpenginepowered.com/team/dr-jose-sanz-mengibar/' },
	{ name: 'Dan Elias', role: 'Consultant Youth & Sports Injury Physiotherapist', profileUrl: 'https://balancephysio.wpenginepowered.com/team/dan-elias/' },
	{ name: 'Jonathan Lewis', role: 'Physiotherapist, Soft Tissue & S&C Coach', profileUrl: 'https://balancephysio.wpenginepowered.com/team/jonathan-lewis/' },
	{ name: 'Joanne Coates', role: 'Physiotherapist', profileUrl: 'https://balancephysio.wpenginepowered.com/team/joanne-coates/' },
	{ name: 'Anthony Adesanmi', role: 'Physiotherapist', profileUrl: 'https://balancephysio.wpenginepowered.com/team/anthony-adesanmi/' },
	{ name: 'Jarryd Ferreira', role: 'Physiotherapist', profileUrl: 'https://balancephysio.wpenginepowered.com/team/jarryd-ferreira/' },
	{ name: 'Joanne Sullivan', role: 'Physiotherapist', profileUrl: 'https://balancephysio.wpenginepowered.com/team/joanne-sullivan/' },
	{ name: 'Sam Stringer', role: 'Physiotherapist', profileUrl: 'https://balancephysio.wpenginepowered.com/team/sam-stringer/' },
	{ name: 'Portia Morey', role: 'Physiotherapist', profileUrl: 'https://balancephysio.wpenginepowered.com/team/portia-morey/' },
	{ name: 'Claire Speer', role: 'Physiotherapist', profileUrl: 'https://balancephysio.wpenginepowered.com/team/claire-speer/' },
	{ name: 'Maxine Baillie-Harland', role: 'Neurological Physiotherapist', profileUrl: 'https://balancephysio.wpenginepowered.com/team/maxine-baillie-harland/' },
	{ name: 'Steven Connor', role: 'Podiatrist', profileUrl: 'https://balancephysio.wpenginepowered.com/team/steven-connor/' },
	{ name: 'Eli Ferracci', role: 'Nutritional Therapist & Osteopath', profileUrl: 'https://balancephysio.wpenginepowered.com/team/eli-ferracci/' },
	{ name: 'Deri Wilson', role: 'Soft Tissue Massage Therapist', profileUrl: 'https://balancephysio.wpenginepowered.com/team/deri-wilson/' },
	{ name: 'Kellie Collar', role: 'Soft Tissue Massage Therapist', profileUrl: 'https://balancephysio.wpenginepowered.com/team/kellie-collar/' },
	{ name: 'Claire Benson', role: 'Soft Tissue Massage Therapist', profileUrl: 'https://balancephysio.wpenginepowered.com/team/claire-benson/' },
	{ name: 'Alex Deif', role: 'Strength & Conditioning Coach', profileUrl: 'https://balancephysio.wpenginepowered.com/team/alex-deif/' },
	{ name: 'Ron Burnett', role: 'Strength & Conditioning Coach', profileUrl: 'https://balancephysio.wpenginepowered.com/team/ron-burnett/' },
	{ name: 'Pat Leahy', role: 'Bike Fitting Specialist', profileUrl: 'https://balancephysio.wpenginepowered.com/team/pat-leahy/' },
	{ name: 'Alice Croucher', role: 'Pilates Teacher', profileUrl: 'https://balancephysio.wpenginepowered.com/team/alice-croucher/' },
	{ name: 'Agur Arrien', role: 'Pilates Teacher', profileUrl: 'https://balancephysio.wpenginepowered.com/team/agur-arrien/' },
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
