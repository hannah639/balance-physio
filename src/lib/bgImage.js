/**
 * Build a CSS background-image declaration with format negotiation.
 *
 * Mirrors what <Picture> does for <img> tags: serves AVIF to modern browsers,
 * WebP to slightly older ones, and the original (JPG/PNG/WebP) as a fallback.
 *
 * Returns a CSS string with TWO `background-image:` declarations stacked:
 *   1. Plain `url()` — fallback for browsers that don't support image-set().
 *   2. `image-set()` with format negotiation — overrides #1 in supporting browsers.
 *
 * AVIF/WebP variants must already exist on disk at <stem>.avif and <stem>.webp.
 * The variant generation script (scripts/gen-image-variants.sh) takes care of
 * this for every image in /public.
 *
 * Example:
 *   import { bgImageSet } from '../lib/bgImage.js';
 *   <div style={bgImageSet('/booking-banner.jpg')}></div>
 *
 * For external URLs (Sanity CDN, anything starting with http://), emits a
 * plain background-image declaration with no negotiation — there are no
 * variants of an external URL on our domain.
 */
export function bgImageSet(src) {
	if (!src) return '';

	const isExternal = /^https?:\/\//.test(src);
	if (isExternal) {
		return `background-image: url('${src}');`;
	}

	const dotIdx = src.lastIndexOf('.');
	const ext = dotIdx > 0 ? src.slice(dotIdx + 1).toLowerCase() : '';

	// SVG/GIF have no AVIF/WebP equivalents — emit plain url().
	if (ext === 'svg' || ext === 'gif') {
		return `background-image: url('${src}');`;
	}

	const stem = dotIdx > 0 ? src.slice(0, dotIdx) : src;
	const avifPath = `${stem}.avif`;
	const webpPath = `${stem}.webp`;

	// Two stacked declarations: the second overrides the first in browsers
	// that support image-set() (Chrome/Edge 113+, Firefox 89+, Safari 17+).
	// Older browsers fall back to the plain url() declaration above.
	return `background-image: url('${src}'); background-image: image-set(url('${avifPath}') type('image/avif'), url('${webpPath}') type('image/webp'), url('${src}'));`;
}
