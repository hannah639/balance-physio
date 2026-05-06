// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

// 301 redirects for the WordPress → Astro migration. Keys are the old
// WordPress paths; values are the new paths. Identity team-bio mappings
// (where the old slug already matches the new dynamic route) are omitted —
// those resolve naturally via /team/[slug].astro with no redirect needed.
//
// The `/services` and `/conditions` entries at the bottom are safety nets:
// the index pages were removed but those paths may still be linked from
// external sources or bookmarks.
const redirects = {
	// Top-level page renames
	'/contact-balance/': '/contact-us',
	'/team/': '/meet-the-team',
	'/what-we-do/': '/about-us',
	'/consultant-therapists/': '/meet-the-team',

	// Services / treatments
	'/back-and-neck-pain/': '/condition/lower-back-pain',
	'/back-neck-pain-team/': '/meet-the-team',
	'/spinal-specialists/': '/meet-the-team',
	'/sports-injury-trauma-orthopaedic/': '/service/sports-physiotherapy',
	'/sports-injury-team/': '/meet-the-team',
	'/physiotherapy-total-rehabilitation/': '/service/physiotherapy',
	'/shoulder-specialist-physiotherapy/': '/condition/shoulder-specialist-physiotherapy',
	'/sports-massage-clapham-soft-tissue-therapy/': '/service/sports-massage-clapham-soft-tissue-therapy',
	'/podiatry-and-ultrasound/': '/service/podiatry',
	'/specialist-neuro-physio-london/': '/service/specialist-neuro-physio-london',
	'/shockwave-therapy/': '/service/shockwave-therapy',
	'/strength-conditioning/': '/service/strength-conditioning',
	'/hydrotherapy/': '/service/hydrotherapy',
	'/womens-health-fitness/': '/service/womens-health',
	'/pilates/': '/',
	'/classes-in-clapham/': '/',
	'/classes-in-clapham/pilates-classes/': '/service/prehab-class',

	// Facility
	'/the-facility/': '/our-clinic',
	'/the-facility/pilates-studio/': '/our-studios',

	// COVID legacy
	'/covid-19-service-balance-physiotherapy-fitness-clapham/': '/',

	// WP team taxonomy archives
	'/team_department/sports-injury-and-orthopaedic/': '/meet-the-team',
	'/team_department/consultant-physiotherapists/': '/meet-the-team',
	'/team_designation/consultant-physiotherapist/': '/meet-the-team',
	'/team_designation/strength-conditioning-coach/': '/meet-the-team',

	// Team slug change (Jose's WP slug differed from the new Astro slug)
	'/team/jose-manuel-sanz-mengibar/': '/team/dr-jose-sanz-mengibar/',

	// Testimonials (individual WP testimonial pages collapse to the index)
	'/testimonial/the-balance-team-gave-us-valuable-advice-and-preparation-for-our-13000-mile-cycle-ride/': '/testimonials',
	'/balance-performance-testimonials/leoni-munslow/': '/testimonials',

	// Blog (not migrated — everything points to home)
	'/blog/': '/',
	'/blog/tag/physiotherapy/': '/',
	'/blog/tag/professional-sport/': '/',
	'/blog/tag/combat-sports/': '/',
	'/category/general-centre-info/': '/',
	'/category/running/': '/',
	'/blog/2011/03/the-lissom-technique-at-balance-performance-physiotherapy/': '/',
	'/blog/2011/10/graham-anderson-leading-atp-world-tour-physiotherapist-talks-about-his-experience-and-life-on-tour/': '/',
	'/blog/2012/03/barefoot-running-and-natural-movement-workshop-at-balance-performance-clapham/': '/',
	'/blog/2014/05/radial-shockwave-therapy-and-achilles-tendonitis/': '/',
	'/2020/05/space-adjustments-to-our-balance-performance-facility-during-covid-19/': '/',


	// 2026 SEO URL renames — old Astro URL → new SEO-friendly URL
	'/service/sports-massage': '/service/sports-massage-clapham-soft-tissue-therapy',
	'/service/neurological-rehabilitation': '/service/specialist-neuro-physio-london',
	'/service/bike-fitting-running-analysis': '/service/bike-fitting-cycling-analysis',
	'/service/anti-gravity-treadmill': '/service/alterg-anti-gravity-treadmill-london',
	'/condition/knee-injuries': '/condition/acl-knee-specialist-london',
	'/condition/shoulder-pain': '/condition/shoulder-specialist-physiotherapy',

	// Removed new-site index pages — safety nets in case of bookmarks / inbound links.
	// Astro's trailing-slash handling means we only need one form per route.
	'/services': '/service/physiotherapy',
	'/conditions': '/condition/lower-back-pain',
};

// https://astro.build/config
export default defineConfig({
	adapter: cloudflare(),
	redirects,
});
