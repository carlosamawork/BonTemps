# Pre-existing issues (snapshot at branch start)

**Branch:** `feat/website-implementation`
**Snapshot date:** 2026-04-28

This file captures the state of `npm run typecheck` and `npm run lint` at the start of the BonTemps website implementation, so we don't blame our changes for issues that were already present.

## Static gates baseline

- `npm run typecheck`: ✅ **clean** (0 errors)
- `npm run lint`: ✅ **clean** (0 errors, 0 warnings)

## Notes

- `.env.local` has `NEXT_PUBLIC_CLIENT_ID=YOUR_CLIENT_ID`. The cookie consent uses this as the cookie prefix (`${NEXT_PUBLIC_CLIENT_ID}_localConsent_25`). Should be updated to `bontemps` (or similar) before production. **Not blocking development.**
- Mailchimp / Hotjar / Facebook / Pinterest / GA env vars are empty — analytics integrations are inert in dev (per layout gate `NODE_ENV === 'production'`).
- The `app/(frontend)/layout.tsx` currently contains a hardcoded "Code by AMA" credits comment in the body; will be removed/edited in a later refactor task if no longer wanted.

## Schemas already authored in prior session

Per `MEMORY.md` 2026-04-16 entry, the following schemas exist and will be modified (not created) in Phase 2:
- `project`, `service`, `home`, `listWork`, `settings/header`, `settings/footer`
- Modules: `centeredText`, `imageVideo`, `textColumn`, `imageText`, `pageTextColumn`, `pageImageVideo`
- Media types: `media.image`, `media.video`, `module.video`
- Block content: `bodyBonTemps`

The plan's Phase 2 will:
1. Simplify `media.image` / `media.video` (drop ipad/mobile variants).
2. Rename `module.video.image` → `poster`.
3. Add `media.imageResponsive`, `media.videoResponsive`, `module.informationClients`, `module.informationImageVideo`.
4. Create `information` singleton.
5. Remove unused schemas (`body`, `bodySimple`, `bodyTextTerms`, `accordion`, etc.) only after confirming non-usage.
