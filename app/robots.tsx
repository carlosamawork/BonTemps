import type {MetadataRoute} from 'next'
import {BASE_URL} from '@/utils/seoHelper'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
    ],
    sitemap: `${BASE_URL.origin}/sitemap.xml`,
    host: BASE_URL.origin,
  }
}
