#!/usr/bin/env node
/**
 * One-time migration: move screensaver from homepageSettings onto siteSettings,
 * then remove it from homepageSettings so Studio stops showing "Unknown fields".
 *
 * Run:
 *   SANITY_API_TOKEN=your-token node scripts/migrate-screensaver-to-siteSettings.mjs
 *
 * Or use CLI login (no token env):
 *   npx sanity exec scripts/migrate-screensaver-to-siteSettings.mjs --with-user-token
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
const HOMEPAGE_DRAFT_ID = `drafts.${HOMEPAGE_ID}`;
const SITE_DRAFT_ID = `drafts.${SITE_ID}`;

function hasScreensaverContent(screensaver) {
  if (!screensaver) return false;
  if (Array.isArray(screensaver)) return screensaver.length > 0;
  if (Array.isArray(screensaver.slides)) return screensaver.slides.length > 0;
  return screensaver.enabled != null
    || screensaver.idleSeconds != null
    || screensaver.slideSeconds != null
    || screensaver.fadeSeconds != null;
}

async function syncScreensaverToSite(screensaver, { forceDraft = false } = {}) {
  const site = await client.fetch(`*[_id == $id][0]`, { id: SITE_ID });
  if (!site) {
    console.error(`No document "${SITE_ID}" found. Create Site Settings in Studio first.`);
    process.exit(1);
  }

  if (!hasScreensaverContent(site.screensaver)) {
    await client.patch(SITE_ID).set({ screensaver }).commit();
    console.log('Copied screensaver into siteSettings.');
  } else {
    console.log('siteSettings already has screensaver content; skipped published copy.');
  }

  const siteDraftExists = await client.fetch(`count(*[_id == $id]) > 0`, { id: SITE_DRAFT_ID });
  if (!siteDraftExists) return;

  const siteDraft = await client.fetch(`*[_id == $id][0]{ screensaver }`, { id: SITE_DRAFT_ID });
  const draftNeedsSync =
    forceDraft || !hasScreensaverContent(siteDraft?.screensaver);
  if (!draftNeedsSync) {
    console.log('drafts.siteSettings already has screensaver content; skipped draft copy.');
    return;
  }

  const published = await client.fetch(`*[_id == $id][0]{ screensaver }`, { id: SITE_ID });
  const screensaverForDraft = published?.screensaver ?? screensaver;
  if (!hasScreensaverContent(screensaverForDraft)) return;

  await client.patch(SITE_DRAFT_ID).set({ screensaver: screensaverForDraft }).commit();
  console.log('Synced screensaver into drafts.siteSettings.');
}

async function main() {
  const homepage = await client.fetch(`*[_id == $id][0]`, { id: HOMEPAGE_ID });
  const homepageDraft = await client.fetch(`*[_id == $id][0]`, { id: HOMEPAGE_DRAFT_ID });
  const legacyScreensaver = homepage?.screensaver ?? homepageDraft?.screensaver;

  if (legacyScreensaver) {
    await syncScreensaverToSite(legacyScreensaver);
  } else {
    const published = await client.fetch(`*[_id == $id][0]{ screensaver }`, { id: SITE_ID });
    if (hasScreensaverContent(published?.screensaver)) {
      console.log('No legacy homepage screensaver; repairing drafts.siteSettings from published copy.');
      await syncScreensaverToSite(published.screensaver, { forceDraft: true });
    } else {
      console.log('No screensaver found on homepageSettings or siteSettings. Nothing to copy.');
    }
  }

  const homepageIds = [HOMEPAGE_ID];
  const homepageDraftExists = await client.fetch(`count(*[_id == $id]) > 0`, {
    id: HOMEPAGE_DRAFT_ID,
  });
  if (homepageDraftExists) homepageIds.push(HOMEPAGE_DRAFT_ID);

  for (const id of homepageIds) {
    const doc = await client.fetch(`*[_id == $id][0]{ _id, screensaver }`, { id });
    if (!doc?.screensaver) continue;
    await client.patch(id).unset(['screensaver']).commit();
    console.log('Removed screensaver from', id);
  }

  console.log('\nDone. Open Site Settings in Studio to confirm, then trigger a Netlify deploy.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
