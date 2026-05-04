// sanity/types/objects/global/settings.ts
// Kept as a thin alias for legacy callers. New code should use HeaderData / FooterData
// directly from the dedicated query results.

import type {SEO} from '../seo'
import type {HeaderData} from './header'
import type {FooterData} from './footer'

export type SettingsData = {
  header?: HeaderData
  footer?: FooterData
  seo?: SEO
}
