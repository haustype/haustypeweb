#!/usr/bin/env node
/**
 * One-time migration: move homepage fields off siteSettings onto homepageSettings,
 * then remove orphaned keys so Sanity Studio stops showing "Unknown fields".
 *
 * Run:
 *   SANITY_API_TOKEN=your-token node scripts/migrate-homepage-from-siteSettings.mjs
 *
 * Token: sanity.io/manage → your project → API → Tokens (Editor permissions).
 *
 * Or use CLI login (no token env):
 *   npx sanity exec scripts/migrate-homepage-from-siteSettings.mjs --with-user-token
 */

import { createClient } from '@sanity/client';
import { getCliClient } from 'sanity/cli';

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID || 'b5rdpzo3';
const dataset = process.env.PUBLIC_SANITY_DATASET || 'production';

const client = process.env.SANITY_API_TOKEN
  ? createClient({
      projectId,
      dataset,
      apiVersion: '2025-01-28',
      token: process.env.SANITY_API_TOKEN,
      useCdn: false,
    })
  : getCliClient({ apiVersion: '2025-01-28' });

const HOMEPAGE_ID = 'homepageSettings';
const SITE_ID = 'siteSettings';
/** Draft mirror id when editors have unsaved/draft singleton */
const SITE_DRAFT_ID = `drafts.${SITE_ID}`;

const LEGACY_FIELDS = ['aboutText', 'heroItems', 'fontsInUse', 'typefaceOrder'];

function hasMeaningfulValue(value) {
  if (value == null) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
}

function homeFieldEmpty(value) {
  if (value == null) return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'string') return value.trim().length === 0;
  return false;
}

async function main() {
  const site = await client.fetch(`*[_id == $id][0]`, { id: SITE_ID });
  if (!site) {
    console.log(`No document "${SITE_ID}" found. Nothing to do.`);
    return;
  }

  let home = await client.fetch(`*[_id == $id][0]`, { id: HOMEPAGE_ID });

  if (!home) {
    await client.create({
      _id: HOMEPAGE_ID,
      _type: 'homepageSettings',
    });
    home = {};
    console.log(`Created "${HOMEPAGE_ID}".`);
  }

  const patchHome = {};
  for (const field of LEGACY_FIELDS) {
    const fromSite = site[field];
    if (!hasMeaningfulValue(fromSite)) continue;
    if (!homeFieldEmpty(home[field])) continue;
    patchHome[field] = fromSite;
  }

  if (Object.keys(patchHome).length > 0) {
    await client.patch(HOMEPAGE_ID).set(patchHome).commit();
    console.log('Copied into homepageSettings:', Object.keys(patchHome).join(', '));
  } else {
    console.log('No homepage fields to copy (homepage already has content or site had none).');
  }

  // Always unset legacy paths: Content API often omits "unknown" keys from reads, so we can't detect them —
  // but patch unset still removes them from the stored document and clears Studio warnings.
  const siteIds = [SITE_ID];
  const draftExists = await client.fetch(`count(*[_id == $id]) > 0`, { id: SITE_DRAFT_ID });
  if (draftExists) siteIds.push(SITE_DRAFT_ID);

  for (const id of siteIds) {
    await client.patch(id).unset(LEGACY_FIELDS).commit();
    console.log('Removed legacy paths from', id + ':', LEGACY_FIELDS.join(', '));
  }

  console.log('\nDone. Open Studio → Homepage Settings for edits; Site Settings is navigation only.');
  console.log('Republish homepage doc if needed, then trigger a Netlify deploy.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
