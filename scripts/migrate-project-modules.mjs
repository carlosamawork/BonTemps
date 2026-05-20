#!/usr/bin/env node
/**
 * One-shot migration for the project document modules split.
 *
 *   1. `project.modules` is moved to `project.modulesDesktop`.
 *   2. `module.textColumn` items become `module.imageVideo` with one
 *      `column.text` child item (single column). Span / columnStart info
 *      is discarded — re-layout manually if needed after the migration.
 *   3. Legacy layout fields on `module.imageVideo`
 *      (layout1col, layout2col, layout3col, reverseOrder) are stripped.
 *   4. `modulesMobile` is NOT seeded automatically — the editor builds
 *      the mobile layout from scratch (or copies it later by hand).
 *
 * Idempotent: if `modulesDesktop` is already populated, the project is
 * skipped. `modules` is unset only after `modulesDesktop` is written.
 *
 * Usage:
 *   SANITY_WRITE_TOKEN=skXXX node scripts/migrate-project-modules.mjs --dry
 *   SANITY_WRITE_TOKEN=skXXX node scripts/migrate-project-modules.mjs --apply
 *
 * Required env:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET   (defaults to "production")
 *   SANITY_WRITE_TOKEN           (token with Editor permission)
 */

import {createClient} from '@sanity/client'
import {randomUUID} from 'node:crypto'

// Load .env.local so NEXT_PUBLIC_SANITY_* vars are available without
// having to repeat them inline. Node 20.6+ has process.loadEnvFile built in.
try {
  process.loadEnvFile('.env.local')
} catch {
  // .env.local missing or unsupported Node version — fall through to
  // whatever the caller exported in the shell.
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_WRITE_TOKEN

const apply = process.argv.includes('--apply')
const dry = !apply

if (!projectId) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID env')
  process.exit(1)
}
if (!token) {
  console.error('Missing SANITY_WRITE_TOKEN env (needs Editor role)')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2024-01-01',
  useCdn: false,
})

const QUERY = `*[_type == "project"]{
  _id,
  _rev,
  modules,
  modulesDesktop
}`

function newKey() {
  return randomUUID().replace(/-/g, '').slice(0, 12)
}

function migrateModule(entry) {
  if (!entry || typeof entry !== 'object') return entry

  if (entry._type === 'module.textColumn') {
    return {
      _key: entry._key || newKey(),
      _type: 'module.imageVideo',
      columns: 1,
      items: [
        {
          _key: newKey(),
          _type: 'column.text',
          body: entry.body || [],
        },
      ],
    }
  }

  if (entry._type === 'module.imageVideo') {
    const rest = {...entry}
    delete rest.layout1col
    delete rest.layout2col
    delete rest.layout3col
    delete rest.reverseOrder
    return rest
  }

  return entry
}

async function run() {
  const projects = await client.fetch(QUERY)
  console.log(`Found ${projects.length} project(s).\n`)

  let migrated = 0
  let skipped = 0

  for (const p of projects) {
    const hasDesktop = Array.isArray(p.modulesDesktop) && p.modulesDesktop.length > 0
    const hasModules = Array.isArray(p.modules) && p.modules.length > 0

    if (hasDesktop) {
      console.log(`SKIP  ${p._id}  modulesDesktop already populated`)
      skipped++
      continue
    }

    if (!hasModules) {
      console.log(`SKIP  ${p._id}  no legacy modules to migrate`)
      skipped++
      continue
    }

    const migratedModules = p.modules.map(migrateModule)
    console.log(`MIGRATE  ${p._id}  ${p.modules.length} modules → modulesDesktop`)
    p.modules.forEach((m, i) => {
      if (m._type === 'module.textColumn') {
        console.log(`   #${i + 1}  module.textColumn → module.imageVideo (1 col, column.text)`)
      } else if (m._type === 'module.imageVideo') {
        const stripped = ['layout1col', 'layout2col', 'layout3col', 'reverseOrder'].filter(
          (k) => k in m,
        )
        if (stripped.length) {
          console.log(`   #${i + 1}  module.imageVideo strip legacy: ${stripped.join(', ')}`)
        }
      }
    })

    if (apply) {
      await client
        .patch(p._id)
        .setIfMissing({modulesDesktop: []})
        .set({modulesDesktop: migratedModules})
        .unset(['modules'])
        .commit({autoGenerateArrayKeys: true})
    }
    migrated++
  }

  console.log(
    `\n${dry ? '[DRY RUN] ' : ''}Done. Migrated: ${migrated}. Skipped: ${skipped}.${
      dry ? '  Re-run with --apply to write changes.' : ''
    }`,
  )
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
