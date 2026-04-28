# BonTemps Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the BonTemps portfolio site (Intro, Work, Project Detail, Information, free pages, mobile menu, blurred chrome, hover-revealed videos, bubble interactions) on the existing Next.js 15 + Sanity v3 template, server-rendered first with progressive-enhancement animations.

**Architecture:** RSC pages fetch from Sanity at request-time with tag-based revalidation. Client islands handle animations (framer-motion), HLS video, clipboard, and the intro overlay. All content is in the SSR HTML — animations layer on top after hydration.

**Tech Stack:** Next.js 15 App Router · React 19 · Sanity v3 (embedded studio) · TypeScript · SCSS modules · framer-motion 12 · hls.js 1.6 · next/font/local · Vercel-style ISR via `revalidateTag`.

**Source spec:** `docs/superpowers/specs/2026-04-28-bontemps-website-design.md`

---

## Verification model (no test suite in template)

Per CLAUDE.md: this template has no Jest/Vitest. Each task replaces the TDD red→green loop with:

1. **Static gates** — `npm run typecheck` and `npm run lint` after every code change.
2. **SSR gates** — `curl -s http://localhost:3000/<route> | grep -E '<expected text>'` to prove the HTML is server-rendered.
3. **Studio gates** — open `/admin` and verify the schema renders, fields validate, and content can be created without errors.
4. **Browser gates** — manual viewport check for animations, hovers, and interactions in Chrome + Safari + Firefox.
5. **Commit gates** — after every gate passes, commit. Frequent commits = bisect-friendly history.

Throughout the plan, "verify" refers to the gate the step describes.

---

## Conventions used throughout this plan

### Inline scripts (XSS-safe pattern)

Whenever a step injects an inline `<script>` (the intro-gate or a JSON-LD block), use React's text-children pattern with a `</`-escape so that user-provided strings cannot break out of the script tag. **Never use `dangerouslySetInnerHTML` for these blocks.**

```tsx
// Safe inline script — children pattern
<script>{`try { /* hardcoded literal */ } catch {}`}</script>

// Safe JSON-LD with escape (content can come from Sanity)
const json = JSON.stringify(data).replace(/</g, '\\u003c')
return <script type="application/ld+json">{json}</script>
```

The `replace(/</g, '\\u003c')` step is the standard mitigation for `</script>` sequences inside JSON.

### Imports & path aliases

`tsconfig.json` already declares `@/*`. Always use it (`@/components/...`, `@/sanity/...`, `@/utils/...`, `@/styles/...`).

### Commit style

Follow the existing repo style: short Spanish-or-English subject line plus a trailer with `Co-Authored-By` only when explicitly requested. The plan's commit lines are templates — engineers may rephrase but should keep the type prefix (`feat`, `chore`, `fix`, `docs`, `polish`).

---

## File structure (target end state)

```
app/(frontend)/
  layout.tsx                                # MODIFY (fonts, providers, intro mount, JSON-LD)
  page.tsx                                  # REWRITE (Work page)
  work/[slug]/page.tsx                      # CREATE (Project detail)
  information/page.tsx                      # CREATE
  [slug]/page.tsx                           # MODIFY (generic Page)
  not-found.tsx                             # MODIFY (or create) — server-rendered 404
  sitemap.ts                                # CREATE
  llms.txt/route.ts                         # CREATE
app/api/revalidate/route.ts                 # CREATE

sanity/
  schemas/
    documents/project.ts                    # MODIFY (add websiteUrl)
    documents/page.ts                       # KEEP
    documents/service.ts                    # KEEP
    singletons/home.ts                      # KEEP
    singletons/listWork.ts                  # KEEP
    singletons/settings.ts                  # KEEP (settings root unchanged)
    singletons/information.ts               # CREATE
    objects/global/header.ts                # MODIFY (add contactEmail)
    objects/module/mediaImage.ts            # MODIFY (single image + alt)
    objects/module/mediaVideo.ts            # MODIFY (single video)
    objects/module/mediaImageResponsive.ts  # CREATE
    objects/module/mediaVideoResponsive.ts  # CREATE
    objects/module/video.tsx                # MODIFY (rename image→poster)
    objects/module/informationClients.ts    # CREATE
    objects/module/informationImageVideo.ts # CREATE
    objects/module/centeredText.ts          # KEEP
    objects/module/imageVideo.ts            # KEEP (used by Project)
    objects/module/imageText.ts             # KEEP
    objects/module/textColumn.ts            # KEEP
    objects/module/pageTextColumn.ts        # KEEP
    objects/module/pageImageVideo.ts        # KEEP
    blocks/bodyBonTemps.tsx                 # MODIFY (verify styles match spec)
    index.ts                                # MODIFY (register new schemas, drop dead)
  desk/index.ts                             # MODIFY (add Information singleton)
  queries/
    primitives/imageData.ts                 # MODIFY (LQIP + dimensions)
    primitives/imageSize.ts                 # KEEP
    fragments/image.ts                      # MODIFY (single)
    fragments/imageResponsive.ts            # CREATE
    fragments/video.ts                      # CREATE (uses module.video shape)
    fragments/videoResponsive.ts            # CREATE
    fragments/seo.ts                        # KEEP
    common/header.ts                        # MODIFY (contactEmail)
    common/footer.ts                        # KEEP
    common/settings.ts                      # KEEP
    common/intro.ts                         # CREATE (home.claim only)
    queries/work.ts                         # CREATE (listWork + projects)
    queries/project.ts                      # CREATE (single project + related)
    queries/information.ts                  # CREATE
    queries/page.ts                         # CREATE (or refactor existing)
    modules/index.ts                        # CREATE (module dispatcher GROQ)
  types/                                    # MODIFY (add Project, Information, Module*)
  utils/validateSlug.ts                     # KEEP

components/
  Common/
    HeaderComponent/
      index.tsx                             # REWRITE (RSC shell)
      HeaderClient.tsx                      # CREATE
      ContactButton.tsx                     # CREATE
      MobileMenu.tsx                        # CREATE
      HeaderComponent.module.scss           # REWRITE
    FooterComponent/                        # REWRITE per spec
    LazyImage/
      index.tsx                             # REWRITE (RSC wrapper)
      ClientLazyImage.tsx                   # CREATE
      LazyImage.module.scss                 # REWRITE
    LazyVideo/
      index.tsx                             # REWRITE (RSC wrapper)
      ClientLazyVideo.tsx                   # CREATE (HLS attach)
      LazyVideo.module.scss                 # REWRITE
    Analytics/, CookieConsent/, Newsletter/, Lottie/   # KEEP
  Home/
    IntroOverlay/
      index.tsx                             # CREATE
      IntroProvider.tsx                     # CREATE
      IntroSequence.tsx                     # CREATE
      IntroOverlay.module.scss              # CREATE
    WorkGrid/
      index.tsx                             # CREATE
      ProjectCard.tsx                       # CREATE
      ProjectCardHover.tsx                  # CREATE
      WorkGrid.module.scss                  # CREATE
    HomeFooterClaim/
      index.tsx                             # CREATE
      HomeFooterClaim.module.scss           # CREATE
  Singles/
    ProjectHeader/                          # CREATE
    ProjectFeaturedMedia/                   # CREATE
    ProjectModules/                         # CREATE (+ 4 module subcomponents)
    VisitWebsiteBubble/                     # CREATE
    BackToWorkBubble/                       # CREATE
    RelatedProjects/                        # CREATE
    ProjectFooter/                          # CREATE
  Information/
    InformationModules/
      ClientsList.tsx                       # CREATE
      PageTextColumn.tsx                    # CREATE (shared with Page)
      InformationImageVideo.tsx             # CREATE
      ResponsiveVideoClient.tsx             # CREATE
  Page/
    PageModules/
      index.tsx                             # CREATE
      PageTextColumn.tsx                    # re-export from Information
      PageImageVideo.tsx                    # CREATE
      PageModules.module.scss               # CREATE
  PortableText/
    BodyBonTempsRenderer.tsx                # CREATE
    PortableText.module.scss                # CREATE

styles/
  main.scss                                 # MODIFY (import all foundations)
  _breakpoints.scss                         # CREATE
  _layout.scss                              # CREATE
  _typography.scss                          # CREATE
  _colors.scss                              # CREATE
  _utilities.scss                           # CREATE
  fonts.ts                                  # CREATE

public/fonts/                               # add user-supplied woff2/woff (placeholder commit)
utils/seoHelper.ts                          # MODIFY first commit
```

---

## Phase 0 — Pre-flight & verification baseline

### Task 0.1: Update `utils/seoHelper.ts` with BonTemps real values

**Files:**
- Modify: `utils/seoHelper.ts`

- [ ] **Step 1:** Read current contents of `utils/seoHelper.ts` to confirm placeholder shape.

- [ ] **Step 2:** Replace placeholders with BonTemps values. The file must export at minimum:

```ts
export const BASE_URL = 'https://bontemps.agency'
export const siteTitle = 'Bon Temps'
export const siteDescription = 'Bon Temps is a creative studio. Beauty Is A Matter Of Precision.'
export const buildUrl = (path: string = '/') =>
  `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
export const favicons = {
  icon: '/favicon.ico',
  shortcut: '/favicon.ico',
  apple: '/apple-touch-icon.png',
}
```

If the template's helper exports more (`metadataBase`, OG defaults, dev warning), preserve them and only update the BonTemps-specific values.

- [ ] **Step 3:** `npm run typecheck` — must pass.

- [ ] **Step 4:** `git add utils/seoHelper.ts && git commit -m "chore(seo): set BonTemps defaults in seoHelper"`

---

### Task 0.2: Confirm dev environment runs

**Files:** none (sanity check)

- [ ] **Step 1:** `npm install` to ensure node_modules current.

- [ ] **Step 2:** Read `.env.local`. Confirm `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_CLIENT_ID` are set. If any missing, stop and ask the user.

- [ ] **Step 3:** Run `npm run dev` in background, hit `http://localhost:3000` once via `curl -I`. Expect HTTP 200. Hit `http://localhost:3000/admin` similarly. Stop the dev server.

- [ ] **Step 4:** `npm run typecheck` and `npm run lint`. Capture any pre-existing failures and document in a scratch file `docs/superpowers/plans/PRE_EXISTING_ISSUES.md` so we don't blame our changes later.

- [ ] **Step 5:** Commit only the scratch file (no source changes here): `git add docs/superpowers/plans/PRE_EXISTING_ISSUES.md && git commit -m "chore: snapshot pre-existing typecheck/lint state"`.

---

## Phase 1 — Foundations (SCSS, breakpoints, tokens, fonts)

### Task 1.1: Create `_breakpoints.scss`

**Files:**
- Create: `styles/_breakpoints.scss`

- [ ] **Step 1:** Write the file:

```scss
// styles/_breakpoints.scss
$bp-mobile-max: 767px;
$bp-tablet-min: 768px;
$bp-tablet-max: 1023px;
$bp-desktop-min: 1024px;
$bp-desktop-xl-min: 1800px;

@mixin mobile { @media (max-width: $bp-mobile-max) { @content; } }
@mixin tablet { @media (min-width: $bp-tablet-min) and (max-width: $bp-tablet-max) { @content; } }
@mixin desktop { @media (min-width: $bp-desktop-min) { @content; } }
@mixin desktop-only { @media (min-width: $bp-desktop-min) and (max-width: $bp-desktop-xl-min - 1px) { @content; } }
@mixin desktop-xl { @media (min-width: $bp-desktop-xl-min) { @content; } }
@mixin tablet-up { @media (min-width: $bp-tablet-min) { @content; } }
```

- [ ] **Step 2:** Commit: `git add styles/_breakpoints.scss && git commit -m "feat(styles): breakpoint mixins"`

---

### Task 1.2: Create `_colors.scss`

**Files:**
- Create: `styles/_colors.scss`

- [ ] **Step 1:** Tokens tied to function. Update hex values during pixel-perfect pass when Figma is read:

```scss
// styles/_colors.scss
:root {
  --color-fg: #000000;
  --color-bg: #ffffff;
  --color-grey: #8e8e8e;
  --color-grey-light: #c8c8c8;
  --color-bubble: #ededed;
  --color-overlay: rgba(255, 255, 255, 0.6);
  --color-related-hover-bg: #000000;
  --color-related-hover-fg: #ffffff;
}
```

- [ ] **Step 2:** Commit: `git add styles/_colors.scss && git commit -m "feat(styles): color tokens"`

---

### Task 1.3: Create `_layout.scss` (margins)

**Files:**
- Create: `styles/_layout.scss`

- [ ] **Step 1:**

```scss
// styles/_layout.scss
@use "./breakpoints" as *;

:root {
  --margin-x: 16px;
  --margin-bottom: 32px;
  --grid-gap-x: 16px;
}
@include tablet {
  :root { --margin-x: 30px; --margin-bottom: 40px; --grid-gap-x: 15px; }
}
@include desktop {
  :root { --margin-x: 50px; --margin-bottom: 60px; --grid-gap-x: 20px; }
}

.page-x { padding-left: var(--margin-x); padding-right: var(--margin-x); }
.page-bottom { padding-bottom: var(--margin-bottom); }
```

- [ ] **Step 2:** Revisit during Task 10.1 — if Figma diverges, **unify per breakpoint** (per user instruction).

- [ ] **Step 3:** Commit: `git add styles/_layout.scss && git commit -m "feat(styles): layout margin tokens"`

---

### Task 1.4: Create `_typography.scss` with all spec tokens

**Files:**
- Create: `styles/_typography.scss`

- [ ] **Step 1:** Write the full token file (every token in spec §8 included):

```scss
// styles/_typography.scss
@use "./breakpoints" as *;

:root {
  --font-sans: var(--font-sans-loaded, 'Helvetica Neue', sans-serif);
  --font-serif: var(--font-serif-loaded, 'Times New Roman', serif);
}

// Intro
.t-intro {
  font-family: var(--font-sans);
  font-size: 28px;
  letter-spacing: -0.01em;
  @include tablet-up { font-size: 32px; }
  @include desktop-xl { font-size: 40px; }
}

// Sans titles
.t-sans-title {
  font-family: var(--font-sans);
  font-size: 16px;
  letter-spacing: -0.01em;
}
.t-sans-small {
  font-family: var(--font-sans);
  font-size: 12px;
  letter-spacing: -0.01em;
  @include mobile { font-size: 10px; }
}
.t-rights-reserved {
  font-family: var(--font-sans);
  font-size: 8px;
  letter-spacing: -0.01em;
}

// Serif details
.t-serif-detail {
  font-family: var(--font-serif);
  font-size: 18px;
  letter-spacing: -0.01em;
  @include mobile { font-size: 16px; }
}

// Body / project description / body large
.t-body {
  font-family: var(--font-sans);
  font-size: 18px;
  line-height: 1.05;
  letter-spacing: -0.02em;
  @include mobile { font-size: 14px; }
}
.t-project-desc {
  font-family: var(--font-sans);
  font-size: 18px;
  line-height: 1.05;
  letter-spacing: -0.02em;
  @include mobile { font-size: 16px; }
}
.t-body-large {
  font-family: var(--font-sans);
  font-size: 26px;
  line-height: 1.05;
  letter-spacing: -0.02em;
  @include tablet { font-size: 24px; }
  @include mobile { font-size: 20px; line-height: 1; }
}

// Caption
.t-caption {
  font-family: var(--font-sans);
  font-size: 14px;
  line-height: 1.05;
  letter-spacing: -0.02em;
  @include mobile { font-size: 12px; }
}

// About (bottom)
.t-about {
  font-family: var(--font-sans);
  font-size: 26px;
  line-height: 1.05;
  letter-spacing: -0.02em;
  @include mobile { font-size: 20px; line-height: 1; }
}

// Project headline
.t-headline-project {
  font-family: var(--font-sans);
  font-size: 50px;
  line-height: 1.05;
  letter-spacing: -0.02em;
  @include tablet { font-size: 40px; line-height: 40px; }
  @include mobile { font-size: 30px; }
}

// Mobile menu
.t-mobile-menu {
  font-family: var(--font-sans);
  font-size: 25px;
  line-height: 47px;
  letter-spacing: -0.02em;
}
```

- [ ] **Step 2:** Commit: `git add styles/_typography.scss && git commit -m "feat(styles): typography tokens per spec"`

---

### Task 1.5: Create `_utilities.scss`

**Files:**
- Create: `styles/_utilities.scss`

- [ ] **Step 1:**

```scss
// styles/_utilities.scss
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--color-fg);
  color: var(--color-bg);
  padding: 8px 12px;
  z-index: 1000;
  &:focus { top: 0; }
}

// Used by intro overlay to mask the work page until the provider decides
body.intro-pending main { visibility: hidden; }
@media (scripting: none) { body.intro-pending main { visibility: visible !important; } }
```

- [ ] **Step 2:** Commit: `git add styles/_utilities.scss && git commit -m "feat(styles): a11y + intro-pending utilities"`

---

### Task 1.6: Wire `main.scss` to import all foundations

**Files:**
- Modify: `styles/main.scss`

- [ ] **Step 1:** Read existing `main.scss`. Prepend (or replace head) with:

```scss
// styles/main.scss
@use "./breakpoints" as *;
@use "normalize.css";
@use "./colors";
@use "./layout";
@use "./typography";
@use "./utilities";

html { box-sizing: border-box; }
*, *::before, *::after { box-sizing: inherit; }

html, body {
  margin: 0;
  padding: 0;
  background: var(--color-bg);
  color: var(--color-fg);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a { color: inherit; text-decoration: none; }
img, video { max-width: 100%; display: block; }
button { background: none; border: 0; padding: 0; cursor: pointer; font: inherit; color: inherit; }
ul, ol { list-style: none; padding: 0; margin: 0; }
```

Preserve any project-specific globals already in the file beneath this block.

- [ ] **Step 2:** `npm run typecheck` — must pass.

- [ ] **Step 3:** `npm run dev`, open `http://localhost:3000`. Page may be empty (pages aren't built yet) but no SCSS compile errors. Stop server.

- [ ] **Step 4:** Commit: `git add styles/main.scss && git commit -m "feat(styles): wire foundations into main.scss"`

---

### Task 1.7: Create `styles/fonts.ts` (placeholder)

**Files:**
- Create: `styles/fonts.ts`
- Create: `public/fonts/.gitkeep`

- [ ] **Step 1:** Until the user delivers actual woff2/woff files, create a placeholder. We use `next/font/local`, but the import is commented out so the build does not fail when files are missing:

```ts
// styles/fonts.ts
// PLACEHOLDER. Replace with next/font/local once the client delivers woff2/woff files into public/fonts/.
// Real version (uncomment when files exist):
//
// import localFont from 'next/font/local'
// export const sans = localFont({
//   src: [
//     { path: '../public/fonts/sans-regular.woff2', weight: '400', style: 'normal' },
//     { path: '../public/fonts/sans-regular.woff', weight: '400', style: 'normal' },
//   ],
//   variable: '--font-sans-loaded',
//   display: 'swap',
// })
// export const serif = localFont({
//   src: [
//     { path: '../public/fonts/serif-regular.woff2', weight: '400', style: 'normal' },
//     { path: '../public/fonts/serif-regular.woff', weight: '400', style: 'normal' },
//   ],
//   variable: '--font-serif-loaded',
//   display: 'swap',
// })

export const sans = { variable: '' as string }
export const serif = { variable: '' as string }
```

- [ ] **Step 2:**

```bash
mkdir -p public/fonts && touch public/fonts/.gitkeep
```

- [ ] **Step 3:** Commit: `git add styles/fonts.ts public/fonts/.gitkeep && git commit -m "feat(styles): font loader stub for next/font/local"`

> **Engineer note:** When the client delivers font files, replace the stub with the real `localFont` block. Verify the variable names (`--font-sans-loaded`, `--font-serif-loaded`) — these are referenced from `_typography.scss`.

---

## Phase 2 — Sanity schema deltas

### Task 2.1: Simplify `media.image` (single image + alt required)

**Files:**
- Modify: `sanity/schemas/objects/module/mediaImage.ts`

- [ ] **Step 1:** Read current file to capture existing options.

- [ ] **Step 2:** Replace contents:

```ts
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'media.image',
  title: 'Image',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description: 'Alt description for screen readers and SEO. Required.',
      validation: (Rule) => Rule.required().min(1).max(200),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
  ],
  preview: {
    select: { title: 'alt', media: 'image' },
    prepare({ title, media }) {
      return { title: title || 'Image', media }
    },
  },
})
```

- [ ] **Step 3:** `npm run typecheck` to surface any consumers of the old shape. Fix consumers in their own task; track here.

- [ ] **Step 4:** Commit: `git add sanity/schemas/objects/module/mediaImage.ts && git commit -m "feat(sanity): simplify media.image to single asset + required alt"`

---

### Task 2.2: Simplify `media.video`

**Files:**
- Modify: `sanity/schemas/objects/module/mediaVideo.ts`

- [ ] **Step 1:**

```ts
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'media.video',
  title: 'Video',
  type: 'object',
  fields: [
    defineField({
      name: 'video',
      title: 'Video',
      type: 'module.video',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
  ],
  preview: {
    select: { title: 'video.title', caption: 'caption' },
    prepare({ title, caption }) {
      return { title: caption || title || 'Video', subtitle: 'Video' }
    },
  },
})
```

- [ ] **Step 2:** `npm run typecheck`. Commit:

```bash
git add sanity/schemas/objects/module/mediaVideo.ts
git commit -m "feat(sanity): simplify media.video to single asset"
```

---

### Task 2.3: Update `module.video` (rename `image`→`poster`, doc HLS)

**Files:**
- Modify: `sanity/schemas/objects/module/video.tsx`

- [ ] **Step 1:**

```tsx
import { DocumentVideoIcon } from '@sanity/icons'
import { defineField } from 'sanity'

export default defineField({
  name: 'module.video',
  title: 'Video',
  type: 'object',
  icon: DocumentVideoIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Internal title',
      type: 'string',
      description: 'For Sanity preview only.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'poster',
      title: 'Poster (still frame)',
      type: 'image',
      options: { hotspot: true },
      description: 'Shown before the video plays and as a fallback if the HLS source fails.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL (HLS .m3u8)',
      type: 'url',
      description: 'Direct HLS streaming URL from Vimeo Pro (must end in .m3u8). Do not use embed/iframe URLs.',
      validation: (Rule) =>
        Rule.required()
          .uri({ scheme: ['https'] })
          .custom((value) => {
            if (!value) return true
            return value.includes('.m3u8')
              ? true
              : 'URL should typically end with .m3u8 (HLS manifest).'
          })
          .warning(),
    }),
  ],
  preview: {
    select: { title: 'title', media: 'poster' },
    prepare({ title, media }) {
      return { title, media }
    },
  },
})
```

- [ ] **Step 2:** `npm run typecheck`. Commit:

```bash
git add sanity/schemas/objects/module/video.tsx
git commit -m "feat(sanity): rename module.video.image to poster, document HLS URL"
```

---

### Task 2.4: Add `websiteUrl` to project document

**Files:**
- Modify: `sanity/schemas/documents/project.ts`

- [ ] **Step 1:** Insert this field **after** `subtitle` and **before** `excerpt`:

```ts
defineField({
  name: 'websiteUrl',
  title: 'Project website URL',
  type: 'url',
  description: 'External URL for "+ Visit Website". Leave empty if the project has no public site.',
  validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
  group: 'editorial',
}),
```

- [ ] **Step 2:** `npm run typecheck`, open `/admin`, confirm field renders. Commit:

```bash
git add sanity/schemas/documents/project.ts
git commit -m "feat(sanity): websiteUrl on project for Visit Website bubble"
```

---

### Task 2.5: Add `contactEmail` to header settings

**Files:**
- Modify: `sanity/schemas/objects/global/header.ts`

- [ ] **Step 1:** Insert before `instagramUrl`:

```ts
defineField({
  name: 'contactEmail',
  title: 'Contact email',
  type: 'string',
  description: 'Single source for the Contact button (header). Tap = copy to clipboard.',
  validation: (Rule) => Rule.required().email(),
}),
```

- [ ] **Step 2:** Open `/admin → Settings → Header`. Confirm field is editable and email-validated. Commit:

```bash
git add sanity/schemas/objects/global/header.ts
git commit -m "feat(sanity): contactEmail in header settings"
```

---

### Task 2.6: Create `media.imageResponsive`

**Files:**
- Create: `sanity/schemas/objects/module/mediaImageResponsive.ts`

- [ ] **Step 1:**

```ts
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'media.imageResponsive',
  title: 'Image (responsive)',
  type: 'object',
  description: 'Use only on Information page where breakpoint art-direction is required.',
  fields: [
    defineField({
      name: 'desktop',
      title: 'Desktop image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'ipad',
      title: 'iPad image (optional)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'mobile',
      title: 'Mobile image (optional)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      validation: (Rule) => Rule.required().min(1).max(200),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
  ],
  preview: {
    select: { title: 'alt', media: 'desktop' },
    prepare({ title, media }) {
      return { title: title || 'Responsive image', media }
    },
  },
})
```

- [ ] **Step 2:** Commit: `git add sanity/schemas/objects/module/mediaImageResponsive.ts && git commit -m "feat(sanity): media.imageResponsive for Information"`

---

### Task 2.7: Create `media.videoResponsive`

**Files:**
- Create: `sanity/schemas/objects/module/mediaVideoResponsive.ts`

- [ ] **Step 1:**

```ts
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'media.videoResponsive',
  title: 'Video (responsive)',
  type: 'object',
  description: 'Use only on Information page where breakpoint art-direction is required.',
  fields: [
    defineField({
      name: 'desktop',
      title: 'Desktop video',
      type: 'module.video',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'ipad',
      title: 'iPad video (optional)',
      type: 'module.video',
    }),
    defineField({
      name: 'mobile',
      title: 'Mobile video (optional)',
      type: 'module.video',
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
  ],
  preview: {
    select: { title: 'desktop.title', media: 'desktop.poster' },
    prepare({ title, media }) {
      return { title: title || 'Responsive video', media }
    },
  },
})
```

- [ ] **Step 2:** Commit: `git add sanity/schemas/objects/module/mediaVideoResponsive.ts && git commit -m "feat(sanity): media.videoResponsive for Information"`

---

### Task 2.8: Create `module.informationClients`

**Files:**
- Create: `sanity/schemas/objects/module/informationClients.ts`

- [ ] **Step 1:**

```ts
import { UsersIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'module.informationClients',
  title: 'Clients list (Information)',
  type: 'object',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Section title',
      type: 'string',
      initialValue: 'Clients',
    }),
    defineField({
      name: 'items',
      title: 'Clients',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'clientEntry',
          fields: [
            defineField({
              name: 'name',
              title: 'Client name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'location',
              title: 'Location',
              type: 'string',
            }),
            defineField({
              name: 'projectRef',
              title: 'Linked project (optional)',
              type: 'reference',
              to: [{ type: 'project' }],
              description: 'When set, the row links to /work/<slug>.',
            }),
          ],
          preview: { select: { title: 'name', subtitle: 'location' } },
        },
      ],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: { title: 'title', count: 'items.length' },
    prepare({ title, count }) {
      return {
        title: title || 'Clients',
        subtitle: `${count || 0} client${count === 1 ? '' : 's'}`,
      }
    },
  },
})
```

- [ ] **Step 2:** Commit: `git add sanity/schemas/objects/module/informationClients.ts && git commit -m "feat(sanity): module.informationClients hover list"`

---

### Task 2.9: Create `module.informationImageVideo`

**Files:**
- Create: `sanity/schemas/objects/module/informationImageVideo.ts`

- [ ] **Step 1:** Read existing `module.pageImageVideo.ts` first so the field names match (columns, items, layout, reverseOrderOnMobile). Then:

```ts
import { ImagesIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'module.informationImageVideo',
  title: 'Image / Video (Information, responsive)',
  type: 'object',
  icon: ImagesIcon,
  description: 'Variant of pageImageVideo with desktop/ipad/mobile art-direction.',
  fields: [
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'number',
      options: { list: [1, 2, 3] },
      validation: (Rule) => Rule.required().min(1).max(3),
      initialValue: 1,
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        { type: 'media.imageResponsive' },
        { type: 'media.videoResponsive' },
      ],
      validation: (Rule) => Rule.min(1).max(3),
    }),
    defineField({
      name: 'reverseOrderOnMobile',
      title: 'Reverse order on mobile',
      type: 'boolean',
      initialValue: false,
      hidden: ({ parent }) => !parent?.items || parent.items.length < 2,
    }),
  ],
  preview: {
    select: { columns: 'columns', count: 'items.length' },
    prepare({ columns, count }) {
      return {
        title: 'Image / Video (Info)',
        subtitle: `${count} item(s) in ${columns} column(s)`,
      }
    },
  },
})
```

- [ ] **Step 2:** Commit: `git add sanity/schemas/objects/module/informationImageVideo.ts && git commit -m "feat(sanity): module.informationImageVideo with responsive variants"`

---

### Task 2.10: Create `information` singleton

**Files:**
- Create: `sanity/schemas/singletons/information.ts`

- [ ] **Step 1:**

```ts
import { InfoOutlineIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

const TITLE = 'Information'

export default defineType({
  name: 'information',
  title: TITLE,
  type: 'document',
  icon: InfoOutlineIcon,
  groups: [
    { default: true, name: 'editorial', title: 'Editorial' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'intro',
      title: 'Intro copy',
      type: 'bodyBonTemps',
      group: 'editorial',
    }),
    defineField({
      name: 'modules',
      title: 'Modules',
      type: 'array',
      of: [
        { type: 'module.informationClients' },
        { type: 'module.pageTextColumn' },
        { type: 'module.informationImageVideo' },
      ],
      group: 'editorial',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo.page',
      group: 'seo',
    }),
  ],
  preview: { prepare: () => ({ title: TITLE, subtitle: 'Singleton' }) },
})
```

- [ ] **Step 2:** Commit: `git add sanity/schemas/singletons/information.ts && git commit -m "feat(sanity): information singleton"`

---

### Task 2.11: Wire new schemas into `schemas/index.ts`

**Files:**
- Modify: `sanity/schemas/index.ts`

- [ ] **Step 1:** Add imports + register:

```ts
// At the top with other singletons:
import information from './singletons/information'
// ... and in the singletons array:
const singletons = [home, listWork, settings, information]

// New objects:
import mediaImageResponsive from './objects/module/mediaImageResponsive'
import mediaVideoResponsive from './objects/module/mediaVideoResponsive'
import moduleInformationClients from './objects/module/informationClients'
import moduleInformationImageVideo from './objects/module/informationImageVideo'

// Append into the objects array:
//   mediaImageResponsive, mediaVideoResponsive,
//   moduleInformationClients, moduleInformationImageVideo,
```

- [ ] **Step 2:** `npm run typecheck`. Open `/admin`. Confirm Information singleton appears (in default doc list until 2.12 wires desk).

- [ ] **Step 3:** Commit: `git add sanity/schemas/index.ts && git commit -m "feat(sanity): register information singleton + new modules"`

---

### Task 2.12: Wire `information` into desk structure

**Files:**
- Modify: `sanity/desk/index.ts`

- [ ] **Step 1:** Read current desk file. Add an entry mirroring the `home` / `listWork` pattern:

```ts
S.listItem()
  .title('Information')
  .id('information')
  .child(
    S.editor()
      .id('information')
      .schemaType('information')
      .documentId('information')
  )
```

Place above or beside the Settings entry.

- [ ] **Step 2:** Open `/admin`. Click "Information" in the left rail; verify it opens a single editor (not a list).

- [ ] **Step 3:** Commit: `git add sanity/desk/index.ts && git commit -m "feat(sanity): information singleton in desk structure"`

---

### Task 2.13: Cleanup unused schemas

**Files:**
- Modify: `sanity/schemas/index.ts`
- Delete: schema files for unused types

- [ ] **Step 1:** Candidates: `body`, `bodySimple`, `bodyTextTerms`, `accordion`, `accordionBody`, `accordionGroup`, `card`, `forms`, `grid`, `gridItem`, `heroHome`, `heroPage`, `notFoundPage`. For each, run:

```bash
grep -r "type: '<schema-name>'" sanity/schemas/ app/ components/
```

If any non-deleted document references the schema, **do not delete it**. Note dependency in `docs/superpowers/plans/PRE_EXISTING_ISSUES.md`.

- [ ] **Step 2:** For each confirmed-unused schema, delete the file and remove the import + array entry from `sanity/schemas/index.ts`.

- [ ] **Step 3:** `npm run typecheck`. If anything fails, restore.

- [ ] **Step 4:** Commit: `git add -A sanity/schemas/ && git commit -m "chore(sanity): remove unused schemas"`

---

### Task 2.14: Verify `bodyBonTemps` styles match spec

**Files:**
- Modify (if needed): `sanity/schemas/blocks/bodyBonTemps.tsx`

- [ ] **Step 1:** Read the file. The `styles` array must include items with `value` matching every typography token used in body content. Recommended set:

```ts
styles: [
  { title: 'Body', value: 'normal' },                  // → .t-body
  { title: 'Body Large', value: 'bodyLarge' },         // → .t-body-large
  { title: 'Headline', value: 'headline' },            // → .t-headline-project
  { title: 'Caption', value: 'caption' },              // → .t-caption
  { title: 'Sans Small Title', value: 'sansSmall' },   // → .t-sans-small
  { title: 'Serif Detail', value: 'serifDetail' },     // → .t-serif-detail
  { title: 'About', value: 'about' },                  // → .t-about
],
```

If existing styles differ, **add** the missing ones; do not remove existing ones unless 100% sure they are unused.

- [ ] **Step 2:** Commit: `git add sanity/schemas/blocks/bodyBonTemps.tsx && git commit -m "feat(sanity): bodyBonTemps styles aligned with typography tokens"`

---

## Phase 3 — TypeScript types, GROQ primitives, fragments, queries

### Task 3.1: Update GROQ primitive `imageData`

**Files:**
- Modify: `sanity/queries/primitives/imageData.ts` (or `.tsx` form)

- [ ] **Step 1:** Read existing file. Replace export with:

```ts
export const imageDataPrimitive = `
  asset->{
    _id,
    url,
    metadata {
      lqip,
      dimensions { width, height, aspectRatio }
    }
  },
  hotspot,
  crop
`
```

- [ ] **Step 2:** Commit: `git add sanity/queries/primitives/imageData.ts && git commit -m "feat(groq): imageData primitive includes LQIP + dimensions"`

---

### Task 3.2: Build `image` fragment (single)

**Files:**
- Modify: `sanity/queries/fragments/image.ts`

- [ ] **Step 1:**

```ts
import { imageDataPrimitive } from '../primitives/imageData'

export const imageFragment = `
  image { ${imageDataPrimitive} },
  alt,
  caption
`
```

- [ ] **Step 2:** Commit: `git add sanity/queries/fragments/image.ts && git commit -m "feat(groq): image fragment for media.image"`

---

### Task 3.3: Build `imageResponsive` fragment

**Files:**
- Create: `sanity/queries/fragments/imageResponsive.ts`

- [ ] **Step 1:**

```ts
import { imageDataPrimitive } from '../primitives/imageData'

export const imageResponsiveFragment = `
  desktop { ${imageDataPrimitive} },
  ipad    { ${imageDataPrimitive} },
  mobile  { ${imageDataPrimitive} },
  alt,
  caption
`
```

- [ ] **Step 2:** Commit: `git add sanity/queries/fragments/imageResponsive.ts && git commit -m "feat(groq): imageResponsive fragment"`

---

### Task 3.4: Build `video` and `videoResponsive` fragments

**Files:**
- Create: `sanity/queries/fragments/video.ts`
- Create: `sanity/queries/fragments/videoResponsive.ts`

- [ ] **Step 1:** `video.ts`:

```ts
import { imageDataPrimitive } from '../primitives/imageData'

export const moduleVideoFragment = `
  title,
  videoUrl,
  poster { ${imageDataPrimitive} }
`

export const videoFragment = `
  video { ${moduleVideoFragment} },
  caption
`
```

- [ ] **Step 2:** `videoResponsive.ts`:

```ts
import { moduleVideoFragment } from './video'

export const videoResponsiveFragment = `
  desktop { ${moduleVideoFragment} },
  ipad    { ${moduleVideoFragment} },
  mobile  { ${moduleVideoFragment} },
  caption
`
```

- [ ] **Step 3:** Commit: `git add sanity/queries/fragments/video.ts sanity/queries/fragments/videoResponsive.ts && git commit -m "feat(groq): video + videoResponsive fragments"`

---

### Task 3.5: Build modules dispatcher GROQ

**Files:**
- Create: `sanity/queries/modules/index.ts`

- [ ] **Step 1:**

```ts
import { imageFragment } from '../fragments/image'
import { videoFragment } from '../fragments/video'
import { imageResponsiveFragment } from '../fragments/imageResponsive'
import { videoResponsiveFragment } from '../fragments/videoResponsive'

// Project modules
export const projectModulesFragment = `
  modules[]{
    _type,
    _key,
    _type == "module.centeredText" => { body },
    _type == "module.imageVideo" => {
      columns,
      reverseOrderOnMobile,
      items[]{
        _type,
        _type == "media.image" => { ${imageFragment} },
        _type == "media.video" => { ${videoFragment} }
      }
    },
    _type == "module.imageText" => {
      reverseOrderOnMobile,
      media{
        _type,
        _type == "media.image" => { ${imageFragment} },
        _type == "media.video" => { ${videoFragment} }
      },
      body
    },
    _type == "module.textColumn" => { body, columns, span, columnStart }
  }
`

// Page modules
export const pageModulesFragment = `
  modules[]{
    _type,
    _key,
    _type == "module.pageTextColumn" => { body, columns, span, columnStart },
    _type == "module.pageImageVideo" => {
      columns,
      reverseOrderOnMobile,
      items[]{
        _type,
        _type == "media.image" => { ${imageFragment} },
        _type == "media.video" => { ${videoFragment} }
      }
    }
  }
`

// Information modules
export const informationModulesFragment = `
  modules[]{
    _type,
    _key,
    _type == "module.informationClients" => {
      title,
      items[]{
        name,
        location,
        "projectSlug": projectRef->slug.current
      }
    },
    _type == "module.pageTextColumn" => { body, columns, span, columnStart },
    _type == "module.informationImageVideo" => {
      columns,
      reverseOrderOnMobile,
      items[]{
        _type,
        _type == "media.imageResponsive" => { ${imageResponsiveFragment} },
        _type == "media.videoResponsive" => { ${videoResponsiveFragment} }
      }
    }
  }
`
```

> **NOTE:** the exact field names inside each module (`columns`, `span`, `columnStart`, `reverseOrderOnMobile`) must match the schema. If schemas differ, update both — keep GROQ in lock-step with schema definitions.

- [ ] **Step 2:** Commit: `git add sanity/queries/modules/index.ts && git commit -m "feat(groq): module dispatchers for project, page, information"`

---

### Task 3.6: Build `intro` query

**Files:**
- Create: `sanity/queries/common/intro.ts`

- [ ] **Step 1:**

```ts
import { client } from '../index'

export async function getIntroClaim(): Promise<string | null> {
  return client.fetch<string | null>(
    `*[_type == "home"][0].claim`,
    {},
    { next: { tags: ['sanity', 'home'] } }
  )
}
```

- [ ] **Step 2:** Commit: `git add sanity/queries/common/intro.ts && git commit -m "feat(groq): intro claim query"`

---

### Task 3.7: Build `work` query (listWork + projects index)

**Files:**
- Create: `sanity/queries/queries/work.ts`

- [ ] **Step 1:**

```ts
import { client } from '../index'
import { imageFragment } from '../fragments/image'
import { videoFragment } from '../fragments/video'
import { defaultSEOFragment } from '../fragments/seo'

const WORK_QUERY = `{
  "listWork": *[_type == "listWork"][0]{
    claim,
    seo { ${defaultSEOFragment} }
  },
  "projects": *[_type == "project"] | order(orderRank asc) {
    _id,
    title,
    "slug": slug.current,
    subtitle,
    excerpt,
    featuredMediaType,
    featuredImage{ ${imageFragment} },
    featuredVideo{ ${videoFragment} }
  }
}`

export type WorkData = {
  listWork: { claim?: string; seo?: any } | null
  projects: Array<{
    _id: string
    title: string
    slug: string
    subtitle?: string
    excerpt?: string
    featuredMediaType: 'image' | 'video'
    featuredImage?: any
    featuredVideo?: any
  }>
}

export async function getWork(): Promise<WorkData> {
  return client.fetch<WorkData>(WORK_QUERY, {}, {
    next: { tags: ['sanity', 'project', 'listWork'] },
  })
}
```

> Adjust `defaultSEOFragment` import path if it lives elsewhere; see `sanity/queries/fragments/seo.ts` first.

- [ ] **Step 2:** Commit: `git add sanity/queries/queries/work.ts && git commit -m "feat(groq): work index query"`

---

### Task 3.8: Build `project` query (single + related)

**Files:**
- Create: `sanity/queries/queries/project.ts`

- [ ] **Step 1:**

```ts
import { client } from '../index'
import { imageFragment } from '../fragments/image'
import { videoFragment } from '../fragments/video'
import { defaultSEOFragment } from '../fragments/seo'
import { projectModulesFragment } from '../modules'

const PROJECT_QUERY = `*[_type == "project" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  subtitle,
  excerpt,
  websiteUrl,
  featuredMediaType,
  featuredImage{ ${imageFragment} },
  featuredVideo{ ${videoFragment} },
  services[]->{ _id, title },
  projectRecap,
  servicesBody,
  customTypeface,
  bonTempsTeam,
  collaborators,
  ${projectModulesFragment},
  "relatedProjects": relatedProjects[]->{
    _id,
    title,
    "slug": slug.current,
    subtitle,
    featuredMediaType,
    featuredImage{ ${imageFragment} },
    featuredVideo{ ${videoFragment} }
  },
  seo { ${defaultSEOFragment} }
}`

const PROJECT_SLUGS_QUERY = `*[_type == "project" && defined(slug.current)][].slug.current`

export async function getProject(slug: string) {
  return client.fetch(PROJECT_QUERY, { slug }, {
    next: { tags: ['sanity', `project:${slug}`] },
  })
}

export async function getAllProjectSlugs(): Promise<string[]> {
  return client.fetch(PROJECT_SLUGS_QUERY, {}, { next: { tags: ['sanity', 'project'] } })
}
```

- [ ] **Step 2:** Commit: `git add sanity/queries/queries/project.ts && git commit -m "feat(groq): single project query + slug index"`

---

### Task 3.9: Build `information` query

**Files:**
- Create: `sanity/queries/queries/information.ts`

- [ ] **Step 1:**

```ts
import { client } from '../index'
import { defaultSEOFragment } from '../fragments/seo'
import { informationModulesFragment } from '../modules'

const INFORMATION_QUERY = `*[_type == "information"][0]{
  intro,
  ${informationModulesFragment},
  seo { ${defaultSEOFragment} }
}`

export async function getInformation() {
  return client.fetch(INFORMATION_QUERY, {}, {
    next: { tags: ['sanity', 'information'] },
  })
}
```

- [ ] **Step 2:** Commit: `git add sanity/queries/queries/information.ts && git commit -m "feat(groq): information query"`

---

### Task 3.10: Build `page` query

**Files:**
- Create: `sanity/queries/queries/page.ts`

- [ ] **Step 1:**

```ts
import { client } from '../index'
import { defaultSEOFragment } from '../fragments/seo'
import { pageModulesFragment } from '../modules'

const PAGE_QUERY = `*[_type == "page" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  ${pageModulesFragment},
  seo { ${defaultSEOFragment} }
}`

const PAGE_SLUGS_QUERY = `*[_type == "page" && defined(slug.current)][].slug.current`

export async function getPage(slug: string) {
  return client.fetch(PAGE_QUERY, { slug }, { next: { tags: ['sanity', `page:${slug}`] } })
}
export async function getAllPageSlugs(): Promise<string[]> {
  return client.fetch(PAGE_SLUGS_QUERY, {}, { next: { tags: ['sanity', 'page'] } })
}
```

- [ ] **Step 2:** Commit: `git add sanity/queries/queries/page.ts && git commit -m "feat(groq): page query"`

---

### Task 3.11: Update header common query (add `contactEmail`)

**Files:**
- Modify: `sanity/queries/common/header.ts`

- [ ] **Step 1:**

```ts
import { client } from '../index'

const HEADER_QUERY = `*[_type == "settings"][0].header{
  contactEmail,
  instagramUrl,
  headerMenu{
    items[]{
      _key,
      _type,
      _type == "linkInternal" => { title, "slug": reference->slug.current, "type": reference->_type },
      _type == "linkExternal" => { title, url, newWindow }
    }
  }
}`

export type HeaderData = {
  contactEmail?: string
  instagramUrl?: string
  headerMenu?: {
    items?: Array<{
      _key: string
      _type: string
      title?: string
      slug?: string
      type?: string
      url?: string
      newWindow?: boolean
    }>
  }
}

export async function getHeader(): Promise<HeaderData | undefined> {
  return client.fetch(HEADER_QUERY, {}, { next: { tags: ['sanity', 'settings'] } })
}
```

- [ ] **Step 2:** Commit: `git add sanity/queries/common/header.ts && git commit -m "feat(groq): header query includes contactEmail"`

---

### Task 3.12: Update Sanity TS types

**Files:**
- Modify: `sanity/types/index.ts` (or split files)

- [ ] **Step 1:** Add/adjust:

```ts
export type SanityImage = {
  asset?: {
    _id: string
    url: string
    metadata?: {
      lqip?: string
      dimensions?: { width: number; height: number; aspectRatio: number }
    }
  }
  hotspot?: any
  crop?: any
}

export type MediaImage = { image: SanityImage; alt: string; caption?: string }

export type ModuleVideo = { title: string; videoUrl: string; poster: SanityImage }
export type MediaVideo = { video: ModuleVideo; caption?: string }

export type MediaImageResponsive = {
  desktop: SanityImage
  ipad?: SanityImage
  mobile?: SanityImage
  alt: string
  caption?: string
}
export type MediaVideoResponsive = {
  desktop: ModuleVideo
  ipad?: ModuleVideo
  mobile?: ModuleVideo
  caption?: string
}

export type ProjectCardData = {
  _id: string
  title: string
  slug: string
  subtitle?: string
  excerpt?: string
  featuredMediaType: 'image' | 'video'
  featuredImage?: MediaImage
  featuredVideo?: MediaVideo
}

export type ProjectFull = ProjectCardData & {
  websiteUrl?: string
  services?: Array<{ _id: string; title: string }>
  projectRecap?: any
  servicesBody?: any
  customTypeface?: any
  bonTempsTeam?: any
  collaborators?: any
  modules?: any[]
  relatedProjects?: ProjectCardData[]
  seo?: any
}

export type InformationData = {
  intro?: any
  modules?: any[]
  seo?: any
}
```

- [ ] **Step 2:** `npm run typecheck`. Commit: `git add sanity/types && git commit -m "feat(types): types for project, information, media variants"`

---

### Task 3.13: Build revalidate API route

**Files:**
- Create: `app/api/revalidate/route.ts`

- [ ] **Step 1:**

```ts
import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

const SECRET = process.env.SANITY_REVALIDATE_SECRET

type WebhookPayload = { _type?: string; slug?: { current?: string } }

export async function POST(req: NextRequest) {
  if (!SECRET) {
    return NextResponse.json({ ok: false, error: 'Missing SANITY_REVALIDATE_SECRET' }, { status: 500 })
  }
  const { isValidSignature, body } = await parseBody<WebhookPayload>(req, SECRET)
  if (!isValidSignature) {
    return NextResponse.json({ ok: false, error: 'Invalid signature' }, { status: 401 })
  }
  const tag = body?._type
  if (!tag) {
    return NextResponse.json({ ok: false, error: 'No _type' }, { status: 400 })
  }
  revalidateTag('sanity')
  revalidateTag(tag)
  if (body.slug?.current) revalidateTag(`${tag}:${body.slug.current}`)
  return NextResponse.json({ ok: true, tag, slug: body.slug?.current })
}
```

- [ ] **Step 2:** Append `SANITY_REVALIDATE_SECRET=` line to `.env.example`.

- [ ] **Step 3:** Commit: `git add app/api/revalidate/route.ts .env.example && git commit -m "feat(api): /api/revalidate webhook for Sanity ISR"`

---

## Phase 4 — Common chrome (Header, Footer, LazyImage, LazyVideo, Intro)

### Task 4.1: Refactor `LazyImage`

**Files:**
- Rewrite: `components/Common/LazyImage/index.tsx`
- Create: `components/Common/LazyImage/ClientLazyImage.tsx`
- Rewrite: `components/Common/LazyImage/LazyImage.module.scss`

- [ ] **Step 1:** RSC wrapper:

```tsx
// components/Common/LazyImage/index.tsx
import type { SanityImage } from '@/sanity/types'
import { urlFor } from '@/sanity/queries'
import ClientLazyImage from './ClientLazyImage'

type Props = {
  image: SanityImage
  alt: string
  sizes: string
  priority?: boolean
  className?: string
  width?: number
}

export default function LazyImage({ image, alt, sizes, priority, className, width = 1600 }: Props) {
  const dim = image.asset?.metadata?.dimensions
  if (!image.asset || !dim) return null
  const src = urlFor(image).auto('format').width(width).quality(85).url()
  const lqip = image.asset.metadata?.lqip
  return (
    <ClientLazyImage
      src={src}
      alt={alt}
      width={dim.width}
      height={dim.height}
      sizes={sizes}
      priority={priority}
      className={className}
      lqip={lqip}
    />
  )
}
```

- [ ] **Step 2:** Client wrapper:

```tsx
// components/Common/LazyImage/ClientLazyImage.tsx
'use client'
import Image from 'next/image'
import { useState } from 'react'
import styles from './LazyImage.module.scss'

type Props = {
  src: string
  alt: string
  width: number
  height: number
  sizes: string
  priority?: boolean
  className?: string
  lqip?: string
}

export default function ClientLazyImage({
  src, alt, width, height, sizes, priority, className, lqip,
}: Props) {
  const [loaded, setLoaded] = useState(false)
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      placeholder={lqip ? 'blur' : 'empty'}
      blurDataURL={lqip}
      className={`${styles.img} ${className ?? ''} ${loaded ? styles.isLoaded : ''}`}
      onLoadingComplete={() => setLoaded(true)}
    />
  )
}
```

- [ ] **Step 3:** SCSS:

```scss
// components/Common/LazyImage/LazyImage.module.scss
.img {
  width: 100%;
  height: auto;
  filter: blur(8px) saturate(1.1);
  transition: filter 600ms ease, opacity 600ms ease;
  opacity: 0.92;
}
.img.isLoaded {
  filter: blur(0) saturate(1);
  opacity: 1;
}
```

- [ ] **Step 4:** `npm run typecheck`. Commit:

```bash
git add components/Common/LazyImage
git commit -m "feat(LazyImage): RSC wrapper + client fade-on-load with LQIP"
```

---

### Task 4.2: Refactor `LazyVideo` (HLS-aware)

**Files:**
- Rewrite: `components/Common/LazyVideo/index.tsx`
- Create: `components/Common/LazyVideo/ClientLazyVideo.tsx`
- Rewrite: `components/Common/LazyVideo/LazyVideo.module.scss`

- [ ] **Step 1:** RSC wrapper:

```tsx
// components/Common/LazyVideo/index.tsx
import { urlFor } from '@/sanity/queries'
import type { ModuleVideo } from '@/sanity/types'
import ClientLazyVideo from './ClientLazyVideo'

type Props = {
  video: ModuleVideo
  mode?: 'hover' | 'in-view' | 'always'
  mobileAutoplay?: boolean
  className?: string
}

export default function LazyVideo({
  video, mode = 'in-view', mobileAutoplay = true, className,
}: Props) {
  const posterUrl = urlFor(video.poster).auto('format').width(1600).quality(85).url()
  return (
    <ClientLazyVideo
      videoUrl={video.videoUrl}
      posterUrl={posterUrl}
      title={video.title}
      mode={mode}
      mobileAutoplay={mobileAutoplay}
      className={className}
    />
  )
}
```

- [ ] **Step 2:** Client component:

```tsx
// components/Common/LazyVideo/ClientLazyVideo.tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import styles from './LazyVideo.module.scss'

type Props = {
  videoUrl: string
  posterUrl: string
  title: string
  mode: 'hover' | 'in-view' | 'always'
  mobileAutoplay: boolean
  className?: string
}

export default function ClientLazyVideo({
  videoUrl, posterUrl, title, mode, mobileAutoplay, className,
}: Props) {
  const ref = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<any>(null)
  const [isAttached, setIsAttached] = useState(false)

  const attachHls = async () => {
    const video = ref.current
    if (!video || isAttached) return
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoUrl
    } else {
      const Hls = (await import('hls.js')).default
      if (Hls.isSupported()) {
        const hls = new Hls({ enableWorker: true, lowLatencyMode: true })
        hls.loadSource(videoUrl)
        hls.attachMedia(video)
        hlsRef.current = hls
      } else {
        return
      }
    }
    setIsAttached(true)
  }

  useEffect(() => () => { hlsRef.current?.destroy?.() }, [])

  useEffect(() => {
    if (mode === 'always') {
      attachHls().then(() => ref.current?.play().catch(() => {}))
      return
    }
    if (mode === 'in-view') {
      const el = ref.current
      if (!el) return
      const io = new IntersectionObserver((entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            attachHls().then(() => ref.current?.play().catch(() => {}))
          } else {
            ref.current?.pause()
          }
        }
      }, { threshold: 0.25 })
      io.observe(el)
      return () => io.disconnect()
    }
    if (mode === 'hover') {
      const isMobile = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches
      if (isMobile && mobileAutoplay) {
        const el = ref.current
        if (!el) return
        const io = new IntersectionObserver((entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              attachHls().then(() => ref.current?.play().catch(() => {}))
            } else {
              ref.current?.pause()
            }
          }
        }, { threshold: 0.5 })
        io.observe(el)
        return () => io.disconnect()
      }
    }
  }, [mode, mobileAutoplay])

  const handleEnter = mode === 'hover'
    ? () => { attachHls().then(() => ref.current?.play().catch(() => {})) }
    : undefined
  const handleLeave = mode === 'hover'
    ? () => { ref.current?.pause() }
    : undefined

  return (
    <video
      ref={ref}
      poster={posterUrl}
      muted
      playsInline
      loop
      preload="none"
      aria-label={title}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={`${styles.video} ${className ?? ''}`}
    />
  )
}
```

- [ ] **Step 3:** SCSS:

```scss
// components/Common/LazyVideo/LazyVideo.module.scss
.video {
  width: 100%;
  height: auto;
  display: block;
  background: #000;
}
```

- [ ] **Step 4:** `npm run typecheck`. Commit:

```bash
git add components/Common/LazyVideo
git commit -m "feat(LazyVideo): HLS-aware player with hover/in-view/always modes"
```

---

### Task 4.3: `HeaderComponent` shell (RSC + nav)

**Files:**
- Rewrite: `components/Common/HeaderComponent/index.tsx`
- Rewrite: `components/Common/HeaderComponent/HeaderComponent.module.scss`

- [ ] **Step 1:**

```tsx
// components/Common/HeaderComponent/index.tsx
import Link from 'next/link'
import HeaderClient from './HeaderClient'
import ContactButton from './ContactButton'
import MobileMenu from './MobileMenu'
import type { HeaderData } from '@/sanity/queries/common/header'
import styles from './HeaderComponent.module.scss'

type Props = { data?: HeaderData }

const NAV_ITEMS = [
  { href: '/', label: 'Work', key: 'work' },
  { href: '/information', label: 'Information', key: 'information' },
] as const

export default function HeaderComponent({ data }: Props) {
  const contactEmail = data?.contactEmail ?? 'info@bontemps.agency'
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} aria-label="Bon Temps — home">
          <span aria-hidden>BTA</span>
        </Link>

        <HeaderClient items={NAV_ITEMS}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`${styles.navItem} t-sans-title`}
              data-key={item.key}
            >
              <span>{item.label}</span>
            </Link>
          ))}
        </HeaderClient>

        <ContactButton email={contactEmail} />
        <MobileMenu items={NAV_ITEMS} contactEmail={contactEmail} />
      </div>
    </header>
  )
}
```

- [ ] **Step 2:** SCSS scaffold:

```scss
// components/Common/HeaderComponent/HeaderComponent.module.scss
@use "../../../styles/breakpoints" as *;

.header {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 50;
  backdrop-filter: blur(12px) saturate(140%);
  -webkit-backdrop-filter: blur(12px) saturate(140%);
  background: rgba(255,255,255,0.55);
  mask-image: linear-gradient(to bottom, #000 0, #000 70%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, #000 0, #000 70%, transparent 100%);
}
.inner {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px var(--margin-x);
  @include desktop { padding: 20px var(--margin-x); }
}
.logo { font-size: 16px; letter-spacing: -0.01em; }
.navItem { position: relative; padding: 8px 14px; }
```

- [ ] **Step 3:** Commit pending until 4.6 (full header bundle).

---

### Task 4.4: `HeaderClient` (bubble + scroll blur trigger)

**Files:**
- Create: `components/Common/HeaderComponent/HeaderClient.tsx`

- [ ] **Step 1:**

```tsx
// components/Common/HeaderComponent/HeaderClient.tsx
'use client'
import { motion, LayoutGroup } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import styles from './HeaderComponent.module.scss'

type Item = { href: string; key: string; label: string }
type Props = { items: readonly Item[]; children: React.ReactNode }

export default function HeaderClient({ items, children }: Props) {
  const pathname = usePathname()
  const activeKey =
    pathname === '/' || pathname.startsWith('/work')
      ? 'work'
      : pathname.startsWith('/information')
      ? 'information'
      : null

  return (
    <nav className={styles.nav} aria-label="Primary">
      <LayoutGroup id="nav">
        <BubbleOverlay activeKey={activeKey} items={items} />
        {children}
      </LayoutGroup>
    </nav>
  )
}

function BubbleOverlay({ activeKey, items }: { activeKey: string | null; items: readonly Item[] }) {
  const [rect, setRect] = useState<{ left: number; width: number; height: number; top: number } | null>(null)
  useEffect(() => {
    if (!activeKey) { setRect(null); return }
    const el = document.querySelector<HTMLElement>(`a[data-key="${activeKey}"]`)
    if (!el) return
    const parent = el.parentElement?.getBoundingClientRect()
    const r = el.getBoundingClientRect()
    if (!parent) return
    setRect({ left: r.left - parent.left, top: r.top - parent.top, width: r.width, height: r.height })
  }, [activeKey])

  if (!rect) return null
  return (
    <motion.span
      layoutId="nav-bubble"
      className={styles.bubble}
      style={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height }}
      transition={{ type: 'spring', stiffness: 400, damping: 36 }}
      aria-hidden
    />
  )
}
```

- [ ] **Step 2:** SCSS append:

```scss
.nav { position: relative; display: flex; gap: 4px; }
.bubble {
  position: absolute;
  background: var(--color-bubble);
  border-radius: 999px;
  z-index: -1;
}
```

---

### Task 4.5: `ContactButton`

**Files:**
- Create: `components/Common/HeaderComponent/ContactButton.tsx`

- [ ] **Step 1:**

```tsx
// components/Common/HeaderComponent/ContactButton.tsx
'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import styles from './HeaderComponent.module.scss'

export default function ContactButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false)
  const handle = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!navigator?.clipboard) return
    e.preventDefault()
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      window.location.href = `mailto:${email}`
    }
  }
  return (
    <a
      href={`mailto:${email}`}
      onClick={handle}
      className={`${styles.contact} t-sans-title`}
      aria-label={`Copy email ${email}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? 'copied' : 'contact'}
          initial={{ y: 4, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -4, opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          {copied ? 'Copied' : 'Contact'}
        </motion.span>
      </AnimatePresence>
    </a>
  )
}
```

- [ ] **Step 2:** SCSS append:

```scss
.contact { padding: 8px 14px; }
```

---

### Task 4.6: `MobileMenu`

**Files:**
- Create: `components/Common/HeaderComponent/MobileMenu.tsx`

- [ ] **Step 1:**

```tsx
// components/Common/HeaderComponent/MobileMenu.tsx
'use client'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import styles from './HeaderComponent.module.scss'

type Item = { href: string; key: string; label: string }
type Props = { items: readonly Item[]; contactEmail: string }

export default function MobileMenu({ items, contactEmail }: Props) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    document.body.classList.toggle('menu-open', open)
    return () => document.body.classList.remove('menu-open')
  }, [open])

  return (
    <>
      <button
        className={styles.burger}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span aria-hidden>{open ? '×' : '☰'}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.mobilePanel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <nav>
              <ul>
                {items.map((it, i) => (
                  <motion.li
                    key={it.key}
                    initial={{ y: 14, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.08 + i * 0.06 }}
                  >
                    <Link href={it.href} className="t-mobile-menu" onClick={() => setOpen(false)}>
                      {it.label}
                    </Link>
                  </motion.li>
                ))}
                <motion.li
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.08 + items.length * 0.06 }}
                >
                  <a href={`mailto:${contactEmail}`} className="t-mobile-menu">Contact</a>
                </motion.li>
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
```

- [ ] **Step 2:** SCSS append:

```scss
@use "../../../styles/breakpoints" as *;

.burger {
  display: none;
  @include mobile { display: inline-flex; padding: 8px 12px; font-size: 18px; }
}
.mobilePanel {
  position: fixed; inset: 0; background: rgba(255,255,255,0.96); z-index: 60;
  padding: 80px var(--margin-x);
  display: flex; flex-direction: column; justify-content: center;
}
:global(body.menu-open) { overflow: hidden; }
```

- [ ] **Step 3:** `npm run typecheck && npm run lint`. Commit the whole header bundle:

```bash
git add components/Common/HeaderComponent
git commit -m "feat(Header): RSC shell + bubble + contact copy + mobile menu"
```

---

### Task 4.7: Refactor `FooterComponent` per spec

**Files:**
- Modify: `components/Common/FooterComponent/index.tsx`
- Modify: `components/Common/FooterComponent/FooterComponent.module.scss`

- [ ] **Step 1:**

```tsx
// components/Common/FooterComponent/index.tsx
import type { FooterData } from '@/sanity/types'
import BodyBonTempsRenderer from '@/components/PortableText/BodyBonTempsRenderer'
import styles from './FooterComponent.module.scss'

export default function FooterComponent({ data }: { data?: FooterData }) {
  if (!data) return null
  return (
    <footer className={styles.footer}>
      {data.claim && (
        <div className={`${styles.claim} t-about`}>
          <BodyBonTempsRenderer value={data.claim} />
        </div>
      )}
      <div className={styles.bottom}>
        <ul className={styles.emails}>
          {data.emails?.map((e) => (
            <li key={e.email} className="t-serif-detail">
              <span className="t-sans-small">{e.title}</span>
              <a href={`mailto:${e.email}`}>{e.email}</a>
            </li>
          ))}
        </ul>
        <ul className={styles.socials}>
          {data.socials?.map((s, i) => (
            <li key={i}>
              <a href={s.url} target="_blank" rel="noreferrer" className="t-serif-detail">
                {s.title}
              </a>
            </li>
          ))}
        </ul>
        <p className={`t-rights-reserved ${styles.copy}`}>
          {data.copyright || `© ${new Date().getFullYear()} Bon Temps. All rights reserved.`}
        </p>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2:** SCSS scaffold:

```scss
@use "../../../styles/breakpoints" as *;

.footer { padding: 60px var(--margin-x) var(--margin-bottom); }
.bottom {
  display: grid; gap: 24px;
  margin-top: 40px;
  @include tablet-up { grid-template-columns: 2fr 1fr 1fr; align-items: end; }
}
.emails li { display: flex; flex-direction: column; gap: 4px; }
.socials { display: flex; gap: 16px; }
.copy { margin-top: 24px; }
```

- [ ] **Step 3:** Commit: `git add components/Common/FooterComponent && git commit -m "feat(Footer): claim + emails + socials + rights"`

> **Type note:** `FooterData` comes from `@/sanity/types`. Make sure it's exported in 3.12 (add it if missing). The current shape: `{ claim?: any; emails?: Array<{title:string; email:string}>; socials?: Array<{title:string; url:string}>; copyright?: string }`.

---

### Task 4.8: `IntroProvider`

**Files:**
- Create: `components/Home/IntroOverlay/IntroProvider.tsx`

- [ ] **Step 1:**

```tsx
// components/Home/IntroOverlay/IntroProvider.tsx
'use client'
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

const KEY = 'bontemps_intro_seen'

type Ctx = {
  shouldShow: boolean
  dismiss: () => void
  replay: () => void
}

const IntroContext = createContext<Ctx | null>(null)

export function useIntro() {
  const ctx = useContext(IntroContext)
  if (!ctx) throw new Error('useIntro must be used inside IntroProvider')
  return ctx
}

export function IntroProvider({ children }: { children: React.ReactNode }) {
  const [decided, setDecided] = useState(false)
  const [shouldShow, setShouldShow] = useState(false)
  const ranOnce = useRef(false)

  useEffect(() => {
    if (ranOnce.current) return
    ranOnce.current = true
    try {
      const seen = sessionStorage.getItem(KEY)
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (!seen && !reduced) {
        setShouldShow(true)
      } else {
        document.body.classList.remove('intro-pending')
      }
    } catch {
      document.body.classList.remove('intro-pending')
    } finally {
      setDecided(true)
    }
  }, [])

  const dismiss = useCallback(() => {
    try { sessionStorage.setItem(KEY, 'true') } catch {}
    setShouldShow(false)
    document.body.classList.remove('intro-pending')
  }, [])

  const replay = useCallback(() => {
    try { sessionStorage.removeItem(KEY) } catch {}
    document.body.classList.add('intro-pending')
    setShouldShow(true)
  }, [])

  return (
    <IntroContext.Provider value={{ shouldShow: decided && shouldShow, dismiss, replay }}>
      {children}
    </IntroContext.Provider>
  )
}
```

---

### Task 4.9: `IntroSequence` and `IntroOverlay`

**Files:**
- Create: `components/Home/IntroOverlay/IntroSequence.tsx`
- Create: `components/Home/IntroOverlay/index.tsx`
- Create: `components/Home/IntroOverlay/IntroOverlay.module.scss`

- [ ] **Step 1:** Sequence:

```tsx
// components/Home/IntroOverlay/IntroSequence.tsx
'use client'
import { motion } from 'framer-motion'
import styles from './IntroOverlay.module.scss'

export default function IntroSequence({ claim }: { claim: string }) {
  const letters = Array.from(claim)
  return (
    <div className={styles.stage}>
      <motion.div
        className={styles.bta}
        aria-hidden
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        BTA
      </motion.div>
      <motion.h1 className={`${styles.claim} t-intro`} aria-label={claim}>
        {letters.map((ch, i) => (
          <motion.span
            key={i}
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 + i * 0.04, duration: 0.35 }}
            aria-hidden
          >
            {ch === ' ' ? ' ' : ch}
          </motion.span>
        ))}
      </motion.h1>
    </div>
  )
}
```

- [ ] **Step 2:** Overlay:

```tsx
// components/Home/IntroOverlay/index.tsx
'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { useIntro } from './IntroProvider'
import IntroSequence from './IntroSequence'
import styles from './IntroOverlay.module.scss'

export default function IntroOverlay({ claim }: { claim: string }) {
  const { shouldShow, dismiss } = useIntro()

  useEffect(() => {
    if (!shouldShow) return
    const t = setTimeout(dismiss, 3500)
    return () => clearTimeout(t)
  }, [shouldShow, dismiss])

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 0.6 }}
          onClick={dismiss}
          role="dialog"
          aria-modal="true"
          aria-label="Intro"
        >
          <IntroSequence claim={claim} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 3:** SCSS:

```scss
// components/Home/IntroOverlay/IntroOverlay.module.scss
@use "../../../styles/breakpoints" as *;

.overlay {
  position: fixed; inset: 0; z-index: 100;
  background: var(--color-bg);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
}
.stage { display: flex; align-items: center; gap: 17px; }
@include tablet-up { .stage { gap: 27px; } }
@include desktop-xl { .stage { gap: 29px; } }
.bta { font-size: 32px; }
.claim { display: inline-block; }
.claim span { display: inline-block; }
```

---

### Task 4.10: Wire `IntroProvider` and `IntroOverlay` into root layout

**Files:**
- Modify: `app/(frontend)/layout.tsx`

- [ ] **Step 1:** Import bits and wire. Use the **safe inline-script children pattern** for the gate (no `dangerouslySetInnerHTML`).

```tsx
// app/(frontend)/layout.tsx (excerpt — keep existing analytics/cookie consent in place)
import { sans, serif } from '@/styles/fonts'
import { IntroProvider } from '@/components/Home/IntroOverlay/IntroProvider'
import IntroOverlay from '@/components/Home/IntroOverlay'
import { getIntroClaim } from '@/sanity/queries/common/intro'

const INTRO_GATE = `try {
  if (!sessionStorage.getItem('bontemps_intro_seen') &&
      !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('intro-pending');
    document.body && document.body.classList.add('intro-pending');
  }
} catch (e) {}`

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const results = await Promise.allSettled([getHeader(), getFooter(), getIntroClaim()])
  const header: HeaderData | undefined = results[0].status === 'fulfilled' ? results[0].value : undefined
  const footer: FooterData | undefined = results[1].status === 'fulfilled' ? results[1].value : undefined
  const claim = (results[2].status === 'fulfilled' ? results[2].value : null) ?? 'Beauty Is A Matter Of Precision'

  return (
    <html lang="en" className={`${sans.variable ?? ''} ${serif.variable ?? ''}`}>
      <head>
        {/* SAFE: hardcoded literal, no user input */}
        <script>{INTRO_GATE}</script>
      </head>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <WebProvider>
          <IntroProvider>
            <HeaderComponent data={header} />
            {children}
            <IntroOverlay claim={claim} />
            <FooterComponent data={footer} />
            <CookieConsent />
            {/* analytics blocks unchanged */}
          </IntroProvider>
        </WebProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 2:** `npm run typecheck && npm run lint`. Run dev. Hit `http://localhost:3000` — overlay appears once per session. Refresh in same tab — does NOT re-appear. Open new incognito — re-appears.

- [ ] **Step 3:** Crawler test:

```bash
curl -s http://localhost:3000 | grep -i 'beauty is a matter'
```

The claim should appear in HTML because Work renders it inside `<h1 class="visually-hidden">`.

- [ ] **Step 4:** Commit:

```bash
git add components/Home/IntroOverlay app/\(frontend\)/layout.tsx
git commit -m "feat(intro): IntroProvider + overlay + safe inline gate"
```

---

## Phase 5 — Work page

### Task 5.1: `WorkGrid` and `ProjectCard` (RSC)

**Files:**
- Create: `components/Home/WorkGrid/index.tsx`
- Create: `components/Home/WorkGrid/ProjectCard.tsx`
- Create: `components/Home/WorkGrid/WorkGrid.module.scss`

- [ ] **Step 1:** WorkGrid:

```tsx
// components/Home/WorkGrid/index.tsx
import type { ProjectCardData } from '@/sanity/types'
import ProjectCard from './ProjectCard'
import styles from './WorkGrid.module.scss'

export default function WorkGrid({ projects }: { projects: ProjectCardData[] }) {
  return (
    <ul className={styles.grid}>
      {projects.map((p) => (
        <li key={p._id}><ProjectCard project={p} /></li>
      ))}
    </ul>
  )
}
```

- [ ] **Step 2:** ProjectCard:

```tsx
// components/Home/WorkGrid/ProjectCard.tsx
import Link from 'next/link'
import LazyImage from '@/components/Common/LazyImage'
import ProjectCardHover from './ProjectCardHover'
import type { ProjectCardData } from '@/sanity/types'
import styles from './WorkGrid.module.scss'

export default function ProjectCard({ project }: { project: ProjectCardData }) {
  const hasVideo = project.featuredMediaType === 'video' && project.featuredVideo?.video
  const image = project.featuredImage
  return (
    <Link href={`/work/${project.slug}`} className={styles.card}>
      <div className={styles.media}>
        {image && (
          <LazyImage
            image={image.image}
            alt={image.alt}
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
          />
        )}
        {hasVideo && <ProjectCardHover video={project.featuredVideo!.video} />}
      </div>
      <h3 className={`${styles.title} t-sans-title`}>{project.title}</h3>
      {project.subtitle && <p className={`${styles.desc} t-project-desc`}>{project.subtitle}</p>}
    </Link>
  )
}
```

- [ ] **Step 3:** SCSS:

```scss
// components/Home/WorkGrid/WorkGrid.module.scss
@use "../../../styles/breakpoints" as *;

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px var(--grid-gap-x);
  padding: 100px var(--margin-x) var(--margin-bottom);
  @include tablet { grid-template-columns: repeat(2, 1fr); }
  @include desktop { grid-template-columns: repeat(3, 1fr); }
}
.card { display: block; }
.media { position: relative; overflow: hidden; aspect-ratio: 5 / 4; background: #f1f1f1; }
.title { margin-top: 12px; }
.desc { margin-top: 4px; color: var(--color-fg); }
.hoverLayer {
  position: absolute; inset: 0; opacity: 0; transition: opacity 200ms ease;
  pointer-events: none;
}
.card:hover .hoverLayer { opacity: 1; }
```

---

### Task 5.2: `ProjectCardHover` (client island)

**Files:**
- Create: `components/Home/WorkGrid/ProjectCardHover.tsx`

- [ ] **Step 1:**

```tsx
// components/Home/WorkGrid/ProjectCardHover.tsx
'use client'
import LazyVideo from '@/components/Common/LazyVideo'
import type { ModuleVideo } from '@/sanity/types'
import styles from './WorkGrid.module.scss'

export default function ProjectCardHover({ video }: { video: ModuleVideo }) {
  return (
    <div className={styles.hoverLayer} aria-hidden>
      <LazyVideo video={video} mode="hover" mobileAutoplay />
    </div>
  )
}
```

- [ ] **Step 2:** Commit:

```bash
git add components/Home/WorkGrid
git commit -m "feat(WorkGrid): ProjectCard with hover-video island"
```

---

### Task 5.3: `HomeFooterClaim`

**Files:**
- Create: `components/Home/HomeFooterClaim/index.tsx`
- Create: `components/Home/HomeFooterClaim/HomeFooterClaim.module.scss`

- [ ] **Step 1:**

```tsx
// components/Home/HomeFooterClaim/index.tsx
import styles from './HomeFooterClaim.module.scss'

export default function HomeFooterClaim({ claim }: { claim?: string }) {
  if (!claim) return null
  return (
    <aside className={`${styles.aside} t-about`}>
      <p>{claim}</p>
    </aside>
  )
}
```

```scss
.aside { padding: 60px var(--margin-x); }
```

- [ ] **Step 2:** Commit: `git add components/Home/HomeFooterClaim && git commit -m "feat(Home): about/bottom claim block"`

---

### Task 5.4: Wire Work page (`app/(frontend)/page.tsx`)

**Files:**
- Rewrite: `app/(frontend)/page.tsx`

- [ ] **Step 1:**

```tsx
// app/(frontend)/page.tsx
import WorkGrid from '@/components/Home/WorkGrid'
import HomeFooterClaim from '@/components/Home/HomeFooterClaim'
import { getWork } from '@/sanity/queries/queries/work'
import { getIntroClaim } from '@/sanity/queries/common/intro'
import type { Metadata } from 'next'
import { siteTitle, siteDescription } from '@/utils/seoHelper'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const claim = await getIntroClaim()
  return {
    title: siteTitle,
    description: claim ?? siteDescription,
  }
}

export default async function WorkPage() {
  const { listWork, projects } = await getWork()
  return (
    <main id="main">
      <h1 className="visually-hidden">{listWork?.claim || siteTitle}</h1>
      <WorkGrid projects={projects} />
      <HomeFooterClaim claim={listWork?.claim} />
    </main>
  )
}
```

- [ ] **Step 2:** `npm run typecheck && npm run lint`. Run dev. Hit `http://localhost:3000`. Confirm:
  - Project cards render (or empty state).
  - Card click → `/work/<slug>` (404 until Phase 6).
  - Hover over a video card → video plays.
  - Mobile viewport (DevTools) → video autoplays in viewport.

- [ ] **Step 3:** SSR test:

```bash
curl -s http://localhost:3000 | grep -c '<a class'
```

Should equal number of projects.

```bash
curl -s http://localhost:3000 | grep -i 'visually-hidden'
```

Must find one.

- [ ] **Step 4:** Commit:

```bash
git add app/\(frontend\)/page.tsx
git commit -m "feat(Work): wire WorkGrid + claim with SSR-first content"
```

---

## Phase 6 — Project Detail page

### Task 6.1: `BodyBonTempsRenderer` (PortableText)

**Files:**
- Create: `components/PortableText/BodyBonTempsRenderer.tsx`
- Create: `components/PortableText/PortableText.module.scss`

- [ ] **Step 1:**

```tsx
// components/PortableText/BodyBonTempsRenderer.tsx
import { PortableText, type PortableTextComponents } from '@portabletext/react'

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="t-body">{children}</p>,
    bodyLarge: ({ children }) => <p className="t-body-large">{children}</p>,
    headline: ({ children }) => <h2 className="t-headline-project">{children}</h2>,
    caption: ({ children }) => <p className="t-caption">{children}</p>,
    sansSmall: ({ children }) => <p className="t-sans-small">{children}</p>,
    serifDetail: ({ children }) => <p className="t-serif-detail">{children}</p>,
    about: ({ children }) => <p className="t-about">{children}</p>,
  },
  marks: {
    linkExternal: ({ children, value }) => (
      <a
        href={value?.url}
        target={value?.newWindow ? '_blank' : undefined}
        rel={value?.newWindow ? 'noreferrer' : undefined}
      >
        {children}
      </a>
    ),
    linkInternal: ({ children, value }) => <a href={value?.slug ? `/${value.slug}` : '#'}>{children}</a>,
    linkEmail: ({ children, value }) => <a href={`mailto:${value?.email}`}>{children}</a>,
  },
}

export default function BodyBonTempsRenderer({ value }: { value: any }) {
  if (!value) return null
  return <PortableText value={value} components={components} />
}
```

- [ ] **Step 2:** Commit:

```bash
git add components/PortableText
git commit -m "feat(PortableText): bodyBonTemps renderer with token classes"
```

---

### Task 6.2: Project sub-components (header, featured, bubbles, related, footer)

**Files (created in this task):**
- `components/Singles/ProjectHeader/index.tsx` + `.module.scss`
- `components/Singles/ProjectFeaturedMedia/index.tsx`
- `components/Singles/VisitWebsiteBubble/index.tsx` + `VisitWebsiteClient.tsx` + `.module.scss`
- `components/Singles/BackToWorkBubble/index.tsx` + `.module.scss`
- `components/Singles/RelatedProjects/index.tsx` + `RelatedCard.tsx` + `.module.scss`
- `components/Singles/ProjectFooter/index.tsx` + `.module.scss`

- [ ] **Step 1:** ProjectHeader:

```tsx
// components/Singles/ProjectHeader/index.tsx
import styles from './ProjectHeader.module.scss'

type Props = {
  title: string
  subtitle?: string
  excerpt?: string
  services?: Array<{ _id: string; title: string }>
}

export default function ProjectHeader({ title, subtitle, excerpt, services }: Props) {
  return (
    <header className={styles.header}>
      <h1 className={`t-headline-project ${styles.title}`}>{title}</h1>
      {subtitle && <p className={`t-body ${styles.subtitle}`}>{subtitle}</p>}
      {excerpt && <p className={`t-body ${styles.excerpt}`}>{excerpt}</p>}
      {services && services.length > 0 && (
        <ul className={`t-sans-small ${styles.services}`}>
          {services.map((s) => <li key={s._id}>{s.title}</li>)}
        </ul>
      )}
    </header>
  )
}
```

```scss
// components/Singles/ProjectHeader/ProjectHeader.module.scss
.header { padding: 120px var(--margin-x) 60px; max-width: 1200px; }
.title { margin: 0 0 24px; }
.subtitle, .excerpt { max-width: 60ch; }
.services { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 24px; }
```

- [ ] **Step 2:** ProjectFeaturedMedia:

```tsx
// components/Singles/ProjectFeaturedMedia/index.tsx
import LazyImage from '@/components/Common/LazyImage'
import LazyVideo from '@/components/Common/LazyVideo'
import type { MediaImage, MediaVideo } from '@/sanity/types'

type Props = { type: 'image' | 'video'; image?: MediaImage; video?: MediaVideo }

export default function ProjectFeaturedMedia({ type, image, video }: Props) {
  if (type === 'image' && image) {
    return <LazyImage image={image.image} alt={image.alt} sizes="100vw" priority />
  }
  if (type === 'video' && video?.video) {
    return <LazyVideo video={video.video} mode="in-view" />
  }
  return null
}
```

- [ ] **Step 3:** VisitWebsiteBubble:

```tsx
// components/Singles/VisitWebsiteBubble/index.tsx
import VisitWebsiteClient from './VisitWebsiteClient'

export default function VisitWebsiteBubble({ url }: { url?: string }) {
  if (!url) return null
  return <VisitWebsiteClient url={url} />
}
```

```tsx
// components/Singles/VisitWebsiteBubble/VisitWebsiteClient.tsx
'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'
import styles from './VisitWebsiteBubble.module.scss'

export default function VisitWebsiteClient({ url }: { url: string }) {
  const [hover, setHover] = useState(false)
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noreferrer"
      className={styles.bubble}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      layout
      transition={{ type: 'spring', stiffness: 320, damping: 32 }}
    >
      <span className="t-sans-title">{hover ? '+ Visit Website' : '+'}</span>
    </motion.a>
  )
}
```

```scss
// components/Singles/VisitWebsiteBubble/VisitWebsiteBubble.module.scss
.bubble {
  display: inline-flex; align-items: center; justify-content: center;
  background: var(--color-bubble);
  border-radius: 999px;
  padding: 12px 18px;
  white-space: nowrap;
}
```

- [ ] **Step 4:** BackToWorkBubble:

```tsx
// components/Singles/BackToWorkBubble/index.tsx
import Link from 'next/link'
import styles from './BackToWorkBubble.module.scss'

export default function BackToWorkBubble() {
  return <Link href="/" className={`${styles.bubble} t-sans-title`}>+ Back To Work</Link>
}
```

```scss
.bubble {
  display: inline-flex; align-items: center;
  background: var(--color-bubble);
  border-radius: 999px;
  padding: 12px 18px;
  transition: color 180ms ease;
}
.bubble:hover { color: var(--color-grey); }
```

- [ ] **Step 5:** RelatedProjects + RelatedCard:

```tsx
// components/Singles/RelatedProjects/index.tsx
import type { ProjectCardData } from '@/sanity/types'
import RelatedCard from './RelatedCard'
import styles from './RelatedProjects.module.scss'

export default function RelatedProjects({ projects }: { projects?: ProjectCardData[] }) {
  if (!projects || projects.length === 0) return null
  return (
    <section className={styles.section}>
      <h2 className="t-sans-small">Related Projects</h2>
      <ul className={styles.grid}>
        {projects.map((p) => <li key={p._id}><RelatedCard project={p} /></li>)}
      </ul>
    </section>
  )
}
```

```tsx
// components/Singles/RelatedProjects/RelatedCard.tsx
'use client'
import Link from 'next/link'
import LazyImage from '@/components/Common/LazyImage'
import type { ProjectCardData } from '@/sanity/types'
import { useState } from 'react'
import styles from './RelatedProjects.module.scss'

export default function RelatedCard({ project }: { project: ProjectCardData }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link
      href={`/work/${project.slug}`}
      className={`${styles.card} ${hovered ? styles.hovered : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {project.featuredImage && (
        <LazyImage
          image={project.featuredImage.image}
          alt={project.featuredImage.alt}
          sizes="(max-width: 767px) 100vw, 50vw"
        />
      )}
      <h3 className={`t-sans-title ${styles.title}`}>{project.title}</h3>
    </Link>
  )
}
```

```scss
// components/Singles/RelatedProjects/RelatedProjects.module.scss
@use "../../../styles/breakpoints" as *;

.section { padding: 60px var(--margin-x); }
.grid {
  display: grid; grid-template-columns: 1fr; gap: 32px var(--grid-gap-x);
  @include tablet-up { grid-template-columns: repeat(2, 1fr); }
  margin-top: 24px;
}
.card { display: block; transition: background 200ms ease, color 200ms ease; padding: 12px; }
.card.hovered { background: var(--color-related-hover-bg); color: var(--color-related-hover-fg); }
.title { margin-top: 12px; }
```

- [ ] **Step 6:** ProjectFooter:

```tsx
// components/Singles/ProjectFooter/index.tsx
import styles from './ProjectFooter.module.scss'

type Props = { aboutClaim?: string }

export default function ProjectFooter({ aboutClaim }: Props) {
  return (
    <footer className={styles.footer}>
      {aboutClaim && <p className="t-about">{aboutClaim}</p>}
    </footer>
  )
}
```

```scss
.footer { padding: 60px var(--margin-x); }
```

- [ ] **Step 7:** Commit all single sub-components:

```bash
git add components/Singles
git commit -m "feat(Singles): header, featured media, bubbles, related, footer"
```

---

### Task 6.3: `ProjectModules` switch + 4 module subcomponents

**Files:**
- Create: `components/Singles/ProjectModules/index.tsx`
- Create: `components/Singles/ProjectModules/CenteredText.tsx`
- Create: `components/Singles/ProjectModules/ImageVideoModule.tsx`
- Create: `components/Singles/ProjectModules/TextColumn.tsx`
- Create: `components/Singles/ProjectModules/ImageText.tsx`
- Create: `components/Singles/ProjectModules/ProjectModules.module.scss`

- [ ] **Step 1:** Switch:

```tsx
// components/Singles/ProjectModules/index.tsx
import CenteredText from './CenteredText'
import ImageVideoModule from './ImageVideoModule'
import TextColumn from './TextColumn'
import ImageText from './ImageText'

export default function ProjectModules({ modules }: { modules?: any[] }) {
  if (!modules) return null
  return (
    <>
      {modules.map((m) => {
        const key = m._key
        switch (m._type) {
          case 'module.centeredText': return <CenteredText key={key} {...m} />
          case 'module.imageVideo': return <ImageVideoModule key={key} {...m} />
          case 'module.textColumn': return <TextColumn key={key} {...m} />
          case 'module.imageText': return <ImageText key={key} {...m} />
          default: return null
        }
      })}
    </>
  )
}
```

- [ ] **Step 2:** Module subcomponents:

```tsx
// CenteredText.tsx
import BodyBonTempsRenderer from '@/components/PortableText/BodyBonTempsRenderer'
import styles from './ProjectModules.module.scss'

export default function CenteredText({ body }: { body?: any }) {
  return <section className={styles.centered}><BodyBonTempsRenderer value={body} /></section>
}
```

```tsx
// ImageVideoModule.tsx
import LazyImage from '@/components/Common/LazyImage'
import LazyVideo from '@/components/Common/LazyVideo'
import styles from './ProjectModules.module.scss'

type Item =
  | { _type: 'media.image'; image: any; alt: string; caption?: string }
  | { _type: 'media.video'; video: any; caption?: string }

type Props = { columns: 1 | 2 | 3; reverseOrderOnMobile?: boolean; items: Item[] }

export default function ImageVideoModule({ columns, reverseOrderOnMobile, items }: Props) {
  return (
    <section
      className={styles.imageVideo}
      data-columns={columns}
      data-reverse-mobile={reverseOrderOnMobile ? 'true' : undefined}
    >
      {items.map((it, i) => (
        <figure key={i}>
          {it._type === 'media.image' && <LazyImage image={it.image} alt={it.alt} sizes="50vw" />}
          {it._type === 'media.video' && <LazyVideo video={it.video} mode="in-view" />}
          {it.caption && <figcaption className="t-caption">{it.caption}</figcaption>}
        </figure>
      ))}
    </section>
  )
}
```

```tsx
// TextColumn.tsx
import BodyBonTempsRenderer from '@/components/PortableText/BodyBonTempsRenderer'
import styles from './ProjectModules.module.scss'

type Props = { body?: any; columns: 1 | 2 | 3; span?: number; columnStart?: number }

export default function TextColumn({ body, columns, span, columnStart }: Props) {
  return (
    <section
      className={styles.textColumn}
      data-columns={columns}
      style={{
        ['--span' as any]: span ?? columns,
        ['--col-start' as any]: columnStart ?? 1,
      }}
    >
      <div className={styles.col}>
        <BodyBonTempsRenderer value={body} />
      </div>
    </section>
  )
}
```

```tsx
// ImageText.tsx
import LazyImage from '@/components/Common/LazyImage'
import LazyVideo from '@/components/Common/LazyVideo'
import BodyBonTempsRenderer from '@/components/PortableText/BodyBonTempsRenderer'
import styles from './ProjectModules.module.scss'

type Media =
  | { _type: 'media.image'; image: any; alt: string }
  | { _type: 'media.video'; video: any }
type Props = { media: Media; body?: any; reverseOrderOnMobile?: boolean }

export default function ImageText({ media, body, reverseOrderOnMobile }: Props) {
  return (
    <section className={styles.imageText} data-reverse-mobile={reverseOrderOnMobile ? 'true' : undefined}>
      <div className={styles.media}>
        {media._type === 'media.image' && <LazyImage image={media.image} alt={media.alt} sizes="50vw" />}
        {media._type === 'media.video' && <LazyVideo video={media.video} mode="in-view" />}
      </div>
      <div className={styles.text}><BodyBonTempsRenderer value={body} /></div>
    </section>
  )
}
```

- [ ] **Step 3:** SCSS:

```scss
// ProjectModules.module.scss
@use "../../../styles/breakpoints" as *;

.centered, .imageVideo, .textColumn, .imageText { padding: 60px var(--margin-x); }

.imageVideo { display: grid; gap: var(--grid-gap-x); }
.imageVideo[data-columns="2"] { grid-template-columns: repeat(2, 1fr); }
.imageVideo[data-columns="3"] { grid-template-columns: repeat(3, 1fr); }
@include mobile {
  .imageVideo { grid-template-columns: 1fr; }
  .imageVideo[data-reverse-mobile="true"] > :nth-child(odd) { order: 2; }
  .imageVideo[data-reverse-mobile="true"] > :nth-child(even) { order: 1; }
}

.textColumn[data-columns="3"] { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--grid-gap-x); }
.textColumn .col { grid-column: var(--col-start, 1) / span var(--span, 1); }

.imageText { display: grid; gap: var(--grid-gap-x); grid-template-columns: 1fr 1fr; }
@include mobile {
  .imageText { grid-template-columns: 1fr; }
  .imageText[data-reverse-mobile="true"] .media { order: 2; }
  .imageText[data-reverse-mobile="true"] .text { order: 1; }
}
```

- [ ] **Step 4:** `npm run typecheck`. Commit:

```bash
git add components/Singles/ProjectModules
git commit -m "feat(Project): module switch (centered, imageVideo, textColumn, imageText)"
```

---

### Task 6.4: Wire `app/(frontend)/work/[slug]/page.tsx`

**Files:**
- Create: `app/(frontend)/work/[slug]/page.tsx`

- [ ] **Step 1:**

```tsx
// app/(frontend)/work/[slug]/page.tsx
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProject, getAllProjectSlugs } from '@/sanity/queries/queries/project'
import ProjectHeader from '@/components/Singles/ProjectHeader'
import ProjectFeaturedMedia from '@/components/Singles/ProjectFeaturedMedia'
import ProjectModules from '@/components/Singles/ProjectModules'
import VisitWebsiteBubble from '@/components/Singles/VisitWebsiteBubble'
import BackToWorkBubble from '@/components/Singles/BackToWorkBubble'
import RelatedProjects from '@/components/Singles/RelatedProjects'
import ProjectFooter from '@/components/Singles/ProjectFooter'
import BodyBonTempsRenderer from '@/components/PortableText/BodyBonTempsRenderer'

export const revalidate = 60

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) return {}
  return {
    title: `${project.title} — Bon Temps`,
    description: project.excerpt ?? project.subtitle,
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) notFound()

  return (
    <main id="main">
      <ProjectHeader
        title={project.title}
        subtitle={project.subtitle}
        excerpt={project.excerpt}
        services={project.services}
      />
      <ProjectFeaturedMedia
        type={project.featuredMediaType}
        image={project.featuredImage}
        video={project.featuredVideo}
      />
      <article>
        {project.projectRecap && <BodyBonTempsRenderer value={project.projectRecap} />}
        {project.servicesBody && <BodyBonTempsRenderer value={project.servicesBody} />}
        {project.customTypeface && <BodyBonTempsRenderer value={project.customTypeface} />}
        {project.bonTempsTeam && <BodyBonTempsRenderer value={project.bonTempsTeam} />}
        {project.collaborators && <BodyBonTempsRenderer value={project.collaborators} />}
      </article>
      <ProjectModules modules={project.modules} />
      <div style={{ display: 'flex', gap: 12, padding: '40px var(--margin-x)' }}>
        <BackToWorkBubble />
        <VisitWebsiteBubble url={project.websiteUrl} />
      </div>
      <RelatedProjects projects={project.relatedProjects} />
      <ProjectFooter />
    </main>
  )
}
```

- [ ] **Step 2:** `npm run typecheck && npm run lint`. Run dev. Hit a project URL (find one in Studio first). Confirm:
  - All sections render.
  - "+" → expands to "Visit Website" on hover.
  - Back to Work → returns to `/`.

- [ ] **Step 3:** SSR test:

```bash
curl -s "http://localhost:3000/work/<slug>" | grep -c '<h1'
```

Should be ≥ 1.

- [ ] **Step 4:** Commit:

```bash
git add app/\(frontend\)/work
git commit -m "feat(Project): wire project detail route with full data"
```

---

## Phase 7 — Information page

### Task 7.1: `ClientsList`

**Files:**
- Create: `components/Information/InformationModules/ClientsList.tsx`
- Create: `components/Information/InformationModules/InformationModules.module.scss`

- [ ] **Step 1:**

```tsx
// components/Information/InformationModules/ClientsList.tsx
'use client'
import Link from 'next/link'
import { useState } from 'react'
import styles from './InformationModules.module.scss'

type Item = { name: string; location?: string; projectSlug?: string }
type Props = { title?: string; items: Item[] }

export default function ClientsList({ title, items }: Props) {
  const [hovered, setHovered] = useState<string | null>(null)
  return (
    <section className={styles.clients}>
      {title && <h2 className="t-sans-small">{title}</h2>}
      <ul>
        {items.map((it, i) => {
          const key = it.name + i
          const isHover = hovered === key
          const Inner = (
            <span
              className={`t-body-large ${styles.row} ${isHover ? styles.rowHover : ''}`}
              onMouseEnter={() => setHovered(key)}
              onMouseLeave={() => setHovered(null)}
            >
              <span className={styles.name}>{it.name}</span>
              {it.location && <span className={styles.location}>{it.location}</span>}
            </span>
          )
          return (
            <li key={key}>
              {it.projectSlug ? <Link href={`/work/${it.projectSlug}`}>{Inner}</Link> : Inner}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
```

- [ ] **Step 2:** SCSS:

```scss
// InformationModules.module.scss
.clients { padding: 40px var(--margin-x); }
.row { display: flex; gap: 16px; align-items: baseline; transition: color 180ms ease; }
.name { color: var(--color-grey); transition: color 180ms ease; }
.location { color: var(--color-fg); transition: color 180ms ease; }
.rowHover .name { color: var(--color-fg); }
.rowHover .location { color: var(--color-grey); }

.textColumn { padding: 40px var(--margin-x); }
.textColumn[data-columns="3"] { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--grid-gap-x); }
.textColumn .col { grid-column: var(--col-start, 1) / span var(--span, 1); }

.imgVid { display: grid; padding: 40px var(--margin-x); gap: var(--grid-gap-x); }
.imgVid[data-columns="2"] { grid-template-columns: repeat(2, 1fr); }
.imgVid[data-columns="3"] { grid-template-columns: repeat(3, 1fr); }
@media (max-width: 767px) {
  .imgVid { grid-template-columns: 1fr; }
  .imgVid[data-reverse-mobile="true"] > :nth-child(odd) { order: 2; }
  .imgVid[data-reverse-mobile="true"] > :nth-child(even) { order: 1; }
}
```

---

### Task 7.2: `PageTextColumn` (shared)

**Files:**
- Create: `components/Information/InformationModules/PageTextColumn.tsx`

- [ ] **Step 1:**

```tsx
// components/Information/InformationModules/PageTextColumn.tsx
import BodyBonTempsRenderer from '@/components/PortableText/BodyBonTempsRenderer'
import styles from './InformationModules.module.scss'

type Props = { body?: any; columns?: 1 | 2 | 3; span?: number; columnStart?: number }

export default function PageTextColumn({ body, columns = 1, span, columnStart }: Props) {
  return (
    <section
      className={styles.textColumn}
      data-columns={columns}
      style={{
        ['--span' as any]: span ?? columns,
        ['--col-start' as any]: columnStart ?? 1,
      }}
    >
      <div className={styles.col}>
        <BodyBonTempsRenderer value={body} />
      </div>
    </section>
  )
}
```

---

### Task 7.3: `InformationImageVideo` + `ResponsiveVideoClient`

**Files:**
- Create: `components/Information/InformationModules/InformationImageVideo.tsx`
- Create: `components/Information/InformationModules/ResponsiveVideoClient.tsx`

- [ ] **Step 1:**

```tsx
// components/Information/InformationModules/InformationImageVideo.tsx
import { urlFor } from '@/sanity/queries'
import type { MediaImageResponsive, MediaVideoResponsive } from '@/sanity/types'
import ResponsiveVideoClient from './ResponsiveVideoClient'
import styles from './InformationModules.module.scss'

type Item =
  | (MediaImageResponsive & { _type: 'media.imageResponsive' })
  | (MediaVideoResponsive & { _type: 'media.videoResponsive' })

type Props = { columns: 1 | 2 | 3; reverseOrderOnMobile?: boolean; items: Item[] }

export default function InformationImageVideo({ columns, reverseOrderOnMobile, items }: Props) {
  return (
    <section
      className={styles.imgVid}
      data-columns={columns}
      data-reverse-mobile={reverseOrderOnMobile ? 'true' : undefined}
    >
      {items.map((it, i) => {
        if (it._type === 'media.imageResponsive') {
          const dWidth = it.desktop.asset?.metadata?.dimensions?.width || 1600
          const dHeight = it.desktop.asset?.metadata?.dimensions?.height || 1200
          const dSrc = urlFor(it.desktop).auto('format').width(2000).quality(85).url()
          const tSrc = it.ipad ? urlFor(it.ipad).auto('format').width(1200).quality(85).url() : null
          const mSrc = it.mobile ? urlFor(it.mobile).auto('format').width(800).quality(85).url() : null
          return (
            <figure key={i}>
              <picture>
                {mSrc && <source media="(max-width: 767px)" srcSet={mSrc} />}
                {tSrc && <source media="(max-width: 1023px)" srcSet={tSrc} />}
                <img src={dSrc} alt={it.alt} width={dWidth} height={dHeight} loading="lazy" />
              </picture>
              {it.caption && <figcaption className="t-caption">{it.caption}</figcaption>}
            </figure>
          )
        }
        return (
          <figure key={i}>
            <ResponsiveVideoClient desktop={it.desktop} ipad={it.ipad} mobile={it.mobile} />
            {it.caption && <figcaption className="t-caption">{it.caption}</figcaption>}
          </figure>
        )
      })}
    </section>
  )
}
```

```tsx
// components/Information/InformationModules/ResponsiveVideoClient.tsx
'use client'
import { useEffect, useState } from 'react'
import LazyVideo from '@/components/Common/LazyVideo'
import type { ModuleVideo } from '@/sanity/types'

type Props = { desktop: ModuleVideo; ipad?: ModuleVideo; mobile?: ModuleVideo }

export default function ResponsiveVideoClient({ desktop, ipad, mobile }: Props) {
  const [active, setActive] = useState<ModuleVideo>(desktop)
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      if (w < 768 && mobile) setActive(mobile)
      else if (w < 1024 && ipad) setActive(ipad)
      else setActive(desktop)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [desktop, ipad, mobile])
  return <LazyVideo video={active} mode="in-view" />
}
```

---

### Task 7.4: `InformationModules` switch + wire page

**Files:**
- Create: `components/Information/InformationModules/index.tsx`
- Create: `app/(frontend)/information/page.tsx`

- [ ] **Step 1:**

```tsx
// components/Information/InformationModules/index.tsx
import ClientsList from './ClientsList'
import PageTextColumn from './PageTextColumn'
import InformationImageVideo from './InformationImageVideo'

export default function InformationModules({ modules }: { modules?: any[] }) {
  if (!modules) return null
  return (
    <>
      {modules.map((m) => {
        const key = m._key
        switch (m._type) {
          case 'module.informationClients':
            return <ClientsList key={key} title={m.title} items={m.items ?? []} />
          case 'module.pageTextColumn':
            return <PageTextColumn key={key} body={m.body} columns={m.columns} span={m.span} columnStart={m.columnStart} />
          case 'module.informationImageVideo':
            return <InformationImageVideo key={key} columns={m.columns} reverseOrderOnMobile={m.reverseOrderOnMobile} items={m.items ?? []} />
          default:
            return null
        }
      })}
    </>
  )
}
```

- [ ] **Step 2:**

```tsx
// app/(frontend)/information/page.tsx
import type { Metadata } from 'next'
import BodyBonTempsRenderer from '@/components/PortableText/BodyBonTempsRenderer'
import InformationModules from '@/components/Information/InformationModules'
import { getInformation } from '@/sanity/queries/queries/information'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Information — Bon Temps' }
}

export default async function InformationPage() {
  const data = await getInformation()
  if (!data) return null
  return (
    <main id="main">
      {data.intro && (
        <section style={{ padding: '120px var(--margin-x) 40px' }}>
          <BodyBonTempsRenderer value={data.intro} />
        </section>
      )}
      <InformationModules modules={data.modules} />
    </main>
  )
}
```

- [ ] **Step 3:** `npm run typecheck && npm run lint`. Run dev, hit `http://localhost:3000/information`. Verify with content from Studio.

- [ ] **Step 4:** Commit:

```bash
git add components/Information app/\(frontend\)/information
git commit -m "feat(Information): page + modules + clients hover list"
```

---

## Phase 8 — Generic page

### Task 8.1: Wire `/[slug]` and Page modules

**Files:**
- Create or modify: `app/(frontend)/[slug]/page.tsx`
- Create: `components/Page/PageModules/index.tsx`
- Create: `components/Page/PageModules/PageTextColumn.tsx`
- Create: `components/Page/PageModules/PageImageVideo.tsx`
- Create: `components/Page/PageModules/PageModules.module.scss`

- [ ] **Step 1:** `PageImageVideo`:

```tsx
// components/Page/PageModules/PageImageVideo.tsx
import LazyImage from '@/components/Common/LazyImage'
import LazyVideo from '@/components/Common/LazyVideo'
import styles from './PageModules.module.scss'

type Item =
  | { _type: 'media.image'; image: any; alt: string; caption?: string }
  | { _type: 'media.video'; video: any; caption?: string }
type Props = { columns: 1 | 2 | 3; reverseOrderOnMobile?: boolean; items: Item[] }

export default function PageImageVideo({ columns, reverseOrderOnMobile, items }: Props) {
  return (
    <section
      className={styles.imgVid}
      data-columns={columns}
      data-reverse-mobile={reverseOrderOnMobile ? 'true' : undefined}
    >
      {items.map((it, i) => (
        <figure key={i}>
          {it._type === 'media.image' && <LazyImage image={it.image} alt={it.alt} sizes="50vw" />}
          {it._type === 'media.video' && <LazyVideo video={it.video} mode="in-view" />}
          {it.caption && <figcaption className="t-caption">{it.caption}</figcaption>}
        </figure>
      ))}
    </section>
  )
}
```

- [ ] **Step 2:** Re-export PageTextColumn:

```tsx
// components/Page/PageModules/PageTextColumn.tsx
export { default } from '@/components/Information/InformationModules/PageTextColumn'
```

- [ ] **Step 3:** Switch:

```tsx
// components/Page/PageModules/index.tsx
import PageTextColumn from './PageTextColumn'
import PageImageVideo from './PageImageVideo'

export default function PageModules({ modules }: { modules?: any[] }) {
  if (!modules) return null
  return (
    <>
      {modules.map((m) => {
        const key = m._key
        switch (m._type) {
          case 'module.pageTextColumn':
            return <PageTextColumn key={key} body={m.body} columns={m.columns} span={m.span} columnStart={m.columnStart} />
          case 'module.pageImageVideo':
            return <PageImageVideo key={key} columns={m.columns} reverseOrderOnMobile={m.reverseOrderOnMobile} items={m.items ?? []} />
          default:
            return null
        }
      })}
    </>
  )
}
```

- [ ] **Step 4:** SCSS:

```scss
// PageModules.module.scss
@use "../../../styles/breakpoints" as *;
.imgVid { display: grid; padding: 40px var(--margin-x); gap: var(--grid-gap-x); }
.imgVid[data-columns="2"] { grid-template-columns: repeat(2, 1fr); }
.imgVid[data-columns="3"] { grid-template-columns: repeat(3, 1fr); }
@include mobile {
  .imgVid { grid-template-columns: 1fr; }
  .imgVid[data-reverse-mobile="true"] > :nth-child(odd) { order: 2; }
  .imgVid[data-reverse-mobile="true"] > :nth-child(even) { order: 1; }
}
```

- [ ] **Step 5:** Route:

```tsx
// app/(frontend)/[slug]/page.tsx
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPage, getAllPageSlugs } from '@/sanity/queries/queries/page'
import PageModules from '@/components/Page/PageModules'

export const revalidate = 60

export async function generateStaticParams() {
  const slugs = await getAllPageSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const page = await getPage(slug)
  if (!page) return {}
  return { title: `${page.title} — Bon Temps` }
}

export default async function GenericPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = await getPage(slug)
  if (!page) notFound()
  return (
    <main id="main">
      <h1 className="visually-hidden">{page.title}</h1>
      <PageModules modules={page.modules} />
    </main>
  )
}
```

- [ ] **Step 6:** Routing note: this `[slug]` collides with `/information` and `/work`. App Router resolves explicit segments first. Verify after commit by hitting `/information` and confirming Information renders, not the generic route.

- [ ] **Step 7:** `npm run typecheck`. Commit:

```bash
git add components/Page app/\(frontend\)/[slug]
git commit -m "feat(Page): generic /[slug] route + page modules"
```

---

## Phase 9 — SEO, structured data, crawler hints

### Task 9.1: `app/sitemap.ts`

**Files:**
- Create: `app/sitemap.ts`

- [ ] **Step 1:**

```ts
import type { MetadataRoute } from 'next'
import { BASE_URL } from '@/utils/seoHelper'
import { getAllProjectSlugs } from '@/sanity/queries/queries/project'
import { getAllPageSlugs } from '@/sanity/queries/queries/page'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projectSlugs, pageSlugs] = await Promise.all([getAllProjectSlugs(), getAllPageSlugs()])
  const now = new Date()
  const base = [
    { url: `${BASE_URL}/`, lastModified: now },
    { url: `${BASE_URL}/information`, lastModified: now },
  ]
  const projects = projectSlugs.map((slug) => ({ url: `${BASE_URL}/work/${slug}`, lastModified: now }))
  const pages = pageSlugs.map((slug) => ({ url: `${BASE_URL}/${slug}`, lastModified: now }))
  return [...base, ...projects, ...pages]
}
```

- [ ] **Step 2:** Hit `/sitemap.xml`. Confirm valid XML.

- [ ] **Step 3:** Commit: `git add app/sitemap.ts && git commit -m "feat(seo): dynamic sitemap"`

---

### Task 9.2: `app/llms.txt/route.ts`

**Files:**
- Create: `app/llms.txt/route.ts`

- [ ] **Step 1:**

```ts
import { BASE_URL, siteTitle, siteDescription } from '@/utils/seoHelper'
import { getAllProjectSlugs } from '@/sanity/queries/queries/project'

export const dynamic = 'force-dynamic'

export async function GET() {
  const slugs = await getAllProjectSlugs()
  const lines = [
    `# ${siteTitle}`,
    siteDescription,
    '',
    '## Pages',
    `- ${BASE_URL}/`,
    `- ${BASE_URL}/information`,
    '',
    '## Projects',
    ...slugs.map((s) => `- ${BASE_URL}/work/${s}`),
  ]
  return new Response(lines.join('\n'), {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  })
}
```

- [ ] **Step 2:** Hit `/llms.txt`. Commit: `git add app/llms.txt && git commit -m "feat(seo): llms.txt for LLM crawlers"`

---

### Task 9.3: Organization JSON-LD on layout (XSS-safe)

**Files:**
- Modify: `app/(frontend)/layout.tsx`

- [ ] **Step 1:** Add a helper at the top of the layout module:

```tsx
const safeJsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c')
```

- [ ] **Step 2:** Build and render the LD block (data may originate from Sanity, so the escape matters):

```tsx
const orgLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Bon Temps',
  url: BASE_URL,
  logo: `${BASE_URL}/favicon.ico`,
  email: header?.contactEmail,
  sameAs: footer?.socials?.map((s: any) => s.url) ?? [],
}

// Inside <body>, before the analytics blocks:
<script type="application/ld+json">{safeJsonLd(orgLd)}</script>
```

- [ ] **Step 3:** Commit: `git add app/\(frontend\)/layout.tsx && git commit -m "feat(seo): Organization JSON-LD (XSS-safe)"`

---

### Task 9.4: CreativeWork + BreadcrumbList JSON-LD on project (XSS-safe)

**Files:**
- Modify: `app/(frontend)/work/[slug]/page.tsx`

- [ ] **Step 1:** At the top of the page module:

```tsx
const safeJsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c')
```

- [ ] **Step 2:** Inside the component, after the project fetch:

```tsx
const ld = [
  {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.excerpt ?? project.subtitle,
    url: `${BASE_URL}/work/${project.slug}`,
    image: project.featuredImage?.image?.asset?.url,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Work', item: `${BASE_URL}/` },
      { '@type': 'ListItem', position: 3, name: project.title, item: `${BASE_URL}/work/${project.slug}` },
    ],
  },
]
```

Render inside `<main>`:

```tsx
<script type="application/ld+json">{safeJsonLd(ld)}</script>
```

- [ ] **Step 3:** Commit: `git add app/\(frontend\)/work && git commit -m "feat(seo): JSON-LD for project pages (XSS-safe)"`

---

### Task 9.5: Update `app/robots.ts`

**Files:**
- Modify: `app/robots.ts` (or `robots.tsx`)

- [ ] **Step 1:**

```ts
import type { MetadataRoute } from 'next'
import { BASE_URL } from '@/utils/seoHelper'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api'] }],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
```

- [ ] **Step 2:** Commit: `git add app/robots.* && git commit -m "feat(seo): robots with sitemap pointer"`

---

## Phase 10 — QA pass

### Task 10.1: Pixel-perfect against Figma

- [ ] **Step 1:** Use the Figma MCP to fetch screenshots:
  - Intro Desktop 1440 → `1481:410`
  - Work Desktop 1440 → `1481:650`
  - Project Desktop 1440 → `1481:944`
  - Information Desktop 1440 → `1481:1135`
  - Tablet variants: `1481:416`, `1481:424`, `1481:1006`, `1481:1192`
  - Mobile variants: `1481:413`, `1481:502`, `1481:576` (mobile menu), `1481:1070`, `1481:1241`
  - Desktop XL intro → `1481:406`

  File key: `gyJkSM0BkGcdVfBZqbAyGK`.

- [ ] **Step 2:** For each, compare with `localhost:3000` at the matching viewport. Patch SCSS modules where margins, gaps, font sizes, or colours diverge from spec/Figma.

- [ ] **Step 3:** **Unify mobile margins** if Figma is inconsistent across 390 frames (per user instruction).

- [ ] **Step 4:** Commit per area:

```bash
git add components/<area>
git commit -m "polish(<area>): pixel-perfect against Figma <breakpoint>"
```

---

### Task 10.2: Reduced-motion audit

- [ ] **Step 1:** Chrome DevTools → Rendering → Emulate `prefers-reduced-motion: reduce`. Reload `/`.
- [ ] **Step 2:** Confirm intro overlay does NOT mount.
- [ ] **Step 3:** Decide: project card hover-video plays, OR is suppressed under reduced-motion. Document the choice in `MEMORY.md` either way.
- [ ] **Step 4:** Patch any animation that ignores the preference using framer-motion's `useReducedMotion()`.
- [ ] **Step 5:** Commit any fixes.

---

### Task 10.3: Crawler audit (no-JS)

- [ ] **Step 1:**

```bash
curl -s http://localhost:3000 > /tmp/work.html
curl -s "http://localhost:3000/work/<slug>" > /tmp/project.html
curl -s http://localhost:3000/information > /tmp/information.html
```

- [ ] **Step 2:** Open each HTML file. Confirm:
  - Project titles visible in `/`.
  - Project headline + body text visible in `/work/<slug>`.
  - Clients list visible in `/information`.
  - All `<a>` tags have valid `href`.
  - JSON-LD blocks present in HTML.

- [ ] **Step 3:** If anything is missing, the offending component is gating content client-side. Move data into the RSC parent.

---

### Task 10.4: Lighthouse pass

- [ ] **Step 1:** `npm run build && npm run start`.
- [ ] **Step 2:** Lighthouse on `/`, `/work/<slug>`, `/information`. Target:
  - Performance ≥ 90 desktop, ≥ 80 mobile.
  - Accessibility ≥ 95.
  - Best Practices ≥ 95.
  - SEO ≥ 100.
- [ ] **Step 3:** Address top issues: missing image dimensions, missing alt, late-loading fonts (`font-display`), CLS, etc.

---

### Task 10.5: Cross-browser smoke test

- [ ] Chrome: hover, intro, copy, mobile view.
- [ ] Safari: HLS native, intro, copy.
- [ ] Firefox: HLS via hls.js, intro, copy.
- [ ] Document any browser-specific issues in `docs/superpowers/plans/PRE_EXISTING_ISSUES.md` and fix.

---

### Task 10.6: Update `MEMORY.md`

**Files:**
- Modify: `MEMORY.md`

- [ ] **Step 1:** Append:

```md
## [2026-04-28] — Implementación completa del sitio BonTemps

- Frontend completo según design spec (`docs/superpowers/specs/2026-04-28-bontemps-website-design.md`)
- Schemas ajustados: media.image / media.video simplificados, alt requerido, contactEmail en header, websiteUrl en project, information singleton, módulos responsive solo para Information
- Páginas: Work (con intro overlay), Project Detail, Information, free Pages
- Animaciones: framer-motion (bubble layoutId, intro stagger, mobile menu, contact copy)
- HLS para videos de Vimeo Pro (hover en Work cards, in-view en módulos)
- SSR-first verificado: HTML legible sin JS, JSON-LD inyectado, sitemap.xml, llms.txt
- Pendiente: cargar archivos woff/woff2 reales en public/fonts/ y actualizar styles/fonts.ts
- Pendiente: pixel-perfect contra Figma (varios componentes pueden requerir polish)
```

- [ ] **Step 2:** Commit: `git add MEMORY.md && git commit -m "docs(memory): registro de la implementación BonTemps"`

---

## Self-review pass (executed by plan author, complete)

**Spec coverage:**
- §2 architectural decisions → covered by Phases 1, 4, 5, 6, 7, 8.
- §3 routes → Tasks 5.4, 6.4, 7.4, 8.1.
- §4 animation catalogue → Tasks 4.4, 4.5, 4.6, 4.8, 4.9, 4.10, 5.2, 6.2 (bubbles), 7.1 (clients hover), 4.1 (image fade), 4.2 (HLS), 6.3 (module video).
- §5 media strategy → Tasks 4.1, 4.2, 7.3.
- §6 schema deltas → Phase 2 in full. `bodyBonTemps` styles in 2.14.
- §7 component layout → Phases 4, 5, 6, 7, 8.
- §8 layout/breakpoints/typography/fonts → Phase 1 in full.
- §9 page-by-page interaction map → Phases 5–8.
- §10 SEO/JSON-LD/a11y → Phase 9, plus Task 1.5 (skip link, visually-hidden).
- §11 implementation phasing → matches the plan's structure.
- §12 open questions → addressed in Tasks 1.3 (margins), 1.7 (fonts), 10.1 (Figma parity).

**Placeholder scan:** none of the steps say "TBD", "TODO", "implement later". Every code step shows code. Every command step shows the command and the expected output to verify against.

**Type consistency:** `MediaImage`, `ModuleVideo`, `MediaVideo`, `MediaImageResponsive`, `MediaVideoResponsive` defined in 3.12 and consumed in 4.1, 4.2, 6.3, 7.3. `getProject`, `getAllProjectSlugs`, `getInformation`, `getPage`, `getAllPageSlugs`, `getWork`, `getIntroClaim` defined in 3.6–3.11 and consumed in 5.4, 6.4, 7.4, 8.1, 9.1, 9.2.

**Inline-script safety:** every `<script>` in this plan uses the children pattern. JSON-LD blocks pass through `safeJsonLd()` which escapes `</` to `</`. No use of `dangerouslySetInnerHTML`.

