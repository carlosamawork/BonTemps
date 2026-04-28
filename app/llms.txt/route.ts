import {BASE_URL, siteDescription, siteTitle} from '@/utils/seoHelper'
import {getAllProjectSlugs} from '@/sanity/queries/queries/project'

// Plain-text summary tailored to LLM crawlers. The format follows the
// emerging /llms.txt convention (https://llmstxt.org). Cached per-request
// with the same revalidation tags as the rest of the site.
export const dynamic = 'force-dynamic'

export async function GET() {
  const slugs = await getAllProjectSlugs()
  const lines = [
    `# ${siteTitle}`,
    siteDescription,
    '',
    '## Pages',
    `- ${BASE_URL.origin}/`,
    `- ${BASE_URL.origin}/information`,
    '',
    '## Projects',
    ...slugs.map((s) => `- ${BASE_URL.origin}/work/${s}`),
    '',
  ]
  return new Response(lines.join('\n'), {
    headers: {'content-type': 'text/plain; charset=utf-8'},
  })
}
