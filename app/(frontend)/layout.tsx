import "../../styles/main.scss";

import React from 'react';
import {sans, serif} from '../../styles/fonts';
import WebProvider from '../../context/webContext';
import HeaderComponent from '../../components/Common/HeaderComponent';
import FooterComponent from '../../components/Common/FooterComponent';
import FooterSwitcher from '../../components/Common/FooterComponent/FooterSwitcher';
import PageTransition from '@/components/Common/PageTransition';
import {IntroProvider} from '@/components/Home/IntroOverlay/IntroProvider';
import IntroOverlay from '@/components/Home/IntroOverlay';
import {getFooter} from '@/sanity/queries/common/footer';
import {getHeader} from '@/sanity/queries/common/header';
import {getIntroClaim} from '@/sanity/queries/common/intro';
import type {FooterData, HeaderData} from '@/sanity/types';
import {BASE_URL, buildUrl, siteTitle, siteDescription, getFavicons, APPLE_TOUCH_ICON} from '@/utils/seoHelper';
import {safeJsonLd} from '@/utils/safeJsonLd';
import type {Metadata, Viewport} from 'next';

import CookieConsent from '@/components/Common/CookieConsent/CookieConsent';
import ConsentGate from '@/components/Common/Analytics/consentGate';

import Analytics from '@/components/Common/Analytics/google';

// Inline gate: applied before paint when JS is on, prevents Work content from
// flashing behind the intro overlay during hydration. The literal is fully
// hardcoded — no user input is interpolated, so it's safe to inline as text
// children of <script>.
const INTRO_GATE = `try {
  if (!sessionStorage.getItem('bontemps_intro_seen') &&
      !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('intro-pending');
  }
} catch (e) {}`

// Declared at the layout so the Bon Temps favicon (black in light mode, white
// in dark mode) applies to every frontend route — not just the home page.
export const metadata: Metadata = {
  metadataBase: BASE_URL,
  icons: getFavicons(),
}

// viewport-fit=cover lets the page extend under the iOS status bar / notch so
// the fixed header's blur can reach the physical screen edge. Without it,
// env(safe-area-inset-top) is always 0 and the notch strip shows unblurred
// content when Safari minimises its bars.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const results = await Promise.allSettled([getHeader(), getFooter(), getIntroClaim()])

  const header: HeaderData | undefined =
    results[0].status === 'fulfilled' ? results[0].value : undefined
  const footer: FooterData | undefined =
    results[1].status === 'fulfilled' ? results[1].value : undefined
  const claim =
    (results[2].status === 'fulfilled' ? results[2].value : null) ??
    'Beauty Is A Matter Of Precision'

  // Organization JSON-LD. Email and socials come from CMS so safeJsonLd is
  // required to neutralise any '</script>' sequences in user input.
  const orgLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteTitle,
    description: siteDescription,
    url: BASE_URL.origin,
    logo: buildUrl(APPLE_TOUCH_ICON),
    email: header?.contactEmail,
    sameAs: [
      header?.instagramUrl,
      ...(footer?.socials?.map((s) => s.url) ?? []),
    ].filter(Boolean),
  }

  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <head>
        <script>{INTRO_GATE}</script>
      </head>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <script type="application/ld+json">{safeJsonLd(orgLd)}</script>
        <WebProvider>
          <IntroProvider>
            <HeaderComponent data={header} />
            <PageTransition>{children}</PageTransition>
            <IntroOverlay claim={claim} />
            <FooterSwitcher
              defaultFooter={<FooterComponent data={footer} variant="default" />}
              informationFooter={<FooterComponent data={footer} variant="information" />}
              projectFooter={<FooterComponent data={footer} variant="project" />}
            />
          </IntroProvider>
        </WebProvider>
      </body>
    </html>
  )
}
