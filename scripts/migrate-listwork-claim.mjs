#!/usr/bin/env node
/**
 * Migrates `listWork.claim` from a plain `string` to a `bodyBonTemps`
 * array of PortableText blocks. The existing string becomes a single
 * `normal` block. Idempotent: skips documents whose `claim` is already
 * an array (i.e. already migrated) or empty.
 *
 * Usage:
 *   SANITY_WRITE_TOKEN=skXXX node scripts/migrate-listwork-claim.mjs
 *   SANITY_WRITE_TOKEN=skXXX node scripts/migrate-listwork-claim.mjs --apply
 *
 * Required env:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET   (defaults to "production")
 *   SANITY_WRITE_TOKEN           (token with Editor permission)
 */

import {createClient} from '@sanity/client'
import {randomUUID} from 'node:crypto'

try {
  process.loadEnvFile('.env.local')
} catch {
  // .env.local missing — fall through to the caller's shell env.
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

const QUERY = `*[_type == "listWork"]{_id, _rev, claim}`

function newKey() {
  return randomUUID().replace(/-/g, '').slice(0, 12)
}

function stringToBlock(text) {
  return [
    {
      _key: newKey(),
      _type: 'block',
      style: 'normal',
      markDefs: [],
      children: [
        {
          _key: newKey(),
          _type: 'span',
          marks: [],
          text,
        },
      ],
    },
  ]
}

async function run() {
  const docs = await client.fetch(QUERY)
  console.log(`Found ${docs.length} listWork document(s).\n`)

  let migrated = 0
  let skipped = 0

  for (const doc of docs) {
    if (Array.isArray(doc.claim)) {
      console.log(`SKIP  ${doc._id}  claim already PortableText`)
      skipped++
      continue
    }
    if (typeof doc.claim !== 'string' || doc.claim.trim() === '') {
      console.log(`SKIP  ${doc._id}  no string claim to migrate`)
      skipped++
      continue
    }

    const blocks = stringToBlock(doc.claim)
    console.log(`MIGRATE  ${doc._id}  "${doc.claim.slice(0, 60)}${doc.claim.length > 60 ? '…' : ''}"`)

    if (apply) {
      await client.patch(doc._id).set({claim: blocks}).commit()
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
