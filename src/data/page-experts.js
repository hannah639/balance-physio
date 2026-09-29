// "Our experts" blocks for condition and service pages.
//
// Source: "Condition Page Team Linking Blocks - Balance Performance
// Physiotherapy" (Google Doc), transcribed 2026-09-30. Rendered by
// src/components/PageExperts.astro — that component is the only consumer.
//
// Keys are ROUTE PATHS with the trailing slash, matching `trailingSlash:
// 'always'`. Values hold the heading and an ordered list of team SLUGS.
//
// Only slugs are stored. Each clinician's display name and job title are read
// from Sanity at build time via getTeam(), so a name or title change in the
// Studio flows through here without touching this file. Every one of the 95
// references below was checked against the roster when it was transcribed:
// all resolved, and every job title in the document matched Sanity exactly.
//
// A slug that no longer matches a published team member is dropped silently by
// the component — the same behaviour as the rest of the site's team lookups.

/**
 * @typedef {Object} ExpertsBlock
 * @property {string} heading   the <h2> for the section
 * @property {string[]} members team.js / Sanity slugs, in display order
 */

/** @type {Record<string, ExpertsBlock>} */
export const pageExperts = {
	'/condition/lower-back-pain/': {
		heading: 'Our experts specialising in lower back pain',
		members: [
			'dr-lucy-goldby',                        // Dr. Lucy Goldby — Consultant Spinal Physiotherapist
			'caroline-curtis',                       // Caroline Curtis — Consultant Spinal Physiotherapist
			'anthony-adesanmi',                      // Anthony Adesanmi — Physiotherapist
			'jarryd-ferreira',                       // Jarryd Ferreira — Physiotherapist
			'joanne-sullivan',                       // Joanne Sullivan — Physiotherapist
			'sam-stringer',                          // Sam Stringer — Physiotherapist
			'nichola-roberts',                       // Nichola Roberts — Cycling Specialist Physiotherapist
			'eli-ferracci',                          // Eli Ferracci — Nutritional Therapist & Osteopath
		],
	},
	'/condition/neck-pain/': {
		heading: 'Our experts specialising in neck pain',
		members: [
			'dr-lucy-goldby',                        // Dr. Lucy Goldby — Consultant Spinal Physiotherapist
			'caroline-curtis',                       // Caroline Curtis — Consultant Spinal Physiotherapist
			'jarryd-ferreira',                       // Jarryd Ferreira — Physiotherapist
			'joanne-sullivan',                       // Joanne Sullivan — Physiotherapist
			'sam-stringer',                          // Sam Stringer — Physiotherapist
			'eli-ferracci',                          // Eli Ferracci — Nutritional Therapist & Osteopath
		],
	},
	'/condition/shoulder-specialist-physiotherapy/': {
		heading: 'Our experts specialising in shoulder pain',
		members: [
			'dr-lucy-goldby',                        // Dr. Lucy Goldby — Consultant Spinal Physiotherapist
			'caroline-curtis',                       // Caroline Curtis — Consultant Spinal Physiotherapist
			'sophia-busfield',                       // Sophia Busfield — Consultant Physiotherapist
			'graham-anderson',                       // Graham Anderson — Consultant Physiotherapist
			'joanne-coates',                         // Joanne Coates — Physiotherapist
			'anthony-adesanmi',                      // Anthony Adesanmi — Physiotherapist
			'jarryd-ferreira',                       // Jarryd Ferreira — Physiotherapist
			'joanne-sullivan',                       // Joanne Sullivan — Physiotherapist
			'sam-stringer',                          // Sam Stringer — Physiotherapist
			'eli-ferracci',                          // Eli Ferracci — Nutritional Therapist & Osteopath
		],
	},
	'/condition/elbow-pain/': {
		heading: 'Our experts specialising in elbow pain',
		members: [
			'sophia-busfield',                       // Sophia Busfield — Consultant Physiotherapist
			'graham-anderson',                       // Graham Anderson — Consultant Physiotherapist
			'anthony-adesanmi',                      // Anthony Adesanmi — Physiotherapist
			'jarryd-ferreira',                       // Jarryd Ferreira — Physiotherapist
			'joanne-sullivan',                       // Joanne Sullivan — Physiotherapist
			'sam-stringer',                          // Sam Stringer — Physiotherapist
		],
	},
	'/condition/hip-pain/': {
		heading: 'Our experts specialising in hip pain',
		members: [
			'dr-lucy-goldby',                        // Dr. Lucy Goldby — Consultant Spinal Physiotherapist
			'caroline-curtis',                       // Caroline Curtis — Consultant Spinal Physiotherapist
			'sophia-busfield',                       // Sophia Busfield — Consultant Physiotherapist
			'joanne-coates',                         // Joanne Coates — Physiotherapist
			'anthony-adesanmi',                      // Anthony Adesanmi — Physiotherapist
			'jarryd-ferreira',                       // Jarryd Ferreira — Physiotherapist
			'joanne-sullivan',                       // Joanne Sullivan — Physiotherapist
			'sam-stringer',                          // Sam Stringer — Physiotherapist
			'eli-ferracci',                          // Eli Ferracci — Nutritional Therapist & Osteopath
		],
	},
	'/condition/acl-knee-specialist-london/': {
		heading: 'Our experts specialising in knee injuries and ACL',
		members: [
			'caroline-curtis',                       // Caroline Curtis — Consultant Spinal Physiotherapist
			'sophia-busfield',                       // Sophia Busfield — Consultant Physiotherapist
			'graham-anderson',                       // Graham Anderson — Consultant Physiotherapist
			'dan-elias',                             // Dan Elias — Consultant Youth & Sports Injury Physiotherapist
			'joanne-coates',                         // Joanne Coates — Physiotherapist
			'anthony-adesanmi',                      // Anthony Adesanmi — Physiotherapist
			'jarryd-ferreira',                       // Jarryd Ferreira — Physiotherapist
			'joanne-sullivan',                       // Joanne Sullivan — Physiotherapist
			'sam-stringer',                          // Sam Stringer — Physiotherapist
		],
	},
	'/condition/foot-pain/': {
		heading: 'Our experts specialising in foot pain',
		members: [
			'dan-elias',                             // Dan Elias — Consultant Youth & Sports Injury Physiotherapist
			'steven-connor',                         // Steven Connor — Podiatrist
		],
	},
	'/condition/ankle-pain/': {
		heading: 'Our experts specialising in ankle pain',
		members: [
			'sophia-busfield',                       // Sophia Busfield — Consultant Physiotherapist
			'graham-anderson',                       // Graham Anderson — Consultant Physiotherapist
			'dan-elias',                             // Dan Elias — Consultant Youth & Sports Injury Physiotherapist
			'joanne-coates',                         // Joanne Coates — Physiotherapist
			'anthony-adesanmi',                      // Anthony Adesanmi — Physiotherapist
			'jarryd-ferreira',                       // Jarryd Ferreira — Physiotherapist
			'joanne-sullivan',                       // Joanne Sullivan — Physiotherapist
			'sam-stringer',                          // Sam Stringer — Physiotherapist
			'steven-connor',                         // Steven Connor — Podiatrist
		],
	},
	'/condition/running-injuries/': {
		heading: 'Our experts specialising in running injuries',
		members: [
			'graham-anderson',                       // Graham Anderson — Consultant Physiotherapist
			'dan-elias',                             // Dan Elias — Consultant Youth & Sports Injury Physiotherapist
			'joanne-coates',                         // Joanne Coates — Physiotherapist
			'anthony-adesanmi',                      // Anthony Adesanmi — Physiotherapist
			'jarryd-ferreira',                       // Jarryd Ferreira — Physiotherapist
			'joanne-sullivan',                       // Joanne Sullivan — Physiotherapist
			'sam-stringer',                          // Sam Stringer — Physiotherapist
			'steven-connor',                         // Steven Connor — Podiatrist
		],
	},
	'/condition/cycling-injuries/': {
		heading: 'Our experts specialising in cycling injuries',
		members: [
			'nichola-roberts',                       // Nichola Roberts — Cycling Specialist Physiotherapist
			'pat-leahy',                             // Pat Leahy — Bike Fitting Specialist
		],
	},
	'/condition/womens-pelvic-health/': {
		heading: 'Our expert specialising in women\'s pelvic health',
		members: [
			'jo-fordyce',                            // Jo Fordyce — Consultant Women's & Men's Health Physiotherapist
		],
	},
	'/condition/mens-pelvic-health/': {
		heading: 'Our expert specialising in men\'s pelvic health',
		members: [
			'jo-fordyce',                            // Jo Fordyce — Consultant Women's & Men's Health Physiotherapist
		],
	},
	'/condition/balance-and-dizziness/': {
		heading: 'Our experts specialising in balance and dizziness',
		members: [
			'jonathan-zulueta',                      // Jonathan Zulueta — Consultant Neurological & Vestibular Physiotherapist
			'maxine-baillie-harland',                // Maxine Baillie-Harland — Neurological Physiotherapist
		],
	},
	'/condition/multiple-sclerosis/': {
		heading: 'Our experts specialising in multiple sclerosis',
		members: [
			'dr-jose-sanz-mengibar',                 // Dr. Jose Sanz Mengibar — Consultant Neurological Physiotherapist, Vojta Therapist
			'maxine-baillie-harland',                // Maxine Baillie-Harland — Neurological Physiotherapist
		],
	},
	'/condition/stroke/': {
		heading: 'Our experts specialising in stroke',
		members: [
			'jonathan-zulueta',                      // Jonathan Zulueta — Consultant Neurological & Vestibular Physiotherapist
			'maxine-baillie-harland',                // Maxine Baillie-Harland — Neurological Physiotherapist
		],
	},
	'/condition/parkinsons/': {
		heading: 'Our experts specialising in parkinson\'s',
		members: [
			'jonathan-zulueta',                      // Jonathan Zulueta — Consultant Neurological & Vestibular Physiotherapist
			'maxine-baillie-harland',                // Maxine Baillie-Harland — Neurological Physiotherapist
		],
	},
	'/condition/childrens-neurological-developmental/': {
		heading: 'Our experts specialising in children\'s neurological and developmental',
		members: [
			'dr-jose-sanz-mengibar',                 // Dr. Jose Sanz Mengibar — Consultant Neurological Physiotherapist, Vojta Therapist
		],
	},
	'/condition/verrucas/': {
		heading: 'Our experts specialising in verrucas',
		members: [
			'steven-connor',                         // Steven Connor — Podiatrist
		],
	},
	'/condition/ingrown-toenails/': {
		heading: 'Our experts specialising in ingrown toenails',
		members: [
			'steven-connor',                         // Steven Connor — Podiatrist
		],
	},
	'/service/tmj-and-jaw-pain/': {
		heading: 'Our experts specialising in TMJ and jaw pain',
		members: [
			'jonathan-zulueta',                      // Jonathan Zulueta — Consultant Neurological & Vestibular Physiotherapist
			'maxine-baillie-harland',                // Maxine Baillie-Harland — Neurological Physiotherapist
		],
	},
	'/service/vojta-therapy/': {
		heading: 'Our experts specialising in vojta therapy',
		members: [
			'dr-jose-sanz-mengibar',                 // Dr. Jose Sanz Mengibar — Consultant Neurological Physiotherapist, Vojta Therapist
		],
	},
	'/service/sports-massage-clapham-soft-tissue-therapy/': {
		heading: 'Our experts specialising in soft tissue and sports massage',
		members: [
			'jonathan-lewis',                        // Jonathan Lewis — Physiotherapist, Soft Tissue & S&C Coach
			'deri-wilson',                           // Deri Wilson — Soft Tissue Massage Therapist
			'kellie-collar',                         // Kellie Collar — Soft Tissue Massage Therapist
			'claire-benson',                         // Claire Benson — Soft Tissue Massage Therapist
		],
	},
	'/service/strength-conditioning/': {
		heading: 'Our experts specialising in strength and conditioning',
		members: [
			'jonathan-lewis',                        // Jonathan Lewis — Physiotherapist, Soft Tissue & S&C Coach
			'alex-deif',                             // Alex Deif — Strength & Conditioning Coach
		],
	},
	'/service/hydrotherapy/': {
		heading: 'Our experts specialising in hydrotherapy',
		members: [
			'portia-morey',                          // Portia Morey — Physiotherapist
			'claire-speer',                          // Claire Speer — Physiotherapist
		],
	},
	'/service/pilates/': {
		heading: 'Our experts specialising in pilates',
		members: [
			'alice-croucher',                        // Alice Croucher — Pilates Teacher
			'agur-arrien',                           // Agur Arrien — Pilates Teacher
		],
	},
};
