import "../../styles/main.scss";

import React from 'react';
import WebProvider from '../../context/webContext';
import HeaderComponent from '../../components/Common/HeaderComponent';
import FooterComponent from '../../components/Common/FooterComponent';
import {IntroProvider} from '@/components/Home/IntroOverlay/IntroProvider';
import IntroOverlay from '@/components/Home/IntroOverlay';
import {getFooter} from '@/sanity/queries/common/footer';
import {getHeader} from '@/sanity/queries/common/header';
import {getIntroClaim} from '@/sanity/queries/common/intro';
import type {FooterData, HeaderData} from '@/sanity/types';

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

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const results = await Promise.allSettled([getHeader(), getFooter(), getIntroClaim()])

  const header: HeaderData | undefined =
    results[0].status === 'fulfilled' ? results[0].value : undefined
  const footer: FooterData | undefined =
    results[1].status === 'fulfilled' ? results[1].value : undefined
  const claim =
    (results[2].status === 'fulfilled' ? results[2].value : null) ??
    'Beauty Is A Matter Of Precision'

  return (
    <html lang="en">
      <head>
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
            {process.env.NODE_ENV === 'production' && (
              <ConsentGate category="analytics">
                <Analytics />
              </ConsentGate>
            )}
          </IntroProvider>
        </WebProvider>
      </body>
    </html>
  )
}
