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
	'/contact-balance/': '/contact-us/',
	'/team/': '/meet-the-team/',
	'/what-we-do/': '/about-us/',
	'/consultant-therapists/': '/meet-the-team/',

	// Services / treatments
	'/back-and-neck-pain/': '/condition/lower-back-pain/',
	'/back-neck-pain-team/': '/meet-the-team/',
	'/spinal-specialists/': '/meet-the-team/',
	'/sports-injury-trauma-orthopaedic/': '/service/sports-physiotherapy/',
	'/sports-injury-team/': '/meet-the-team/',
	'/physiotherapy-total-rehabilitation/': '/service/physiotherapy/',
	'/paediatric-injuries-developmental-concerns/': '/service/paediatric-sports-physiotherapy/',
	'/youthphysiotherapy/': '/service/paediatric-sports-physiotherapy/',
	'/bike-fitting-cycling-analysis/': '/service/bike-fitting-cycling-analysis/',
	'/cycling-analysis-and-fitting/': '/service/bike-fitting-cycling-analysis/',
	'/new-bike-fitting/': '/service/bike-fitting-cycling-analysis/',
	'/runners/': '/service/bike-fitting-cycling-analysis/',
	'/running-analysis-and-coaching/': '/service/bike-fitting-cycling-analysis/',
	'/alterg-anti-gravity-treadmill-london/': '/service/alterg-anti-gravity-treadmill-london/',
	'/acl-knee-specialist-london/': '/condition/acl-knee-specialist-london/',
	'/classes-in-clapham/tissue-mobility-class-foam-rolling/': '/service/prehab-class/',
	'/shoulder-specialist-physiotherapy/': '/condition/shoulder-specialist-physiotherapy/',
	'/sports-massage-clapham-soft-tissue-therapy/': '/service/sports-massage-clapham-soft-tissue-therapy/',
	'/podiatry-and-ultrasound/': '/service/podiatry/',
	'/specialist-neuro-physio-london/': '/service/specialist-neuro-physio-london/',
	'/shockwave-therapy/': '/service/shockwave-therapy/',
	'/strength-conditioning/': '/service/strength-conditioning/',
	'/hydrotherapy/': '/service/hydrotherapy/',
	'/womens-health-fitness/': '/service/womens-health/',
	'/womens-and-mens-health/': '/service/womens-health/',
	'/pilates/': '/service/pilates/',
	'/classes-in-clapham/': '/service/prehab-class/',
	'/classes-in-clapham/pilates-classes/': '/service/prehab-class/',

	// Facility
	'/the-facility/': '/our-clinic/',
	'/the-facility/pilates-studio/': '/our-studios/',
	'/the-facility/location/': '/our-clinic/',
	'/the-facility/gym/': '/our-clinic/',
	'/the-facility/treatment-rooms/': '/our-clinic/',
	'/the-facility/early-rehab-studio/': '/',

	// Old WP product URLs (Shopify replaced these)
	'/product/alter-g-session/': '/service/alterg-anti-gravity-treadmill-london/',
	'/product/flex-kinesiology-tape-gentle-adhesion/': '/shop/',

	// Retired services / specialty pages — soft-redirect to home or related service
	'/personal-training/': '/',
	'/youth-boxing-clapham/': '/',
	'/breathing-and-breathwork/': '/',
	'/nadia-hussain/': '/meet-the-team/',

	// COVID legacy
	'/covid-19-service-balance-physiotherapy-fitness-clapham/': '/',

	// WP team taxonomy archives
	'/team_department/sports-injury-and-orthopaedic/': '/meet-the-team/',
	'/team_department/consultant-physiotherapists/': '/meet-the-team/',
	'/team_designation/consultant-physiotherapist/': '/meet-the-team/',
	'/team_designation/strength-conditioning-coach/': '/meet-the-team/',

	// Team slug change (Jose's WP slug differed from the new Astro slug)
	'/team/jose-manuel-sanz-mengibar/': '/team/dr-jose-sanz-mengibar/',

	// Testimonials (individual WP testimonial pages collapse to the index)
	'/testimonial/the-balance-team-gave-us-valuable-advice-and-preparation-for-our-13000-mile-cycle-ride/': '/testimonials/',
	'/balance-performance-testimonials/leoni-munslow/': '/testimonials/',

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
	'/blog/2013/06/bmx-kurt-yaeger-rehab-journey-and-rudimental-music-video/': '/',
	'/2015/10/diastasis-recti-during-pregnancy/': '/service/womens-health/',
	'/2017/01/10-minutes-for-your-tendon-thoughts-from-graham-anderson-at-the-australian-open-tennis/': '/',
	'/2017/02/vojta-therapy-uk-jose-manual-sanz-mengibar/': '/service/vojta-therapy/',
	'/2021/07/return-of-londons-longest-running-kettlebell-class/': '/',
	'/2020/05/space-adjustments-to-our-balance-performance-facility-during-covid-19/': '/',


	// 2026 SEO URL renames — old Astro URL → new SEO-friendly URL
	'/service/sports-massage': '/service/sports-massage-clapham-soft-tissue-therapy/',
	'/service/neurological-rehabilitation': '/service/specialist-neuro-physio-london/',
	'/service/bike-fitting-running-analysis': '/service/bike-fitting-cycling-analysis/',
	'/service/anti-gravity-treadmill': '/service/alterg-anti-gravity-treadmill-london/',
	'/condition/knee-injuries': '/condition/acl-knee-specialist-london/',
	'/condition/shoulder-pain': '/condition/shoulder-specialist-physiotherapy/',


	// =============================================================
	// WordPress 404 sweep (May 2026) — paths from the legacy
	// www.balancephysio.com site flagged by Search Console / Semrush.
	// =============================================================

	// Old WP blog asset URLs
	'/blog/wp-content/uploads/2013/12/Firefly-What-Is-The-Firefly.htm': '/',

	// WP tag archives
	'/blog/tag/jason-progl/': '/',
	'/blog/tag/naeem-akram/': '/',
	'/blog/tag/keith-hall/': '/',
	'/blog/tag/kettlebell-conditioning/': '/',
	'/tag/sex/': '/',
	'/tag/pregnancy/': '/',
	'/tag/tai-chi/': '/',
	'/tag/mums/': '/',
	'/tag/kettlebells/': '/',
	'/tag/jessica-sargeant/': '/',
	'/tag/brazilian-jiu-jitsu/': '/',
	'/tag/bjj/': '/',
	'/tag/balham/': '/',

	// WP blog posts and category archives
	'/blog/contact/': '/',
	'/blog/2015/03/on-learning-how-to-meditate-by-jim-oneil/': '/',
	'/blog/2014/03/mark-sisson-the-primal-blueprint-on-movement-and-standing-desks/': '/',
	'/blog/2013/11/skin-repair-wound-healing-scar-softening-callus-and-blister-care/': '/',
	'/blog/2013/12/firefly-technology-injury-recovery-trial-at-balance-performance/': '/',
	'/blog/2013/12/1365/': '/',
	'/blog/2013/11/combat-athletics-a-free-cpd-lecture-for-physiotherapists-coaches-and-all-health-fitness-professionals/': '/',
	'/blog/2013/11/combat-athletics-a-free-cpd-lecture-for-physiotherapists-coaches-and-all-health-fitness-professionals-2/': '/',
	'/blog/2013/07/new-trigger-point-performance-therapy-mini-grid-foam-roller/': '/',
	'/blog/2012/07/why-did-bradley-wiggins-win/': '/',
	'/blog/2013/01/runners-resilience-offer-with-trigger-point-self-massage-kit/': '/',
	'/blog/2013/06/alter-g-for-pain-free-running-walking-and-weight-loss/': '/',
	'/blog/2012/08/balance-team-at-the-olympics/': '/',
	'/blog/2012/10/utmb-one-of-europes-most-challenging-runs-mud-mayhem-and-mountain-miles/': '/',
	'/blog/2012/07/crosscore-rotational-bodyweight-training-perfect-for-anybody-or-training-style/': '/',
	'/blog/2012/03/crosscore180-goes-so-far-beyond-suspension-training/': '/',
	'/blog/2012/07/hand-care-for-climbers-kettlebell-lifters-rowers-gardeners-etc/': '/',
	'/blog/2011/04/war-machine-review-from-gymless-training-blog/': '/',
	'/blog/2012/03/born-to-run-and-why-we-run-reviewed-ultradistance-spartathlon-and-virtually-barefooted-super-athletes/': '/',
	'/blog/2011/03/race-walking-international-training-camp/': '/',
	'/blog/2011/05/world-class-kettlebell-certification-from-ikff/': '/',
	'/blog/2011/03/michael-jordan-powerful-and-graceful-athleticism/': '/',
	'/blog/2009/06/balance-wimbledon-tennis-2009/': '/',
	'/blog/2009/03/ultramarathon-transworld-adventurer/': '/',
	'/blog/2007/11/the-amish-workout-on-yahoo-health/': '/',
	'/event/pillars-of-meditation/': '/',
	'/category/education-and-cpd/': '/',
	'/category/online-services/': '/',
	'/2019/12/balance-falls-and-dizziness-great-vestibular-expertise-available-from-jonathan-zulueta/': '/',
	'/2019/01/research-article-on-music-therapy-from-vojta-therapist-jose-sanz-mengibar/': '/',
	'/2018/03/nordic-walking-the-potential-for-balance-performance-clients/': '/',
	'/2018/01/thoughts-on-sports-massage-soft-tissue-therapy-from-jess/': '/',
	'/2017/01/tennis-is-a-unilateral-sport-thoughts-from-graham-anderson-at-the-australian-open-2017/': '/',
	'/2017/01/tennis-injuries-and-the-effect-of-playing-surfaces-some-thoughts-from-graham-anderson-from-the-australian-open-2017/': '/',
	'/2015/09/serious-physio-work-at-wimbledon/': '/',
	'/2015/09/new-mums-does-your-back-ache-standing-cuddling-your-newborn/': '/',
	'/2015/09/learn-to-land-before-you-return-to-running-following-knee-injury/': '/',

	// Retired pages → home
	'/workforbalance/': '/',
	'/timetable/': '/',
	'/taping-to-protect-and-guide/': '/',
	'/running-injuries-and-rehabilitation/': '/',
	'/pexservice/what-we-do/': '/',
	'/orthotics-bespoke-and-semi-bespoke/': '/',
	'/movement/': '/',
	'/force-plates/': '/',
	'/education/': '/',
	'/combat-athletes-martial-artists/': '/',
	'/bupa-physio/': '/',
	'/acupuncture/': '/',
	'/3d-retul-bike-fit/': '/',

	// WP team / portfolio pages
	'/womens-health-and-continence-team/': '/meet-the-team/',
	'/team_designation/podiatrist/': '/meet-the-team/',
	'/team_designation/consultant-spinal-physiotherapist/': '/meet-the-team/',
	'/team_designation/physiotherapist/': '/meet-the-team/',
	'/team_designation/consultant-neurological-physiotherapist/': '/meet-the-team/',
	'/team_department/strength-and-conditioning-team/': '/meet-the-team/',
	'/team_department/podiatrists/': '/meet-the-team/',
	'/team_department/soft-tissue-therapy-and-sports-massage-team/': '/meet-the-team/',
	'/team_department/physiotherapists/': '/meet-the-team/',
	'/team_department/hydrotherapy/': '/meet-the-team/',
	'/team/ron-burnett/': '/meet-the-team/',
	'/soft-tissue-therapy-and-sports-massage-team/': '/meet-the-team/',
	'/sports-injury-orthopaedic-team/': '/meet-the-team/',
	'/portfolio_category/sports-injury-team/': '/meet-the-team/',
	'/portfolio_category/back-pain-team/': '/meet-the-team/',
	'/pexservice/movement-strength-fitness-team-2/': '/meet-the-team/',
	'/pexservice/neurological-and-vestibular-specialist-team/': '/meet-the-team/',
	'/movement-strength-and-fitness-team/': '/meet-the-team/',
	'/movement-and-breathwork-team/': '/meet-the-team/',
	'/health-and-wellness-team/': '/meet-the-team/',
	'/portfolio/caroline-curtis/': '/meet-the-team/',
	'/leanne-simmons/': '/meet-the-team/',

	// WP individual testimonials
	'/balance-performance-testimonials/maja-hadziomerovic/': '/testimonials/',
	'/balance-performance-testimonials/tom-holland/': '/testimonials/',
	'/balance-performance-testimonials/sarah-brendlor/': '/testimonials/',
	'/balance-performance-testimonials/miriam-bremer/': '/testimonials/',
	'/balance-performance-testimonials/leoni-munslow-2017/': '/testimonials/',
	'/balance-performance-testimonials/izzy-mcnab-england-lacrosse-player/': '/testimonials/',
	'/balance-performance-testimonials/leoni-munslow-2015/': '/testimonials/',
	'/balance-performance-testimonials/daniel-stacey/': '/testimonials/',
	'/balance-performance-testimonials/dion-harrison/': '/testimonials/',
	'/balance-performance-testimonials/claire-bennett/': '/testimonials/',
	'/balance-performance-testimonials/al-riley/': '/testimonials/',

	// WP classes / studio pages
	'/the-facility/homework-station-studio/': '/our-studios/',
	'/the-facility/class-movement-studio/': '/our-studios/',
	'/classes-in-clapham/tissue-mobility-class-foam-rolling-2/': '/our-studios/',
	'/classes-in-clapham/weight-training-club/': '/our-studios/',
	'/classes-in-clapham/womens-fitness/': '/our-studios/',
	'/category/classes/': '/our-studios/',
	'/classes-in-clapham/fitness-and-health-during-pregnancy/': '/our-studios/',
	'/2020/04/restorative-yoga-online-class-timetable/': '/our-studios/',

	// WP service pages
	'/bike-fitting-and-running-analysis/': '/service/bike-fitting-cycling-analysis/',
	'/osteopathy/': '/service/osteopathy/',
	'/nutritional-therapy-diet/': '/service/osteopathy/',
	'/physiotherapy/': '/service/physiotherapy/',
	'/pexpricing/consultant-physiotherapy/': '/service/physiotherapy/',
	'/personal-fitness-training/': '/service/sports-physiotherapy/',

	// WP condition pages
	'/pelvic-girdle-pain/': '/condition/womens-pelvic-health/',

	// WP product pages
	'/product/gift-vouchers/': '/shop/',
	'/product/raised-spirit-cbd-oil-10/': '/shop/',

	// Other
	'/about/': '/about-us/',
	'/faqs-2/': '/faqs/',
	'/pexpricing/full-service-price-list/': '/pricing/',

	// Removed new-site index pages — safety nets in case of bookmarks / inbound links.
	// Astro's trailing-slash handling means we only need one form per route.
	'/services': '/service/physiotherapy/',
	'/conditions': '/condition/lower-back-pain/',
};

// https://astro.build/config
export default defineConfig({
	adapter: cloudflare(),
	redirects,
	// Enforce trailing slashes on every URL. Astro's default behaviour
	// served pages from the with-slash form but did NOT actively redirect
	// no-slash requests — Cloudflare then issued a 307 (temporary
	// redirect) for /team/dan-elias → /team/dan-elias/. Semrush flagged
	// 14,280 of these in May 2026 because internal links across the site
	// were inconsistent (some had trailing slashes, some didn't).
	//
	// 'always' forces Astro to:
	//   - emit every internal link with a trailing slash
	//   - normalise no-slash requests to with-slash via a 301 (permanent)
	//     instead of 307 (temporary), which is what SEO crawlers want
	// build.format: 'directory' (the Astro default) outputs each page as
	// /path/index.html so the with-slash URL resolves natively without
	// any redirect at all when accessed directly.
	trailingSlash: 'always',
	build: { format: 'directory' },
});
