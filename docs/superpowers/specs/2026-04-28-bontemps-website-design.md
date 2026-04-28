# BonTemps Website — Design Spec

**Date:** 2026-04-28
**Status:** Approved — ready for implementation plan
**Source spec:** Tech specs provided by client (breakpoints, typography, interactions, animation references: unstated.co, mouthwash, canyoncoffee.co)
**Figma:** https://www.figma.com/design/gyJkSM0BkGcdVfBZqbAyGK/BonTemps-Website--Copy-?node-id=1481-404

---

## 1. Overview

BonTemps is a creative-studio portfolio. The site has four primary surfaces — Intro, Work (home), Project Detail, Information — plus generic free pages, mobile menu, and a persistent header / footer. The design language emphasises a typographic intro animation, blurred header chrome, hover-revealed video thumbnails, and bubble-based micro-interactions.

The build sits on the existing template (Next.js 15 App Router + Sanity v3 embedded studio). Sanity schemas were already authored in a prior session; this spec drives queries, types, frontend implementation and a small set of schema deltas.

### Goals
- Pixel-perfect implementation against the three Figma frames (Mobile 390, Tablet 834, Desktop 1440) plus a Desktop XL ≥1800 tier limited to the intro page.
- All content rendered server-side as semantic HTML so crawlers and LLMs can read the site without executing JS.
- Animations and hover states layered as **progressive enhancement** after hydration — never required for content access.
- Editor-first content model: copy, projects, related projects, modules, contact email and intro claim are all edited in Sanity.
- Solid Core Web Vitals (LCP < 2.5s on 4G, CLS = 0, INP < 200ms).

### Non-goals (out of scope here)
- E-commerce, multi-locale, search, blog/CMS-driven categories.
- A/B testing, analytics dashboards beyond the existing Google Analytics + cookie consent template.
- Custom CMS plugins (Mux, anything beyond the standard Sanity studio).
- Migration of legacy URLs (greenfield deploy).

---

## 2. Architectural decisions (confirmed during brainstorming)

| Decision | Choice | Reason |
|---|---|---|
| Routing | `/` is **Work**; intro is overlay shown once per session | Keeps SEO concentrated on the portfolio; no redirect dance. |
| Intro trigger | `sessionStorage["bontemps_intro_seen"]`; replays on logo click | Familiar pattern; client confirmed |
| Animation library | **framer-motion only** (already in deps); GSAP only as later fallback if a sequence demands it | Bundle parsimony; framer-motion covers `layoutId`, `useScroll`, `whileInView`, `AnimatePresence`. |
| Page navigation | `next/link`, no global page transition | Minimal latency; transitions handled per-element via `<Image>` blur and entrance variants. |
| Image loading | `next/image` + `placeholder="blur"` with Sanity LQIP, fade-in on `onLoadingComplete` | Native blur; zero extra request; SSR-friendly. |
| Video loading | Direct HLS m3u8 URL from Vimeo Pro, played via native `<video>` (Safari) or `hls.js` (Chromium/Firefox) — never iframe | Quality + control; `hls.js` already in deps. |
| Per-breakpoint media | Single image/video per asset; responsive via `next/image sizes`. **Exception:** Information page may keep dedicated breakpoint variants where needed. | Confirmed by user: most of the site uses one media; only Information requires variants. |
| Fonts | `next/font/local` loading woff2 + woff; CSS variables `--font-sans-loaded`, `--font-serif-loaded` | Self-hosted, swap, zero-CLS. |
| Render strategy | Pages are **React Server Components**; hydration islands marked `"use client"` only where necessary | SSR-first principle; minimum JS on the wire. |

### SSR-first / progressive-enhancement principle (rule of thumb for the whole codebase)

> If JavaScript fails to execute, the server-rendered HTML must show the full content, all links navigable, all media presented as static posters/captions, and all semantics intact. Animations, hovers, intro overlay, video playback, copy-to-clipboard, and bubble morphs are **enhancement** that mount after hydration.

Practical consequences applied throughout:
- Avoid `initial={{ opacity: 0 }}` framer-motion patterns for content text or images (would flash on slow hydration). Prefer `initial={{ y: 10 }}` or `whileInView` triggers; for content that must animate from invisible, gate inside a client-only component that the server never renders.
- IntroOverlay is a client-only mount. Its visible text (`home.claim`) is **also** rendered inside the Work page DOM (visually hidden once hydration completes via a body class) so it stays in the HTML for crawlers.
- Every interactive element has a real `<a href>`, `<button>`, or `<form>`. The Contact "copy email" button is `<a href="mailto:info@bontemps.agency">Contact</a>`; the clipboard copy is enhancement.
- Mobile menu is a real `<nav>` rendered server-side (CSS hides it off-canvas; toggle is JS enhancement).
- Hover videos: only the poster `<Image>` and the `<a>` exist in HTML. The video element is mounted on hover by a client island.
- All Sanity content (PortableText, project lists, related projects, module arrays) is fetched in RSC and rendered server-side.
- JSON-LD structured data and `llms.txt` are server-rendered.

---

## 3. Routes

```
app/(frontend)/
  layout.tsx                    persistent: <html><body>{header}{children}{footer}{cookies}{analytics}
                                fetches header + footer settings + home.claim (for intro provider)
  page.tsx                      Work (home) — RSC, fetches projects + listWork.claim + home.claim
  work/[slug]/page.tsx          Project detail — RSC, fetches project by slug + relatedProjects refs
  information/page.tsx          Information — RSC, fetches information singleton + module content
  [slug]/page.tsx               Generic free page (privacy, terms…) — already wired to `page` document
  not-found.tsx                 404 — server-rendered with link back to /
  robots.ts                     existing
  sitemap.ts                    NEW — derives URLs from page + project + information singletons
  llms.txt/route.ts             NEW — short summary for LLM crawlers
```

`app/(admin)/[[...tool]]/page.tsx` already mounts the embedded studio at `/admin`.

### Data fetch tags & revalidation
- All Sanity queries run with `next: { tags: ['sanity'] }` (or per-document tags, e.g. `project:${slug}`).
- A revalidation webhook (`/api/revalidate`) accepts Sanity GROQ-powered webhook payloads and runs `revalidateTag('sanity')` (or per-doc tag).

---

## 4. Animation catalogue

All animations are framer-motion or pure CSS, all client-side, all guarded by `useReducedMotion()` where motion is significant.

| # | Interaction | Server HTML | Client behaviour |
|---|---|---|---|
| 1 | Intro sequence (BTA + claim letters) | None (overlay never SSRs); `home.claim` rendered visually-hidden inside Work | Client component checks `sessionStorage`, mounts overlay, animates BTA icon + per-letter stagger of `home.claim`. Click anywhere → skip to end → unmount. Sets sessionStorage flag. |
| 2 | Logo fade-out on scroll (mobile) | `<a href="/">` always visible | `useScroll` + `useTransform` over opacity, threshold ~80px. |
| 3 | Header backdrop blur + bottom edge fade | CSS only: `backdrop-filter: blur()` + `mask-image: linear-gradient` | none |
| 4 | Active menu item bubble (Work ↔ Information) | `<span class="nav-bubble" data-route="work">` rendered behind active item server-side | `motion.span` with `layoutId="nav-bubble"` morphs between items on route change. |
| 5 | Hover greys out non-active menu items | CSS `:hover { color: var(--color-grey) }` + transition | none |
| 6 | Contact button copy-to-clipboard | `<a href="mailto:…">Contact</a>` real link | Client wraps in button; on click, `navigator.clipboard.writeText`, swap text to "Copied" via `AnimatePresence`, restore "Contact" after 1500ms. Falls back to mailto navigation if clipboard API unavailable. |
| 7 | Project card hover video | `<a><Image poster></a>` static | Client island wraps the link; on `mouseenter`, mounts `<video>` + HLS.js, `play()`; on `mouseleave`, `pause()`. Mobile autoplays on intersection. |
| 8 | "+" expanding to "Visit Website" | `<a class="visit-bubble" href={websiteUrl} aria-label="Visit website"><span>+</span></a>` | Client wraps with `motion.a` + `layout`; on hover/focus expands width and crossfades "+" → "Visit Website". |
| 9 | Back-to-work bubble | `<a href="/">+ Back To Work</a>` | CSS-only colour fade on hover (greys text, like menu items). |
| 10 | Related project black hover | `<a><Image><h3></a>` | Client wraps; on hover applies `data-hover` class, CSS transitions to all-black background + white text. |
| 11 | Information clients list grey↔black switch | `<ul><li><a>{name}<span>{location}</span></a></li></ul>` | Client wraps each `<li>`; on hover swap classes so name → black, location → grey (default state is reverse). Click navigates to `/work/[slug]`. |
| 12 | Image blur → load fade | `next/image` with `placeholder="blur"` + LQIP | Component `onLoadingComplete` adds `is-loaded` class; CSS transitions blur out + opacity in. |
| 13 | Mobile menu (canyon-coffee style) | `<nav>` with `<a>` links rendered server-side; off-canvas via CSS transform | Burger button toggles state class; `AnimatePresence` plays text/icon stagger entrance. |
| 14 | Module video autoplay-on-view | Static `<video poster>` | IntersectionObserver mounts HLS.js, autoplays muted, pauses on exit. |

`prefers-reduced-motion: reduce` is honoured everywhere; reduced-motion users get fades only (no transforms, no stagger), and intro plays an instant cut to end.

---

## 5. Media strategy

### Images — `LazyImage`

```
LazyImage props: { image: MediaImage, sizes: string, priority?: boolean, className?: string }
```

`MediaImage` shape after schema simplification:
```ts
type MediaImage = {
  image: SanityImage           // single asset; src + LQIP + dimensions resolved by GROQ
  alt: string                   // required at schema level
  caption?: string
}
```

GROQ fragment (`primitives/imageData.ts`):
```groq
asset->{
  _id,
  url,
  metadata { lqip, dimensions { width, height, aspectRatio } }
},
hotspot, crop
```

Render:
- `next/image` with `src = urlFor(image).auto('format').width(N).quality(85).url()`
- `width` / `height` from `metadata.dimensions`
- `placeholder="blur"`, `blurDataURL = metadata.lqip`
- `sizes` provided by parent component
- `loading="lazy"` default, `priority` only on hero / above-fold of project detail

### Videos — `LazyVideo`

```
LazyVideo props: { video: ModuleVideo, mode: 'hover' | 'in-view' | 'always', mobileAutoplay?: boolean, className?: string }
```

`ModuleVideo` (after rename `image` → `poster`):
```ts
type ModuleVideo = {
  title: string
  poster: SanityImage           // fallback / first frame
  videoUrl: string              // HLS m3u8 from Vimeo Pro
}
```

Render:
1. SSR: `<video poster={posterUrl} muted playsInline loop preload="none">` — no `src`, no script, just the poster as static image fallback.
2. Client (`ClientLazyVideo`): once mounted, decides whether to attach HLS:
   - `mode="hover"` → mount HLS on `mouseenter`, `play()`; `pause()` on leave. On mobile (no hover), use IntersectionObserver autoplay (mobile autoplay confirmed).
   - `mode="in-view"` → attach HLS when intersecting, autoplay muted, pause on exit.
   - `mode="always"` → attach HLS on mount (used sparingly, e.g. featured hero).
3. Browser detection: if `video.canPlayType('application/vnd.apple.mpegurl')` is non-empty (Safari) → set `src` directly. Otherwise → `new Hls()`, `loadSource`, `attachMedia`.
4. Cleanup: HLS instance destroyed on unmount; one instance per `<video>`.

### Aspect ratios
The Figma file references 5×4, 16×9, 3×2, 4×5 ratios for project assets. Editors choose the ratio when uploading; the component preserves intrinsic ratio via `width`/`height` so CLS = 0.

---

## 6. Sanity schema deltas

Existing schemas largely cover the spec. Required changes:

### `media.image` (objects/module/mediaImage.ts) — simplify
- Drop `desktop`, `ipad`, `mobile`. Single `image` field.
- Add `alt: string` (validation: required).
- Keep `caption`.

### `media.video` (objects/module/mediaVideo.ts) — simplify
- Drop `desktop`, `ipad`, `mobile`. Single `video: module.video` field.
- Keep `caption`.

### NEW: `media.imageResponsive` (objects/module/mediaImageResponsive.ts)
- Used **only** by Information page modules where per-breakpoint art-direction is required.
- Fields: `desktop: image` (required), `ipad: image` (optional), `mobile: image` (optional), `alt: string` (required), `caption?: string`.
- Component selects variant via `<picture>` + `<source media="…">` with `desktop` as final fallback.

### NEW: `media.videoResponsive` (objects/module/mediaVideoResponsive.ts)
- Counterpart of `media.imageResponsive` for video. Used **only** by Information.
- Fields: `desktop: module.video` (required), `ipad: module.video` (optional), `mobile: module.video` (optional), `caption?: string`.
- Client component reads `window.matchMedia` to pick the URL on mount; SSR uses the desktop poster as the initial render.

### `module.video` (objects/module/video.tsx) — clarify
- Rename `image` → `poster`.
- Update help text on `videoUrl` to spec HLS m3u8 from Vimeo Pro.
- Optional regex hint validation (warning) for `.m3u8`.

### `project` (documents/project.ts) — add
- `websiteUrl: url` (optional). Drives the "+ Visit Website" bubble. When empty, the bubble is omitted entirely.

> **`year` / `date` field:** confirmed not needed. The "Date" mentioned in the typography spec refers to inline serif details that may appear inside PortableText bodies, not a top-level project field.

### `headerSettings` (objects/global/header.ts) — add
- `contactEmail: string` (validation: required + email). Single source for the Contact button. Footer's `emails` array remains for the footer copy.

### NEW: `information` singleton (sanity/schemas/singletons/information.ts)
- `intro: bodyBonTemps` — Body Large + Body Small intro copy.
- `modules: array of [module.informationClients, module.pageTextColumn, module.informationImageVideo]` — rest of the page is editor-composed.
- `seo: seo.page`.
- Wire as singleton in `desk/index.ts`.

### NEW: `module.informationImageVideo` (objects/module/informationImageVideo.ts)
- Sibling of `module.pageImageVideo` but uses the responsive media types so Information editors can art-direct each breakpoint.
- Fields: same shape as `module.pageImageVideo` (layout, columns, items, reverseOrder, caption logic) but each item references `media.imageResponsive` or `media.videoResponsive` instead of the single-variant types.
- **Not** added to generic Page modules — the responsive variants are confined to Information per the source spec.

### NEW: `module.informationClients` (objects/module/informationClients.ts)
- `title: string` (e.g. "Clients").
- `items: array<{ name: string, location: string, projectRef?: reference(project) }>`.
  - When `projectRef` is set, the row links to `/work/${projectRef.slug.current}`.
  - When unset, the row is plain text (no anchor) — falls back semantically to a `<li>` with no `<a>`.

### Schema cleanup
Remove (verified unused vs. spec): `body`, `bodySimple`, `bodyTextTerms`, `accordion`, `accordionBody`, `accordionGroup`, `card`, `forms`, `grid`, `gridItem`, `heroHome`, `heroPage`, `notFoundPage`. Drop their imports from `schemas/index.ts`.

> Anything that turns out to be needed during implementation — restored explicitly via plan checkpoint, never silently.

### `bodyBonTemps` (blocks/bodyBonTemps.tsx) — verify styles
The block must declare custom styles matching the typography tokens (see §8): Headline, BodyLarge, Body, Caption, SerifDetail, SansSmallTitle, AboutBottom. If any are missing, add them with `name`, `title`, and `value` matching the CSS class. PortableText renderer maps `_type === 'block'` styles to the corresponding CSS class.

---

## 7. Component layout

```
components/
├── Common/                              (existing; refactor)
│   ├── HeaderComponent/
│   │   ├── index.tsx                    RSC: <header><nav> with anchors and active class derived from pathname
│   │   ├── HeaderClient.tsx             "use client": layoutId bubble, blur class on scroll, mobile menu toggle
│   │   ├── ContactButton.tsx            "use client": copy-to-clipboard + "Copied" toggle
│   │   ├── MobileMenu.tsx               "use client": AnimatePresence stagger + scroll lock
│   │   └── HeaderComponent.module.scss
│   ├── FooterComponent/                 (existing; restyle to match spec)
│   ├── LazyImage/                       refactor to RSC wrapper + ClientLazyImage child for fade-on-load
│   ├── LazyVideo/                       refactor to RSC wrapper + ClientLazyVideo child with HLS attach
│   ├── Analytics/, CookieConsent/, NewsletterComponent/, Lottie/   (no changes)
├── Home/
│   ├── IntroOverlay/
│   │   ├── index.tsx                    "use client" (mounted from layout); reads home.claim via prop
│   │   ├── IntroProvider.tsx            "use client": context with `played`, `replay()`
│   │   ├── IntroSequence.tsx            "use client": framer-motion variants per letter, BTA SVG morph
│   │   └── IntroOverlay.module.scss
│   ├── WorkGrid/
│   │   ├── index.tsx                    RSC: <ul><li> grid driven by props
│   │   ├── ProjectCard.tsx              RSC: <a><Image/poster><h3><p>
│   │   ├── ProjectCardHover.tsx         "use client": LazyVideo mode="hover"
│   │   └── WorkGrid.module.scss
│   └── HomeFooterClaim/                 RSC: about-bottom claim block
├── Singles/
│   ├── ProjectHeader/                   RSC: title, subtitle, excerpt, services list
│   ├── ProjectFeaturedMedia/            RSC: switches to LazyImage or LazyVideo
│   ├── ProjectModules/
│   │   ├── index.tsx                    RSC: switch over `_type`
│   │   ├── CenteredText.tsx
│   │   ├── ImageVideoModule.tsx
│   │   ├── TextColumn.tsx
│   │   └── ImageText.tsx
│   ├── VisitWebsiteBubble/
│   │   ├── index.tsx                    RSC: <a href={websiteUrl}>+</a> (omitted if empty)
│   │   ├── VisitWebsiteClient.tsx       "use client": motion.a + layout expand
│   │   └── VisitWebsiteBubble.module.scss
│   ├── BackToWorkBubble/                RSC + CSS hover
│   ├── RelatedProjects/
│   │   ├── index.tsx                    RSC: <ul> of related project cards
│   │   ├── RelatedCard.tsx              RSC + client wrapper for black hover
│   │   └── RelatedProjects.module.scss
│   └── ProjectFooter/                   RSC: about-bottom + sans-small-titles
├── Information/
│   ├── InformationModules/
│   │   ├── ClientsList.tsx              RSC list + "use client" wrapper for grey/black hover
│   │   ├── PageTextColumn.tsx           shared with Page/
│   │   └── InformationImageVideo.tsx    RSC <picture> + "use client" video switcher (desktop/ipad/mobile)
├── Page/
│   └── PageModules/                     pageTextColumn, pageImageVideo, etc.
└── PortableText/
    ├── BodyBonTempsRenderer.tsx         maps PT styles → typography token classes
    ├── components/
    │   ├── Headline.tsx                 → .t-headline-project
    │   ├── BodyLarge.tsx                → .t-body-large
    │   ├── Body.tsx                     → .t-body
    │   ├── Caption.tsx                  → .t-caption
    │   ├── SerifDetail.tsx              → .t-serif-detail
    │   ├── SansSmallTitle.tsx           → .t-sans-small
    │   └── AboutBottom.tsx              → .t-about
    └── PortableText.module.scss
```

Conventions:
- One folder per component, `index.tsx` + `.module.scss` (existing template convention).
- Client islands are siblings (`<Component>Client.tsx`) of their RSC parent.
- Client trees are kept small; the parent RSC owns data.

---

## 8. Layout, breakpoints & typography

### Breakpoints
- Mobile: 0 – 767 px
- Tablet: 768 – 1023 px
- Desktop: 1024 – 1799 px
- Desktop XL: ≥ 1800 px (only the intro page consumes this tier)

### Margins (sitewide; values from spec, unified per breakpoint)
- Desktop: 50 px left/right, 60 px bottom.
- Tablet: 30 px left/right, bottom matches Figma (verify on first frame; default 40 px).
- Mobile: derived from Figma. **If Figma is inconsistent across mobile frames, unify to a single value** (per user instruction). Default placeholder 16 px until Figma value is read.

Exposed via CSS variables on `:root`:
```css
--margin-x, --margin-bottom
```
…and overridden per breakpoint with `@media`.

### SCSS organisation
```
styles/
  main.scss                  global imports
  _reset.scss                normalize/reset
  _breakpoints.scss          mixins (mobile, tablet, desktop, desktop-xl, tablet-up)
  _layout.scss               margin tokens + grid helpers
  _typography.scss           token classes (.t-*)
  _colors.scss               tokens (--color-fg, --color-bg, --color-grey, --color-bubble)
  _utilities.scss            .visually-hidden, .stack, .cluster, etc.
  fonts.ts                   next/font/local declarations (re-exported from layout)
```

### Typography tokens (semantic, breakpoint-aware)

Each spec entry maps to a token class. Tokens encode font-family + size + line-height + tracking. Tokens are applied directly in JSX (`<h1 className="t-headline-project">`) or by PortableText style mapping.

| Token class | Family | Mobile | Tablet | Desktop | Desktop XL |
|---|---|---|---|---|---|
| `.t-intro` | sans | 28 / -1% | 32 / -1% | 32 / -1% | 40 / -1% |
| `.t-sans-title` | sans | 16 / -1% | 16 / -1% | 16 / -1% | — |
| `.t-sans-small` | sans | 10 / -1% | 12 / -1% | 12 / -1% | — |
| `.t-rights-reserved` | sans | 8 / -1% | 8 / -1% | 8 / -1% | — |
| `.t-serif-detail` | serif | 16 / -1% | 18 / -1% | 18 / -1% | — |
| `.t-body` | sans | 14 / 105% / -2% | 18 / 105% / -2% | 18 / 105% / -2% | — |
| `.t-project-desc` | sans | 16 / 105% / -2% | 18 / 105% / -2% | 18 / 105% / -2% | — |
| `.t-body-large` | sans | 20 / 100% / -2% | 24 / 105% / -2% | 26 / 105% / -2% | — |
| `.t-headline-project` | sans | 30 / 105% / -2% | 40 / 40px / -2% | 50 / 105% / -2% | — |
| `.t-caption` | sans | 12 / 105% / -2% | 14 / 105% / -2% | 14 / 105% / -2% | — |
| `.t-about` | sans | 20 / 100% / -2% | 26 / 105% / -2% | 26 / 105% / -2% | — |
| `.t-mobile-menu` | sans | 25 / 47px / -2% | — | — | — |

(Format: `font-size px / line-height / letter-spacing`. Line-heights without a unit are unitless multipliers.)

Notes:
- "About" (bottom block) and "Body Large" share desktop sizes but differ in semantic role; tokens kept separate so spec changes can drift them.
- `.t-project-desc` is the description text under each Work card. It diverges from `.t-body` only on mobile (16 vs 14) — the spec explicitly distinguishes them, so the tokens stay separate.
- "All Rights Reserved" (8 px) is specified only at mobile in the spec; the same size is reused on tablet and desktop unless Figma proves otherwise.

### Fonts
- `next/font/local`, woff2 + woff fallbacks per weight, files placed in `public/fonts/`.
- Weight set determined by Figma source files (likely Regular for both families; Medium / Italic if present).
- Variables `--font-sans-loaded`, `--font-serif-loaded` exposed; tokens reference them through `--font-sans` / `--font-serif` to keep system fallbacks if a load fails.

---

## 9. Page-by-page interaction map

### Intro overlay (rendered via `IntroProvider` from layout)
- Mounts only if `sessionStorage.bontemps_intro_seen !== 'true'` AND not in reduced-motion.
- Animation: BTA icon SVG slides/scales in, "Beauty Is A Matter" claim renders letter-by-letter (stagger ~50ms), pause ~500ms, fade out.
- Click anywhere → skip to end (mark seen, unmount).
- Logo click anywhere on site → `IntroProvider.replay()` clears flag and remounts.
- During mount, `body.intro-pending` class is applied to mask Work behind the overlay (no flash).
- Without JS: overlay never mounts; no flash because `intro-pending` class is added by an inline script gate-checked with `sessionStorage`. Inline script only runs if JS is on.

### Work (`/`)
- `<main>` contains:
  - `<h1 class="visually-hidden">{home.claim || 'Bon Temps'}</h1>` — gives crawlers the claim semantically while not duplicating visible content.
  - `<ul class="work-grid">` → each `<li>` is a `ProjectCard` with `<a><Image poster><h3>{title}</h3><p>{subtitle}</p></a>`.
  - `<aside class="about-claim">` rendering `listWork.claim` (or footer.claim) as About-Bottom typography token.
- Hover behaviour (client island per card):
  - Title + subtitle text greys out (`.is-other-hovered` on the grid).
  - The hovered card mounts a `LazyVideo mode="hover"`; if the project's featured media is video, it plays; if image, no video — only the image stays.
- Horizontal spacing between cards: 20 px desktop, 15 px tablet (per spec).

### Project Detail (`/work/[slug]`)
- Top: ProjectHeader (title, subtitle, excerpt, services list).
- Featured media: LazyImage or LazyVideo `mode="in-view"`.
- Body sections: ProjectRecap, Services, Custom Typeface, Bon Temps Team, Collaborators (each a `bodyBonTemps` rendered with PortableText).
- Modules: `module.centeredText`, `module.imageVideo`, `module.textColumn`, `module.imageText` mixed.
- Bottom: VisitWebsiteBubble (only if `websiteUrl` set) + BackToWorkBubble + RelatedProjects + ProjectFooter (about + small titles + serif details).

### Information (`/information`)
- Intro `bodyBonTemps` (Body Large + Body Small).
- Modules: `module.informationClients` (clients hover list) + `module.pageTextColumn` (services / awards / press / contact info) + `module.informationImageVideo` (image/video with desktop/ipad/mobile variants).
- ClientsList behaviour: `<ul><li>` per row; row = `<a href="/work/{slug}">` if `projectRef` exists, else `<li>` with `<span>` only. Hover swaps colour classes (default name=grey, location=black; hover name=black, location=grey).
- Image/Video module behaviour: `<picture>` with art-directed `<source>` per breakpoint for image; for video, the client component switches the HLS source via `matchMedia` on mount (SSR shows the desktop poster).

### Generic page (`/[slug]`)
- Already wired to `page` document; we keep it functional with `module.pageTextColumn` + `module.pageImageVideo` only.

### Mobile menu
- `<nav>` is in DOM at all times (off-canvas via `transform: translateX(100%)`).
- Burger toggle adds `body.menu-open` → CSS slides menu in, locks scroll.
- Items animate in with stagger (per canyon-coffee reference).
- Close on link click and on route change.

---

## 10. SEO, structured data, accessibility

### Server-rendered metadata
- `app/(frontend)/layout.tsx` exports `generateMetadata` that reads `settings.seo` defaults from Sanity.
- Each page (`page.tsx`, `work/[slug]/page.tsx`, `information/page.tsx`, `[slug]/page.tsx`) exports its own `generateMetadata` reading the `seo.page` / `seo.home` block from its document.
- `utils/seoHelper.ts` already defines `BASE_URL`, `siteTitle`, `siteDescription`, `buildUrl`. Update first commit per CLAUDE.md instruction.

### Structured data (JSON-LD, server-rendered via `<script type="application/ld+json">`)
- `Organization` on layout (name, url, logo, sameAs from socials).
- `CreativeWork` per project page (name, description, image, url).
- `BreadcrumbList` on project detail (`Home → Work → {project}`).
- `WebSite` with `potentialAction: SearchAction` skipped (no search).

### Accessibility
- `<html lang="en">` already set; verified.
- Skip link `<a href="#main">Skip to content</a>` injected at top of body.
- `prefers-reduced-motion: reduce` honoured by every animation.
- Keyboard: bubble nav and Visit Website link must be focusable with the same expansion behaviour as hover.
- Colour contrast: confirm grey/black tokens meet WCAG AA on body text (default text colour vs hover grey).
- Alt text on every image, captions on every video, aria-labels on icon-only buttons (burger, logo).

### Crawler hints
- `app/robots.ts` already provided by template; verify it points to the live sitemap.
- `app/sitemap.ts` (NEW): generated from Sanity (projects, information, free pages).
- `app/llms.txt/route.ts` (NEW): plain-text summary tailored to LLM crawlers (studio name, services, project list with URLs).

---

## 11. Implementation phasing (high level)

The implementation plan (next deliverable, written by `writing-plans` skill) will sequence:

1. **Foundations** — fonts, breakpoints, layout tokens, typography tokens, schema deltas + cleanup, GROQ primitives & fragments, TypeScript types, sanity revalidate route.
2. **Common chrome** — Header (bubble, contact, blur, logo fade), Footer, MobileMenu, LazyImage, LazyVideo, IntroOverlay + IntroProvider.
3. **Work page** — WorkGrid, ProjectCard, hover-video island, About claim block, sessionStorage intro logic.
4. **Project Detail** — Header, FeaturedMedia, body sections (PortableText), modules switch, VisitWebsite bubble, BackToWork, RelatedProjects, ProjectFooter.
5. **Information page** — Singleton + GROQ + ClientsList module + page modules.
6. **Generic page** — wire `[slug]` route to `page` doc + page modules.
7. **SEO + structured data** — sitemap, llms.txt, JSON-LD, metadata wiring per route.
8. **QA pass** — pixel-perfect against three Figma frames, reduced-motion audit, crawler audit (curl `/` w/o JS), a11y audit, Lighthouse on each page.

Each phase ends with a verification gate: `npm run typecheck`, `npm run lint`, manual browser test in Chrome + Safari + Firefox + mobile viewport.

---

## 12. Open questions (deferred to implementation, not blocking)

These are minor and resolved at implementation-time once Figma is read:

1. Mobile sitewide margins — exact value(s) from Figma; unify if inconsistent.
2. Font weights / styles — extracted from Figma when font files arrive.
3. Tablet bottom margin — exact value from Figma (default 40 px until verified).
4. Figma "Date" appearance — verify whether project headers show a date string (would change PortableText / project schema if confirmed).
5. Archive frame (`1482:533`) — appears to be a wider variant of Work; confirm with user during implementation whether it is in scope.
6. Header "Contact" bubble styling — same bubble component as menu items, or a separate "Copied" visual? Implementation-time decision based on Figma.

---

## 13. Risk register

| Risk | Likelihood | Mitigation |
|---|---|---|
| Vimeo HLS URLs require auth refresh and break in production | Low | Validate with at least one project before launch; document URL extraction process for client. |
| LCP suffers from above-fold video on Project pages | Medium | Featured media is image by default; video uses `mode="in-view"` and never autoplays before scroll. |
| Hydration flash on Intro overlay | Medium | `body.intro-pending` class set by inline script before paint; CSS hides Work behind overlay until provider resolves. |
| Reduced-motion users miss the brand intro | Low | Intro shows static end state (poster of letters + brand mark) and dismisses after 1s. |
| Sanity CMS shape drift (editors add unsupported field combos) | Medium | Schema validation rules; GROQ types regenerated and TypeScript refuses unknown shapes; PortableText falls back gracefully. |

---

## 14. Approval

This spec was iteratively reviewed during the brainstorming session on 2026-04-28 and approved section-by-section. Implementation plan to be authored next via `superpowers:writing-plans`.

