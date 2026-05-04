// styles/fonts.ts
//
// Local font loading via next/font/local. The `variable` option exposes
// each family as a CSS custom property which `_typography.scss` consumes
// through `--font-sans` / `--font-serif`.
import localFont from 'next/font/local'

// Waldenburg Halbfett — single semibold weight. Mapped to --font-sans.
export const sans = localFont({
  src: [
    {path: './fonts/Waldenburg-Halbfett.otf', weight: '600', style: 'normal'},
  ],
  variable: '--font-sans-loaded',
  display: 'swap',
})

// ABC Marist Variable Trial — variable font (full weight axis). Mapped
// to --font-serif.
export const serif = localFont({
  src: [
    {path: './fonts/ABCMaristVariable-Trial.ttf', weight: '100 900', style: 'normal'},
  ],
  variable: '--font-serif-loaded',
  display: 'swap',
})
