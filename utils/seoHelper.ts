// utils/seoHelper.ts

// Base URL by environment
export const BASE_URL = new URL(
	process.env.NODE_ENV === "production"
		? "https://bontemps.agency"
		: "https://staging.bontemps.agency"
);

// Helper for consistent URL creation
export const buildUrl = (path = "/") => new URL(path, BASE_URL).toString();

// Global site metadata
export const siteTitle = "Bon Temps";
export const siteDescription =
	"Bon Temps is a creative studio. Beauty Is A Matter Of Precision.";

// Social & canonical links
export const linkInstagram = "https://www.instagram.com/bontemps.agency/";
export const canonicalHome = buildUrl("/");
export const canonicalWork = buildUrl("/");
export const canonicalInformation = buildUrl("/information");

// 🖼️ Images & favicons
export const BASE_IMAGE_URL = buildUrl("/images/cc_ama_fbshare_1200x800.jpg");
export const BASE_IMAGE_WIDTH = 1200;
export const BASE_IMAGE_HEIGHT = 800;

// Two real variants of the Bon Temps monogram: a black mark for light browser
// chrome and a white mark for dark mode. SVG is the primary (crisp at any size,
// adapts via the media query); the PNGs are fallbacks for browsers that don't
// support SVG favicons.
//
// These are ROOT-RELATIVE on purpose — do NOT wrap them in buildUrl(). Next
// emits icon hrefs verbatim, so the browser resolves them against the current
// origin (localhost in dev, the real domain in prod). Using buildUrl() would
// hardcode the staging domain in dev and 404 → the browser falls back to its
// default globe icon. For an absolute URL (e.g. JSON-LD logo) call
// buildUrl(APPLE_TOUCH_ICON) at the use site.
export const FAVICON_LIGHT_SVG = "/favicon/favicon-light.svg"; // black
export const FAVICON_DARK_SVG = "/favicon/favicon-dark.svg"; // white
export const FAVICON_LIGHT_PNG = "/favicon/favicon-light.png"; // black
export const FAVICON_DARK_PNG = "/favicon/favicon-dark.png"; // white
export const APPLE_TOUCH_ICON = "/favicon/apple-touch-icon.png";

export function getFavicons() {
	return {
		icon: [
			{ media: '(prefers-color-scheme: light)', type: 'image/svg+xml', url: FAVICON_LIGHT_SVG },
			{ media: '(prefers-color-scheme: dark)', type: 'image/svg+xml', url: FAVICON_DARK_SVG },
			{ media: '(prefers-color-scheme: light)', type: 'image/png', url: FAVICON_LIGHT_PNG },
			{ media: '(prefers-color-scheme: dark)', type: 'image/png', url: FAVICON_DARK_PNG },
		],
		shortcut: FAVICON_LIGHT_PNG,
		apple: APPLE_TOUCH_ICON,
		other: { rel: 'apple-touch-icon-precomposed', url: APPLE_TOUCH_ICON },
	};
}

// Shape returned by the `seo.image` projection in sanity/queries/fragments/seo.ts.
type SeoImage =
	| {
			imageUrl?: string | null
			metadata?: {dimensions?: {width?: number; height?: number} | null} | null
	  }
	| null
	| undefined

// Builds the Open Graph `images` array from a Sanity `seo.image`, falling back
// to the site-wide default OG image when the page has no editorial SEO image.
export function buildOgImages(image?: SeoImage) {
	return [
		{
			url: image?.imageUrl || BASE_IMAGE_URL,
			width: image?.metadata?.dimensions?.width || BASE_IMAGE_WIDTH,
			height: image?.metadata?.dimensions?.height || BASE_IMAGE_HEIGHT,
		},
	];
}

// Default indexable robots directives. Spread into `metadata.robots`.
export const defaultRobots = {
	index: true,
	follow: true,
	googleBot: {
		index: true,
		follow: true,
		'max-image-preview': 'large',
		'max-snippet': -1,
	},
} as const;

export function formatSlug(slug: string) {
	if (!slug) return '';
	// Replace dashes/underscores with spaces and capitalize first letter of each word
	return slug
		.replace(/[-_]/g, ' ')
		.replace(/\b\w/g, (c) => c.toUpperCase());
}